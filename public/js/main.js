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
    // --- 2026.08.17 楽天ROOMから反映（10件） ---
    { cat:"goods", date:"2026.08.17", motif:"m-mug", brand:"嶺陽茶行", name:"ジャスミン茶 テトラ型ティーバッグ 14袋入り", price:"¥3,397〜", url:"https://hb.afl.rakuten.co.jp/hgc/56a144f3.a9cc5647.56a144f4.27f5377e/_RTroom06836859_389423634_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftwdirect%2Fgeowyongtea-015%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/twdirect/cabinet/geowyongtea/geowyongtea-1/geowyongtea-015_01.jpg",
      blurb:"台湾の老舗・嶺陽茶行のジャスミン茶。テトラ型のティーバッグで気軽に淹れられて、花柄の缶は置いておくだけで絵になります。" },
    { cat:"goods", date:"2026.08.17", motif:"m-crate", brand:"竹中", name:"mayu ランチボックス M 680ml", price:"¥2,420", url:"https://hb.afl.rakuten.co.jp/hgc/568fd4dd.94633fef.568fd4df.63bd6584/_RTroom06836859_389410548_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhitoiro%2F387849%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/hitoiro/cabinet/maker_takenaka/387849.jpg",
      blurb:"ころんと丸いフォルムのランチボックス。継ぎ目が少なくて洗いやすく、並べるとお弁当箱よりインテリア雑貨みたい。" },
    { cat:"interior", date:"2026.08.17", motif:"m-chair", brand:"Kartell", name:"PRINCE AHA（プリンス アハ）スツール", price:"¥22,500", url:"https://hb.afl.rakuten.co.jp/hgc/5647efbc.ee8761c9.5647efc2.ad8c4a6e/_RTroom06836859_389324000_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmminterior%2F575585%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/mminterior/cabinet/03250003/06880268/imgrc0084752721.jpg",
      blurb:"フィリップ・スタルクが手がけた砂時計のようなフォルム。屋内でも屋外でも使えるので、テラスにひとつ置きたくなります。" },
    { cat:"goods", date:"2026.08.17", motif:"m-bottle", brand:"uka", name:"ヘアオイル Rainy Walk 50ml", price:"¥4,400", url:"https://hb.afl.rakuten.co.jp/hgc/56968846.a8d2fad4.56968847.bd53c286/_RTroom06836859_389236421_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fukaofficial%2F4582328104418%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/ukaofficial/cabinet/hair_oil_mist/4582328104418x.jpg",
      blurb:"レモン・ユーカリ・ミントの香りに、アサイーとモリンガのオイルを配合。ボトルのイエローとパッケージのグリーンの色合わせも良い。" },
    { cat:"interior", date:"2026.08.17", motif:"m-mug", brand:"yumiko iihoshi porcelain × 木村硝子店", name:"dishes プレート L 20cm（サンドベージュ）", price:"¥3,630", url:"https://hb.afl.rakuten.co.jp/hgc/566a652b.e5da1afb.566a652d.fb4e4fef/_RTroom06836859_389216262_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Freceno%2Fdispl-l%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/receno/cabinet/plate2/displ/img/0000054304020.jpg",
      blurb:"艶を抑えたマットな質感で、和にも洋にも馴染む一枚。食卓の色を選ばないので、長く使えそうなプレートです。" },
    { cat:"gadget", date:"2026.08.17", motif:"m-mixer", brand:"Francfranc", name:"フレ ハンディファン ウェーブ（2026年モデル）", price:"¥3,980", url:"https://hb.afl.rakuten.co.jp/hgc/56430753.d3416592.56430757.a1dc5f63/_RTroom06836859_388816757_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylifemen%2Frm4239%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/stylifemen/cabinet/item/239/rm4239-01_1.jpg",
      blurb:"手になじむ部分の波打つマーブル調の仕上げがメタリック。手に取った瞬間にテンションが上がるハンディファン。" },
    { cat:"gadget", date:"2026.08.17", motif:"m-stand", brand:"Kodak", name:"FunSaver 800 レンズ付きフィルム 27枚撮り", price:"¥2,376", url:"https://hb.afl.rakuten.co.jp/hgc/56996fa2.9daf1187.56996fa3.ebae6f21/_RTroom06836859_389355237_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fec-current%2F0041778617762%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/ec-current/cabinet/9131/0041778617762.jpg",
      blurb:"27枚を撮り切るまで写りが分からない不便さが、かえっていい。ISO800でフラッシュ内蔵だから夕方や室内でも気軽に。" },
    { cat:"fashion", date:"2026.08.17", motif:"m-polo", brand:"LOEWE", name:"アナグラム刺繍 Tシャツ S616Y22X87", price:"¥88,000", url:"https://hb.afl.rakuten.co.jp/hgc/5656b57d.22b6e6b6.5656b586.40e2c27f/_RTroom06836859_389308241_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fauc-marks-run%2F380522357%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/auc-marks-run/cabinet/20260818_cp_1/380522357_1.jpg",
      blurb:"無地に効かせ刺繍だけを添えた潔さ。オーバーサイズのシルエットも、いまの気分に合います。" },
    { cat:"fashion", date:"2026.08.17", motif:"m-polo-knit", brand:"JOURNAL STANDARD", name:"リネンナイロン ストレッチワイドパンツ", price:"¥13,200", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_389243097_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fpy4401%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/stylife/cabinet/item/401/py4401-01_1.jpg",
      blurb:"撥水・接触冷感・洗える・UVカットと機能は充分。レッドの発色が効いた、これからの季節のワイドパンツ。" },
    { cat:"fashion", date:"2026.08.17", motif:"m-socks", brand:"gelato pique", name:"レーヨンロゴT＆ボーダーショートパンツ セット", price:"¥11,550", url:"https://hb.afl.rakuten.co.jp/hgc/56951b20.39e2a5b7.56951b21.d7d9d019/_RTroom06836859_389211070_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshirohato%2Fb52pwct261365%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/shirohato/cabinet/001807/b52pwct261365.jpg",
      blurb:"レーヨン素材のひんやりした肌当たりが心地よい接触冷感のセットアップ。落ち着いたミントグリーンで、部屋着なのに主役級。" },
    { cat:"interior", date:"2026.08.14", motif:"m-chair", brand:"KAY BOJESEN DENMARK", name:"Monkey Mini（モンキー ミニ ブラック）", code:"belle-life:10007016", price:"¥16,500", url:"https://a.r10.to/hPIgoH", img:"https://shop.r10s.jp/belle-life/cabinet/02325296/imgrc0083882083.jpg",
      blurb:"デンマークの木工職人技が息づく、愛らしい表情のモンキー。日本正規代理店品でオーク材の温もりが魅力。" },
    { cat:"gadget", date:"2026.08.14", motif:"m-keyboard", brand:"NuPhy", name:"Air75 V3 メカニカルキーボード（Blush）", code:"r-kojima:11665960", price:"¥31,770", url:"https://a.r10.to/hF52M6", img:"https://shop.r10s.jp/r-kojima/cabinet/n0000001494/4570001397691_1.jpg",
      blurb:"黒ボディにミント・オレンジ・レッドのアクセントキーキャップが効いた、ホットスワップ対応のワイヤレスキーボード。" },
    { cat:"fashion", date:"2026.08.13", motif:"m-chair", brand:"METRONOME", name:"Resonance by METRONOME MINX C3 サングラス", code:"megane-douraku:10032685", price:"¥14,300", url:"https://a.r10.to/h5pgBW", img:"https://shop.r10s.jp/megane-douraku/cabinet/09527721/minx-c3-1.jpg",
      blurb:"クリップ式のブルーレンズを外すとクリアフレームに戻る、2WAY仕様のサングラス。マットクリアの軽やかな質感。" },
    { cat:"goods", date:"2026.08.13", motif:"m-wineglass", brand:"bodum", name:"ダブルウォールグラス PAVINA 250ml 2個セット", code:"bodumshop:10000041", price:"¥2,551", url:"https://a.r10.to/hka5Vv", img:"https://shop.r10s.jp/bodumshop/cabinet/item/pavina/4558-10_6.jpg",
      blurb:"二重構造で保温・保冷力が高く、見た目もすっきりしたダブルウォールグラス。北欧デンマーク発のキッチンウエア。" },
    { cat:"fashion", date:"2026.08.13", motif:"m-tote", brand:"and wander", name:"シル デイパック", code:"daigochi:10006198", price:"¥19,800", url:"https://a.r10.to/h5faNf", img:"https://shop.r10s.jp/daigochi/cabinet/item001/19242_3_shiro.jpg",
      blurb:"薄手のナイロン素材でくしゅっと畳める、軽さと携帯性を両立したパッカブルリュック。" },
    { cat:"interior", date:"2026.08.12", motif:"m-chair", brand:"Vitra", name:"スタンダードチェア（ジャン・プルーヴェ／ブレヴェール）", code:"vanilla1950:10000691", price:"¥138,600", url:"https://a.r10.to/hPJuIj", img:"https://shop.r10s.jp/vanilla1950/cabinet/product/000000011517-02.jpg",
      blurb:"1934年に学校用チェアとして誕生したジャン・プルーヴェのデザイン。無骨な脚と軽やかな座面のコントラストが魅力。" },
    { cat:"goods", date:"2026.08.12", motif:"m-pouch", brand:"KING JIM", name:"Flatty SHEER メッシュポーチ（Mサイズ）", code:"bellepo:10024225", price:"¥1,075", url:"https://a.r10.to/heEQgN", img:"https://shop.r10s.jp/bellepo/cabinet/kingjim/lezaface/5164m.jpg",
      blurb:"メッシュ素材で中身がうっすら見える、Flattyシリーズのシアータイプポーチ。小物探しがしやすい一枚。" },
    { cat:"fashion", date:"2026.08.12", motif:"m-chair", brand:"because", name:"UMBRELLAS MINI クリアアンブレラ×Lipton", code:"shinotome-nakano:10000244", price:"¥3,190", url:"https://a.r10.to/h5YJ4D", img:"https://shop.r10s.jp/shinotome-nakano/cabinet/compass1748939855.jpg",
      blurb:"フルーツ柄が涼しげなLiptonコラボのクリアミニ傘。折りたたみでバッグにもすっと収まる。" },
    { cat:"goods", date:"2026.08.12", motif:"m-bottle", brand:"ZONE DENMARK", name:"ソープディスペンサー SOLO（ソフトグレー）", code:"shikama-intl:10001998", price:"¥7,040", url:"https://a.r10.to/hPJ4O8", img:"https://shop.r10s.jp/shikama-intl/cabinet/zone/34775/34775.jpg",
      blurb:"デンマーク発デザインブランドのソープディスペンサー。マットなソフトグレーが洗面台に馴染む。" },
    { cat:"fashion", date:"2026.08.11", motif:"m-polo", brand:"UNITED ARROWS green label relaxing", name:"＜To b. by agnes b.コラボ＞エンブロイダリー オーバーサイズシャツ", code:"stylife:15706877", price:"¥3,980", url:"https://a.r10.to/hg0t3a", img:"https://tshop.r10s.jp/stylife/cabinet/item/226/sb8226-01_1.jpg",
      blurb:"オーバーサイズでゆるっと羽織れる、agnes b.とのコラボエンブロイダリーシャツ。胸ポケットの刺繍がアクセント。" },
    { cat:"gadget", date:"2026.08.11", motif:"m-keyboard", brand:"ロジクール(Logicool)", name:"Alto Keys K98M ワイヤレスメカニカルキーボード", code:"logicool:10000799", price:"¥16,900", url:"https://a.r10.to/hkzoDq", img:"https://shop.r10s.jp/logicool/cabinet/prd/kb/k98mgr/k98mgr_n.jpg",
      blurb:"半透明のガスケットボディ越しに内部構造が透けて見える、眺めて楽しいメカニカルキーボード。" },
    { cat:"fashion", date:"2026.08.10", motif:"m-polo", brand:"Arnold Palmer", name:"TCポプリン サマーカーゴハーフパンツ（ブラック）", code:"mizujin:10032856", price:"¥3,850", url:"https://a.r10.to/hgZIyi", img:"https://shop.r10s.jp/mizujin/cabinet/ap/26ss3/a8251144-1.jpg",
      blurb:"生地にハリ感があって涼しい、この夏活躍しそうなTCポプリンのカーゴハーフパンツ。" },
    { cat:"gadget", date:"2026.08.10", motif:"m-stand", brand:"Nothing", name:"Headphone(a)（ピンク）", code:"nothingagent:10000111", price:"¥27,800", url:"https://a.r10.to/hP7Rgi", img:"https://shop.r10s.jp/nothingagent/cabinet/13067532/headphonea_main.jpg",
      blurb:"半透明パーツとくすみピンクの配色が目を引く、ハイレゾ対応のワイヤレスヘッドホン。" },
    { cat:"gadget", date:"2026.08.10", motif:"m-watch", brand:"MOFT", name:"Apple Watch用 マグネット式シリコンバンド（バイカラー）", code:"moft:10000113", price:"¥5,880", url:"https://a.r10.to/h8akBP", img:"https://shop.r10s.jp/moft/cabinet/product/12469098/12469099/imgrc0116113922.jpg",
      blurb:"内側と外側で色が切り替わるバイカラーのApple Watchバンド。マグネット留め具でサイズ調整もスムーズ。" },

    { cat:"fashion", date:"2026.08.09", motif:"m-socks", brand:"STANCE", name:"クルーソックス「currents」", code:"candymitt:10000828", price:"¥2,750", url:"https://a.r10.to/hPxxXb", img:"https://image.rakuten.co.jp/candymitt/cabinet/stance/st308y-curren-st.jpg",
      blurb:"足元にひとさじの色を。メキシカンブランケットみたいな多色ボーダーが主役級のクルーソックス。" },
    { cat:"interior", date:"2026.08.09", motif:"m-bottle", brand:"BALMUDA", name:"The Lantern（ブラック）", code:"sokutei:10001894", price:"¥15,899", url:"https://a.r10.to/h5Q7Oh", img:"https://tshop.r10s.jp/sokutei/cabinet/05716971/4560330119378_2.jpg",
      blurb:"キャンドルのように揺らめく暖色を無段階で調光。持ち運べる充電式のランタン。" },
    { cat:"interior", date:"2026.08.09", motif:"m-chair", brand:"天童木工", name:"バタフライスツール（ローズウッド）", code:"auc-designshop:10001011", price:"¥82,500", url:"https://a.r10.to/hg9pVY", img:"https://image.rakuten.co.jp/auc-designshop/cabinet/2101/2101000001702_0.jpg",
      blurb:"柳宗理の名作。2枚の成形合板が蝶の羽のように交わる、憧れの一脚。" },
    { cat:"interior", date:"2026.08.09", motif:"m-chair", brand:"Vitra", name:"イームズエレファント（スモール）", code:"shinwashop:10005703", price:"¥15,400", url:"https://a.r10.to/hYTaAq", img:"https://image.rakuten.co.jp/shinwashop/cabinet/kes6/vitra-215112-main.jpg",
      blurb:"イームズ夫妻が1945年に生んだ、ゾウをかたどった愛らしいプロダクト。" },
    { cat:"goods", date:"2026.08.08", motif:"m-chair", brand:"YOLU", name:"ナイトケア ボディソープ", price:"¥1,029", url:"https://hb.afl.rakuten.co.jp/hgc/g00r9icn.z7k3182b.g00r9icn.z7k3295f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbloomgreen%2F10327354%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fbloomgreen%2Fi%2F10536822%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/bloomgreen/cabinet/bg10755064/4582521689002.jpg?_ex=500x500",
      blurb:"夜の香りに包まれるバスタイム。とろみのあるテクスチャーで優しく洗い上げる。" },
    { cat:"goods", date:"2026.08.08", motif:"m-chair", brand:"YOLU", name:"カームナイトリペア ボディソープ", price:"¥946", url:"https://hb.afl.rakuten.co.jp/hgc/g00r23nn.z7k3113e.g00r23nn.z7k326ee/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkobe-beauty-labo%2Fyol018%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fkobe-beauty-labo%2Fi%2F10002671%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://shop.r10s.jp/kobe-beauty-labo/cabinet/imgrc0108984420.jpg",
      blurb:"夜の香りに包まれるバスタイム。とろみのあるテクスチャーで優しく洗い上げる。" },
    { cat:"goods", date:"2026.08.08", motif:"m-chair", brand:"YOLU", name:"ボディスクラブ", price:"¥1,738", url:"https://hb.afl.rakuten.co.jp/hgc/g00r23nn.z7k3113e.g00r23nn.z7k326ee/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkobe-beauty-labo%2Fyol035%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fkobe-beauty-labo%2Fi%2F10002831%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://shop.r10s.jp/kobe-beauty-labo/cabinet/1st_thum/yol035.jpg",
      blurb:"ジェラートみたいな質感でするする伸びるマイルドピーリング。優しい香りでご褒美のお手入れ時間に。" },
    { cat:"fashion", date:"2026.08.08", motif:"m-chair", brand:"Swatch", name:"BESIDE THE SEA", price:"¥33,550", url:"https://hb.afl.rakuten.co.jp/hgc/g00slxtn.z7k31a9e.g00slxtn.z7k325f0/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswatchofficial%2Fss07s148%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fswatchofficial%2Fi%2F10003280%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/swatchofficial/cabinet/product/2025-05/ss07s148-s-01.jpg?_ex=500x500",
      blurb:"ネイビー文字盤に赤い針が効いた海辺の一本。スイス製クオーツ、3気圧防水で夏のお出かけにも。" },
    { cat:"goods", date:"2026.08.08", motif:"m-chair", brand:"Snow Peak", name:"チタンダブルマグ 300", price:"¥5,280", url:"https://hb.afl.rakuten.co.jp/hgc/g00r4jvn.z7k31acb.g00r4jvn.z7k32368/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcanpanera%2Fs06-1200%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fcanpanera%2Fi%2F10084594%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/canpanera/cabinet/item207/item_s06-1200_0.jpg?_ex=500x500",
      blurb:"二重構造で保温・結露しにくく、チタンの軽さ。キャンプにも家にもなじむ無骨なマグ。" },
    { cat:"gadget", date:"2026.08.08", motif:"m-chair", brand:"Bang & Olufsen", name:"Beosound A1", price:"¥58,000", url:"https://hb.afl.rakuten.co.jp/hgc/g00ts3vn.z7k31eca.g00ts3vn.z7k32b18/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbang-olufsen%2F17360%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fbang-olufsen%2Fi%2F10000103%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/bang-olufsen/cabinet/thum/17360/17360_01.jpg?_ex=500x500",
      blurb:"アルミ削り出しの丸いフォルムと革ストラップ。手のひらサイズで本格的な音、IP67防水。" },
    { cat:"gadget", date:"2026.08.08", motif:"m-chair", brand:"Marshall", name:"EMBERTON III", price:"¥28,980", url:"https://hb.afl.rakuten.co.jp/hgc/g00u54tn.z7k31cb2.g00u54tn.z7k322ad/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmarshall-official%2F7340055399449%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fmarshall-official%2Fi%2F10000035%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/marshall-official/cabinet/portable_speakers/emberton3/imgrc0121215094.jpg?_ex=500x500",
      blurb:"アンプそのままの佇まいに真鍮ロゴ。手のひらサイズでIP67防水、外にも連れ出せるスピーカー。" },
    { cat:"goods", date:"2026.08.08", motif:"m-chair", brand:"LAMY", name:"LAMY 2000 ボールペン", price:"¥11,300", url:"https://hb.afl.rakuten.co.jp/hgc/g00qm7tn.z7k31d04.g00qm7tn.z7k32047/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fauc-youstyle%2Fl401%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fauc-youstyle%2Fi%2F10012653%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://shop.r10s.jp/auc-youstyle/cabinet/lamy/08809040/l401-naire-x-zt.jpg",
      blurb:"1966年生まれのバウハウス由来デザイン。ヘアライン加工のボディは指なじみよく、置くだけで気分が上がる。" },
    { cat:"gadget", date:"2026.08.08", motif:"m-chair", brand:"Vermicular", name:"ライスポットミニ", price:"¥77,440", url:"https://hb.afl.rakuten.co.jp/hgc/g00ufh8n.z7k31c0f.g00ufh8n.z7k32caf/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fvermicular-rshop%2Frp19a-gy%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fvermicular-rshop%2Fi%2F10000004%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/vermicular-rshop/cabinet/11432399/rp19ry_01.jpg?_ex=500x500",
      blurb:"鋳物ホーロー鍋がそのまま内鍋に。一粒ずつ立つ炊きあがりで、無水・低温調理までこなす一台。" },
    { cat:"fashion", date:"2026.08.08", motif:"m-chair", brand:"FACTORY900", name:"RF-051 メガネ", price:"¥58,080", url:"https://hb.afl.rakuten.co.jp/hgc/g00uj10n.z7k312a6.g00uj10n.z7k32ef2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fthebecos%2Fs0233-041%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fthebecos%2Fi%2F10004570%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/thebecos/cabinet/s0233/s0233-041-1.jpg?_ex=500x500",
      blurb:"鯖江で立体的に削り出した丸フレーム。クラシックなのに未来的で、顔まわりの印象が変わる一本。" },
    { cat:"goods", date:"2026.08.08", motif:"m-chair", brand:"HASAMI PORCELAIN", name:"プレート（波佐見焼）", price:"¥4,400", url:"https://hb.afl.rakuten.co.jp/hgc/g00s5mvn.z7k311ce.g00s5mvn.z7k320d0/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fzuiun7%2Fhpm004%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fzuiun7%2Fi%2F10012527%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/zuiun7/cabinet/04643587/04645121/04645138/imgrc0104105919.jpg?_ex=500x500",
      blurb:"マットな黒に縁の素地が効いた波佐見焼。重ねて仕舞えて、和洋どちらの料理も映える一枚。" },
    { cat:"interior", date:"2026.08.08", motif:"m-chair-y", brand:"Carl Hansen & Søn", name:"CH24 Yチェア オーク／オイル仕上げ SH45cm", price:"¥168,300", url:"https://hb.afl.rakuten.co.jp/hgc/g00q2chn.z7k3151f.g00q2chn.z7k3251e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fconnect%2Fchs_ch24_oo%2F&m=http%3A%2F%2Fm.rakuten.co.jp%2Fconnect%2Fi%2F10003108%2F&rafcid=wsc_i_is_1e77fdda-9913-4278-80a5-14c97599cd28", img:"https://thumbnail.image.rakuten.co.jp/@0_mall/connect/cabinet/chs/ch24/chs_ch24_oor.jpg?_ex=500x500",
      blurb:"北欧の名作。流れるようなY字の背とペーパーコードの座面。オーク×オイルで使うほど風合いが増す。" },
    // --- gadget ---
    { cat:"gadget", date:"2026.08.05", motif:"m-cable", brand:"Native Union", name:"POP CABLE USB-C 60W カールコード", price:"¥3,080〜", url:"https://a.r10.to/h8MV9f", img:"images/native-union.jpg",
      blurb:"くるんと伸び縮みするカールコード。充電まわりの生活感を、むしろ主役に。" },
    { cat:"gadget", date:"2026.08.05", motif:"m-keyboard", brand:"HHKB (PFU)", name:"Professional HYBRID Type-S 墨", price:"¥36,850", url:"https://a.r10.to/hPBwjc", img:"images/hhkb.jpg",
      blurb:"墨色の佇まいと“スッ”と沈む打鍵感。机に置くだけで気分が上がる憧れの一台。お値段は張りますが…。" },
    { cat:"gadget", date:"2026.08.05", motif:"m-mixer", brand:"Teenage Engineering", name:"EP-136 K.O. sidekick", price:"¥29,700", url:"https://a.r10.to/hgnNqL", img:"https://shop.r10s.jp/shimamuragakki/cabinet/mt01955/mt0195586.jpg",
      blurb:"おもちゃみたいに可愛いのに本気の音楽ツール。眺めているだけで楽しい。" },
    { cat:"gadget", date:"2026.08.05", motif:"m-stand", brand:"Satechi", name:"マグネットウォレットスタンド", price:"¥6,499", url:"https://a.r10.to/hgY16z", img:"https://shop.r10s.jp/princeton/cabinet/260804/pstvlw_m01.jpg",
      blurb:"カードを挟んでそのまま立てられる二役。マットな質感が机にも鞄にも馴染む。" },

    // --- interior ---
    { cat:"interior", date:"2026.08.05", motif:"m-chair", brand:"Fritz Hansen", name:"セブンチェア（正規）", price:"¥128,000", url:"https://a.r10.to/hgn3KB", img:"https://shop.r10s.jp/kproject/cabinet/05264517/seluno38/imgrc0105036603.jpg",
      blurb:"言わずと知れた名作。薄い成形合板のしなりと佇まいに、いつか一脚だけでも。" },
    { cat:"interior", date:"2026.08.05", motif:"m-chair-y", brand:"Carl Hansen & Søn", name:"Yチェア CH24 ビーチ／ソープ仕上げ", price:"¥115,500", url:"https://hb.afl.rakuten.co.jp/hgc/56516bb8.0d3eef81.56516bb9.281574a0/_RTroom06836859_388014988_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fattract%2Fch24_bh_sp%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/attract/cabinet/carl_hansen2/000000000010-40-l.jpg",
      blurb:"ウェグナーが1950年に手がけた名作。流れるようなY字の背とペーパーコードの座面は、使うほど風合いが増していくそう。" },
    { cat:"interior", date:"2026.08.05", motif:"m-vase-wave", brand:"iittala", name:"アアルト ベース 120mm", price:"¥27,500", url:"https://hb.afl.rakuten.co.jp/hgc/565540e7.eef737ca.565540e8.3f8d2bf2/_RTroom06836859_388077094_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fscope%2Fiitaalv120%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/scope/cabinet/iittala/iia93a11_a_im01.jpg",
      blurb:"1936年生まれの波打つフォルム。花を活けても、お菓子をざっくり入れても様になる懐の深さ。" },
    { cat:"interior", date:"2026.08.05", motif:"m-vase", brand:"HOLMEGAARD", name:"FLORA ベース ロングネック 24cm", price:"¥9,350", url:"https://a.r10.to/hgsyWV", img:"https://shop.r10s.jp/belle-life/cabinet/01517232/12810465/4340841-main.jpg",
      blurb:"デンマークの吹きガラスの一輪挿し。花が無くても様になる透明感。" },
    { cat:"interior", date:"2026.08.05", motif:"m-wineglass", brand:"HAY", name:"TINT ワイングラス 2個セット", price:"¥6,160", url:"https://hb.afl.rakuten.co.jp/hgc/5648b0f9.c66dc8d7.5648b0fa.57960852/_RTroom06836859_388024197_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fs-deco%2Ftintwineglass_blue%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/s-deco/cabinet/10683009/tintwineglass_c.jpg",
      blurb:"青みがかった色ガラスに、飲みものの色が透ける。ボロシリケイトで見た目より軽やかな2脚セット。" },
    { cat:"interior", date:"2026.08.05", motif:"m-crate", brand:"HAY", name:"COLOUR CRATE L", price:"¥7,700", url:"https://hb.afl.rakuten.co.jp/hgc/56328232.eede3f62.56328233.565dd845/_RTroom06836859_387514617_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fko-jo%2Fhay_colour_crate_l_2023%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/ko-jo/cabinet/hay/colour-crate/l/cart-img.jpg",
      blurb:"スタッキングできて色も選べる折りたたみ収納。無造作に積んでもサマになるのが良いところ。" },
    { cat:"interior", date:"2026.08.05", motif:"m-mountain", brand:"BEAMS JAPAN", name:"別注 富士山 マルチマット", price:"¥3,960", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_387045594_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fpv5249%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/stylife/cabinet/item/249/pv5249-01_1.jpg",
      blurb:"玄関にちょこんと置くだけで気分が上がる赤富士。アクリル100%でふかふか、約45.5×61cm。" },
    { cat:"interior", date:"2026.08.05", motif:"m-chair", brand:"大川家具", name:"ダイニングチェア カレン（オーク無垢）", price:"¥117,500", url:"https://hb.afl.rakuten.co.jp/hgc/5605cc79.d58c0fad.5605cc7a.ca2a5214/_RTroom06836859_386791943_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ff402125-okawa%2Fdd052%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/f402125-okawa/cabinet/frp_goods/frp027/8534764.jpg",
      blurb:"福岡・大川の職人がつくるオーク無垢の一脚。北欧テイストのグレー座面が心地いい。ふるさと納税の返礼品です。" },

    // --- goods ---
    { cat:"goods", date:"2026.08.05", motif:"m-mug", brand:"Marimekko", name:"マグ 250ml", price:"¥2,300〜", url:"https://a.r10.to/hgv8bw", img:"images/marimekko.jpg",
      blurb:"ぽってりした250mlは、両手で包むのにちょうどよさそうなサイズ。柄を選べるので、朝の気分に合う一杯を。" },
    { cat:"goods", date:"2026.08.05", motif:"m-tissue", brand:"PUEBCO", name:"アルミ ティッシュケース（Matte）", price:"¥3,300", url:"https://a.r10.to/h8jSTI", img:"https://shop.r10s.jp/zen-you/cabinet/04497754/12174158/imgrc0127611390.jpg",
      blurb:"生活感の出がちなティッシュを、無骨なアルミでそっけなく格上げ。" },
    { cat:"goods", date:"2026.08.05", motif:"m-scale", brand:"DULTON", name:"ダイエットスケール 100-126（赤）", price:"¥4,180", url:"https://a.r10.to/hYvA15", img:"https://shop.r10s.jp/atease-br/cabinet/00639267/05227710/100-126-00n.jpg",
      blurb:"レトロなアメリカン。赤の差し色でキッチンがぱっと華やぐ一台。" },
    { cat:"goods", date:"2026.08.05", motif:"m-diffuser", brand:"YCYK", name:"リードディフューザー 金木犀 120ml", price:"¥4,086", url:"https://hb.afl.rakuten.co.jp/hgc/564809b7.bb733817.564809b8.e99c3a77/_RTroom06836859_387853985_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fdaily-store%2Fgr-e9r8gqj5sn%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/daily-store/cabinet/g/36/e9r8gqj5sn-3.jpg",
      blurb:"金木犀のふわっと甘い残り香。家に帰るたび気分がほどける、玄関脇の定位置。" },
    { cat:"goods", date:"2026.08.05", motif:"m-bottle", brand:"VITAL MATERIAL", name:"ルーム&ファブリックミスト 深緑の森 120mL", price:"¥4,180", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_387769332_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Ffu1829%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/stylife/cabinet/item/829/fu1829-01_1.jpg",
      blurb:"名前のとおり、少しウッディで静かな香り。ミニマルなボトルは置いておくだけで様になる。" },
    { cat:"goods", date:"2026.08.05", motif:"m-notebook", brand:"HIGHTIDE / nahe", name:"2027 スクエア マンスリー手帳", price:"¥825", url:"https://hb.afl.rakuten.co.jp/hgc/56298ccd.94853ac7.56298cce.1a120fe7/_RTroom06836859_387761139_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhtdd%2Fne1%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/htdd/cabinet/27diary/ne1-img1.jpg",
      blurb:"四角いフォルムとくすみ色の表紙が良い10月始まり。マンスリーでコンパクト、持ち歩きやすいサイズ。" },
    { cat:"goods", date:"2026.08.05", motif:"m-pouch", brand:"nahe", name:"ユーティリティケース ミニ", price:"¥1,650", url:"https://hb.afl.rakuten.co.jp/hgc/56298ccd.94853ac7.56298cce.1a120fe7/_RTroom06836859_387370855_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhtdd%2Fgb332%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/htdd/cabinet/option23/gb332-img1.jpg",
      blurb:"充電器やケーブルのごちゃつきをまとめて収納。きれいめなレザー調で、机でも鞄でも旅先でも。" },
    { cat:"goods", date:"2026.08.05", motif:"m-tube", brand:"SWAG", name:"歯磨き粉 100g（選べる5フレーバー）", price:"¥1,980", url:"https://hb.afl.rakuten.co.jp/hgc/56298db5.931c5b07.56298db6.64299957/_RTroom06836859_387371153_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswag-official%2Ftp%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/swag-official/cabinet/shosai01/swag/12794581/imgrc0107252124.jpg",
      blurb:"ビビッドなチューブが海外プロダクトみたい。洗面所に置くだけで気分が上がる一本。" },
    { cat:"goods", date:"2026.08.05", motif:"m-tube", brand:"SWAG", name:"ホワイトニング歯磨き粉 100g", price:"¥2,530〜", url:"https://hb.afl.rakuten.co.jp/hgc/56298db5.931c5b07.56298db6.64299957/_RTroom06836859_387371343_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswag-official%2Fhw%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/swag-official/cabinet/shosai01/swag/12794581/8.jpg",
      blurb:"清潔感のある白がかわいいホワイトニングタイプ。ブルーとおそろいで並べても◎。" },
    { cat:"goods", date:"2026.08.05", motif:"m-memo", brand:"表現社 / 沖野愛", name:"ブロックメモ 日本", price:"¥605", url:"https://hb.afl.rakuten.co.jp/hgc/562211be.4a527ecd.562211bf.a3680a17/_RTroom06836859_387237364_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fevisubungu%2F22-888%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/evisubungu/cabinet/05227668/05229331/imgrc0097698411.jpg",
      blurb:"花火に屋台、新幹線、だるま。日本の“好き”が詰まったブロックメモ。ちょっとした贈り物にも。" },
    { cat:"goods", date:"2026.08.05", motif:"m-memo", brand:"表現社 / 沖野愛", name:"メモ帳＋付箋 京都", price:"¥550", url:"https://hb.afl.rakuten.co.jp/hgc/56220fb8.7673755a.56220fb9.71d3f94d/_RTroom06836859_387237289_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Faromage-store2%2F30003217%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/aromage-store2/cabinet/item19/30003217_1.jpg",
      blurb:"舞妓さんに京都タワー、五重塔。眺めるだけで旅気分になるメモ＋付箋のセット。" },
    { cat:"goods", date:"2026.08.05", motif:"m-record", brand:"The Durutti Column", name:"RENASCENT（LP）", price:"¥8,190", url:"https://hb.afl.rakuten.co.jp/hgc/56484ca7.b65dbd41.56484ca8.2c9e50b4/_RTroom06836859_387858616_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Famericanpie%2Flndn1725759vinyl%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/americanpie/cabinet/lp25/lndn1725759vinyl.jpg",
      blurb:"16年ぶりの新作LP。グラデーションと色面が重なるジャケットは、棚に立てかけておくだけで様になる。" },

    // --- fashion ---
    { cat:"fashion", date:"2026.08.05", motif:"m-socks", brand:"ROTOTO", name:"ダブルフェイス クルーソックス R1508", price:"¥2,200", url:"https://a.r10.to/h5S9Jf", img:"https://shop.r10s.jp/belmani/cabinet/rototo02/r1508.jpg",
      blurb:"内側パイル・外側フラットの二重編み。足元の“ちょっといい”は結構効く。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-watch", brand:"Swatch", name:"BLUEBERRY SKY SO29M702", price:"¥14,520", url:"https://hb.afl.rakuten.co.jp/hgc/565645a7.e2c108b6.565645a8.d2c738a8/_RTroom06836859_388096151_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fswatchofficial%2Fso29m702%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/swatchofficial/cabinet/product/2024-08/so29m702-s-01.jpg",
      blurb:"ライトブルーの文字盤とグレーのケースの淡い配色がきれい。41mmの大きめフェイスなのに軽やかに見えるのが良いところ。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-pouch", brand:"Marimekko", name:"ウニッコ柄 ポーチ", price:"¥5,599", url:"https://hb.afl.rakuten.co.jp/hgc/56329022.b6ed13bf.56329023.74ea77a3/_RTroom06836859_387515459_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fglv%2Fmri-en%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/glv/cabinet/newsingle202302/mri-enrak1si.jpg",
      blurb:"ぱっと明るい花柄。バッグを開けるたびに気分を上げてくれる小物入れ。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-tote", brand:"Maison MIHARA YASUHIRO", name:"in・stru(men-tal). ビッグネームトート", price:"¥8,800", url:"https://hb.afl.rakuten.co.jp/hgc/5606229a.d681058a.5606229b.d6295ad8/_RTroom06836859_386791868_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flli-femme%2Fi12bg701%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/lli-femme/cabinet/cm38/i12bg701_brn.jpg",
      blurb:"やわらかいコットンキャンバスでA4も入る大きめ。手持ちと肩掛けの2wayで毎日使える。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-polo", brand:"FRED PERRY", name:"ポロシャツ M12（英国製）", price:"¥13,200〜", url:"https://hb.afl.rakuten.co.jp/hgc/56560b24.81a4af99.56560b25.69852214/_RTroom06836859_388090896_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcoc%2Fm12n-black%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/coc/cabinet/fredperry/m12_1.jpg",
      blurb:"襟と袖口のツインティップに、胸の月桂樹。英国製の鹿の子はほどよい厚みで、襟もしっかり立つ。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-polo-knit", brand:"JOHN SMEDLEY", name:"ADRIAN ニットポロ 30ゲージ", price:"¥26,000", url:"https://hb.afl.rakuten.co.jp/hgc/5642f255.dfdaa4f2.5642f256.e4ad01cd/_RTroom06836859_387768335_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmb%2Fadrian%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/mb/cabinet/260714_0002/adrian00.jpg",
      blurb:"シーアイランドコットンの上品な光沢と、なめらかな編み地。襟のあるニットは季節の変わり目にちょうどいい。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-sneaker-trail", brand:"SALOMON", name:"XA PRO 3D", price:"¥19,800", url:"https://hb.afl.rakuten.co.jp/hgc/56166504.3fb5399f.56166505.5b4d5fd4/_RTroom06836859_388072599_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstylife%2Fkm2581%2F%3Fscid%3Droom_pc_id_reg", img:"https://tshop.r10s.jp/stylife/cabinet/item/581/km2581-01_1.jpg",
      blurb:"トレイル由来のごつっとした佇まいが、むしろ普段着のいい差し色に。Quicklaceのすっと締まる感じも good。" },
    { cat:"fashion", date:"2026.08.05", motif:"m-sneaker", brand:"On", name:"Cloud 6", price:"¥19,800", url:"https://hb.afl.rakuten.co.jp/hgc/564298ab.00744c4a.564298ac.d7858634/_RTroom06836859_387762742_pc?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsakaikututen%2Fcloud-m%2F%3Fscid%3Droom_pc_id_reg", img:"https://shop.r10s.jp/sakaikututen/cabinet/image1/compass1785939948.jpg",
      blurb:"雲の上のようと言われるクラウドソール。すっきりした見た目で、街履きにも軽い運動にも。" }
  ];

  // 掲載日の新しい順に並べる（同日は記述順を保つ安定ソート）
  PICKS.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  // NEW は「最新の掲載日」かつ「その日付の商品が6件以下」のときだけ付ける。
  // 全件が同じ日付だと何が新しいとも言えないので、その場合は誰にも付かない。
  // 商品を1〜数件追加すると、その日付の商品にだけ自動で付く。
  const latestDate = PICKS.reduce((m, p) => (p.date > m ? p.date : m), "");
  const latestCount = PICKS.filter((p) => p.date === latestDate).length;
  const isNew = (p) => latestCount > 0 && latestCount < PICKS.length / 3 && p.date === latestDate;
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
        </div>
        <span class="card__brand">${esc(p.brand)}</span>
        <h3 class="card__name">${esc(p.name)}</h3>
        <p class="card__blurb">${esc(p.blurb || p.desc || "")}</p>
        <div class="card__foot">
          <a class="card__btn" href="${p.url}" target="_blank" rel="sponsored noopener nofollow">商品を見る</a>
        </div>
      </div>`;
    frag.appendChild(el);
  });
  // 読みもの等の商品グリッドが無いページでも同じmain.jsを読むため、存在確認する
  if (grid) grid.appendChild(frag);

  let visibleCount = INITIAL_VISIBLE;
  const LOAD_STEP = 30;
  let totalMatches = 0;
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
      const collapse = visibleIndex >= visibleCount;
      card.classList.toggle("is-hidden", collapse);
      visibleIndex += 1;
    });
      totalMatches = visibleIndex;

    if (togglePicks) {
      const hasMore = totalMatches > visibleCount;
      const isExpanded = visibleCount > INITIAL_VISIBLE;
      togglePicks.hidden = !(hasMore || isExpanded);
      togglePicks.textContent = hasMore ? "もっと見る" : "閉じる";
      togglePicks.setAttribute("aria-expanded", String(isExpanded));
    }
  };

  if (togglePicks) {
    togglePicks.addEventListener("click", () => {
      if (totalMatches > visibleCount) {
        visibleCount += LOAD_STEP;
      } else {
        visibleCount = INITIAL_VISIBLE;
      }
      applyLimit();
      if (visibleCount === INITIAL_VISIBLE) {
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
        visibleCount = INITIAL_VISIBLE;
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
