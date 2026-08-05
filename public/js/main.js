/* 気になるモノ手帖 — base interactions */
(function () {
  "use strict";

  // ---- category meta ----
  const CAT = {
    gadget:   { label: "ガジェット",       cvar: "var(--purple)" },
    interior: { label: "インテリア",       cvar: "var(--teal)" },
    goods:    { label: "雑貨",             cvar: "var(--coral)" },
    fashion:  { label: "ファッション",     cvar: "var(--amber)" }
  };

  // ---- picks (real affiliate links already live on ROOM/Pinterest) ----
  // price/在庫は変動。将来Amazon切替後は該当リンクをAmazon(タグ curryoden22-22)へ差し替え可。
  const PICKS = [
    // --- gadget ---
    { cat:"gadget", brand:"Native Union", name:"POP CABLE USB-C 60W カールコード", price:"¥3,080〜", url:"https://a.r10.to/h8MV9f", img:"images/native-union.jpg",
      blurb:"くるんと伸び縮みするカールコード。充電まわりの生活感を、むしろ主役に。" },
    { cat:"gadget", brand:"HHKB (PFU)", name:"Professional HYBRID Type-S 墨", price:"¥36,850", url:"https://a.r10.to/hPBwjc", img:"images/hhkb.jpg",
      blurb:"墨色の佇まいと“スッ”と沈む打鍵感。机に置くだけで気分が上がる憧れの一台。お値段は張りますが…。" },
    { cat:"gadget", brand:"Teenage Engineering", name:"EP-136 K.O. sidekick", price:"¥29,700", url:"https://a.r10.to/hgnNqL", img:null,
      blurb:"おもちゃみたいに可愛いのに本気の音楽ツール。眺めているだけで楽しい。" },
    { cat:"gadget", brand:"Satechi", name:"マグネットウォレットスタンド", price:"¥6,499", url:"https://a.r10.to/hgY16z", img:null,
      blurb:"カードを挟んでそのまま立てられる二役。マットな質感が机にも鞄にも馴染む。" },

    // --- interior ---
    { cat:"interior", brand:"Fritz Hansen", name:"セブンチェア（正規）", price:"¥128,000", url:"https://a.r10.to/hgn3KB", img:null,
      blurb:"言わずと知れた名作。薄い成形合板のしなりと佇まいに、いつか一脚だけでも。" },
    { cat:"interior", brand:"Carl Hansen & Søn", name:"Yチェア CH24 ビーチ／ソープ仕上げ", price:"¥115,500", url:"https://hb.afl.rakuten.co.jp/hgc/56516bb8.0d3eef81.56516bb9.281574a0/_RTroom06836859_388014988_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fattract%2Fch24_bh_sp%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ウェグナーが1950年に手がけた名作。流れるようなY字の背とペーパーコードの座面は、使うほど風合いが増していくそう。" },
    { cat:"interior", brand:"iittala", name:"アアルト ベース 120mm", price:"¥27,500", url:"https://hb.afl.rakuten.co.jp/hgc/565540e7.eef737ca.565540e8.3f8d2bf2/_RTroom06836859_388077094_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fscope%2Fiitaalv120%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"1936年生まれの波打つフォルム。花を活けても、お菓子をざっくり入れても様になる懐の深さ。" },
    { cat:"interior", brand:"HOLMEGAARD", name:"FLORA ベース ロングネック 24cm", price:"¥9,350", url:"https://a.r10.to/hgsyWV", img:null,
      blurb:"デンマークの吹きガラスの一輪挿し。花が無くても様になる透明感。" },
    { cat:"interior", brand:"HAY", name:"TINT ワイングラス 2個セット", price:"¥6,160", url:"https://hb.afl.rakuten.co.jp/hgc/5648b0f9.c66dc8d7.5648b0fa.57960852/_RTroom06836859_388024197_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fs-deco%2Ftintwineglass_blue%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"青みがかった色ガラスに、飲みものの色が透ける。ボロシリケイトで見た目より軽やかな2脚セット。" },
    { cat:"interior", brand:"HAY", name:"COLOUR CRATE L", price:"¥7,700", url:"https://hb.afl.rakuten.co.jp/hgc/56328232.eede3f62.56328233.565dd845/_RTroom06836859_387514617_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fko-jo%2Fhay_colour_crate_l_2023%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"スタッキングできて色も選べる折りたたみ収納。無造作に積んでもサマになるのが良いところ。" },
    { cat:"interior", brand:"BEAMS JAPAN", name:"別注 富士山 マルチマット", price:"¥3,960", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_387045594_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fpv5249%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"玄関にちょこんと置くだけで気分が上がる赤富士。アクリル100%でふかふか、約45.5×61cm。" },
    { cat:"interior", brand:"大川家具", name:"ダイニングチェア カレン（オーク無垢）", price:"¥117,500", url:"https://hb.afl.rakuten.co.jp/hgc/5605cc79.d58c0fad.5605cc7a.ca2a5214/_RTroom06836859_386791943_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ff402125-okawa%2Fdd052%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"福岡・大川の職人がつくるオーク無垢の一脚。北欧テイストのグレー座面が心地いい。ふるさと納税の返礼品です。" },

    // --- goods ---
    { cat:"goods", brand:"Marimekko", name:"マグ 250ml", price:"¥2,300〜", url:"https://a.r10.to/hgv8bw", img:"images/marimekko.jpg",
      blurb:"ぽってりした250mlは、両手で包むのにちょうどよさそうなサイズ。柄を選べるので、朝の気分に合う一杯を。" },
    { cat:"goods", brand:"PUEBCO", name:"アルミ ティッシュケース（Matte）", price:"¥3,300", url:"https://a.r10.to/h8jSTI", img:null,
      blurb:"生活感の出がちなティッシュを、無骨なアルミでそっけなく格上げ。" },
    { cat:"goods", brand:"DULTON", name:"ダイエットスケール 100-126（赤）", price:"¥4,180", url:"https://a.r10.to/hYvA15", img:null,
      blurb:"レトロなアメリカン。赤の差し色でキッチンがぱっと華やぐ一台。" },
    { cat:"goods", brand:"YCYK", name:"リードディフューザー 金木犀 120ml", price:"¥4,086", url:"https://hb.afl.rakuten.co.jp/hgc/564809b7.bb733817.564809b8.e99c3a77/_RTroom06836859_387853985_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fdaily-store%2Fgr-e9r8gqj5sn%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"金木犀のふわっと甘い残り香。家に帰るたび気分がほどける、玄関脇の定位置。" },
    { cat:"goods", brand:"VITAL MATERIAL", name:"ルーム&ファブリックミスト 深緑の森 120mL", price:"¥4,180", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_387769332_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Ffu1829%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"名前のとおり、少しウッディで静かな香り。ミニマルなボトルは置いておくだけで様になる。" },
    { cat:"goods", brand:"HIGHTIDE / nahe", name:"2027 スクエア マンスリー手帳", price:"¥825", url:"https://hb.afl.rakuten.co.jp/hgc/56298ccd.94853ac7.56298cce.1a120fe7/_RTroom06836859_387761139_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhtdd%2Fne1%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"四角いフォルムとくすみ色の表紙が良い10月始まり。マンスリーでコンパクト、持ち歩きやすいサイズ。" },
    { cat:"goods", brand:"nahe", name:"ユーティリティケース ミニ", price:"¥1,650", url:"https://hb.afl.rakuten.co.jp/hgc/56298ccd.94853ac7.56298cce.1a120fe7/_RTroom06836859_387370855_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhtdd%2Fgb332%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"充電器やケーブルのごちゃつきをまとめて収納。きれいめなレザー調で、机でも鞄でも旅先でも。" },
    { cat:"goods", brand:"SWAG", name:"歯磨き粉 100g（選べる5フレーバー）", price:"¥1,980", url:"https://hb.afl.rakuten.co.jp/hgc/56298db5.931c5b07.56298db6.64299957/_RTroom06836859_387371153_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswag-official%2Ftp%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ビビッドなチューブが海外プロダクトみたい。洗面所に置くだけで気分が上がる一本。" },
    { cat:"goods", brand:"SWAG", name:"ホワイトニング歯磨き粉 100g", price:"¥2,530〜", url:"https://hb.afl.rakuten.co.jp/hgc/56298db5.931c5b07.56298db6.64299957/_RTroom06836859_387371343_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswag-official%2Fhw%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"清潔感のある白がかわいいホワイトニングタイプ。ブルーとおそろいで並べても◎。" },
    { cat:"goods", brand:"表現社 / 沖野愛", name:"ブロックメモ 日本", price:"¥605", url:"https://hb.afl.rakuten.co.jp/hgc/562211be.4a527ecd.562211bf.a3680a17/_RTroom06836859_387237364_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fevisubungu%2F22-888%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"花火に屋台、新幹線、だるま。日本の“好き”が詰まったブロックメモ。ちょっとした贈り物にも。" },
    { cat:"goods", brand:"表現社 / 沖野愛", name:"メモ帳＋付箋 京都", price:"¥550", url:"https://hb.afl.rakuten.co.jp/hgc/56220fb8.7673755a.56220fb9.71d3f94d/_RTroom06836859_387237289_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Faromage-store2%2F30003217%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"舞妓さんに京都タワー、五重塔。眺めるだけで旅気分になるメモ＋付箋のセット。" },
    { cat:"goods", brand:"The Durutti Column", name:"RENASCENT（LP）", price:"¥8,190", url:"https://hb.afl.rakuten.co.jp/hgc/56484ca7.b65dbd41.56484ca8.2c9e50b4/_RTroom06836859_387858616_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Famericanpie%2Flndn1725759vinyl%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"16年ぶりの新作LP。グラデーションと色面が重なるジャケットは、棚に立てかけておくだけで様になる。" },

    // --- fashion ---
    { cat:"fashion", brand:"ROTOTO", name:"ダブルフェイス クルーソックス R1508", price:"¥2,200", url:"https://a.r10.to/h5S9Jf", img:null,
      blurb:"内側パイル・外側フラットの二重編み。足元の“ちょっといい”は結構効く。" },
    { cat:"fashion", brand:"Swatch", name:"BLUEBERRY SKY SO29M702", price:"¥14,520", url:"https://hb.afl.rakuten.co.jp/hgc/565645a7.e2c108b6.565645a8.d2c738a8/_RTroom06836859_388096151_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswatchofficial%2Fso29m702%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ライトブルーの文字盤とグレーのケースの淡い配色がきれい。41mmの大きめフェイスなのに軽やかに見えるのが良いところ。" },
    { cat:"fashion", brand:"Marimekko", name:"ウニッコ柄 ポーチ", price:"¥5,599", url:"https://hb.afl.rakuten.co.jp/hgc/56329022.b6ed13bf.56329023.74ea77a3/_RTroom06836859_387515459_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fglv%2Fmri-en%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"ぱっと明るい花柄。バッグを開けるたびに気分を上げてくれる小物入れ。" },
    { cat:"fashion", brand:"Maison MIHARA YASUHIRO", name:"in・stru(men-tal). ビッグネームトート", price:"¥8,800", url:"https://hb.afl.rakuten.co.jp/hgc/5606229a.d681058a.5606229b.d6295ad8/_RTroom06836859_386791868_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flli-femme%2Fi12bg701%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"やわらかいコットンキャンバスでA4も入る大きめ。手持ちと肩掛けの2wayで毎日使える。" },
    { cat:"fashion", brand:"FRED PERRY", name:"ポロシャツ M12（英国製）", price:"¥13,200〜", url:"https://hb.afl.rakuten.co.jp/hgc/56560b24.81a4af99.56560b25.69852214/_RTroom06836859_388090896_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcoc%2Fm12n-black%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"襟と袖口のツインティップに、胸の月桂樹。英国製の鹿の子はほどよい厚みで、襟もしっかり立つ。" },
    { cat:"fashion", brand:"JOHN SMEDLEY", name:"ADRIAN ニットポロ 30ゲージ", price:"¥26,000", url:"https://hb.afl.rakuten.co.jp/hgc/5642f255.dfdaa4f2.5642f256.e4ad01cd/_RTroom06836859_387768335_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmb%2Fadrian%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"シーアイランドコットンの上品な光沢と、なめらかな編み地。襟のあるニットは季節の変わり目にちょうどいい。" },
    { cat:"fashion", brand:"SALOMON", name:"XA PRO 3D", price:"¥19,800", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_388072599_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fkm2581%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"トレイル由来のごつっとした佇まいが、むしろ普段着のいい差し色に。Quicklaceのすっと締まる感じも good。" },
    { cat:"fashion", brand:"On", name:"Cloud 6", price:"¥19,800", url:"https://hb.afl.rakuten.co.jp/hgc/564298ab.00744c4a.564298ac.d7858634/_RTroom06836859_387762742_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsakaikututen%2Fcloud-m%2F%3Fscid%3Droom_pc_id_reg", img:null,
      blurb:"雲の上のようと言われるクラウドソール。すっきりした見た目で、街履きにも軽い運動にも。" }
  ];

  // ---- render cards ----
  const grid = document.getElementById("pickGrid");
  const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const frag = document.createDocumentFragment();

  PICKS.forEach((p) => {
    const meta = CAT[p.cat];
    const el = document.createElement("article");
    el.className = "card reveal";
    el.dataset.cat = p.cat;
    el.style.setProperty("--c", meta.cvar);
    el.style.setProperty("--mediabg", meta.cvar);

    const media = p.img
      ? `<div class="card__media"><span class="card__cat">${meta.label}</span><img src="${p.img}" alt="${esc(p.brand)} ${esc(p.name)}" loading="lazy"></div>`
      : `<div class="card__media card__media--blank"><span class="card__cat">${meta.label}</span><span class="glyph" aria-hidden="true">${esc(p.brand.charAt(0))}</span></div>`;

    el.innerHTML = `
      ${media}
      <div class="card__body">
        <span class="card__brand">${esc(p.brand)}</span>
        <h3 class="card__name">${esc(p.name)}</h3>
        <p class="card__blurb">${esc(p.blurb)}</p>
        <div class="card__foot">
          <span class="card__price">${esc(p.price)}</span>
          <a class="card__btn" href="${p.url}" target="_blank" rel="sponsored noopener nofollow">楽天で見る →</a>
        </div>
      </div>`;
    frag.appendChild(el);
  });
  grid.appendChild(frag);

  // ---- category filter ----
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-selected","false"); });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected","true");
      const cat = chip.dataset.cat;
      document.querySelectorAll(".card").forEach((card) => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

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

  // ---- scroll reveal ----
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
  } else {
    document.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
  }

  // ---- year ----
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
