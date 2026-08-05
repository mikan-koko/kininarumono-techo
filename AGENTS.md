# AGENTS.md — 気になるモノ手帖

このリポジトリで作業するAIエージェント向けの引き継ぎ資料。**着手前に必ず全部読むこと。**
デザイン規約は別ファイル [DESIGN.md](DESIGN.md) にある。UIを触るならそちらも必読。

---

## 1. これは何か

デザインの良い雑貨・インテリア・ガジェットを紹介する、個人運営のアフィリエイト・キュレーションサイト。
運営者は「みかんココ」。楽天アフィリエイト（将来的にAmazonアソシエイトも）で収益化している**本番稼働中のサイト**。

| 項目 | 値 |
|---|---|
| 公開URL | https://kininarumono-techo.web.app |
| リポジトリ | https://github.com/mikan-koko/kininarumono-techo （public） |
| ローカル | `H:\共有ドライブ\ここ企画\案件\気になるモノ手帖\kininarumono-site` |
| ホスティング | Firebase Hosting（プロジェクトID `kininarumono-techo`、無料Sparkプラン） |
| GitHubアカウント | `mikan-koko` |
| Googleアカウント | `mikan@kokokikaku.com` |

同じ親フォルダに `_zip展開直後の旧コピー_20260805/` がある。**これは配布zipの未編集コピーで、現行とは無関係。** 中身は本リポジトリに完全に取り込まれているので消してよい（判断は運営者に確認すること）。

---

## 2. 技術スタック

**ビルドステップは無い。** npm も bundler も使っていない。素のHTML/CSS/JSを直接編集して `firebase deploy` するだけ。

```
public/
├─ index.html      … 全マークアップ + SVGモチーフのスプライト（インライン）
├─ css/style.css   … 全スタイル
├─ js/main.js      … 商品データ(PICKS) + カード描画 + 絞り込み + 演出
├─ images/         … 商品写真3点 + ogp.png
├─ 404.html / robots.txt
firebase.json      … Hosting設定（publicを配信、css/jsに max-age=86400）
.firebaserc        … プロジェクトID
```

外部依存はCDNから3つだけ。いずれも `index.html` の `<head>`。
- Google Fonts（Dela Gothic One / Zen Maru Gothic / Outfit）
- YakuHanJP（和文約物の詰め）

---

## 3. 絶対に守ること

### 3-1. アフィリエイトリンクを絶対に捏造しない

`PICKS` の `url` は運営者のアフィリエイトIDが埋め込まれた実リンク。形式は2種類ある。

- `https://a.r10.to/xxxxxx` … 楽天の短縮リンク（初期10件）
- `https://hb.afl.rakuten.co.jp/hgc/<ID>/_RTroom06836859_<商品ID>_pc?pc=<商品URL>` … 楽天ROOM経由

**それらしいURLを推測で書いてはいけない。** リンク切れか、最悪まったく別の商品や他人のIDに飛ぶ。収益とユーザーの信頼が直接かかる。

新しい商品を追加するときは、運営者の楽天ROOM（https://room.rakuten.co.jp/totonou_note/items ）の**個別商品ページ**を開き、`楽天市場で見る` のリンクを取得する。

> **取り違え注意**: 同じページに `_RTroom06836859rp_` （`rp` 付き）のリンクが多数ある。これは「同じショップの関連商品」で**別商品**。本命は `rp` の付かない `_RTroom06836859_<商品ID>_pc` 1本だけ。商品IDは詳細URL `/totonou_note/1700<9桁>xxx` の9桁部分と一致する。

### 3-2. 楽天の商品画像をスクレイピングしない

ショップ側の著作物。ページから拾って `public/images/` に置くのは不可。
正規ルートは**楽天ウェブサービス（Rakuten Web Service）のAPI**。アプリID登録と規約確認が必要で、**まだ未着手**。

### 3-3. アクセシビリティ（WCAG AA）を落とさない

過去に、白文字 × アンバー/ティールで**コントラスト比2.07**という不適合を作り込んだ実績がある。カテゴリ色には必ず用途別の変数を使う（DESIGN.md 参照）。

**初期表示だけ測って合格としないこと。** チップの選択状態、ホバー、絞り込み後など、**状態を変化させてから**測る。過去のバグはまさにそこで見落とした。

### 3-4. `?v=` を必ず上げる

`firebase.json` が css/js に `max-age=86400` を設定している。`index.html` の

```html
<link rel="stylesheet" href="css/style.css?v=9" />
<script src="js/main.js?v=9" defer></script>
```

の数字を**css/jsを変更したら必ず両方上げる**。上げ忘れると、再訪問者に最大24時間「新しいHTML × 古いCSS」が配信されて表示が壊れる。

### 3-5. `prefers-reduced-motion` を尊重する

演出を追加したら必ず `@media (prefers-reduced-motion: reduce)` にも対応を書く。

---

## 4. デプロイ手順

```bash
# 検証用（本番に影響しない一時URL・自動失効）
firebase hosting:channel:deploy design --expires 1d

# 本番
firebase deploy --only hosting

# 確認が済んだらプレビューチャンネルを消す
firebase hosting:channel:delete design --force
```

認証が切れていたら `firebase login --reauth`。**この再認証は対話的ターミナルでしか通らない**（AIエージェントの非対話シェルからは `Cannot run login in non-interactive mode` で失敗する）。運営者に実行してもらうこと。

`firebase login:list` は失効していても「ログイン中」と表示するので信用しない。`firebase projects:list` を叩いて実際に通るか確認する。

---

## 5. データモデル

商品は `public/js/main.js` の `PICKS` 配列。現在32件（ガジェット4 / インテリア8 / 雑貨12 / ファッション8）。うち写真ありは3件のみ。

```js
{ cat:"gadget",              // gadget | interior | goods | fashion
  motif:"m-cable",           // index.html のスプライト内 <symbol> のid
  brand:"Native Union",
  name:"POP CABLE USB-C 60W カールコード",
  price:"¥3,080〜",          // 通常価格。セール価格は書かない（期間終了で嘘になる）
  url:"https://a.r10.to/...",// 3-1参照
  img:"images/native-union.jpg", // 無ければ null → モチーフ表示
  blurb:"くるんと伸び縮みする…" }
```

- `img` があるカードは自動で2カラム占有の**フィーチャー扱い**になる（誌面のリズム用）
- 価格帯バッジ（¥ / ¥¥ / ¥¥¥）は `price` の数値から自動算出。手で書かない
- カテゴリのラベル・色は `main.js` 冒頭の `CAT` に集約

---

## 6. 過去に踏んだ罠

同じ穴に落ちないこと。

**インラインSVGの `<style>` に不等号を書くとCSSが全壊する**
`index.html` のスプライト内 `<style>` は raw text 要素ではないため、コメントに `<use>` と書いたらHTMLパーサーがタグとして解釈し、**CSSがルール0件でパースされ、全29図案が黒塗りになった。** あの中に `<` `>` を書かないこと。疑わしいときは `document.querySelector('svg style').sheet.cssRules.length` を見る。

**HTMLはキャッシュされる**
`?v=` を上げるのは css/js だけ。**HTML自体は別**。ブラウザで確認するときはURLにクエリを足すか強制再読み込みする。「直したのに反映されない」の原因はほぼこれ。

**View Transition の多重起動**
`document.startViewTransition()` の実行中に次のクリックが来ると `InvalidStateError` で未処理のPromise拒否になる。`main.js` の `vtBusy` ガードを外さないこと。

**スクリーンショットだけで判断しない**
プレビューの見た目だけでは寸法や重なりを誤読する。`getBoundingClientRect()` や `getComputedStyle()` で実測する。過去に「カード下半分が空洞」「装飾が本文に重なる」を実測で発見した。

**削除は検証の後**
スクリプトの挿入が失敗しているのに気づかず元ファイルを消して復旧に手間をかけた。`grep -c` などで結果を確認してから消す。

---

## 7. 現状と残タスク

### 完了
- 商品32件、全リンク実在確認済み（商品ページに直接アクセスして200/301を確認）
- ポップ×エディトリアルのデザイン刷新、WCAG AA達成
- SVGモチーフ29種、版ズレ・網点の質感
- OGP画像、スクロール連動などの演出

### 未着手（優先度順）
1. **「読みもの」記事** — `index.html` の READ セクションは2件ともガワだけ（「準備中」「近日公開」）。アフィリンク不要で書けて、**楽天アフィリエイトのサイト登録・Amazonアソシエイト審査で独自コンテンツとして効く**。最優先。
2. **商品写真** — 32件中29件が図案のまま。楽天ウェブサービスAPI（3-2）か運営者の撮影写真で置き換えるのが本筋。
3. **楽天アフィリエイトへのサイト登録** — 運営者本人の操作。サイトの中身が充実してから。
4. **Amazonアソシエイトの登録メディア切替** — README参照。運営者本人の操作。
5. 独自ドメイン（Firebaseコンソール → Hosting → カスタムドメイン）

### 運営者が自分でやること（エージェントは代行しない）
- 各種サービスへのログイン、アカウント設定変更
- アフィリエイトプログラムへの申請・メディア登録

---

## 8. 作業の進め方

1. UIを触るなら **DESIGN.md を先に読む**
2. セクション単位で進める。一度に全部作り変えない
3. プレビューチャンネルに出して、**スクリーンショットと実測の両方**で確認する
4. コントラストは状態を変えて測る（3-3）
5. `?v=` を上げる（3-4）
6. 本番デプロイ → 実URLを叩いて反映確認 → コミット＆push → プレビューチャンネル削除

コミットメッセージは日本語。何を直したかだけでなく**なぜそうしたか**を書く（既存のログを参照）。
