# CLAUDE_CODE_HANDOFF.md — 2026-08-06 CodexからClaude Codeへ

## 最初に読むもの

1. `AGENTS.md`
2. `DESIGN.md`
3. このファイル

## リポジトリ

`H:\共有ドライブ\ここ企画\案件\気になるモノ手帖\kininarumono-site`

静的サイト。ビルドなし。`public/index.html` / `public/css/style.css` / `public/js/main.js` を直接編集する。

## 現在の状態

- ローカルプレビュー: `http://127.0.0.1:5178/?verify=21-final`
- Firebase本番: `https://kininarumono-techo.web.app`
- 今回のCodex作業は未コミット、未デプロイ
- `index.html` のキャッシュ番号: `style.css?v=21` / `main.js?v=21`

## 今回の主な変更

- ヒーローを、添付由来の `public/images/hero-pop-props.webp` を全面背景にする構成へ変更。
- 黒い仕切り線をやめ、ヒーロー下端を紙面の波形エッジに変更。
- `MOOD BOARD` / `EDITOR'S FILTER` / `HOW TO PICK` をスライドショー化。
- スライドの生成イラストは、画像カードではなくフレーム内背景として配置。
- スライド背景画像をポップアート寄りのフラット線画に差し替え。
- 「定番を選び直す」等の4フレームを生成写真へ差し替え。
- ブランドスクロール帯を削除。
- 商品カード番号を削除し、投稿日を表示。
- 商品一覧は初期6件だけ表示し、「もっと見る」で展開。
- 「もっと見る」ボタンをサイトに合う専用デザイン `.more-btn` に変更。
- 右下にトップへ戻る `.back-top` ボタンを追加。
- READセクションは「準備中」ではなく短い独自コンテンツ2件に変更。

## 新規画像アセット

- `public/images/hero-pop-props.webp`
- `public/images/mood-standard.webp`
- `public/images/mood-room.webp`
- `public/images/mood-edge.webp`
- `public/images/mood-luxury.webp`
- `public/images/slide-mood-board.webp`
- `public/images/slide-editors-filter.webp`
- `public/images/slide-how-to-pick.webp`
- `public/images/editor-illustration.webp` は現在HTMLから未参照。削除候補だが、削除前に `rg editor-illustration` で確認すること。

## 検証済み

- `node --check public/js/main.js` OK
- CSS波括弧: open=218 / close=218 / balanced=True
- `Invoke-WebRequest http://127.0.0.1:5178/?verify=21` で `style.css?v=21` / `main.js?v=21` を確認
- `v=20` 残りなし

## Claude Codeに渡すプロンプト例

```
AGENTS.md、DESIGN.md、CLAUDE_CODE_HANDOFF.mdを読んでから作業して。
最新状態は http://127.0.0.1:5178/?verify=21-final 。
まずは現状の表示を確認し、スライドショー、もっと見る、トップへ戻るボタン、スマホ表示に崩れがないか見て。
問題なければ変更をコミットする準備をして。その後はREAD記事の拡充を進めたい。
アフィリエイトリンクは絶対に推測で追加・変更しないで。
```

## 次のおすすめ作業

1. 目視と実測で現デザインの最終確認。
2. 不要なら `editor-illustration.webp` を削除。
3. 一連のデザイン変更をコミット。
4. READ記事を増やす。アフィリエイトリンクなしの独自記事が最優先。
5. 独自ドメイン方針を決める。ブランド重視なら会社サブドメインより独立ドメイン推奨。

## 注意

- `public/js/main.js` の `PICKS.url` はアフィリエイト実リンク。推測・書き換え禁止。
- 楽天画像のスクレイピング禁止。商品画像を増やすならAPIまたは運営者撮影素材。
- CSS/JSを触ったら `?v=` を必ず上げる。
- `prefers-reduced-motion` 対応を崩さない。