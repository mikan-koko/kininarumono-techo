import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const arg = (name, def = null) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
const has = (name) => argv.includes('--' + name);
const cfgPath = path.join(__dirname, '.rakuten.json');
if (!fs.existsSync(cfgPath)) { console.error('tools/.rakuten.json がありません'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
if (!cfg.applicationId || !cfg.accessKey || !cfg.affiliateId) { console.error('.rakuten.json を埋めてください'); process.exit(1); }
const cat = arg('cat'); const keyword = arg('keyword'); const itemCode = arg('itemcode');
const CATS = ['gadget', 'interior', 'goods', 'fashion'];
if (!CATS.includes(cat)) { console.error('--cat は ' + CATS.join(' | ')); process.exit(1); }
if (!keyword && !itemCode) { console.error('--keyword か --itemcode が必要'); process.exit(1); }
const params = new URLSearchParams({ applicationId: cfg.applicationId, accessKey: cfg.accessKey, affiliateId: cfg.affiliateId, format: 'json', hits: '3' });
if (itemCode) params.set('itemCode', itemCode);
if (keyword) params.set('keyword', keyword);
const endpoint = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?' + params.toString();
const res = await fetch(endpoint, { headers: { 'Referer': 'https://kininarumono.jp/', 'Origin': 'https://kininarumono.jp', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } });
if (!res.ok) { console.error('APIエラー', res.status); console.error((await res.text()).slice(0, 800)); process.exit(1); }
const data = await res.json();
const item = data.Items && data.Items[0] && data.Items[0].Item;
if (!item) { console.error('商品が見つかりません'); console.error(JSON.stringify(data).slice(0, 500)); process.exit(1); }
let img = (item.mediumImageUrls && item.mediumImageUrls[0] && item.mediumImageUrls[0].imageUrl) || null;
if (img) img = img.replace(/\?_ex=\d+x\d+$/, '?_ex=500x500');
const entry = { cat, date: arg('date', '2026.08.08'), motif: arg('motif', 'm-chair'), brand: arg('brand', item.shopName || ''), name: arg('name', item.itemName), price: '¥' + Number(item.itemPrice).toLocaleString('ja-JP'), url: item.affiliateUrl, img, blurb: arg('blurb', '') };
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const lit = '    { cat:"' + esc(entry.cat) + '", date:"' + esc(entry.date) + '", motif:"' + esc(entry.motif) + '", brand:"' + esc(entry.brand) + '", name:"' + esc(entry.name) + '", price:"' + esc(entry.price) + '", url:"' + entry.url + '", img:' + (entry.img ? '"' + entry.img + '"' : 'null') + ',\n      blurb:"' + esc(entry.blurb) + '" },';
console.log('\n=== 取得 ==='); console.log(' 名称:', item.itemName); console.log(' 価格:', entry.price); console.log(' 料率:', (item.affiliateRate != null ? item.affiliateRate + '%' : '-')); console.log(' 画像:', img || '(なし)');
console.log('\n=== 生成PICKS ==='); console.log(lit);
if (has('insert')) {
  const mainPath = path.join(repoRoot, 'public', 'js', 'main.js');
  let src = fs.readFileSync(mainPath, 'utf8');
  const anchor = 'const PICKS = [';
  const idx = src.indexOf(anchor);
  if (idx < 0) { console.error('main.js に const PICKS = [ が無い'); process.exit(1); }
  const at = idx + anchor.length;
  src = src.slice(0, at) + '\n' + lit + src.slice(at);
  fs.writeFileSync(mainPath, src);
  console.log('\n[OK] main.js に追加しました。git add/commit/push で反映。');
} else { console.log('\n（--insert で main.js に追加）'); }