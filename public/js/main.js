/* 気になるモノ手帖 — base interactions */
(function () {
  "use strict";

  // ---- category meta ----
  // cvar=面 / deep=文字色(白地でWCAG AA) / soft=淡い面
  const CAT = {
    gadget:   { label: "ガジェット",   cvar: "var(--purple)", deep: "var(--purple-deep)", soft: "var(--purple-soft)" },
    interior: { label: "インテリア",   cvar: "var(--teal)",   deep: "var(--teal-deep)",   soft: "var(--teal-soft)" },
    goods:    { label: "雑貨",         cvar: "var(--coral)",  deep: "var(--coral-deep)",  soft: "var(--coral-soft)" },
    fashion:  { label: "ファッション", cvar: "var(--amber)",  deep: "var(--amber-deep)",  soft: "var(--amber-soft)" }
  };

  // ---- picks (real affiliate links already live on ROOM/Pinterest) ----
  // price/在庫は変動。将来Amazon切替後は該当リンクをAmazon(タグ curryoden22-22)へ差し替え可。
  const PICKS = [
    { cat:"interior", date:"2026.08.08", motif:"m-chair-y", brand:"Carl Hansen & Søn", name:"CH24 Yチェア オーク／オイル仕上げ SH45cm", price:"¥168,300", url:"https://hb.afl.rakuten.co.jp/hgc/g00q2chn.z7k3151f.g00q2chn.z7k3251e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fconnect%2Fchs_ch24_oo%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fconnect%2Fi%2F10003108%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/connect/cabinet/chs/ch24/chs_ch24_oor.jpg?_ex=500x500",
      blurb:"北欧の名作。流れるようなY字の背とペーパーコードの座面。オーク×オイルで使うほど風合いが増す。" },
    // --- gadget ---
    { cat:"gadget", date:"2026.08.05", motif:"m-cable", brand:"Native Union", name:"POP CABLE USB-C 60W カールコード", price:"¥3,080〜", url:"https://a.r10.to/h8MV9f", img:"images/native-union.jpg",
      blurb:"くるんと伸び縮みするカールコード。充電まわりの生活感を、むしろ主役に。" },
    { cat:"gadget", date:"2026.08.05", motif:"m-keyboard", brand:"HHKB (PFU)", name:"Professional HYBRID Type-S 墨", price:"¥36,850", url:"https://a.r10.to/hPBwjc", img:"images/hhkb.jpg",
      blurb:"墨色の佇まいと“スッ”と沈む打鍵感。机に置くだけで気分が上がる憧れの一台。お値段は張りますが…。" },
    { cat:"gadget", date:"2026.08.05", motif:"m-mixer", brand:"Teenage Engineering", name:"EP-136 K.O. sidekick", price:"¥29,700", url:"https://a.r10.to/hgnNqL", img:null,
      blurb:"おもちゃみたいに可愛いのに本気の音楽ツール。眺めているだけで楽しい。" },
    { cat:"gadget", date:"2026.08.05", motif:"m-stand", brand:"Satechi", name:"マグネットウォレットスタンド", price:"¥6,499", url:"https://a.r10.to/hgY16z", img:null,
      blurb:"カードを挟んでそのまま立てられる二役。マットな質感が机にも鞄にも馴染む。" },

    // --- interior ---
    { cat:"interior", date:"2026.08.05", motif:"m-chair", brand:"Fritz Hansen", name:"セブンチェア（正規）", price:"¥128,000", url:"https://a.r10.to/hgn3KB", img:null,
      blurb:"言わずと知れた名作。薄い成形合板のしなりと佇まいに、いつか一脚だけでも。" },
    { cat:"interior", date:"2026.08.05", motif:"m-chair-y", brand:"Carl Hansen & Søn", name:"Yチェア CH24 ビーチ／ソープ仕上げ", price:"¥115,500", url:"https://hb.afl.rakuten.co.jp/hgc/56516bb8.0d3eef81.56516bb9.281574a0/_RTroom06836859_388014988_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fattract%2Fch24_bh_sp%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ウェグナーが1950年に手がけた名作。流れるようなY字の背とペーパーコードの座面は、使うほど風合いが増していくそう。" },
    { cat:"interior", date:"2026.08.05", motif:"m-vase-wave", brand:"iittala", name:"アアルト ベース 120mm", price:"¥27,500", url:"https://hb.afl.rakuten.co.jp/hgc/565540e7.eef737ca.565540e8.3f8d2bf2/_RTroom06836859_388077094_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fscope%2Fiitaalv120%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"1936年生まれの波打つフォルム。花を活けても、お菓子をざっくり入れても様になる懐の深さ。" },
    { cat:"interior", date:"2026.08.05", motif:"m-vase", brand:"HOLMEGAARD", name:"FLORA ベース ロングネック 24cm", price:"¥9,350", url:"https://a.r10.to/hgsyWV", img:null,
      blurb:"デンマークの吹きガラスの一輪挿し。花が無くても様になる透明感。" },
    { cat:"interior", date:"2026.08.05", motif:"m-wineglass", brand:"HAY", name:"TINT ワイングラス 2個セット", price:"¥6,160", url:"https://hb.afl.rakuten.co.jp/hgc/5648b0f9.c66dc8d7.5648b0fa.57960852/_RTroom06836859_388024197_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fs-deco%2Ftintwineglass_blue%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"青みがかった色ガラスに、飲みものの色が透ける。ボロシリケイトで見た目より軽やかな2脚セット。" },
    { cat:"interior", date:"2026.08.05", motif:"m-crate", brand:"HAY", name:"COLOUR CRATE L", price:"¥7,700", url:"https://hb.afl.rakuten.co.jp/hgc/56328232.eede3f62.56328233.565dd845/_RTroom06836859_387514617_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fko-jo%2Fhay_colour_crate_l_2023%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"スタッキングできて色も選べる折りたたみ収納。無造作に積んでもサマになるのが良いところ。" },
    { cat:"interior", date:"2026.08.05", motif:"m-mountain", brand:"BEAMS JAPAN", name:"別注 富士山 マルチマット", price:"¥3,960", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_387045594_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fpv5249%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"玄関にちょこんと置くだけで気分が上がる赤富士。アクリル100%でふかふか、約45.5×61cm。" },
    { cat:"interior", date:"2026.08.05", motif:"m-chair", brand:"大川家具", name:"ダイニングチェア カレン（オーク無垢）", price:"¥117,500", url:"https://hb.afl.rakuten.co.jp/hgc/5605cc79.d58c0fad.5605cc7a.ca2a5214/_RTroom06836859_386791943_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ff402125-okawa%2Fdd052%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"福岡・大川の職人がつくるオーク無垢の一脚。北欧テイストのグレー座面が心地いい。ふるさと納税の返礼品です。" },

    // --- goods ---
    { cat:"goods", date:"2026.08.05", motif:"m-mug", brand:"Marimekko", name:"マグ 250ml", price:"¥2,300〜", url:"https://a.r10.to/hgv8bw", img:"images/marimekko.jpg",
      blurb:"ぽってりした250mlは、両手で包むのにちょうどよさそうなサイズ。柄を選べるので、朝の気分に合う一杯を。" },
    { cat:"goods", date:"2026.08.05", motif:"m-tissue", brand:"PUEBCO", name:"アルミ ティッシュケース（Matte）", price:"¥3,300", url:"https://a.r10.to/h8jSTI", img:null,
      blurb:"生活感の出がちなティッシュを、無骨なアルミでそっけなく格上げ。" },
    { cat:"goods", date:"2026.08.05", motif:"m-scale", brand:"DULTON", name:"ダイエットスケール 100-126（赤）", price:"¥4,180", url:"https://a.r10.to/hYvA15", img:null,
      blurb:"レトロなアメリカン。赤の差し色でキッチンがぱっと華やぐ一台。" },
    { cat:"goods", date:"2026.08.05", motif:"m-diffuser", brand:"YCYK", name:"リードディフューザー 金木犀 120ml", price:"¥4,086", url:"https://hb.afl.rakuten.co.jp/hgc/564809b7.bb733817.564809b8.e99c3a77/_RTroom06836859_387853985_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fdaily-store%2Fgr-e9r8gqj5sn%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"金木犀のふわっと甘い残り香。家に帰るたび気分がほどける、玄関脇の定位置。" },
    { cat:"goods", date:"2026.08.05", motif:"m-bottle", brand:"VITAL MATERIAL", name:"ルーム&ファブリックミスト 深緑の森 120mL", price:"¥4,180", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_387769332_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Ffu1829%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"名前のとおり、少しウッディで静かな香り。ミニマルなボトルは置いておくだけで様になる。" },
    { cat:"goods", date:"2026.08.05", motif:"m-notebook", brand:"HIGHTIDE / nahe", name:"2027 スクエア マンスリー手帳", price:"¥825", url:"https://hb.afl.rakuten.co.jp/hgc/56298ccd.94853ac7.56298cce.1a120fe7/_RTroom06836859_387761139_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhtdd%2Fne1%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"四角いフォルムとくすみ色の表紙が良い10月始まり。マンスリーでコンパクト、持ち歩きやすいサイズ。" },
    { cat:"goods", date:"2026.08.05", motif:"m-pouch", brand:"nahe", name:"ユーティリティケース ミニ", price:"¥1,650", url:"https://hb.afl.rakuten.co.jp/hgc/56298ccd.94853ac7.56298cce.1a120fe7/_RTroom06836859_387370855_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhtdd%2Fgb332%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"充電器やケーブルのごちゃつきをまとめて収納。きれいめなレザー調で、机でも鞄でも旅先でも。" },
    { cat:"goods", date:"2026.08.05", motif:"m-tube", brand:"SWAG", name:"歯磨き粉 100g（選べる5フレーバー）", price:"¥1,980", url:"https://hb.afl.rakuten.co.jp/hgc/56298db5.931c5b07.56298db6.64299957/_RTroom06836859_387371153_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswag-official%2Ftp%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ビビッドなチューブが海外プロダクトみたい。洗面所に置くだけで気分が上がる一本。" },
    { cat:"goods", date:"2026.08.05", motif:"m-tube", brand:"SWAG", name:"ホワイトニング歯磨き粉 100g", price:"¥2,530〜", url:"https://hb.afl.rakuten.co.jp/hgc/56298db5.931c5b07.56298db6.64299957/_RTroom06836859_387371343_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswag-official%2Fhw%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"清潔感のある白がかわいいホワイトニングタイプ。ブルーとおそろいで並べても◎。" },
    { cat:"goods", date:"2026.08.05", motif:"m-memo", brand:"表現社 / 沖野愛", name:"ブロックメモ 日本", price:"¥605", url:"https://hb.afl.rakuten.co.jp/hgc/562211be.4a527ecd.562211bf.a3680a17/_RTroom06836859_387237364_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fevisubungu%2F22-888%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"花火に屋台、新幹線、だるま。日本の“好き”が詰まったブロックメモ。ちょっとした贈り物にも。" },
    { cat:"goods", date:"2026.08.05", motif:"m-memo", brand:"表現社 / 沖野愛", name:"メモ帳＋付箋 京都", price:"¥550", url:"https://hb.afl.rakuten.co.jp/hgc/56220fb8.7673755a.56220fb9.71d3f94d/_RTroom06836859_387237289_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Faromage-store2%2F30003217%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"舞妓さんに京都タワー、五重塔。眺めるだけで旅気分になるメモ＋付箋のセット。" },
    { cat:"goods", date:"2026.08.05", motif:"m-record", brand:"The Durutti Column", name:"RENASCENT（LP）", price:"¥8,190", url:"https://hb.afl.rakuten.co.jp/hgc/56484ca7.b65dbd41.56484ca8.2c9e50b4/_RTroom06836859_387858616_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Famericanpie%2Flndn1725759vinyl%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"16年ぶりの新作LP。グラデーションと色面が重なるジャケットは、棚に立てかけておくだけで様になる。" },

    // --- fashion ---
    { cat:"fashion", date:"2026.08.05", motif:"m-socks", brand:"ROTOTO", name:"ダブルフェイス クルーソックス R1508", price:"¥2,200", url:"https://a.r10.to/h5S9Jf", img:null,
      blurb:"内側パイル・外側フラットの二重編み。足元の“ちょっといい”は結構効く。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-watch", brand:"Swatch", name:"BLUEBERRY SKY SO29M702", price:"¥14,520", url:"https://hb.afl.rakuten.co.jp/hgc/565645a7.e2c108b6.565645a8.d2c738a8/_RTroom06836859_388096151_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswatchofficial%2Fso29m702%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ライトブルーの文字盤とグレーのケースの淡い配色がきれい。41mmの大きめフェイスなのに軽やかに見えるのが良いところ。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-pouch", brand:"Marimekko", name:"ウニッコ柄 ポーチ", price:"¥5,599", url:"https://hb.afl.rakuten.co.jp/hgc/56329022.b6ed13bf.56329023.74ea77a3/_RTroom06836859_387515459_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fglv%2Fmri-en%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ぱっと明るい花柄。バッグを開けるたびに気分を上げてくれる小物入れ。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-tote", brand:"Maison MIHARA YASUHIRO", name:"in・stru(men-tal). ビッグネームトート", price:"¥8,800", url:"https://hb.afl.rakuten.co.jp/hgc/5606229a.d681058a.5606229b.d6295ad8/_RTroom06836859_386791868_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flli-femme%2Fi12bg701%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"やわらかいコットンキャンバスでA4も入る大きめ。手持ちと肩掛けの2wayで毎日使える。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-polo", brand:"FRED PERRY", name:"ポロシャツ M12（英国製）", price:"¥13,200〜", url:"https://hb.afl.rakuten.co.jp/hgc/56560b24.81a4af99.56560b25.69852214/_RTroom06836859_388090896_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcoc%2Fm12n-black%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"襟と袖口のツインティップに、胸の月桂樹。英国製の鹿の子はほどよい厚みで、襟もしっかり立つ。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-polo-knit", brand:"JOHN SMEDLEY", name:"ADRIAN ニットポロ 30ゲージ", price:"¥26,000", url:"https://hb.afl.rakuten.co.jp/hgc/5642f255.dfdaa4f2.5642f256.e4ad01cd/_RTroom06836859_387768335_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmb%2Fadrian%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"シーアイランドコットンの上品な光沢と、なめらかな編み地。襟のあるニットは季節の変わり目にちょうどいい。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-sneaker-trail", brand:"SALOMON", name:"XA PRO 3D", price:"¥19,800", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_388072599_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fkm2581%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"トレイル由来のごつっとした佇まいが、むしろ普段着のいい差し色に。Quicklaceのすっと締まる感じも good。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-sneaker", brand:"On", name:"Cloud 6", price:"¥19,800", url:"https://hb.afl.rakuten.co.jp/hgc/564298ab.00744c4a.564298ac.d7858634/_RTroom06836859_387762742_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsakaikututen%2Fcloud-m%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"雲の上のようと言われるクラウドソール。すっきりした見た目で、街履きにも軽い運動にも。" }
  ];

  // 掲載日の新しい順に並べる（同日は記述順を保つ安定ソート）
  PICKS.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  // NEW は「最新の掲載日」かつ「その日付の商品が6件以下」のときだけ付ける。
  // 全件が同じ日付だと何が新しいとも言えないので、その場合は誰にも付かない。
  // 商品を1〜数件追加すると、その日付の商品にだけ自動で付く。
  const latestDate = PICKS.reduce((m, p) => (p.date > m ? p.date : m), "");
  const latestCount = PICKS.filter((p) => p.date === latestDate).length;
  const isNew = (p) => latestCount > 0 && latestCount <= 6 && p.date === latestDate;
  const INITIAL_VISIBLE = 6;

  // ---- render cards ----
  const grid = document.getElementById("pickGrid");
  const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  const band = (price) => {
    if (!price) return "";
    const n = Number(price.replace(/[^0-9]/g, ""));
    if (!n) return "";
    if (n < 2500) return "UNDER 2.5K";
    if (n < 7000) return "2.5K-7K";
    return "7K+";
  };

  const frag = document.createDocumentFragment();
  PICKS.forEach((p) => {
    const meta = CAT[p.cat];
    const el = document.createElement("article");
    el.className = "card reveal" + (p.feature ? " card--feature" : "");
    el.dataset.cat = p.cat;
    el.style.setProperty("--c", meta.cvar);
    el.style.setProperty("--c-deep", meta.deep);
    el.style.setProperty("--c-soft", meta.soft);

    const media = p.img
      ? `<div class="card__media"><img src="${p.img}" alt="${esc(p.brand)} ${esc(p.name)}" loading="lazy"></div>`
      : `<div class="card__media card__media--blank" aria-hidden="true"><span class="card__visual-word">${meta.label}</span><span class="card__visual-shape card__visual-shape--a"></span><span class="card__visual-shape card__visual-shape--b"></span></div>`;

    el.innerHTML = `
      ${media}
      <div class="card__body">
        <div class="card__meta">
          <span class="card__cat">${meta.label}</span>
          ${isNew(p) ? `<span class="card__new">NEW</span>` : ""}
          <span class="card__date">${esc(p.date)}</span>
          ${band(p.price) ? `<span class="card__band" title="価格帯のめやす">${band(p.price)}</span>` : ""}
        </div>
        <span class="card__brand">${esc(p.brand)}</span>
        <h3 class="card__name">${esc(p.name)}</h3>
        <p class="card__blurb">${esc(p.blurb || p.desc || "")}</p>
        <div class="card__foot">
          <span class="card__price">${esc(p.price)}</span>
          <a class="card__btn" href="${p.url}" target="_blank" rel="sponsored noopener nofollow">楽天ROOMで見る</a>
        </div>
      </div>`;
    frag.appendChild(el);
  });
  // 読みもの等の商品グリッドが無いページでも同じmain.jsを読むため、存在確認する
  if (grid) grid.appendChild(frag);

  let expanded = false;
  const togglePicks = document.getElementById("togglePicks");
  const applyLimit = () => {
    const activeChip = document.querySelector(".chip.is-active");
    const cat = activeChip?.dataset.cat || "all";
    let visibleIndex = 0;

    document.querySelectorAll(".card").forEach((card) => {
      const matches = cat === "all" || card.dataset.cat === cat;
      if (!matches) {
        card.classList.add("is-hidden");
        return;
      }
      const collapse = !expanded && visibleIndex >= INITIAL_VISIBLE;
      card.classList.toggle("is-hidden", collapse);
      visibleIndex += 1;
    });

    if (togglePicks) {
      const canExpand = visibleIndex > INITIAL_VISIBLE;
      togglePicks.hidden = !canExpand;
      togglePicks.textContent = expanded ? "閉じる" : "もっと見る";
      togglePicks.setAttribute("aria-expanded", String(expanded));
    }
  };

  if (togglePicks) {
    togglePicks.addEventListener("click", () => {
      expanded = !expanded;
      applyLimit();
      if (!expanded) {
        document.getElementById("select")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
  applyLimit();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- category filter ----
  let vtBusy = false;
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const apply = () => {
        chips.forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-selected","false"); });
        chip.classList.add("is-active");
        chip.setAttribute("aria-selected","true");
        expanded = false;
        applyLimit();
      };
      // 対応ブラウザでは絞り込みをクロスフェードさせる（未対応なら即時切替）。
      // 実行中に次のクリックが来ると中断されて Promise が reject するため、
      // 多重起動を防いだうえで拒否も握りつぶす。
      if (document.startViewTransition && !reduce && !vtBusy) {
        vtBusy = true;
        const t = document.startViewTransition(apply);
        const release = () => { vtBusy = false; };
        t.finished.then(release, release);
        t.ready.catch(() => {});
        t.updateCallbackDone.catch(() => {});
      } else {
        apply();
      }
    });
  });


  // ---- mood story slideshow ----
  const moodSlider = document.querySelector("[data-mood-slider]");
  if (moodSlider) {
    const slides = [...moodSlider.querySelectorAll(".mood-slide")];
    const dots = [...moodSlider.querySelectorAll("[data-mood-dot]")];
    let currentSlide = 0;
    let moodTimer = null;

    const showMood = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === currentSlide;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === currentSlide);
      });
    };

    const startMood = () => {
      if (reduce || slides.length < 2 || moodTimer) return;
      moodTimer = window.setInterval(() => showMood(currentSlide + 1), 4600);
    };

    const stopMood = () => {
      if (!moodTimer) return;
      window.clearInterval(moodTimer);
      moodTimer = null;
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        stopMood();
        showMood(Number(dot.dataset.moodDot || 0));
        startMood();
      });
    });
    moodSlider.addEventListener("pointerenter", stopMood);
    moodSlider.addEventListener("pointerleave", startMood);
    showMood(0);
    startMood();
  }
  // ---- mobile menu ----
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.hasAttribute("hidden");
      if (open) { menu.removeAttribute("hidden"); menu.style.display = "flex"; }
      else { menu.setAttribute("hidden",""); menu.style.display = "none"; }
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      menu.setAttribute("hidden",""); menu.style.display = "none";
      toggle.setAttribute("aria-expanded","false");
    }));
  }

  // ---- motion ----
  // スクロール連動アニメが使えるブラウザではそちらに任せる（CSS側 html.sda）
  const sda = !reduce && window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
  if (sda) document.documentElement.classList.add("sda");

  if (!reduce) {
    // マグネットボタン: ポインタに少し吸い寄せる
    document.querySelectorAll(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform =
          "translate(" + (e.clientX - r.left - r.width / 2) * 0.2 + "px," +
          (e.clientY - r.top - r.height / 2) * 0.28 + "px)";
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });

    // カードの傾き: --rx/--ry を渡すだけにして、CSS側の hover 移動と合成させる
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 7 + "deg");
        card.style.setProperty("--rx", (0.5 - (e.clientY - r.top) / r.height) * 7 + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  // ---- editorial float: ムード面の大きいカードを軽く追従させる ----
  if (!reduce) {
    document.querySelectorAll("[data-float]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--fx", ((e.clientX - r.left) / r.width - 0.5) * 10 + "px");
        el.style.setProperty("--fy", ((e.clientY - r.top) / r.height - 0.5) * 10 + "px");
        el.style.transform = "translate(var(--fx), var(--fy))";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
        el.style.removeProperty("--fx");
        el.style.removeProperty("--fy");
      });
    });
  }
  // ---- scroll reveal（スクロール連動が無いブラウザ向けのフォールバック） ----
  if (!reduce && !sda && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
  } else {
    document.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
  }


  // ---- back to top ----
  const backTop = document.getElementById("backTop");
  if (backTop) {
    const toggleBackTop = () => {
      backTop.classList.toggle("is-visible", window.scrollY > 520);
    };
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", toggleBackTop, { passive: true });
    toggleBackTop();
  }
  // ---- share ----
  // Instagram は Web から投稿文を渡す仕組みが無いのでボタンを作れない。
  // 代わりに navigator.share が使える端末では OS の共有シートを出し、そこから選べるようにする。
  document.querySelectorAll("[data-share]").forEach((box) => {
    const url = location.href.split("#")[0].split("?")[0];
    const title = document.title;
    const media = document.querySelector('meta[property="og:image"]')?.content || "";
    const e = encodeURIComponent;
    const set = (sel, href) => { const a = box.querySelector(sel); if (a) a.href = href; };
    set("[data-share-x]",  "https://x.com/intent/tweet?text=" + e(title) + "&url=" + e(url));
    set("[data-share-line]","https://social-plugins.line.me/lineit/share?url=" + e(url));
    set("[data-share-fb]", "https://www.facebook.com/sharer/sharer.php?u=" + e(url));
    set("[data-share-pin]","https://pinterest.com/pin/create/button/?url=" + e(url) +
                           "&media=" + e(media) + "&description=" + e(title));

    const nat = box.querySelector("[data-share-native]");
    if (nat && navigator.share) {
      nat.hidden = false;
      nat.addEventListener("click", () => {
        navigator.share({ title, url }).catch(() => {});   // 共有中止は正常系なので握りつぶす
      });
    }
    const copy = box.querySelector("[data-share-copy]");
    if (copy) {
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(url); }
        catch { return; }
        const before = copy.textContent;
        copy.textContent = "コピーしました";
        copy.classList.add("is-done");
        setTimeout(() => { copy.textContent = before; copy.classList.remove("is-done"); }, 1800);
      });
    }
  });

  // ---- year ----
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
