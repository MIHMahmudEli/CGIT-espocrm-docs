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

/* 4. eleven numbered sections in order */
const tags = [...h.matchAll(/<span class="tag">(\d+)<\/span>/g)].map((m) => +m[1]);
const want = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
JSON.stringify(tags) === JSON.stringify(want) ? ok('section tags 1..11 in order')
    : fail('section tags: ' + JSON.stringify(tags));

/* 5. figure count and captions present */
const figs = (h.match(/<figure class="shot">/g) || []).length;
figs === 19 ? ok('19 figures') : fail(`figures=${figs}, expected 19`);

/* 6. currency entity, no BDT+digits in the body */
const ent = (h.match(/&#2547;/g) || []).length;
ent > 0 ? ok(`taka entity x${ent}`) : fail('no taka entity');
const bdt = (h.match(/BDT\s*[\d,]/g) || []).length;
bdt === 0 ? ok('no BDT+digits') : fail(`BDT+digits x${bdt}`);

/* 7. feature counts in prose */
const checks = [
    ['Eleven improvements', /Eleven improvements/],
    ['11 features pill', /<span>11 features<\/span>/],
    ['feature table has 11 rows', /<td class="num">11<\/td>/],
    ['nav has 11. Meetings', />11\. Meetings</],
];
for (const [label, re] of checks) re.test(h) ? ok(label) : fail(label);

/* 8. labels now present */
for (const s of ['Call Date', 'Call Time', 'Product Services']) {
    h.includes(s) ? ok(`string present: ${s}`) : fail(`string missing: ${s}`);
}

/* 9. raw field keys must not leak into the UI copy */
for (const s of ['cCallDate', 'cCallTime', 'cProductServices']) {
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
