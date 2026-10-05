import fs from 'node:fs';

const h = fs.readFileSync('C:/xampp_lite_8_5/www/espocrm-docs/index.html', 'utf8');
let bad = 0;
const fail = (m) => { bad++; console.log('BAD  ' + m); };
const ok = (m) => console.log('OK   ' + m);

/* 1. no unexpanded template placeholders */
const un = (h.match(/\$\{/g) || []).length;
un === 0 ? ok('no unexpanded ${') : fail(`unexpanded \${ : ${un}`);

/* 2. unique ids */
const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
dup.length === 0 ? ok(`ids unique (${ids.length})`) : fail('duplicate ids: ' + dup.join(','));

/* 3. internal anchors resolve */
const hrefs = [...h.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
const missing = [...new Set(hrefs.filter((a) => !ids.includes(a)))];
missing.length === 0 ? ok(`anchors resolve (${new Set(hrefs).size} unique)`)
    : fail('broken anchors: ' + missing.join(','));

/* 4. thirteen numbered sections in order */
const tags = [...h.matchAll(/<span class="tag">(\d+)<\/span>/g)].map((m) => +m[1]);
const want = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
JSON.stringify(tags) === JSON.stringify(want) ? ok('section tags 1..13 in order')
    : fail('section tags: ' + JSON.stringify(tags));

/* 5. figure count and captions present */
const figs = (h.match(/<figure class="shot">/g) || []).length;
figs === 21 ? ok('21 figures') : fail(`figures=${figs}, expected 21`);

/* 6. currency entity, no BDT+digits in the body */
const ent = (h.match(/&#2547;/g) || []).length;
ent > 0 ? ok(`taka entity x${ent}`) : fail('no taka entity');
const bdt = (h.match(/BDT\s*[\d,]/g) || []).length;
bdt === 0 ? ok('no BDT+digits') : fail(`BDT+digits x${bdt}`);

/* 7. feature counts in prose */
const checks = [
    ['Thirteen improvements', /Thirteen improvements/],
    ['13 features pill', /<span>13 features<\/span>/],
    ['nav has 11. Meetings', />11\. Meetings</],
    ['nav has 12. New leads', />12\. New leads/],
    ['nav has 13. Calendar week view', />13\. Calendar week view</],
    ['week title range', /4 Oct 2026 &ndash; 10 Oct 2026/],
];
for (const [label, re] of checks) re.test(h) ? ok(label) : fail(label);

const rows = (h.match(/<td class="num">/g) || []).length;
rows === 13 ? ok('feature table has 13 rows') : fail(`feature table rows=${rows}, expected 13`);

/* 8. labels now present */
for (const s of ['Call Date', 'Call Time', 'Product Services', 'Assigned User', 'Timeline', 'Meetings']) {
    h.includes(s) ? ok(`string present: ${s}`) : fail(`string missing: ${s}`);
}

/* 9. raw field keys must not leak into the UI copy */
for (const s of ['cCallDate', 'cCallTime', 'cProductServices', 'assignedUserId', 'modelDefaultsPreparator']) {
    const n = (h.match(new RegExp(s, 'g')) || []).length;
    n === 0 ? ok(`no raw key ${s}`) : fail(`raw key ${s} x${n}`);
}

/* 10. crude tag balance for block elements */
for (const t of ['div', 'section', 'table', 'ul', 'figure', 'tbody', 'thead', 'tr', 'nav', 'main']) {
    const o = (h.match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length;
    const c = (h.match(new RegExp(`</${t}>`, 'g')) || []).length;
    o === c ? ok(`<${t}> balanced (${o})`) : fail(`<${t}> open=${o} close=${c}`);
}

console.log(`--- ${bad} problems`);
process.exit(bad ? 1 : 0);
