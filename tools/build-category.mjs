// build-category.mjs — public/js/main.js の PICKS から カテゴリ別ページ7本を生成する。
//
// なぜ静的生成なのか:
//   トップは商品121件をJSで描画し、初期表示6件以外は display:none にしている。
//   これだと「iittala ティーマ マグカップ」のような指名検索の受け皿が1URLも無い。
//   カテゴリページはHTMLに商品を焼き込んで、JS無しでも本文として読める状態にする。
//
// ★ PICKS を編集したら必ず再生成すること:
//      node tools/build-category.mjs
//   忘れると生成物が古いまま残る。デプロイのワークフロー
//   (.github/workflows/firebase-hosting-merge.yml) に再生成→差分チェックを入れてあるので、
//   忘れた場合はデプロイが落ちて気づけるようにしてある。
//
// 出力: public/category/<cat>.html （cleanUrls:true なので /category/<cat> で配信される）
//       public/sitemap.xml に未登録のカテゴリURLがあれば追記する（既存の lastmod は触らない）

import fs from 'node:fs';
import path from 'node:path';
// カード描画とPICKS読み取りは build-roundup.mjs と共有する。
// ここに書き写すと必ず片方だけ古くなるため（data-* は main.js の計測が読む）。
import { repoRoot, CAT, esc, readPicks, makeIsNew, cardHtml, footerCatlinks, adSlot, AD_BY_PAGE, CONTACT_URL } from './lib/site.mjs';

const outDir = path.join(repoRoot, 'public/category');
const sitemapPath = path.join(repoRoot, 'public/sitemap.xml');

const ORIGIN = 'https://kininarumono.jp';
const OGP = `${ORIGIN}/images/ogp-2026-08.jpg`;
const GA_ID = 'G-S4LRS2KCRZ';

// 生成日（sitemap に新規URLを足すときだけ使う）。実際に変えていない日付を today にしないため、
// 既存エントリの lastmod は書き換えない。
const TODAY = process.argv.includes('--date')
  ? process.argv[process.argv.indexOf('--date') + 1]
  : new Date().toISOString().slice(0, 10);

// ---- ページごとの本文。検索意図を拾う語を自然に含める（煽り・断定はしない） ----
const COPY = {
  interior: {
    title: 'インテリア雑貨・北欧家具のおすすめ',
    desc: '北欧の定番チェアから、テーブルランプ・花瓶・キャンドルホルダーまで。部屋の景色を少し上げてくれるインテリアを、気になった順に集めています。',
    h1: 'インテリア — 北欧の定番から、灯りと小さなオブジェまで',
    lead: '北欧の定番チェアから、テーブルランプ、花瓶、キャンドルホルダーまで。今の部屋に何を足したいかを考えるための候補を集めました。',
    body: [
      '灯りを足すなら、まず本を読む場所や手元など、明るくしたい位置を決めます。器具の寸法だけでなく、電源、コードの通り道、周囲の空間、使用できる場所を購入品の説明書と照合します。',
      '家具は、本体寸法に座る・引く・扉を開く空間と搬入経路を加えて比べます。脚の形や床が見える面積も眺めながら、手持ちの家具と並べたときに残したい余白を考えます。'
    ]
  },
  kitchen: {
    title: '食器・キッチン用品のおすすめ',
    desc: '北欧食器のマグカップ、耐熱ガラス、波佐見焼のボウル、燕三条のキッチンツールまで。毎日使うものだからこそ、形と質感で選んだ食器・調理道具を集めています。',
    h1: '食器・キッチン — 毎日使うから、形と質感で選ぶ',
    lead: 'マグカップ、ガラス、ボウル、キッチンツール。形や質感に加え、一度に使う量、収納場所、手入れの方法から比べたい食器と調理道具を並べました。',
    body: [
      '食器は手持ちの器を一つ出し、容量・高さ・個数を候補と比較します。重ねられるかは外形だけで決めず、商品の説明と棚の寸法を確認。電子レンジ・食洗機・オーブンの対応は、同じシリーズでも購入する仕様で確かめます。',
      '調理道具は、使う場所としまう場所の両方を測ってから選びます。対応熱源、耐熱条件、洗える部品も確認し、使ったあとの片付けまで続けられるかを考えます。'
    ]
  },
  gadget: {
    title: 'デザインのいいガジェットのおすすめ',
    desc: 'スピーカー、イヤホン、キーボード、カメラまわりの小物まで。スペックだけでなく、机や棚に置いたときの見た目で選んだガジェットを集めています。',
    h1: 'ガジェット — 机に置いたときの顔で選ぶ',
    lead: 'スピーカー、ワイヤレスイヤホン、キーボード、カメラまわりの小物。必要な機能と、机や棚に置いたときの見た目を一緒に比較するための候補です。',
    body: [
      'デスクまわりは、使いたい機能を先に挙げてから接続端子と対応機器を照合します。本体が小さくても配線や充電器の場所は必要なので、置いた状態と使っている状態を分けて考えます。',
      'スピーカーは棚に置くか、部屋の中で動かすかを決め、寸法と電源を確認します。防水等級だけで浴室や充電時の水濡れへの対応を判断せず、型番ごとの使用環境と取扱説明を優先します。'
    ]
  },
  fashion: {
    title: 'バッグ・スニーカー・ファッション小物のおすすめ',
    desc: 'ショルダーバッグやトートバッグ、スニーカー、アクセサリーまで。定番からコラボ・別注まで、普段の服に足して効くものを集めています。',
    h1: 'ファッション — 普段の服に、一点だけ足して効くもの',
    lead: 'バッグ、スニーカー、アクセサリー、雨の日のウェアまで。普段の服と合わせたい色や形を、サイズと手入れの条件も含めて比べる候補を並べました。',
    body: [
      'バッグは持ち歩く荷物を並べ、容量だけでなく開口部・マチ・持ち手の長さを比べます。肩に掛けるなら上着を着た状態も考えます。撥水加工から、縫い目や開口部を含む防水性能までは決めつけません。',
      '靴は普段の靴下と合わせて、サイズや足に触れる部分を確認します。ソールの厚みや色は、手持ちの服と並べて好みを比較する項目。見た目だけで歩きやすさや雨の日の適性を判断しないようにします。'
    ]
  },
  goods: {
    title: '文具・雑貨のおすすめ',
    desc: 'ペン、手帳まわり、ポーチ、財布、カードケースまで。机の上とカバンの中で毎日触るものを、使い勝手と見た目の両方で選んで集めています。',
    h1: '文具・雑貨 — 机の上と、カバンの中の定位置',
    lead: 'ペンや手帳、ポーチ、財布、カードケース。机の上とカバンの中で使うものを、使う場面と置く場所から比べるための候補です。',
    body: [
      '小物は入れるものと置く場所を決めてから寸法を比べます。ポーチなら口の開き方、財布ならカードや小銭を入れた状態も確認。価格から使える年数や買い物の元が取れるかを決めず、必要な機能を絞ります。',
      '文具は書き方や手帳の使い方に合わせて比較します。ペンの太さと替芯、ノートの寸法と紙、手帳なら対象年と始まり月。置いてあるときの佇まいも、好みとして選ぶ理由に加えます。'
    ]
  },
  daily: {
    title: '日用品・収納グッズのおすすめ',
    desc: '収納ボックス、ティッシュディスペンサー、洗面まわりの小物まで。生活感が出やすいところこそ、形を選ぶと部屋の印象が変わります。',
    h1: '日用品 — 生活感が出やすいところほど、形を選ぶ',
    lead: '収納ボックス、ティッシュまわり、洗面所の小物。何を入れるか、どこに置くかを決めてから、毎日の出し入れと手入れを比べたい候補を集めました。',
    body: [
      '収納は、中身を見せたいか隠したいかと、出し入れする頻度から考えます。積み重ねる場合は対応する組合せ・耐荷重・安定性を購入品の案内で確認し、ふたを開く空間も残します。',
      '洗面や洗濯まわりは、掃除のときに動かす物を確認します。壁に留めたり掛けたりするものは、壁材、取付方法、荷重、賃貸での条件を照合。置いたまま使うものは、水濡れや洗剤への対応も確かめます。'
    ]
  },
  beauty: {
    title: 'コスメ・ヘアケアのおすすめ',
    desc: 'ハンドソープやバーム、ヘアケアまで。洗面台や机に出しっぱなしにしても気持ちのいい、パッケージまで含めて気になったものを集めています。',
    h1: 'コスメ・ケア — 出しっぱなしでも気持ちのいいもの',
    lead: 'ソープ、バーム、ヘアケア。中身の用途と使い方を確認しながら、洗面台や机に置きたい容器の形も比べるための候補です。',
    body: [
      'ボトルは置く面を測り、ポンプを押すときや詰め替えるときの空間も考えます。見た目だけで保管場所を決めず、直射日光や温度など、製品に書かれた保管条件を確かめます。',
      '香りは、好きな系統と実際に使う場所から候補を比べます。試せる場合は少量で確かめ、成分・用途・使用上の注意を確認します。パッケージの印象や香りの好みから、肌への適合や効能を保証しない選び方です。'
    ]
  }
};

// ---- 関連記事（内部リンク。カテゴリごとに相性のいいものを手で選ぶ） ----
// まとめ記事（/read/*-ika 等）もここに含める。含めないと、トップの一覧からしか
// 辿れないページになってしまう。fashion はまとめ3本のどれとも噛み合わないので足さない。
const RELATED = {
  interior: ['hitorigurashi-no-heyazukuri', 'kagu-brand-no-erabikata', 'burando-lineup-no-kijun',
             'hokuo-design-teiban', 'hitorigurashi-kaden-akari'],
  kitchen:  ['ii-mono-no-kijun', 'zakka-no-mikata', 'hitorigurashi-no-heyazukuri',
             'hokuo-design-teiban', 'gift-3000en-ika'],
  gadget:   ['ii-mono-no-kijun', 'burando-lineup-no-kijun', 'zakka-no-mikata',
             'hitorigurashi-kaden-akari'],
  fashion:  ['trend-komono-rule', 'zakka-no-mikata', 'burando-lineup-no-kijun'],
  goods:    ['zakka-no-asobigokoro', 'trend-komono-rule', 'gift-no-erabikata',
             'gift-3000en-ika'],
  daily:    ['hitorigurashi-no-heyazukuri', 'zakka-no-asobigokoro', 'ii-mono-no-kijun',
             'hitorigurashi-kaden-akari'],
  beauty:   ['gift-no-erabikata', 'zakka-no-asobigokoro', 'ii-mono-no-kijun',
             'gift-3000en-ika']
};

const ARTICLE_TITLES = {
  'zakka-no-mikata': '部屋と服のあいだで選ぶ、デザイン雑貨の見方',
  'trend-komono-rule': '強い色や柄の小物を、いつもの部屋や服に合わせる3つの試し方',
  'ii-mono-no-kijun': '実際に買ってよかったものに共通する、「良いモノ」の選び方',
  'zakka-no-asobigokoro': '小さな雑貨で、柄や形の遊び心を試す',
  'kagu-brand-no-erabikata': '家具は使い方・寸法・手入れから選ぶ',
  'burando-lineup-no-kijun': '定番から知らないブランドまで、選ぶ3つの視点',
  'gift-no-erabikata': 'プレゼント選びで見ている3つの基準',
  'hitorigurashi-no-heyazukuri': '一人暮らしの部屋づくりで最初に決める3つのこと',
  'gift-3000en-ika': 'プチギフトに選ぶ、毎日使う雑貨 8選',
  'hitorigurashi-kaden-akari': '小さな部屋で検討したい、家電と灯り 7選',
  'hokuo-design-teiban': '北欧デザインの定番、どれから買うか 9選'
};

function page(cat, picks, allPicks, vparam) {
  const meta = CAT[cat];
  const copy = COPY[cat];
  const url = `${ORIGIN}/category/${cat}`;
  const fullTitle = `${copy.title}｜気になるモノ手帖`;

  // NEW の判定はトップ (main.js) と同じルールで揃える
  const isNew = makeIsNew(allPicks);

  const cards = picks.map((p) => cardHtml(p, isNew(p))).join('\n');

  const otherCats = Object.keys(CAT).filter((c) => c !== cat)
    .map((c) => `<a class="catnav__link" href="/category/${c}" style="--c:var(--${CAT[c].cvar}-deep)">${esc(CAT[c].label)}</a>`)
    .join('\n');

  const related = (RELATED[cat] || []).map((slug) =>
    `<li><a href="/read/${slug}">${esc(ARTICLE_TITLES[slug] || slug)}</a></li>`).join('\n');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: fullTitle,
        description: copy.desc,
        inLanguage: 'ja-JP',
        isPartOf: { '@id': `${ORIGIN}/#website` },
        about: { '@type': 'Thing', name: meta.label }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '気になるモノ手帖', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: meta.label, item: url }
        ]
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        name: `${meta.label}のピック`,
        numberOfItems: picks.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        // 商品一覧は通常のItemList。単一商品向けProductスニペットとして扱わない。
        itemListElement: picks.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.brand} ${p.name}`
        }))
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="ja">
<head> <!-- Google tag (gtag.js) --> <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}'); </script>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(copy.desc)}" />
<meta property="og:title" content="${esc(fullTitle)}" />
<meta property="og:description" content="${esc(copy.desc)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<link rel="canonical" href="${url}" />
<meta property="og:site_name" content="気になるモノ手帖" />
<meta property="og:locale" content="ja_JP" />
<meta property="og:image" content="${OGP}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${esc(fullTitle)}" /><meta name="twitter:description" content="${esc(copy.desc)}" /><meta name="twitter:image" content="${OGP}" />
<meta name="theme-color" content="#0A57FF" />
<link rel="icon" href="/favicon.ico" sizes="32x32" /><link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" /><link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192x192.png" /><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Noto+Sans+JP:wght@400;500&family=Zen+Maru+Gothic:wght@400;500;700;900&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp.min.css" />
<!-- ?v= はキャッシュ破棄用。css/js を変更したら全ページで数字を上げること -->
<link rel="stylesheet" href="/css/style.css?v=${vparam}" />
<script type="application/ld+json">${JSON.stringify(ld)}</script></head>
<body>

<!-- このページは tools/build-category.mjs が生成しています。直接編集しないこと。
     文言を直すなら tools/build-category.mjs の COPY を編集して再生成する。 -->

<header class="site-header" id="top">
<a href="/" class="wordmark" aria-label="気になるモノ手帖 トップへ">
<img class="wordmark__mark" src="/images/logo-mark.webp" alt="" width="320" height="320" decoding="async" />
<span class="wordmark__name">気になるモノ手帖</span>
<span class="wordmark__sub">MONO NOTE</span>
</a>
<nav class="site-nav" aria-label="メインナビ">
<a href="/#about">ムード</a>
<a href="/#select">ピック</a>
<a href="/read">読みもの</a>
<a href="/#channels">チャンネル</a>
</nav>
<a class="pill pill--room" href="https://room.rakuten.co.jp/totonou_note" target="_blank" rel="noopener">楽天ROOM →</a>
<button class="nav-toggle" aria-label="メニューを開閉" aria-expanded="false"><span></span><span></span><span></span></button>
</header>
<div class="mobile-menu" id="mobileMenu" hidden>
<a href="/#about">ムード</a>
<a href="/#select">ピック</a>
<a href="/read">読みもの</a>
<a href="/#channels">チャンネル</a>
<a href="https://room.rakuten.co.jp/totonou_note" target="_blank" rel="noopener">楽天ROOM →</a>
</div>

<main>
<section class="cat-page">

<nav class="crumbs" aria-label="パンくず">
<a href="/">気になるモノ手帖</a><span aria-hidden="true">›</span><span aria-current="page">${esc(meta.label)}</span>
</nav>

<div class="section-head">
<span class="eyebrow" style="--c:var(--${meta.cvar}-deep)">${esc(meta.label)}</span>
<h1>${esc(copy.h1)}</h1>
<p class="section-sub">${esc(copy.lead)}</p>
</div>

<div class="cat-intro">
${copy.body.map((t) => `<p>${esc(t)}</p>`).join('\n')}
</div>

<!-- ステマ規制（景表法）対応。商品カードより前に必ず置くこと。 -->
<p class="disclosure">
<span class="disclosure__tag">PR</span>
<span>当サイトはアフィリエイト広告を利用しています。以下の商品リンクから購入されると、運営者に報酬が支払われます。価格・在庫は変動するので、購入前にリンク先でご確認ください。</span>
</p>

<h2 class="cat-count">${esc(meta.label)}のピック（${picks.length}件）</h2>

<div class="grid">
${cards}
</div>

<h2>ほかのカテゴリ</h2>
<nav class="catnav" aria-label="ほかのカテゴリ">
${otherCats}
<a class="catnav__link" href="/#select">すべてのピック</a>
</nav>

<h2>あわせて読む</h2>
<ul class="cat-related">
${related}
</ul>

<div class="share" data-share>
<span class="share__label">SHARE</span>
<button class="share__btn" type="button" data-share-native hidden>シェアする</button>
<a class="share__btn" data-share-x target="_blank" rel="noopener">X</a>
<a class="share__btn" data-share-line target="_blank" rel="noopener">LINE</a>
<a class="share__btn" data-share-fb target="_blank" rel="noopener">Facebook</a>
<a class="share__btn" data-share-pin target="_blank" rel="noopener">Pinterest</a>
<button class="share__btn" type="button" data-share-copy>リンクをコピー</button>
</div>

</section>
${adSlot(AD_BY_PAGE[cat], `category-${cat}`)}
</main>

<footer class="site-footer" id="footer">
<div class="footer__brand">
<span class="wordmark wordmark--footer">
<img class="wordmark__mark" src="/images/logo-mark.webp" alt="" width="320" height="320" loading="lazy" decoding="async" />
<span class="wordmark__name">気になるモノ手帖</span>
<span class="wordmark__sub">MONO NOTE</span>
</span>
<p>デザインでアガる雑貨・インテリア・ガジェット。</p>
</div>
${footerCatlinks}
<div class="footer__legal">
<p><strong>アフィリエイトについて</strong><br />当サイトは、アフィリエイトプログラム（楽天アフィリエイト・A8.net）を利用しています。掲載リンクから商品を購入されると、運営者に報酬が支払われる場合があります。価格・在庫は掲載時点のもので変動します。購入前にリンク先でご確認ください。</p>
<p class="footer__mini">運営：気になるモノ手帖（<a href="${CONTACT_URL}" target="_blank" rel="noopener">お問い合わせフォーム</a>）／掲載情報の正確性には努めますが内容を保証するものではありません。商品の購入・利用は各自のご判断でお願いします。</p>
</div>
<p class="footer__copy">© <span id="year"></span> 気になるモノ手帖</p>
</footer>

<button class="back-top" id="backTop" type="button" aria-label="ページトップへ戻る">↑</button>

<script src="/js/main.js?v=${vparam}" defer></script>
<!-- koko-ask-chatgpt -->
<script src="/ask-chatgpt.js?v=2" data-product="kininarumono" defer></script>
</body>
</html>
`;
}

// ---- sitemap に未登録のカテゴリURLだけ足す（既存の lastmod は書き換えない） ----
function updateSitemap(cats) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const eol = xml.includes('\r\n') ? '\r\n' : '\n';
  const missing = cats.filter((c) => !xml.includes(`<loc>${ORIGIN}/category/${c}</loc>`));
  if (missing.length === 0) return 0;
  const lines = missing.map((c) =>
    `  <url><loc>${ORIGIN}/category/${c}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`);
  xml = xml.replace('</urlset>', lines.join(eol) + eol + '</urlset>');
  fs.writeFileSync(sitemapPath, xml);
  return missing.length;
}

// ---- main ----
const picks = readPicks();
// index.html の ?v= に合わせる（css/js のキャッシュ破棄番号をページ間でずらさない）
const vparam = (fs.readFileSync(path.join(repoRoot, 'public/index.html'), 'utf8')
  .match(/main\.js\?v=(\d+)/) || [, '1'])[1];

fs.mkdirSync(outDir, { recursive: true });

const cats = Object.keys(CAT);
let written = 0;
for (const cat of cats) {
  if (!COPY[cat]) throw new Error(`COPY に ${cat} が無い`);
  const items = picks.filter((p) => p.cat === cat);
  if (items.length === 0) {
    console.log(`skip ${cat}（該当商品なし）`);
    continue;
  }
  const html = page(cat, items, picks, vparam);
  const dest = path.join(outDir, `${cat}.html`);
  const prev = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  // このリポジトリは core.autocrlf が効いていて、チェックアウト後の作業コピーは CRLF になる。
  // 改行の違いだけで「毎回書き換わった」と出ると再生成の要否が読めなくなるので、比較は正規化する。
  const norm = (t) => t.replace(/\r\n/g, '\n');
  const same = prev !== null && norm(prev) === norm(html);
  if (!same) {
    fs.writeFileSync(dest, html);
    written++;
  }
  console.log(`${same ? '=' : '+'} /category/${cat}  ${items.length}件`);
}

const added = updateSitemap(cats.filter((c) => picks.some((p) => p.cat === c)));
console.log(`\n生成: ${cats.length}カテゴリ / 更新したファイル ${written}件 / sitemapに追加 ${added}件 / ?v=${vparam}`);
