#!/usr/bin/env node
/**
 * OG画像（1200x630）をサイト本体のCSSでレンダリングして書き出す。
 *
 *   1. firebase emulators:start --only hosting  を別ターミナルで起動しておく
 *   2. node tools/build-ogp.mjs
 *   3. 出力された public/images/ogp-YYYY-MM.jpg を index.html と read/*.html の
 *      og:image / twitter:image / JSON-LD image に反映する（ファイル名を変えるのが要点。
 *      同名で上書きすると各SNSのキャッシュが数日〜数週間残る）
 *
 * なぜブラウザでレンダリングするか:
 *   ソースの tools/ogp-source.html が public/css/style.css をそのまま読むので、
 *   カテゴリ色やフォントを変えたときにOG画像だけ旧デザインで取り残されない。
 *   Pillowで直接描くと、色・フォント・影の定義を二重管理することになる。
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "tools", "ogp-source.html");
const SERVED = join(ROOT, "public", "_ogp-source.html");
const URL_ = "http://127.0.0.1:5000/_ogp-source";

const stamp = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();
const OUT = join(ROOT, "public", "images", `ogp-${stamp}.jpg`);

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chromeが見つからない。CHROME_PATH で実行ファイルを指定する。");
  process.exit(1);
}

// エミュレータが上がっているか先に確かめる。python -m http.server では
// cleanUrls が効かず /_ogp-source が404になるので、必ずエミュレータを使う。
// ここで叩くのはトップ。生成用HTMLはこの時点でまだ public/ に置いていない。
try {
  execFileSync("curl", ["-sf", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "http://127.0.0.1:5000/"], {
    stdio: "ignore",
  });
} catch {
  console.error(`${URL_} が応答しない。別ターミナルで次を実行してから再試行する:`);
  console.error("  firebase emulators:start --only hosting");
  process.exit(1);
}

const work = join(tmpdir(), "kmn-ogp");
mkdirSync(work, { recursive: true });
const raw = join(work, "ogp-raw.png");

copyFileSync(SRC, SERVED);
try {
  // 2倍で撮ってからLanczosで縮小する。等倍だと900ウェイトの細部が甘くなる。
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--user-data-dir=${join(work, "chrome-profile")}`,
      "--window-size=1200,630",
      "--force-device-scale-factor=2",
      "--virtual-time-budget=20000",
      `--screenshot=${raw}`,
      `${URL_}?shot=1`,
    ],
    { stdio: "ignore" }
  );

  execFileSync(
    "python",
    [
      "-c",
      [
        "from PIL import Image",
        `im=Image.open(r'${raw}').convert('RGB').resize((1200,630), Image.LANCZOS)`,
        `im.save(r'${OUT}','JPEG',quality=90,optimize=True,progressive=True,subsampling=0)`,
      ].join("\n"),
    ],
    { stdio: "inherit" }
  );
} finally {
  // 生成用HTMLを公開ディレクトリに残さない
  rmSync(SERVED, { force: true });
}

const kb = Math.round(statSync(OUT).size / 1024);
console.log(`書き出した: ${OUT} (${kb}KB)`);
console.log("index.html と read/*.html の og:image / twitter:image / JSON-LD image を新しいファイル名に更新すること。");
