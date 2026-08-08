// check-stock.mjs — サイトPICKS全件の在庫状況を楽天APIで監査する（v2: 429リトライ対応）
// 実行環境: GitHub Actions(Linux) or ローカルLinux/macOS（Node18+のグローバルfetch）。
// 認証: 環境変数 RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY / RAKUTEN_AFFILIATE_ID（GitHub Secrets 推奨）。無ければ tools/.rakuten.json。
// 使い方:
//   node tools/check-stock.mjs            … 監査してレポート出力（stock-report.json）
//   node tools/check-stock.mjs --fix      … さらに「販売終了(該当なし)」のエントリをmain.jsから削除し ?v を+1（PR前提）
//
// 判定:
//   availability=1 → 在庫あり / 0 → 在庫切れ / (200かつ0件) → 販売終了の可能性 / 429連発 → RATE_LIMITED(判定保留)
// 重要: 429(レート制限)は「販売終了」と誤判定しないこと（v1のバグ修正点）。楽天APIは概ね1req/秒。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const FIX = process.argv.includes('--fix');

function loadCfg() {
  const e = process.env;
  if (e.RAKUTEN_APP_ID && e.RAKUTEN_ACCESS_KEY && e.RAKUTEN_AFFILIATE_ID)
    return { applicationId: e.RAKUTEN_APP_ID, accessKey: e.RAKUTEN_ACCESS_KEY, affiliateId: e.RAKUTEN_AFFILIATE_ID };
  const p = path.join(__dirname, '.rakuten.json');
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  console.error('[エラー] 認証情報がありません（環境変数 or tools/.rakuten.json）'); process.exit(1);
}
const cfg = loadCfg();

const mainPath = path.join(repoRoot, 'public', 'js', 'main.js');
let src = fs.readFileSync(mainPath, 'utf8');

// PICKS配列領域を取り出し、エントリ（{ cat:... }, の2行ブロック）を列挙
const start = src.indexOf('const PICKS = [');
const end = src.indexOf('];', start);
const picksText = src.slice(start, end);
const blocks = picksText.match(/\{\s*cat:"[\s\S]*?\},/g) || [];

function itemCodeOf(block) {
  const codeM = block.match(/code:"([^"]+)"/);
  if (codeM) return codeM[1];
  const urlM = block.match(/url:"([^"]*)"/);
  if (!urlM) return null;
  const url = decodeURIComponent(urlM[1]);
  const mm = url.match(/m\.rakuten\.co\.jp\/([^/]+)\/i\/(\d+)\//);
  return mm ? `${mm[1]}:${mm[2]}` : null;
}
const nameOf = (b) => (b.match(/name:"([^"]*)"/) || [, ''])[1];

async function check(itemCode) {
  const u = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?' + new URLSearchParams({
    applicationId: cfg.applicationId, accessKey: cfg.accessKey, affiliateId: cfg.affiliateId, format: 'json', hits: '1', itemCode
  });
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(u, { headers: {
      'Referer': 'https://kininarumono.jp/', 'Origin': 'https://kininarumono.jp',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    }});
    if (r.status === 429) { await new Promise(x => setTimeout(x, 1500 * (attempt + 1))); continue; } // レート制限→待って再試行
    const j = await r.json();
    const it = j.Items && j.Items[0] && j.Items[0].Item;
    if (!it) return 'DISCONTINUED';                 // 200かつ0件＝販売終了の可能性
    return it.availability === 1 ? 'IN_STOCK' : 'OUT_OF_STOCK';
  }
  return 'RATE_LIMITED'; // 判定保留（販売終了扱いにしない）
}

const results = [];
for (const b of blocks) {
  const name = nameOf(b), code = itemCodeOf(b);
  if (!code) { results.push({ name, code: null, state: 'UNCHECKABLE', note: 'itemCode未保存（要バックフィル）', block: b }); continue; }
  const state = await check(code);
  results.push({ name, code, state, block: b });
  await new Promise(r => setTimeout(r, 1300)); // 楽天APIレート配慮（約1req/秒）
}

const by = (s) => results.filter(r => r.state === s);
console.log('=== 在庫監査 ===');
console.log(`在庫あり:${by('IN_STOCK').length} 在庫切れ:${by('OUT_OF_STOCK').length} 販売終了の可能性:${by('DISCONTINUED').length} 判定保留(429):${by('RATE_LIMITED').length} 要バックフィル:${by('UNCHECKABLE').length}`);
for (const s of ['OUT_OF_STOCK', 'DISCONTINUED', 'RATE_LIMITED', 'UNCHECKABLE']) {
  const g = by(s); if (g.length) { console.log(`\n[${s}]`); g.forEach(r => console.log(`  - ${r.name} (${r.code || '-'}) ${r.note || ''}`)); }
}
fs.writeFileSync(path.join(repoRoot, 'stock-report.json'),
  JSON.stringify(results.map(({ block, ...r }) => r), null, 2));

// --fix: 「販売終了(該当なし)」のみ削除。在庫切れはキープ（再入荷し得るため）。
if (FIX) {
  const remove = by('DISCONTINUED');
  if (!remove.length) { console.log('\n[--fix] 削除対象（販売終了）はありません。'); }
  else {
    for (const r of remove) src = src.replace('\n    ' + r.block, '').replace(r.block, ''); // 前置改行込みで除去
    src = src.replace(/([?&]v=)(\d+)/g, (m, a, n) => a + (parseInt(n, 10) + 1)); // main.js内に?vは無いが安全側
    fs.writeFileSync(mainPath, src);
    // index.html / read/*.html の ?v を +1
    const bump = (p) => { if (!fs.existsSync(p)) return; let t = fs.readFileSync(p, 'utf8'); t = t.replace(/([?&]v=)(\d+)/g, (m, a, n) => a + (parseInt(n, 10) + 1)); fs.writeFileSync(p, t); };
    bump(path.join(repoRoot, 'public', 'index.html'));
    const rd = path.join(repoRoot, 'public', 'read');
    if (fs.existsSync(rd)) for (const f of fs.readdirSync(rd)) if (f.endsWith('.html')) bump(path.join(rd, f));
    console.log(`\n[--fix] 販売終了 ${remove.length} 件を削除し ?v を+1しました（PRで確認してください）。`);
  }
}
console.log('\n[OK] stock-report.json を出力しました。');
