/* 気になるモノ手帖 — base interactions */
(function () {
  "use strict";

  // ---- category meta ----
  const CAT = {
    gadget:   { label: "ガジェット",       cvar: "var(--purple)" },
    interior: { label: "インテリア",       cvar: "var(--teal)" },
    goods:    { label: "雑貨",             cvar: "var(--coral)" },
    fashion:  { label: "ファッション小物", cvar: "var(--amber)" }
  };

  // ---- picks (real affiliate links already live on ROOM/Pinterest) ----
  // price/在庫は変動。将来Amazon切替後は該当リンクをAmazon(タグ curryoden22-22)へ差し替え可。
  const PICKS = [
    { cat:"gadget", brand:"Native Union", name:"POP CABLE USB-C 60W カールコード", price:"¥3,080〜", url:"https://a.r10.to/h8MV9f", img:"images/native-union.jpg",
      blurb:"くるんと伸び縮みするカールコード。充電まわりの生活感を、むしろ主役に。" },
    { cat:"goods", brand:"Marimekko", name:"マグ 250ml カルシッコ柄", price:"¥2,300〜", url:"https://a.r10.to/hgv8bw", img:"images/marimekko.jpg",
      blurb:"ウニッコじゃない、木立みたいな柄が今の気分。朝の一杯が少し特別に。" },
    { cat:"gadget", brand:"HHKB (PFU)", name:"Professional HYBRID Type-S 墨", price:"¥36,850", url:"https://a.r10.to/hPBwjc", img:"images/hhkb.jpg",
      blurb:"墨色の佇まいと“スッ”と沈む打鍵感。机に置くだけで気分が上がる憧れの一台。お値段は張りますが…。" },
    { cat:"gadget", brand:"Teenage Engineering", name:"EP-136 K.O. sidekick", price:"¥29,700", url:"https://a.r10.to/hgnNqL", img:null,
      blurb:"おもちゃみたいに可愛いのに本気の音楽ツール。眺めているだけで楽しい。" },
    { cat:"gadget", brand:"Satechi", name:"マグネットウォレットスタンド", price:"楽天で確認", url:"https://a.r10.to/hgY16z", img:null,
      blurb:"カードを挟んでそのまま立てられる二役。マットな質感が机にも鞄にも馴染む。" },
    { cat:"interior", brand:"Fritz Hansen", name:"セブンチェア（正規）", price:"¥128,000", url:"https://a.r10.to/hgn3KB", img:null,
      blurb:"言わずと知れた名作。薄い成形合板のしなりと佇まいに、いつか一脚だけでも。" },
    { cat:"interior", brand:"HOLMEGAARD", name:"FLORA ベース ロングネック 24cm", price:"¥9,350", url:"https://a.r10.to/hgsyWV", img:null,
      blurb:"デンマークの吹きガラスの一輪挿し。花が無くても様になる透明感。" },
    { cat:"goods", brand:"PUEBCO", name:"アルミ ティッシュケース（Matte）", price:"¥3,300", url:"https://a.r10.to/h8jSTI", img:null,
      blurb:"生活感の出がちなティッシュを、無骨なアルミでそっけなく格上げ。" },
    { cat:"goods", brand:"DULTON", name:"ダイエットスケール 100-126（赤）", price:"¥4,180", url:"https://a.r10.to/hYvA15", img:null,
      blurb:"レトロなアメリカン。赤の差し色でキッチンがぱっと華やぐ一台。" },
    { cat:"fashion", brand:"ROTOTO", name:"ダブルフェイス クルーソックス R1508", price:"¥2,200", url:"https://a.r10.to/h5S9Jf", img:null,
      blurb:"内側パイル・外側フラットの二重編み。足元の“ちょっといい”は結構効く。" }
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
