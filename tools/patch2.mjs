import fs from 'node:fs';
const p = 'public/js/main.js';
let t = fs.readFileSync(p, 'utf8');
t = t.split('楽天ROOMで見る').join('楽天で見る');
t = t.replace(/img:"[^"]*auc-youstyle[^"]*"/g, 'img:null');
t = t.replace(/img:"[^"]*kobe-beauty-labo[^"]*"/g, 'img:null');
fs.writeFileSync(p, t);
const files = ['public/index.html'];
for (const f of fs.readdirSync('public/read')) if (f.endsWith('.html')) files.push('public/read/' + f);
const m = fs.readFileSync(files[0], 'utf8').match(/\?v=(\d+)/);
if (m) { const cur = +m[1], next = cur + 1; for (const f of files) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split('?v=' + cur).join('?v=' + next)); console.log('?v ' + cur + ' -> ' + next); }
console.log('done: ボタン表記変更＋販促画像を図案表示に');