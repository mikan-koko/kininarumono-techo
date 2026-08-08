import fs from 'node:fs';
let t = fs.readFileSync('public/js/main.js','utf8');
t = t.replace(/\s*\$\{band\(p\.price\)[\s\S]*?: ""\}/, '');
t = t.replace(/\s*<span class="card__price">[^<]*<\/span>/, '');
fs.writeFileSync('public/js/main.js', t);
const files = ['public/index.html'];
for (const f of fs.readdirSync('public/read')) if (f.endsWith('.html')) files.push('public/read/' + f);
const m = fs.readFileSync(files[0], 'utf8').match(/\?v=(\d+)/);
if (m) { const cur = +m[1], next = cur + 1; for (const f of files) fs.writeFileSync(f, fs.readFileSync(f, 'utf8').split('?v=' + cur).join('?v=' + next)); console.log('?v ' + cur + ' -> ' + next); }
console.log('done: 金額表示を削除しました');