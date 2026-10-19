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

/* 4. fifteen numbered sections in order */
const tags = [...h.matchAll(/<span class="tag">(\d+)<\/span>/g)].map((m) => +m[1]);
const want = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
JSON.stringify(tags) === JSON.stringify(want) ? ok('section tags 1..15 in order')
    : fail('section tags: ' + JSON.stringify(tags));

/* 5. figure count and captions present */
const figs = (h.match(/<figure class="shot">/g) || []).length;
figs === 23 ? ok('23 figures') : fail(`figures=${figs}, expected 23`);

/* 6. currency entity, no BDT+digits in the body */
const ent = (h.match(/&#2547;/g) || []).length;
ent > 0 ? ok(`taka entity x${ent}`) : fail('no taka entity');
const bdt = (h.match(/BDT\s*[\d,]/g) || []).length;
bdt === 0 ? ok('no BDT+digits') : fail(`BDT+digits x${bdt}`);

/* 7. feature counts in prose */
const checks = [
    ['Fifteen improvements', /Fifteen improvements/],
    ['15 features pill', /<span>15 features<\/span>/],
    ['nav has 11. Meetings', />11\. Meetings</],
    ['nav has 12. New records start with you', />12\. New records start with you/],
    ['nav has 13. Calendar week view', />13\. Calendar week view</],
    ['nav has 14. Find a call by its product', />14\. Find a call by its product</],
    ['nav has 15. Meetings remind you too', />15\. Meetings remind you too</],
    ['week title range', /4 Oct 2026 &ndash; 10 Oct 2026/],
    ['Brave push note', /brave:\/\/settings\/privacy/],
    ['Brave push setting', /Use Google services for\s+push messaging/],
    ['product search section', /id="calls-search"/],
    ['product search figure', /Searching the Calls list/],
    ['meeting reminders section', /id="meeting-reminders"/],
    ['meeting reminders figure', /The reminder when a meeting starts/],
    ['meeting prefill in feature 8', /Meetings behave the same/],
    ['meeting prefill dev note', /the same watchers, on the Meeting form/],
    ['five-scope assigned-user prefill', /a product, an account,\s+a call, a meeting or a lead/],
];
for (const [label, re] of checks) re.test(h) ? ok(label) : fail(label);

const rows = (h.match(/<td class="num">/g) || []).length;
rows === 15 ? ok('feature table has 15 rows') : fail(`feature table rows=${rows}, expected 15`);

/* 7b. one collapsed developer note per feature */
const devIds = [...h.matchAll(/<details class="dev" id="dev-([^"]+)"/g)].map((m) => m[1]);
devIds.length === 15 ? ok('15 developer notes') : fail(`developer notes=${devIds.length}, expected 15`);
const secIds = [...h.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
const devMissing = devIds.filter((d) => !secIds.includes(d));
devMissing.length === 0 ? ok('every developer note matches a section')
    : fail('developer notes with no section: ' + devMissing.join(','));
const devOpen = (h.match(/<details class="dev"[^>]*\sopen[ >]/g) || []).length;
devOpen === 0 ? ok('developer notes closed by default') : fail(`developer notes open=${devOpen}`);

/* 8. labels now present */
for (const s of ['Call Date', 'Call Time', 'Product Services', 'Assigned User', 'Timeline', 'Meetings']) {
    h.includes(s) ? ok(`string present: ${s}`) : fail(`string missing: ${s}`);
}

/* 9. raw field keys must not leak into the user-facing copy (developer notes excluded) */
const copy = h.replace(/<details class="dev"[\s\S]*?<\/details>/g, '');
for (const s of ['cCallDate', 'cCallTime', 'cProductServices', 'assignedUserId', 'modelDefaultsPreparator', 'cMeetingReminderNotifiedFor']) {
    const n = (copy.match(new RegExp(s, 'g')) || []).length;
    n === 0 ? ok(`no raw key ${s} in the plain copy`) : fail(`raw key ${s} x${n} in the plain copy`);
}

/* 10. crude tag balance for block elements */
for (const t of ['div', 'section', 'table', 'ul', 'figure', 'tbody', 'thead', 'tr', 'nav', 'main', 'details', 'summary']) {
    const o = (h.match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length;
    const c = (h.match(new RegExp(`</${t}>`, 'g')) || []).length;
    o === c ? ok(`<${t}> balanced (${o})`) : fail(`<${t}> open=${o} close=${c}`);
}

console.log(`--- ${bad} problems`);
process.exit(bad ? 1 : 0);
