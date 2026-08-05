# 気になるモノ手帖 — 独自サイト（ベース）

**公開URL: https://kininarumono-techo.web.app**

- リポジトリ: https://github.com/mikan-koko/kininarumono-techo
- Firebase コンソール: https://console.firebase.google.com/project/kininarumono-techo/overview

デザインでアガる雑貨・インテリア・ガジェットのキュレーションサイト。
静的サイト（ビルド不要）。**GitHub → Firebase Hosting** で公開する前提のベース一式です。
このあと Claude Code で編集・拡張していきます。

## 構成
```
kininarumono-site/
├─ public/                 ← Firebase Hosting の公開ディレクトリ
│  ├─ index.html           ← トップページ（1枚もの）
│  ├─ 404.html
│  ├─ robots.txt
│  ├─ css/style.css        ← ポップなデザインシステム
│  ├─ js/main.js           ← セレクト描画・カテゴリ絞り込み・リビール
│  └─ images/              ← 商品写真（Native Union / Marimekko / HHKB）
├─ firebase.json           ← Hosting 設定（public を配信）
├─ .firebaserc             ← ★ Firebase プロジェクトIDを入れる
├─ .gitignore
└─ README.md
```

## デザイン方針（ポップ）
- 参考テイスト: ポップ系Webデザイン（高彩度の多色・丸みのある書体・色面と弾むアニメ）。※原則のみ参考、他社サイトの模倣はしない。
- カラー: 紙白 `#FBF7EF` ／ 墨 `#17130E` ／ ポップ4色＝ガジェット=パープル `#5B2BEB`・インテリア=ティール `#10B6A8`・雑貨=コーラル `#FF4B3E`・ファッション=アンバー `#FF9E1B`（＋アクセントのピンク/イエロー）。
- フォント: 和文 `M PLUS Rounded 1c` / `Noto Sans JP`、欧文 `Quicksand`（Google Fonts）。
- カテゴリを色で分ける「色タブ」がシグネチャ。`prefers-reduced-motion` 対応・WCAG AA 意識。

## セレクト商品の編集
`public/js/main.js` の `PICKS` 配列を編集すれば商品を追加・変更できます。
各要素: `cat`(gadget/interior/goods/fashion) / `brand` / `name` / `price` / `url`(アフィリンク) / `img`(画像パス or null) / `blurb`。
- アフィリンクは `rel="sponsored noopener nofollow"` を付与済み。
- 画像がない商品は、頭文字＋カテゴリ色のカードで表示されます。

---

## 公開手順（GitHub みかんココ → Firebase Hosting）

### 1. GitHub に置く
```bash
cd kininarumono-site
git init
git add .
git commit -m "init: 気になるモノ手帖 site base"
# GitHub(みかんココ)で空リポジトリを作成してから：
git branch -M main
git remote add origin https://github.com/<みかんココのユーザー名>/kininarumono-techo.git
git push -u origin main
```

### 2. Firebase Hosting で公開
前提: Node.js が入っていること。
```bash
# 1) Firebase CLI
npm install -g firebase-tools
# 2) ログイン（ブラウザで本人が認証）
firebase login
# 3) Firebase コンソール(https://console.firebase.google.com)で新規プロジェクト作成 → そのプロジェクトIDを .firebaserc の "default" に記入
#    例: "default": "kininaru-techo"
# 4) デプロイ（このリポジトリのルートで）
firebase deploy --only hosting
```
→ `https://<プロジェクトID>.web.app` で公開されます。独自ドメインは Firebase コンソールの Hosting → カスタムドメインで後付け可能。

※ `firebase init` を自分で走らせたい場合は `firebase init hosting` を選び、public ディレクトリに `public`、SPA は「No」、既存 index.html は上書きしない、で進めてください（本リポジトリの firebase.json と同等になります）。

### 3.（任意）GitHub Actions で自動デプロイ
`firebase init hosting:github` を実行すると、push で自動デプロイする Actions を作れます（Firebase 側でサービスアカウントの Secret が自動設定されます）。

---

## Amazon アソシエイト 登録メディア切替（本人操作）
1. サイトにセレクト＋読みものを数本入れて中身を充実させる（審査対策）。
2. アソシエイト・セントラル → アカウント設定 → ウェブサイト/アプリの管理 → 公開した本サイトURLを**追加**（note はしばらく残す）。
3. 切替後、フッターのAmazon開示文はそのまま活用。楽天に無い/条件の良い商品は Amazon(タグ `curryoden22-22`)へ差し替え。
※ ログイン・アカウント設定変更は本人が実施。

## コンプライアンス
- フッターにアフィリ開示・Amazon開示・運営者情報・免責を記載済み。運営者名（実名 or 屋号）と連絡先は必要に応じて更新してください。
