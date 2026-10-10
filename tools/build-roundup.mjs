#!/usr/bin/env node
// build-roundup.mjs — テーマ別のまとめ記事を public/read/ に生成する。
//
//   node tools/build-roundup.mjs
//
// ★ PICKS を編集したら再生成すること（デプロイのワークフローが差分で検出して落とす）
//
// なぜ生成するのか:
//   まとめ記事は特定の商品を名指しで紹介する。商品をベタ書きすると、
//   週次の在庫監査（check-stock.mjs --fix）が販売終了品をPICKSから消したときに、
//   記事側だけリンク切れのまま残る。ここでは brand + name で PICKS を引くので、
//   消えていれば **生成時にエラーで落ちる**。気づけるようにするのが目的。
//
// 既存の「読みもの」（選び方エッセイ）との違い:
//   エッセイはアフィリエイトリンクを含まない編集メモ。まとめ記事は商品リンクを含む。
//   そのため各記事で商品カードより前に開示（AGENTS.md 3-6）を必ず置く。

import fs from 'node:fs';
import path from 'node:path';
import {
  repoRoot, ORIGIN, CAT, esc, readPicks, makeIsNew, cardHtml,
  cacheVersion, head, header, footer, disclosure, addToSitemap, writeIfChanged, adSlot, AD_BY_PAGE
} from './lib/site.mjs';

// 記事からカテゴリページへ戻す導線。これが無いと、検索の入口になる記事から
// 商品を並べたページへ流れず、リンクが片側にしか通らない。
const CAT_LABEL = {
  gadget: 'ガジェット', interior: 'インテリア', kitchen: '食器・キッチン',
  beauty: 'コスメ・ケア', daily: '日用品', goods: '文具・雑貨', fashion: 'ファッション'
};
const catNavHtml = (cats) => `<h2>このテーマの商品を見る</h2>
<nav class="catnav" aria-label="関連カテゴリ">
${cats.map((c) => `<a class="catnav__link" href="/category/${c}" style="--c:var(--${CAT[c].cvar}-deep)">${esc(CAT_LABEL[c])}</a>`).join('\n')}
</nav>`;

// 日付は ROUNDUPS の published/modified に固定で持たせる。
// ここで new Date() を使うと、実行した日が datePublished に焼き込まれてしまい、
// 「翌日に再生成すると必ず差分が出る」＝ CI の生成物チェック（.github/workflows）が
// その日以降ずっと落ちる、という状態になる（実際に2026-08-30に踏んだ）。
// 構造化データとしても、datePublished が再生成のたびに動くのは誤りなので固定する。
const disp = (d) => d.replace(/-/g, '.');

// 商品は [brand, name] で PICKS を引く。表記を1文字でも間違えたら生成時に落ちる。
const ROUNDUPS = [
  {
    slug: 'gift-3000en-ika',
    shareImage: 'article-share-gift.jpg',
    cats: ['goods', 'kitchen', 'beauty'],   // 記事末尾のカテゴリ導線
    published: '2026-08-27',   // 公開日。動かさない（modified を足せば更新日だけ変えられる）
    modified: '2026-10-10',
    tag: 'ギフト', tagColor: 'violet-deep',
    titleBase: 'プチギフトに選ぶ、毎日使う雑貨',
    desc: 'プチギフトや手土産の候補を、使う頻度・置き場所・相手の好みから考えます。文具、グラス、ソープなど8点を紹介。価格や容量は購入前に販売ページで確認してください。',
    lead: 'ちょっとしたお礼に何を渡すか。値段だけで候補を絞る前に、相手がすでに使っている道具と、家に持ち帰ったあとの置き場所を考えます。サイトに掲載している雑貨から、文具・食器・ケア用品を集めました。',
    intentGuide: 'プチギフトや手土産を探している人向け。使う頻度、置き場所、好みが分からないときの確認点を整理します。掲載商品の価格上限は保証していません。容量・セット数・送料も含め、販売ページで予算に収まるか確認してください。',
    intro: [
      '「その場で気が利いて見えるか」だけでは、持ち帰ってから使うかどうかは分かりません。机で書く、飲み物を飲む、手を洗うなど、相手の日常のどこに入るかを先に考えると候補を比べやすくなります。',
      '毎日か毎週使う場面があるか、新しい置き場所が必要か、相手の好みを確認できるか。この3つを見ます。弁当箱は弁当を持つ習慣、香りのある用品は香りの好みが分かる相手向けです。分からない場合は、渡す前に確認するか別の候補を選びます。'
    ],
    sections: [
      {
        h2: '机の上で毎日使うもの',
        body: '文具は、すでに使っているものと用途が重ならないかを確認します。ポーチなら入れたいもの、ペンなら書く場面、手帳なら紙で予定を管理する習慣があるか。見た目に加えて、使う場面を一つ挙げられるものを候補にします。',
        items: [
          ['DELFONICS', 'キトリ ポーチM', 'マチのない平たいポーチ。文具や小物をまとめたい人向けの候補です。入れたいものの厚みと本体寸法を比べ、普段のバッグに収まるか確認してください。'],
          ['suck UK', 'DRUM STICK PEN（ドラムスティック型ボールペン）', '見た目が完全にドラムスティックで、机に転がっていると何度も説明したくなる類。話のきっかけになるギフトが欲しいときに。'],
          ['HIGHTIDE / nahe', '2027 スクエア マンスリー手帳', '月間予定を紙で一覧したい人向けの候補です。贈る時期に合う年版と開始月を確認し、すでに使っている手帳と役割が重ならないか考えます。']
        ]
      },
      {
        h2: '台所とテーブルまわり',
        body: 'グラスは、よく飲むものに合う容量と、食器棚に収まる高さ・個数で比べます。二人暮らしでも同じグラスを使うとは限りません。すでに持っている食器や弁当箱を確認し、置き場所と使う習慣に合うものを選びます。',
        items: [
          ['DURALEX', 'ピカルディ', '容量を選ぶときは、相手がよく飲むものと、一度に注ぐ量を確認します。販売ページで選択中の容量とセット数を照合してから予算を考えてください。'],
          ['bodum', 'ダブルウォールグラス PAVINA 250ml 2個セット', '250mlのグラス2個セット。二重構造の見た目に加えて、持ちやすい寸法か、2個分の置き場所があるかを確認します。対応する洗い方や扱い方も販売ページで確かめてください。'],
          ['竹中', 'mayu ランチボックス M 680ml', '容量680mlのランチボックス。弁当を持ち歩く人向けの候補です。普段使う容量と、持ち歩くバッグに収まる寸法かを購入前に確認してください。']
        ]
      },
      {
        h2: '香りと手ざわりで選ぶ',
        body: '使い切れる用品でも、香りや肌との相性は人によって違います。ソープやバームは、相手が普段使う種類や香りを確認できるときの候補です。好みが分からない場合に無条件で選べるものではありません。',
        items: [
          ['COMPAGNIE DE PROVENCE', 'リキッドマルセイユソープ EXTRA PUR', '香りの好みが分かる相手向けの候補です。選択中の香りと容量、ボトルを置く場所の寸法を確認してください。肌との相性が分からない場合は、普段使う種類を先に聞きます。'],
          ['Jurlique', 'ローズ ラブバーム', '缶入りのバームで、ポーチに転がしておける大きさ。持ち歩くものを贈りたいときに。']
        ]
      }
    ],
    closing: '候補を選んだら、使う場面・置き場所・好みの3点をもう一度確認します。最後に販売ページで容量、セット数、送料込みの総額を見て予算と照合してください。どの相手にも合うと決めつけず、分からない条件が残るものは候補から外して考えます。',
    related: ['gift-no-erabikata', 'zakka-no-asobigokoro']
  },

  {
    slug: 'hitorigurashi-kaden-akari',
    shareImage: 'article-share-room.jpg',
    cats: ['gadget', 'interior', 'kitchen'],   // 記事末尾のカテゴリ導線
    published: '2026-08-27',   // 公開日。動かさない（modified を足せば更新日だけ変えられる）
    modified: '2026-10-10',
    tag: '一人暮らし', tagColor: 'teal-deep',
    titleBase: '小さな部屋で検討したい、家電と灯り',
    desc: '小さな部屋の家電・照明を、置き場所と使用条件から考える7つの候補。本体寸法だけでなく、トースターの必要な空間、ランプの屋外使用、スピーカーの充電条件を確認します。',
    lead: '棚に本体が収まっても、その場所で使えるとは限りません。熱を出す家電には周囲の空間が必要で、持ち運べる機器にも水濡れや充電の条件があります。灯り、台所、音の3つに分け、買う前に確認したい点を並べました。',
    intentGuide: '小さい部屋に家電・照明・スピーカーを増やしたい人向け。寸法、配線、使用環境を照合するための候補集です。掲載品をすべて実際に設置・使用したレビューではありません。',
    intro: [
      'この記事では、まず手元やベッドサイドなど、灯りを足したい位置を決める順番を提案します。必要な明るさに加え、台座やコードの置き場所も考えておきます。',
      '台所では、置く面の幅と奥行き、上の棚までの高さ、扉を開く空間、コンセントの位置を測ります。そのうえで、候補の取扱説明書にある設置条件と照合します。'
    ],
    sections: [
      {
        h2: '灯りは、高さと使う場所を決める',
        body: '天井から吊るす照明と、台に置く照明では必要な場所が違います。充電式でも充電場所は必要です。SOMPEXのLULUは公式情報で屋内・屋外用、使用温度0〜40℃と案内されています。雨や雪に長時間さらさず、充電は乾いた平らな場所で行う条件もあります。ベランダで使う前に、購入品の説明書と置く場所を照合してください。',
        sources: [['SOMPEX LULU公式製品情報（英語）', 'https://www.sompex.de/en_de/lulu-grun-metallic-akku-tischleuchte.html']],
        items: [
          ['abode', 'STRAW ペンダントランプ', '色付きのストローを束ねただけの構造。灯すと隙間から光が抜けるので、天井まわりの表情が変わります。'],
          ['INTERFORM', 'テーブルライト ペルナ', '木を削り出した脚にプリーツの布セード。ベッドサイドに置いたときの灯りの落ち方がやわらかいタイプです。'],
          ['SOMPEX', 'LULU テーブルランプ', 'コードをつながずに置ける充電式。置く台の広さと、充電する場所をセットで決めたい候補です。']
        ]
      },
      {
        h2: '台所は、本体寸法と周囲の空間を分けて測る',
        body: 'CAT-G8Aの本体は約幅21.8×奥行25.4×高さ21.1cm。説明書の設置図では、木製の壁・家具などの可燃物から上面10cm以上、側面・後面4.5cm以上を離し、右側か左側の片面を開放するよう案内されています。水のかかる場所や火気の近くでは使えません。コンロ脇の幅だけを見て置けると判断せず、扉の開閉や作業に使う場所も残せるか確認します。',
        sources: [['Aladdin CAT-G8A取扱説明書（PDF・冊子2ページ）', 'https://aladdin-aic.com/web-contents/wp-content/uploads/2025/10/CAT-G8A.pdf']],
        items: [
          ['Aladdin', 'グラファイトトースター 1枚焼き CAT-G8A', '食パン1枚用。設置条件を満たす場所を確保したうえで、必要な調理量に合うかを考えます。'],
          ['bodum', 'ダブルウォールグラス PAVINA 250ml 2個セット', '家電と一緒に使う食器の候補。グラスを置く面と収納場所、容量とセット数を購入前に確かめます。']
        ]
      },
      {
        h2: '音は、置き場所とセットで考える',
        body: '棚に据え置くか、部屋の中で持ち運ぶかを先に考えます。EMBERTON IIIはIP67の防塵・防水仕様ですが、それだけで浴室の熱・蒸気・洗剤への対応まで判断はできません。公式説明書は流水で洗わず、充電前に本体を完全に乾かすよう案内しています。この記事では浴室利用を勧める候補にはせず、置き場所と充電場所を確認します。',
        sources: [['Marshall EMBERTON III公式仕様（英語）', 'https://www.marshall.com/fi/en/product/emberton-iii?pid=1006884'], ['Marshall EMBERTON III取扱説明書（英語PDF・5〜6ページ）', 'https://www.marshall.com/on/demandware.static/-/Library-Sites-SharedLibrary-Marshall/default/dwe0dadd06/images/cms-pages/user/Marshall_Emberton_III_OLM_R1_1_en.pdf']],
        items: [
          ['Sonos', 'Era 100 スマートスピーカー', '円筒をそのまま立てたような形で、棚に1台置くだけで済む大きさ。あとから2台にして左右に振り分けることもできます。'],
          ['Marshall', 'EMBERTON III', '持ち運べるスピーカー。使う環境と充電時の乾燥条件を確認してから、机や棚のどこに置くかを考えます。']
        ]
      }
    ],
    closing: '候補を絞るときは、使う場所を決め、本体寸法と必要な周囲の空間を照合し、配線と手入れの動作まで確かめる。この順番で考えると、棚に収まるかだけでは見えなかった条件を整理できます。照明にも台座や充電場所が必要なので、増やす前に置き場所を決めておきたいと思います。',
    related: ['hitorigurashi-no-heyazukuri', 'kagu-brand-no-erabikata']
  },

  {
    slug: 'hokuo-design-teiban',
    shareImage: 'article-share-room.jpg',
    cats: ['kitchen', 'interior'],   // 記事末尾のカテゴリ導線
    published: '2026-08-27',   // 公開日。動かさない（modified を足せば更新日だけ変えられる）
    tag: '北欧', tagColor: 'green-deep',
    titleBase: '北欧デザインの定番、どれから買うか',
    desc: '北欧デザインの定番アイテムを、買う順番で整理しました。イッタラやHAYの食器から、アアルトベース、Yチェアやセブンチェアまで。価格帯ごとの入り口を紹介します。',
    lead: '北欧の定番と呼ばれるものは数が多く、しかも価格の幅が数千円から十数万円まであります。全部は無理でも、どれから手を付けると部屋が変わるのかには順番があると思っていて、それを価格帯ごとに整理しました。',
    intentGuide: '北欧デザインの定番を、何から買うか迷っている人向け。食器、花瓶、灯り、椅子の順に、失敗しにくい入口を整理します。',
    intro: [
      '定番が定番であり続ける理由は、たいてい「他のものと並べても喧嘩しない」ことにあります。単体で見て一番かっこいいものが定番になるわけではなく、すでに部屋にあるものの隣に置いたときに成立するものが残っていく。だから買い足していく前提なら、結局そこに戻ってきます。',
      '順番としては、食器 → 花と灯り → 椅子の順で薦めています。前に行くほど安く、失敗しても取り返しがつき、しかも毎日手に取る回数が多いからです。'
    ],
    sections: [
      {
        h2: '1. まず食器から。毎日手に取る回数が一番多い',
        body: '数千円で買えて、毎日必ず使い、割れても買い直せる。北欧デザインの入り口としてこれ以上の条件は無いと思っています。定番の形は色を変えても揃って見えるので、少しずつ足していけます。',
        items: [
          ['iittala', 'ティーマ マグカップ 0.3L（アイスブルー）', 'カイ・フランクがデザインした定番。持ち手が細めなので、別の色と重ねて置いてもうるさくなりません。'],
          ['HAY', 'TINT ワイングラス 2個セット', '色付きのガラスを2個セットで。テーブルに1色入れるだけで印象が変わります。']
        ]
      },
      {
        h2: '2. 花と灯りで、部屋の空気を変える',
        body: '家具を買い替えなくても、花瓶とキャンドルの高さが入ると部屋に視線の止まる場所ができます。食器の次に効いて、まだ数千円から一万円台で届く帯です。',
        items: [
          ['iittala', 'アアルト ベース 120mm', 'アルヴァ・アアルトの波形。小さいサイズなら一輪挿しとして気軽に使えます。'],
          ['HOLMEGAARD', 'FLORA ベース ロングネック 24cm', '口の細いガラスなので、花を挿さずに置いてもオブジェとして成立します。'],
          ['ferm LIVING', 'Komo Mini Vases 3個セット', '高さも釉薬の出方も少しずつ違う3つセット。並べると陰影が出ます。'],
          ['Georg Jensen', 'NENDO ティーライト キャンドルホルダー', '佐藤オオキが手がけた、ステンレスを折り曲げただけのような形。火を入れると鏡面のほうにも炎が映ります。']
        ]
      },
      {
        h2: '3. 椅子は最後に、長く',
        body: '価格は跳ね上がりますが、座る時間の長さで割ると印象が変わる帯です。ここまで来たら、流行りではなく何十年も残っている形から選ぶほうが結局満足します。',
        items: [
          ['KAY BOJESEN DENMARK', 'Monkey Mini（モンキー ミニ ブラック）', '椅子の前に、小さいものでデンマークの木ものを1つ。棚の上に置くだけで空気が変わります。'],
          ['Carl Hansen & Søn', 'CH24 Yチェア オーク／オイル仕上げ SH45cm', 'ハンス・ウェグナーの代表作。座面のペーパーコードは張り替えられるので、長く使う前提が立ちます。'],
          ['Fritz Hansen', 'セブンチェア（正規）', '成形合板の薄さと重ねられる実用性。1脚から足していける定番です。']
        ]
      }
    ],
    closing: '北欧の定番は、安いものから順に買っても部屋が中途半端になりません。むしろ食器やガラスで色と質感の方向を決めてから大きいものに進むほうが、後から並べたときに揃います。急いで椅子から入る必要はないと思っています。',
    related: ['kagu-brand-no-erabikata', 'burando-lineup-no-kijun']
  },

  {
    slug: 'fuyujitaku-no-dougu',
    shareImage: 'article-share-akibeya.jpg',
    cats: ['daily', 'fashion', 'kitchen'],   // 記事末尾のカテゴリ導線
    published: '2026-09-26',   // 公開日。動かさない（modified を足せば更新日だけ変えられる）
    modified: '2026-10-10',
    tag: '冬支度', tagColor: 'amber-deep',
    titleBase: '寒くなる前に揃えておきたい、冬支度の道具',
    desc: '本格的に寒くなる前に揃えておきたい冬支度の道具をまとめました。湯たんぽやルームシューズ、ウールのブランケットから、カシミヤのマフラー、温かいものを入れる台所の道具まで。',
    lead: '冬支度は、使う場面と手入れの手間を比べながら考えたいもの。布団を温める道具、室内で身に着けるもの、温かい飲みものを入れる器を、購入前の確認点と一緒に集めました。',
    intentGuide: '身のまわりの道具で冬に備えたい人向け。就寝前、室内、外出、台所の場面で使い方を整理します。湯たんぽの就寝前の取り出しを含め、購入品の取扱説明書を確認してください。掲載品すべての使用レビューではありません。',
    intro: [
      'この記事では、布団に入る前、室内で過ごすとき、外出するとき、台所で一杯淹れるときに分けて候補を見ます。必要なものは部屋の環境や過ごし方で変わるので、暖房器具の代わりになると一括して考えず、使う場面を決めて選びます。',
      '購入前には、準備と片付けまで続けられるかを確認したいと思います。湯たんぽならお湯を用意し、布団を温めたら取り出し、使用後に手入れするまで。衣類ならサイズと洗濯表示まで見ておくと、使い方を具体的に考えられます。'
    ],
    sections: [
      {
        h2: '布団を温めたら、湯たんぽを取り出して就寝する',
        body: 'NITEは、湯たんぽを就寝前に布団へ入れ、温まったら取り出すよう案内しています。カバーで包んでも、長時間体に触れると低温やけどを負うことがあります。入れるお湯の温度・量、カバー、手入れは購入品の説明書で確認してください。容量と準備・片付けの手間が、生活に合うかも確かめたいところです。',
        sources: [['NITE・低温やけどを防ぐ使い方（2023年11月28日）', 'https://www.nite.go.jp/jiko/chuikanki/mailmagazin/2023fy/vol441_231128.html']],
        items: [
          ['工房アイザワ', '18-8ステンレス ゆたんぽ 2.5L', '購入前に容量と注湯・手入れの方法を確認したい候補。布団を温める場合は就寝前に取り出し、入れたまま眠らない使い方を考えます。'],
          ['Francfranc', 'プードルボア ルームシューズ（グリーン）', 'フローリングの冷たさを足裏で受けないための一足。くすんだグリーンは、玄関に脱いだままでも部屋の色から浮きにくい色です。'],
          ['KLIPPAN', 'ウール シングルブランケット FLOOR', 'ソファで膝に掛けるのにちょうどいいシングルサイズ。ウールなので、寒い日にもう一枚重ねる役にも回せます。']
        ]
      },
      {
        h2: '出かけるときの首元と一枚目',
        body: '外出用は、手持ちのコートに重ねられるかを基準に考えます。マフラーの幅と長さ、ニットの身幅を確かめ、肌ざわりや洗濯表示も見て選びたいところです。必要な暖かさは気温や過ごし方で変わります。',
        items: [
          ['Johnstons of Elgin', 'カシミヤ タータンチェック マフラー', 'スコットランドの老舗のカシミヤ。無地のコートにタータンが一本入るだけで、冬の服の印象が変わります。'],
          ['SLOANE', '14G天竺 メリノウール クルーネック', 'シャツやコートに重ねる候補。重ね着する場合は、手持ちの服と身幅・袖まわりを比べて選びます。']
        ]
      },
      {
        h2: '温かいものを、台所で',
        body: '寒い季節は、温かい飲みものやご飯を口にする回数が自然と増えます。だから台所の道具は、毎日出すものを少しだけ良くするのがいちばん効きます。',
        items: [
          ['bodum', 'CHAMBORD ティーポット 1000ml', '淹れたい量と、使うカップの容量を照合したい候補。満水容量と普段使う湯量を分け、洗いやすさも確認します。'],
          ['Staub', 'ラ・ココット de GOHAN S（12cm）', '鍋でご飯を炊くための候補。炊飯量、対応熱源、調理中と食卓での置き場所を確認して選びます。'],
          ['Rörstrand', 'モナミ マグ 340ml', '濃いブルーの花柄は、冬の朝の白っぽい光の中でも沈まずに映えます。スープを入れても足りる容量です。']
        ]
      }
    ],
    closing: '使う場面を決めたら、準備と片付けの手間、収納場所、購入品の取扱条件を比べてみてください。湯たんぽは就寝前の取り出しまでを一つの動作に。身に着けるものは重ね方と手入れを、器は一度に使う量を確かめて選ぶ順番を提案します。',
    related: ['akibeya-no-totonoekata', 'hitorigurashi-no-heyazukuri']
  }
];

const ARTICLE_TITLES = {
  'zakka-no-mikata': '部屋と服のあいだで選ぶ、デザイン雑貨の見方',
  'trend-komono-rule': 'トレンド小物を子どもっぽく見せないルール',
  'ii-mono-no-kijun': '実際に買ってよかったものに共通する、「良いモノ」の選び方',
  'zakka-no-asobigokoro': 'お手頃な雑貨だからこそ、遊び心を効かせる',
  'kagu-brand-no-erabikata': '家具ブランドは「どこに投資するか」で選ぶ',
  'burando-lineup-no-kijun': 'モノを選ぶときに見ている3つの視点',
  'gift-no-erabikata': 'プレゼント選びで見ている3つの基準',
  'hitorigurashi-no-heyazukuri': '一人暮らしの部屋づくりで最初に決める3つのこと',
  'akibeya-no-totonoekata': 'ソファは動かさない。秋の部屋を小物で整える4つの順番'
};

// ---- ここから生成 ----
const picks = readPicks();
const isNew = makeIsNew(picks);
const vparam = cacheVersion();
const outDir = path.join(repoRoot, 'public/read');

const find = (brand, name, slug) => {
  const hit = picks.find((p) => p.brand === brand && p.name === name);
  if (!hit) {
    throw new Error(
      `[${slug}] PICKSに見つからない: ${brand} / ${name}\n` +
      '  在庫監査で消えたか、main.js側の表記が変わった可能性がある。\n' +
      '  記事から外すか、tools/build-roundup.mjs の表記を直すこと。'
    );
  }
  return hit;
};

let written = 0;
for (const r of ROUNDUPS) {
  // published を書き忘れると undefined が datePublished に入って構造化データが壊れる。
  // 静かに壊れるより落とす。
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.published || '')) {
    throw new Error(`${r.slug}: published が YYYY-MM-DD で入っていない（値: ${r.published}）。ROUNDUPSに公開日を書くこと。`);
  }
  const url = `${ORIGIN}/read/${r.slug}`;
  const all = r.sections.flatMap((s) => s.items.map(([b, n]) => find(b, n, r.slug)));
  // 見出しの「N選」は必ず実データから作る。手書きにすると商品の増減でズレる（実際にズレた）
  r.title = r.titleBase + ' ' + all.length + '選';
  const fullTitle = `${r.title}｜気になるモノ手帖`;
  const shareImage = r.shareImage || 'read-editorial-cover-v2.jpg';
  const shareImageUrl = `${ORIGIN}/images/${shareImage}`;
  const shareImageAlt = `${r.title}のイメージ写真`;

  const sections = r.sections.map((s) => `<h2>${esc(s.h2)}</h2>
<p>${esc(s.body)}</p>
${s.sources ? `<p>確認資料：${s.sources.map(([label, href]) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`).join(' ／ ')}（2026年10月10日確認）</p>\n` : ''}<div class="grid grid--article">
${s.items.map(([b, n, note]) => {
    const p = find(b, n, r.slug);
    return `<div class="roundup__item">\n${cardHtml(p, isNew(p))}\n<p class="roundup__note"><strong>${esc(p.brand)}</strong>${esc(note)}</p>\n</div>`;
  }).join('\n')}
</div>`).join('\n\n');

  const related = r.related.map((slug) =>
    `<li><a href="/read/${slug}">${esc(ARTICLE_TITLES[slug] || slug)}</a></li>`).join('\n');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: r.title,
        description: r.desc,
        image: shareImageUrl,
        datePublished: r.published,
        dateModified: r.modified || r.published,
        inLanguage: 'ja-JP',
        author: { '@id': `${ORIGIN}/#organization` },
        publisher: { '@id': `${ORIGIN}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '気になるモノ手帖', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: r.title, item: url }
        ]
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#itemlist`,
        name: r.title,
        numberOfItems: all.length,
        // 商品一覧は通常のItemList。単一商品向けProductスニペットとして扱わない。
        itemListElement: all.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.brand} ${p.name}`
        }))
      }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="ja">
${head({ title: fullTitle, desc: r.desc, url, ogType: 'article', vparam, ld, ogImage: shareImageUrl, ogImageAlt: shareImageAlt })}
<body>

<!-- このページは tools/build-roundup.mjs が生成しています。直接編集しないこと。
     文言を直すなら tools/build-roundup.mjs の ROUNDUPS を編集して再生成する。 -->

${header}

<main>
<section>
<article class="article article--roundup">
<a class="article__crumb" href="/read">← 読みものへ戻る</a>

<div class="article__topline">
<span class="tag" style="--c:var(--${r.tagColor})">${esc(r.tag)}</span>
<span class="tag" style="--c:var(--ink)">まとめ</span>
<span class="article__date">${r.modified ? `公開 ${disp(r.published)} · 更新 ${disp(r.modified)}` : disp(r.published)}</span>
</div>

<h1>${esc(r.title)}</h1>

<figure class="article__hero"><img src="/images/${shareImage}" alt="${esc(shareImageAlt)}" loading="eager" /><figcaption class="article__hero-caption">記事の内容をイメージした写真。SNSで共有するとこの画像が表示されます。</figcaption></figure>

<p class="article__lead">${esc(r.lead)}</p>

<aside class="article__guide" aria-label="この記事で整理すること"><b>この記事で整理すること</b><p>${esc(r.intentGuide)}</p></aside>

<div class="article__body">
${r.intro.map((t) => `<p>${esc(t)}</p>`).join('\n')}

${disclosure}

${sections}

<h2>まとめ</h2>
<p>${esc(r.closing)}</p>
<p>ここで挙げたもの以外は<a href="/#select">ピック一覧</a>から、価格帯や気分に合わせて探してみてください。</p>
</div>

<div class="share" data-share>
<span class="share__label">SHARE</span>
<button class="share__btn" type="button" data-share-native hidden>シェアする</button>
<a class="share__btn" data-share-x target="_blank" rel="noopener">X</a>
<a class="share__btn" data-share-line target="_blank" rel="noopener">LINE</a>
<a class="share__btn" data-share-fb target="_blank" rel="noopener">Facebook</a>
<a class="share__btn" data-share-pin target="_blank" rel="noopener">Pinterest</a>
<button class="share__btn" type="button" data-share-copy>リンクをコピー</button>
</div>

<p class="article__note">この記事は商品へのアフィリエイトリンクを含みます。掲載リンクから購入されると運営者に報酬が支払われる場合があります。価格・在庫は掲載時点のもので変動するため、購入前にリンク先でご確認ください。</p>

<h2>あわせて読む</h2>
<ul class="cat-related">
${related}
</ul>

${catNavHtml(r.cats)}
<div class="article__foot">
<a class="article__crumb" href="/read">← 読みものへ戻る</a>
<a class="article__crumb" href="/#select">ピック一覧を見る →</a>
</div>
</article>
${adSlot(AD_BY_PAGE[r.slug], `article-${r.slug}`)}
</section>
</main>

${footer(vparam)}
</body>
</html>
`;

  const dest = path.join(outDir, `${r.slug}.html`);
  const changed = writeIfChanged(dest, html);
  if (changed) written++;
  console.log(`${changed ? '+' : '='} /read/${r.slug}  商品${all.length}点`);
}

// lastmod もその記事自身の日付を使う（実行日を入れると新記事追加のたびに非決定になる）
const added = ROUNDUPS.reduce((n, r) =>
  n + addToSitemap([`/read/${r.slug}`], r.modified || r.published, { priority: '0.8' }), 0);
console.log(`\n生成: ${ROUNDUPS.length}本 / 更新 ${written}件 / sitemapに追加 ${added}件 / ?v=${vparam}`);
