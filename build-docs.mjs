import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/xampp_lite_8_5/www/espocrm';
const OUT = 'C:/xampp_lite_8_5/www/espocrm-docs';

/* Real EspoCRM screenshots dropped into <OUT>/ss, named after the figure caption.
   When one exists it replaces the hand-built mockup for that figure. */
const SS = (() => {
    try {
        return new Set(
            fs.readdirSync(path.join(OUT, 'ss'))
                .filter((f) => /\.png$/i.test(f))
                .map((f) => f.replace(/\.png$/i, '')),
        );
    } catch {
        return new Set();
    }
})();

const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\s+$/, '');

const code = (label, rel, lines) => {
    let body = read(rel);
    if (lines) {
        const arr = body.split('\n');
        body = arr.slice(lines[0] - 1, lines[1]).join('\n');
    }
    return `<div class="codeblock"><div class="codeblock-h">${esc(label)}</div><pre><code>${esc(body)}</code></pre></div>`;
};

const raw = (label, text) =>
    `<div class="codeblock"><div class="codeblock-h">${esc(label)}</div><pre><code>${esc(text)}</code></pre></div>`;

/* ------------------------------------------------------------------ icons */
const P = {
    bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
    bellOff: 'M13.73 21a2 2 0 0 1-3.46 0M18.63 13A17.9 17.9 0 0 1 18 8M6 8a6 6 0 0 1 9.33-5M2 2l20 20',
    search: 'M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM21 21l-4.35-4.35',
    plus: 'M12 5v14M5 12h14',
    check: 'M20 6L9 17l-5-5',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    cal: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    warn: 'M12 3l10 18H2zM12 9v5M12 17.5v.5',
    filter: 'M3 5h18l-7 8v6l-4 2v-8z',
    chevL: 'M15 18l-6-6 6-6',
    chevR: 'M9 18l6-6-6-6',
    circle: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
};
const ic = (n, size = 14) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;

const num = (n) => `<sup class="ui-num">${n}</sup>`;
const li = (n, t) => `<span><b>${n}</b> ${t}</span>`;

const shot = (cap, body, legend) => {
    const real = SS.has(cap);
    const note = legend
        ? `<div class="ui-annot${real ? ' plain' : ''}">` +
          (real ? legend.replace(/<b>\d+<\/b>\s*/g, '') : legend) +
          `</div>`
        : '';
    return (
        `<figure class="shot"><figcaption class="shot-cap">${cap}</figcaption>` +
        (real
            ? `<img class="sshot" loading="lazy" src="ss/${cap}.png" alt="${esc(cap)}">`
            : body) +
        note +
        `</figure>`
    );
};

/* EspoCRM top bar, reused by every screen so it looks like the real application */
const bar = (crumb, bell) => `
  <div class="ui-top">
    <span class="ui-logo">EspoCRM</span>
    <span class="ui-spacer"></span>
    <span class="ui-ic">${ic('search', 15)}</span>
    <span class="ui-ic">${ic('plus', 15)}</span>
    <span class="ui-ic bell${bell ? ' ring' : ''}">${ic('bell', 15)}${bell ? num(bell) : ''}</span>
    <span class="ui-ic av">A</span>
  </div>
  ${crumb ? `<div class="ui-crumbs">${crumb}</div>` : ''}`;

const buttons = `<span class="ui-btn">Cancel</span><span class="ui-btn pri">${ic('check', 12)} Save</span>`;

/* ================================================================== MOCKUPS */

/* A1 â€” the notification switch */
const A1 = `
<div class="ui">
  ${bar('', 1)}
  <div class="ui-body alt">
    <div class="ui-hd">Notification bell &mdash; every state a user can see ${num(2)}</div>
    <div class="ui-states">
      <div class="st"><span class="st-i g">${ic('bellOff', 20)}</span><b>Off</b><i>Enable notifications</i></div>
      <div class="st"><span class="st-i on">${ic('bell', 20)}</span><b>On</b><i>Notifications on</i></div>
      <div class="st"><span class="st-i bad">${ic('bellOff', 20)}</span><b>Blocked</b><i>Notifications blocked</i></div>
      <div class="st"><span class="st-i g">${ic('bellOff', 20)}</span><b>Not set up</b><i>Not configured</i></div>
      <div class="st"><span class="st-i g">${ic('bellOff', 20)}</span><b>Not supported</b><i>Not supported</i></div>
      <div class="st"><span class="st-i busy">&#8635;</span><b>Working</b><i>Please wait&hellip;</i></div>
    </div>
  </div>
</div>`;

/* A2 â€” the desktop notification */
const A2 = `
<div class="ui desk">
  <div class="desk-bg"></div>
  <div class="desk-toast">
    <span class="desk-ic">${ic('bell', 16)}</span>
    <div class="desk-txt"><b>EspoCRM ${num(1)}</b><span>Call reminder &mdash; MIH Jihad ${num(2)}</span><em>Call starts at 10:30 AM</em></div>
    <span class="desk-time">now</span>
  </div>
  <div class="desk-toast dim">
    <span class="desk-ic g">${ic('mail', 16)}</span>
    <div class="desk-txt"><b>EspoCRM</b><span>New email from Mohsin Eli</span></div>
    <span class="desk-time">2 min</span>
  </div>
</div>`;

/* B â€” history before / after */
const row = (icon, cls, title, meta) => `
  <li><span class="ui-ico ${cls}">${ic(icon, 13)}</span>
    <span class="ui-h"><span class="ui-h-t">${title}</span><span class="ui-h-m">${meta}</span></span></li>`;

const B = `
<div class="ui">
  ${bar('Leads &nbsp;&rsaquo;&nbsp; MIH Jihad')}
  <div class="ba">
    <div class="ba-c">
      <div class="ba-h">History <span class="ba-tag">before</span></div>
      <ul class="ui-hist">
        ${row('mail', '', 'Re: Quotation for X', 'Email &middot; 01 Oct 2026, 09:12 AM')}
        ${row('phone', '', 'TestX', 'Call &middot; 30 Sep 2026, 03:40 PM')}
        ${row('cal', 'mut', 'Weekly sync', 'Meeting &middot; 28 Sep 2026, 11:00 AM')}
        ${row('mail', '', 'Re: Follow up', 'Email &middot; 27 Sep 2026, 05:05 PM')}
        ${row('phone', '', 'test Y', 'Call &middot; 25 Sep 2026, 02:15 PM')}
      </ul>
    </div>
    <div class="ba-c">
      <div class="ba-h">History <span class="ba-tag on">${ic('filter', 11)} Product Services: X ${num(1)}</span></div>
      <ul class="ui-hist">
        ${row('phone', '', 'TestX', 'Call &middot; 30 Sep 2026, 03:40 PM')}
      </ul>
      <div class="ba-drop">${num(2)}
        <span class="gone">Re: Quotation for X &mdash; Email</span>
        <span class="gone">Weekly sync &mdash; Meeting</span>
        <span class="gone">Re: Follow up &mdash; Email</span>
        <span class="gone">test Y &mdash; Call for another product ${num(3)}</span>
      </div>
    </div>
  </div>
</div>`;

/* C1 / L1 - the call form, using the layout the application really has:
   Name + Parent, Status + Direction, Date Start + Date End,
   Duration + Product Services, Call Date + Call Time, Description. */
const callForm = (m = {}) => `
<div class="ui">
  ${bar('Calls &nbsp;&rsaquo;&nbsp; New Call')}
  <div class="ui-body">
    <div class="ui-card">
      <div class="ui-card-h">New Call <span class="ui-actions"><span class="ui-btn">Cancel</span>
        <span class="ui-btn pri">${ic('check', 12)} Save${m.save ? ' ' + m.save : ''}</span></span></div>
      <div class="ui-card-b">
        <div class="ui-row">
          <div class="ui-field"><span class="ui-lab">Name ${m.name || ''}</span>
            <div class="ui-in${m.nameFlash ? ' flash' : ''}">MIH Jihad</div></div>
          <div class="ui-field"><span class="ui-lab">Parent ${m.parent || ''}</span>
            <div class="ui-in link">MIH Jihad <span class="ui-mag">${ic('search', 13)}</span></div></div>
        </div>
        <div class="ui-row">
          <div class="ui-field"><span class="ui-lab">Status</span>
            <div class="ui-in"><span class="bdg">Planned</span></div></div>
          <div class="ui-field"><span class="ui-lab">Direction</span>
            <div class="ui-in">Outbound <span class="ui-mag">&#9662;</span></div></div>
        </div>
        <div class="ui-row">
          <div class="ui-field"><span class="ui-lab">Date Start</span>
            <div class="ui-pair">
              <div class="ui-in">02/10/2026 <span class="ui-mag">${ic('cal', 13)}</span></div>
              <div class="ui-in">03:57 PM <span class="ui-mag">${ic('clock', 13)}</span></div>
            </div></div>
          <div class="ui-field"><span class="ui-lab">Date End</span>
            <div class="ui-pair">
              <div class="ui-in">02/10/2026 <span class="ui-mag">${ic('cal', 13)}</span></div>
              <div class="ui-in">04:02 PM <span class="ui-mag">${ic('clock', 13)}</span></div>
            </div></div>
        </div>
        <div class="ui-row">
          <div class="ui-field"><span class="ui-lab">Duration</span>
            <div class="ui-in">5m <span class="ui-mag">&#9662;</span></div></div>
          <div class="ui-field"><span class="ui-lab">Product Services ${m.ps || ''} <span class="req">*</span></span>
            <div class="ui-in filled">${m.chip || ''}
              <span class="ui-mag">${ic('search', 13)}</span></div></div>
        </div>
        <div class="ui-row">
          <div class="ui-field"><span class="ui-lab">Call Date ${m.date || ''} <span class="req">*</span></span>
            <div class="ui-in${m.dateFlash ? ' flash' : ''}">02/10/2026 <span class="ui-mag">${ic('cal', 13)}</span></div>
            ${m.dateHint ? `<div class="ui-hint">${m.dateHint}</div>` : ''}</div>
          <div class="ui-field"><span class="ui-lab">Call Time ${m.time || ''} <span class="req">*</span></span>
            <div class="ui-pair">
              <div class="ui-in${m.timeFlash ? ' flash' : ''}">02/10/2026 <span class="ui-mag">${ic('cal', 13)}</span></div>
              <div class="ui-in${m.timeFlash ? ' flash' : ''}">03:57 PM <span class="ui-mag">${ic('clock', 13)}</span></div>
            </div>
            ${m.timeHint ? `<div class="ui-hint">${m.timeHint}</div>` : ''}</div>
        </div>
        <div class="ui-field wide"><span class="ui-lab">Description ${m.descLabel || ''}${m.descReq ? ' <span class="req">*</span>' : ''}</span>
          <div class="ui-in tall${m.descFlash ? ' flash' : ''}${m.descReq ? ' req' : ''}${m.descText ? '' : ' mute'}">${m.descText ||
              'Add notes about this call&hellip;'}</div>
          ${m.descError ? `<div class="ui-err">${ic('warn', 12)} ${m.descError}</div>` : ''}</div>
      </div>
    </div>
  </div>
</div>`;

const C1 = callForm({
    name: num(1),
    nameFlash: true,
    parent: num(2),
    ps: num(3),
    chip: '<span class="ui-chip">X <span class="x">&times;</span></span>',
});

/* C2 â€” the selection popup */
const C2 = `
<div class="ui">
  ${bar('Calls &nbsp;&rsaquo;&nbsp; New Call')}
  <div class="ui-overlay">
    <div class="ui-modal">
      <div class="ui-modal-h">Select Product Service <span class="x">&times;</span></div>
      <div class="ui-modal-b">
        <div class="ui-modal-msg">This lead (<b>MIH Jihad</b>) is linked to more than one
        product service. Select the one(s) to add to this call. ${num(1)}</div>
        <ul class="ui-list">
          <li><input type="checkbox" checked class="cb">${num(2)}<a>X</a><span class="ui-sub">Software</span></li>
          <li><input type="checkbox" class="cb"><a>${num(3)}Y</a><span class="ui-sub">Hardware</span></li>
        </ul>
      </div>
      <div class="ui-modal-f"><span class="ui-btn">Cancel</span><span class="ui-btn pri">Select</span></div>
    </div>
  </div>
</div>`;

/* D â€” duplicate */
/* D - the form a Duplicate opens: everything carried over, description empty */
const D = callForm({
    parent: num(1),
    ps: num(2),
    descLabel: num(3),
    descReq: true,
    descError: 'Description is required.',
    chip: '<span class="ui-chip">X <span class="x">&times;</span></span>',
});

/* E â€” dates and times */
const dtRow = (label, before, after) =>
    `<tr><td>${label}</td><td class="mono">${before}</td><td class="mono now">${after}</td></tr>`;

const E = `
<div class="ui plain">
  <table class="dt">
    <thead><tr><th>Where you see it</th><th>Before</th><th>Now ${num(1)}</th></tr></thead>
    <tbody>
      ${dtRow('A date you type into a form', '01.10.2026', '01/10/2026')}
      ${dtRow('A date field while you edit it', '01.10.2026', '01/10/2026')}
      ${dtRow('An afternoon time', '14:30', '02:30 PM')}
      ${dtRow('Midnight', '00:00', '12:00 AM')}
      ${dtRow('Noon', '12:00', '12:00 PM')}
      ${dtRow('Date and time together, in a form', '01.10.2026 14:30', '01/10/2026 02:30 PM')}
      ${dtRow('The calendar', '01.10.2026 14:30', '01/10/2026 02:30 PM')}
      ${dtRow('A reminder', 'Call starts at 14:30', 'Call starts at 02:30 PM')}
    </tbody>
  </table>
</div>`;

/* F â€” meeting */
const F = `
<div class="ui">
  ${bar('Meetings &nbsp;&rsaquo;&nbsp; New Meeting')}
  <div class="ui-body two">
    <div class="ui-main">
      <div class="ui-card">
        <div class="ui-card-h">New Meeting <span class="ui-actions">${buttons}</span></div>
        <div class="ui-card-b">
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Parent ${num(1)}</span>
              <div class="ui-in link">Delta Trading Co. <span class="ui-mag">${ic('search', 13)}</span></div></div>
            <div class="ui-field"><span class="ui-lab">Name ${num(2)}</span>
              <div class="ui-in flash">Delta Trading Co. <span class="ui-badge">auto-filled</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Status</span>
              <div class="ui-in">Planned <span class="ui-mag">&#9662;</span></div></div>
            <div class="ui-field"><span class="ui-lab">Start Date</span>
              <div class="ui-in">02/10/2026 <span class="ui-mag">${ic('cal', 13)}</span></div></div>
            <div class="ui-field"><span class="ui-lab">Start Time</span>
              <div class="ui-in">11:00 AM <span class="ui-mag">${ic('clock', 13)}</span></div></div>
          </div>
          <div class="ui-field wide"><span class="ui-lab">Description</span>
            <div class="ui-in tall mute">Add notes about this meeting&hellip;</div></div>
        </div>
      </div>
    </div>
    <div class="ui-side">
      <div class="ui-card">
        <div class="ui-card-h">${ic('users', 13)} Attendance ${num(3)}</div>
        <div class="ui-card-b">
          <span class="ui-lab">Users</span>
          <div class="ui-in filled"><span class="ui-chip">Admin (You) <span class="x">&times;</span></span></div>
          <div class="ui-col">
            <span class="ui-lab">Status</span>
            <div class="ui-in">None <span class="ui-mag">&#9662;</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

/* =================================================== Product Service entity */

/* G1 â€” the catalogue list */
const G1 = `
<div class="ui">
  ${bar('')}
  <div class="ui-ltop">
    <span class="ui-ltitle">Product Services <span class="cnt">2</span> ${num(1)}</span>
    <span class="ui-spacer"></span>
    <span class="ui-srch">${ic('search', 13)} Searchâ€¦</span>
    <span class="ui-btn pri">${ic('plus', 12)} Add Product Service ${num(3)}</span>
  </div>
  <div class="ui-lwrap">
  <table class="lt">
    <thead><tr><th>Name</th><th>Category</th><th>Type</th><th>Price</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td class="lk">Y ${num(2)}</td><td>Software</td><td>Product</td>
          <td class="r">&#2547;30,000.00</td><td><span class="bdg ok">Active</span></td></tr>
      <tr><td class="lk">X</td><td>Software</td><td>Product</td>
          <td class="r">&#2547;20,000.00</td><td><span class="bdg ok">Active</span></td></tr>
    </tbody>
  </table>
  </div>
</div>`;

/* G2 â€” a product service record */
const G2 = `
<div class="ui">
  ${bar('Product Services &nbsp;&rsaquo;&nbsp; Y')}
  <div class="ui-body two">
    <div class="ui-main">
      <div class="ui-rhead">
        <span class="ui-rtitle">Y</span>
        <span class="ui-actions"><span class="ui-btn">Edit</span><span class="ui-btn">&hellip;</span></span>
      </div>
      <div class="ui-card">
        <div class="ui-card-h">Overview ${num(1)}</div>
        <div class="ui-card-b">
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Name</span>
              <div class="ui-in">Y</div></div>
            <div class="ui-field"><span class="ui-lab">Price</span>
              <div class="ui-in">&#2547;30,000.00</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Category</span>
              <div class="ui-in">Software <span class="ui-mag">&#9662;</span></div></div>
            <div class="ui-field"><span class="ui-lab">Status</span>
              <div class="ui-in">Active <span class="ui-mag">&#9662;</span></div></div>
            <div class="ui-field"><span class="ui-lab">Type</span>
              <div class="ui-in">Product <span class="ui-mag">&#9662;</span></div></div>
          </div>
        </div>
      </div>
      <div class="ui-card" style="margin-top:14px">
        <div class="ui-card-h">Description</div>
        <div class="ui-card-b">
          <div class="ui-in tall mute">No description&hellip;</div>
        </div>
      </div>
    </div>
    <div class="ui-side">
      <div class="ui-card">
        <div class="ui-card-h">${ic('users', 13)} Leads <span class="cnt">1</span></div>
        <ul class="ui-hist">
          <li><span class="ui-ico">${ic('users', 13)}</span>
            <span class="ui-h"><span class="ui-h-t">MIH Jihad</span>
            <span class="ui-h-m">Status &middot; New</span></span></li>
        </ul>
      </div>
      <div class="ui-card" style="margin-top:14px">
        <div class="ui-card-h">${ic('phone', 13)} Calls <span class="cnt">2</span></div>
        <ul class="ui-hist">
          <li><span class="ui-ico">${ic('phone', 13)}</span>
            <span class="ui-h"><span class="ui-h-t">TestX</span>
            <span class="ui-h-m">30 Sep 2026, 03:40 PM</span></span></li>
          <li><span class="ui-ico">${ic('phone', 13)}</span>
            <span class="ui-h"><span class="ui-h-t">Mohsin Eli</span>
            <span class="ui-h-m">01 Oct 2026, 04:20 PM</span></span></li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

/* G3 â€” a lead record showing the product-service field */
const G3 = `
<div class="ui">
  ${bar('Leads &nbsp;&rsaquo;&nbsp; MIH Jihad')}
  <div class="ui-body two">
    <div class="ui-main">
      <div class="ui-rhead">
        <span class="ui-rtitle">MIH Jihad</span>
        <span class="ui-actions"><span class="ui-btn">Edit</span><span class="ui-btn">&hellip;</span></span>
      </div>
      <div class="ui-card">
        <div class="ui-card-h">Overview</div>
        <div class="ui-card-b">
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Name</span>
              <div class="ui-in link">MIH Jihad</div></div>
            <div class="ui-field"><span class="ui-lab">Account Name</span>
              <div class="ui-in mute">&mdash;</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Email</span>
              <div class="ui-in mute">&mdash;</div></div>
            <div class="ui-field"><span class="ui-lab">Phone</span>
              <div class="ui-in mute">&mdash;</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Product Services ${num(1)}</span>
              <div class="ui-in filled"><span class="ui-chip">X <span class="x">&times;</span></span>
              <span class="ui-mag">${ic('search', 13)}</span></div></div>
            <div class="ui-field"><span class="ui-lab">Website</span>
              <div class="ui-in mute">&mdash;</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field wide"><span class="ui-lab">Address</span>
              <div class="ui-in mute">&mdash;</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui-side">
      <div class="ui-card">
        <div class="ui-card-h">Details</div>
        <div class="ui-card-b">
          <span class="ui-lab">Status</span>
          <div class="ui-in">New <span class="ui-mag">&#9662;</span></div>
          <div class="ui-col"><span class="ui-lab">Source</span>
            <div class="ui-in mute">&mdash;</div></div>
        </div>
      </div>
    </div>
  </div>
</div>`;

/* ============================================= lead list search & filters */

const leadListHead = `
  <thead><tr><th>Name</th><th>Status</th><th>Email</th>
  <th>Assigned To</th><th>Created At</th></tr></thead>`;

/* G4 â€” searching the list with a phone number */
const G4 = `
<div class="ui">
  ${bar('Leads')}
  <div class="ui-search">
    <div class="ui-sgrp">
      <span class="ui-sin">01716099707 ${num(1)}</span>
      <span class="ui-sbtn">${ic('search', 13)}</span>
      <span class="ui-sbtn last">&#8942;</span>
    </div>
  </div>
  <div class="ui-ltop">
    <span class="ui-btn">Actions</span>
    <span class="ui-spacer"></span>
    <span class="ui-total">1 record found ${num(2)}</span>
  </div>
  <div class="ui-lwrap">
    <table class="lt">
      ${leadListHead}
      <tbody>
        <tr><td class="lk">Mohsin Eli ${num(3)}</td><td><span class="bdg ok">New</span></td>
            <td>&mdash;</td><td>Admin</td><td>18 Sep 03:42 PM</td></tr>
      </tbody>
    </table>
  </div>
</div>`;

/* G5 â€” the Add Field menu, Product Services put first */
const G5 = `
<div class="ui">
  ${bar('Leads')}
  <div class="ui-search">
    <div class="ui-sgrp">
      <span class="ui-sin ph">Search&hellip;</span>
      <span class="ui-sbtn">${ic('search', 13)}</span>
      <span class="ui-sbtn last">&#8942; ${num(1)}</span>
      <div class="ui-menu">
        <div class="hdr">Add Field ${num(2)}</div>
        <div class="qbox">${ic('search', 12)} Find a field&hellip;</div>
        <ul>
          <li class="hi"><span class="mi">Product Services ${num(3)}</span></li>
          <li><span class="mi">Assigned To</span></li>
          <li><span class="mi">Teams</span></li>
          <li><span class="mi">Created At</span></li>
          <li><span class="mi">Created By</span></li>
          <li><span class="mi">Modified At</span></li>
          <li><span class="mi">Updated At</span></li>
          <li><span class="mi">Address</span></li>
          <li><span class="mi">Account Name</span></li>
          <li><span class="mi">Email</span></li>
          <li><span class="mi">Phone</span></li>
          <li><span class="mi">Status</span></li>
          <li><span class="mi">Source</span></li>
          <li><span class="mi">Industry</span></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="ui-ltop">
    <span class="ui-btn">Actions</span>
    <span class="ui-spacer"></span>
    <span class="ui-total">2 records found</span>
  </div>
  <div class="ui-lwrap">
    <table class="lt">
      ${leadListHead}
      <tbody>
        <tr><td class="lk">MIH Jihad</td><td><span class="bdg ok">New</span></td>
            <td>&mdash;</td><td>&mdash;</td><td>18 Sep 03:44 PM</td></tr>
        <tr><td class="lk">Mohsin Eli</td><td><span class="bdg ok">New</span></td>
            <td>&mdash;</td><td>Admin</td><td>18 Sep 03:42 PM</td></tr>
      </tbody>
    </table>
  </div>
</div>`;

/* G6 â€” the filter applied, list narrowed to one product */
const G6 = `
<div class="ui">
  ${bar('Leads')}
  <div class="ui-search">
    <div class="ui-sgrp">
      <span class="ui-sin ph">Search&hellip;</span>
      <span class="ui-sbtn">${ic('search', 13)}</span>
      <span class="ui-sbtn last">&#8942;</span>
    </div>
  </div>
  <div class="ui-adv">
    <div class="ui-fbox">
      <span class="ui-lab">Product Services ${num(1)}</span>
      <div class="ui-in filled"><span class="ui-chip">Y <span class="x">&times;</span></span>
        <span class="ui-mag">${ic('search', 13)}</span></div>
    </div>
  </div>
  <div class="ui-ltop">
    <span class="ui-btn">Actions</span>
    <span class="ui-spacer"></span>
    <span class="ui-total">1 record found ${num(2)}</span>
  </div>
  <div class="ui-lwrap">
    <table class="lt">
      ${leadListHead}
      <tbody>
        <tr><td class="lk">Mohsin Eli ${num(3)}</td><td><span class="bdg ok">New</span></td>
            <td>&mdash;</td><td>Admin</td><td>18 Sep 03:42 PM</td></tr>
      </tbody>
    </table>
  </div>
</div>`;

/* ================================== lead form: amount filled from the price */

const leadForm = (chips, amount, side, mk) => {
    const mark = mk || num;

    return `
<div class="ui">
  ${bar('Leads &nbsp;&rsaquo;&nbsp; New Lead')}
  <div class="ui-body two">
    <div class="ui-main">
      <div class="ui-card">
        <div class="ui-card-h">Overview <span class="ui-actions">${buttons}</span></div>
        <div class="ui-card-b">
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Name</span>
              <div class="ui-in">Mohsin Eli</div></div>
            <div class="ui-field"><span class="ui-lab">Account Name</span>
              <div class="ui-in mute">Enter account name&hellip;</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Email</span>
              <div class="ui-in mute">Enter email address&hellip;</div></div>
            <div class="ui-field"><span class="ui-lab">Phone</span>
              <div class="ui-in mute">Enter phone number&hellip;</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Product Services ${mark(1)}</span>
              <div class="ui-in filled">${chips}
              <span class="ui-mag">${ic('search', 13)}</span></div></div>
            <div class="ui-field"><span class="ui-lab">Website</span>
              <div class="ui-in mute">https://&hellip;</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field wide"><span class="ui-lab">Address</span>
              <div class="ui-in mute">Enter address&hellip;</div></div>
          </div>
        </div>
      </div>
      <div class="ui-card" style="margin-top:14px">
        <div class="ui-card-h">Details</div>
        <div class="ui-card-b">
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Status</span>
              <div class="ui-in">New <span class="ui-mag">&#9662;</span></div></div>
            <div class="ui-field"><span class="ui-lab">Source</span>
              <div class="ui-in mute">Select&hellip; <span class="ui-mag">&#9662;</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Opportunity Amount ${mark(2)}</span>
              <div class="ui-cur"><span class="in flash">${amount}</span><span class="ad">BDT</span></div>
              ${mark(3) ? `<div style="margin-top:7px"><span class="ui-badge">auto-filled ${mark(3)}</span></div>` : ''}</div>
            <div class="ui-field"><span class="ui-lab">Campaign</span>
              <div class="ui-in mute">Select&hellip; <span class="ui-mag">&#9662;</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Industry</span>
              <div class="ui-in mute">Select&hellip; <span class="ui-mag">&#9662;</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field wide"><span class="ui-lab">Description</span>
              <div class="ui-in tall mute">Add notes about this lead&hellip;</div></div>
          </div>
        </div>
      </div>
    </div>
${side || ''}  </div>
</div>`;
};

/* H1 — one product chosen */
const H1 = leadForm('<span class="ui-chip">X <span class="x">&times;</span></span>', '20,000.00');

/* H2 — a second product added, prices added together */
const H2 = leadForm(
    '<span class="ui-chip">X <span class="x">&times;</span></span>' +
    '<span class="ui-chip">Y <span class="x">&times;</span></span>',
    '50,000.00');

/* M1 — the right-hand column of a new lead, owner already set */
const M1 = leadForm(
    '<span class="ui-chip">X <span class="x">&times;</span></span>',
    '20,000.00',
    `
    <div class="ui-side">
      <div class="ui-card">
        <div class="ui-card-b">
          <span class="ui-lab">Assigned User ${num(1)}</span>
          <div class="ui-in filled">Admin (You) <span class="ui-mag">&#9662;</span></div>
          <div style="margin-top:14px"><span class="ui-lab">Teams ${num(2)}</span>
            <div class="ui-in mute">Add team&hellip;</div></div>
        </div>
      </div>
    </div>
`,
    () => '');

/* ========================================================== calendar: week */
const calHead = (dow, dom, today) =>
    `<div class="cal-hc${today ? ' today' : ''}"><div class="cal-day-header">` +
    `<span class="cal-dow">${dow}</span><span class="cal-dom">${dom}</span></div></div>`;

const calCell = (inner = '', today) =>
    `<div class="cal-c${today ? ' today' : ''}">${inner}</div>`;

const calChip = (icon, text) =>
    `<span class="cal-chip">${ic(icon, 9)}<span class="cal-chip-text">${text}</span></span>`;

const calEv = (bg, time, title, extra, mark) => `
          <div class="cal-ev" style="background:${bg}">
            <div class="cal-ev-frame">
              <div class="cal-ev-time">${time}</div>
              <div class="cal-ev-titles">
                <div class="cal-ev-title">${title}${mark ? ' ' + num(mark) : ''}</div>${extra || ''}
              </div>
            </div>
          </div>`;

const MEET = '#558bbd';
const CALL = '#cf605d';
const TASK = '#70c173';

const calUser = (name) => `<div class="cal-ev-user"><span class="av">A</span><span>${name}</span></div>`;

/* CAL — the agenda week, redrawn to match the month view */
const CAL = `
<div class="ui cal-ui">
  ${bar('')}
  <div class="ui-ctb">
    <span class="cgrp">
      <span class="cbtn sq">${ic('chevL', 13)}</span>
      <span class="cbtn sq">${ic('chevR', 13)}</span>
      <span class="cbtn">Today</span>
    </span>
    <span class="ctb-title">4 Oct 2026 &ndash; 10 Oct 2026 ${num(1)}</span>
    <span class="ctb-modes">
      <span class="cbtn">Month</span>
      <span class="cbtn on">Week ${num(3)}</span>
      <span class="cbtn">Timeline</span>
      <span class="cbtn sq">&hellip;</span>
    </span>
  </div>
  <div class="cal">
    <div class="cal-head">
      <div class="cal-gut"></div>
      ${calHead('Sun', '4')}
      ${calHead('Mon', '5', true)}
      ${calHead('Tue', '6')}
      ${calHead('Wed', '7')}
      ${calHead('Thu', '8')}
      ${calHead('Fri', '9')}
      ${calHead('Sat', '10')}
    </div>
    <div class="cal-body">
      <div class="cal-row">
        <div class="cal-time">9:00AM</div>
        ${calCell()}
        ${calCell(calEv(CALL, '9:00 AM', 'Mohsin Eli', '', 5), true)}
        ${calCell()}
        ${calCell(calEv(TASK, '9:00 AM', 'Send quotation',
            calChip('check', 'Tasks') + calChip('check', 'Completed')))}
        ${calCell()}
        ${calCell()}
        ${calCell()}
      </div>
      <div class="cal-row">
        <div class="cal-time">10:00AM</div>
        ${calCell()}
        ${calCell(calEv(MEET, '10:00 AM', 'Delta Trading Co.',
            calChip('cal', 'Meetings') + calChip('circle', 'Planned') + calUser('Admin'),
            4), true)}
        ${calCell()}
        ${calCell()}
        ${calCell()}
        ${calCell(calEv(MEET, '10:00 AM', 'Product demo',
            calChip('cal', 'Meetings') + calChip('circle', 'Planned')))}
        ${calCell()}
      </div>
      <div class="cal-row">
        <div class="cal-time">11:00AM</div>
        ${calCell()}
        ${calCell('', true)}
        ${calCell()}
        ${calCell()}
        ${calCell(calEv(CALL, '11:00 AM', 'TestX'))}
        ${calCell()}
        ${calCell()}
      </div>
      <div class="cal-row">
        <div class="cal-time">12:00PM</div>
        ${calCell()}
        ${calCell(calEv(CALL, '12:00 PM', 'MIH Jihad'), true)}
        ${calCell()}
        ${calCell()}
        ${calCell()}
        ${calCell()}
        ${calCell()}
      </div>
      <div class="cal-row">
        <div class="cal-time">1:00PM</div>
        ${calCell()}
        ${calCell()}
        ${calCell()}
        ${calCell(calEv(MEET, '1:00 PM', 'Site visit',
            calChip('cal', 'Meetings') + calChip('circle', 'Planned')))}
        ${calCell()}
        ${calCell()}
        ${calCell()}
      </div>
    </div>
  </div>
</div>`;

/* ================================================ calls: the product shown */

/* K1 - the Calls list, with the Product Services column added */
const K1 = `
<div class="ui">
  ${bar('Calls')}
  <div class="ui-search">
    <div class="ui-sgrp">
      <span class="ui-sin ph">Search&hellip;</span>
      <span class="ui-sbtn">${ic('search', 13)}</span>
      <span class="ui-sbtn last">&#8942;</span>
    </div>
  </div>
  <div class="ui-ltop">
    <span class="ui-btn">Actions</span>
    <span class="ui-spacer"></span>
    <span class="ui-total">13 records found</span>
  </div>
  <div class="ui-lwrap">
    <table class="lt">
      <thead><tr><th>Name ${num(1)}</th><th>Parent</th>
        <th>Product Services ${num(2)}</th>
        <th>Status</th><th>Date Start</th><th>Assigned User</th></tr></thead>
      <tbody>
        <tr><td class="lk">Mohsin Eli</td><td>Mohsin Eli</td><td>Y ${num(3)}</td>
            <td><span class="bdg">Planned</span></td><td>Today 04:00 PM</td><td>Admin</td></tr>
        <tr><td class="lk">Mohsin Eli</td><td>Mohsin Eli</td><td>X</td>
            <td><span class="bdg">Planned</span></td><td>Yesterday 10:34 AM</td><td>Admin</td></tr>
        <tr><td class="lk">MIH Jihad</td><td>MIH Jihad</td><td>X</td>
            <td><span class="bdg">Planned</span></td><td>Yesterday 09:26 AM</td><td>Admin</td></tr>
      </tbody>
    </table>
  </div>
</div>`;

/* K1s - the same list, with a product name typed into the search box */
const K1s = `
<div class="ui">
  ${bar('Calls')}
  <div class="ui-search">
    <div class="ui-sgrp">
      <span class="ui-sin">Y ${num(1)}</span>
      <span class="ui-sbtn">${ic('search', 13)}</span>
      <span class="ui-sbtn last">&#8942;</span>
    </div>
  </div>
  <div class="ui-ltop">
    <span class="ui-btn">Actions</span>
    <span class="ui-spacer"></span>
    <span class="ui-total">3 records found ${num(3)}</span>
  </div>
  <div class="ui-lwrap">
    <table class="lt">
      <thead><tr><th>Name</th><th>Parent</th><th>Product Services</th>
        <th>Status</th><th>Date Start</th><th>Assigned User</th></tr></thead>
      <tbody>
        <tr><td class="lk">Mohsin Eli</td><td>Mohsin Eli</td><td>Y</td>
            <td><span class="bdg">Planned</span></td><td>Today 04:00 PM</td><td>Admin</td></tr>
        <tr><td class="lk">Mohsin Eli</td><td>Mohsin Eli</td><td>Y, X ${num(2)}</td>
            <td><span class="bdg">Planned</span></td><td>Yesterday 10:34 AM</td><td>Admin</td></tr>
        <tr><td class="lk">Mohsin Eli</td><td>Mohsin Eli</td><td>Y</td>
            <td><span class="bdg">Planned</span></td><td>Yesterday 09:20 AM</td><td>Admin</td></tr>
      </tbody>
    </table>
  </div>
</div>`;

/* MR1 — the meeting reminder toast */
const MR1 = `
<div class="ui desk">
  <div class="desk-bg"></div>
  <div class="desk-toast">
    <span class="desk-ic">${ic('bell', 16)}</span>
    <div class="desk-txt"><b>EspoCRM ${num(1)}</b><span>Meeting Reminder &mdash; Weekly sync ${num(2)}</span><em>Starting now &mdash; join the meeting</em></div>
    <span class="desk-time">now</span>
  </div>
</div>`;

/* LS1 — the lead form's Details panel with the new source and phone label */
const LS1 = `
<div class="ui">
  <div class="ui-card">
    <div class="ui-card-h">Details</div>
    <div class="ui-card-b">
      <div class="ui-row">
        <div class="ui-field"><span class="ui-lab">Source ${num(1)}</span>
          <div class="ui-in filled">Facebook <span class="ui-mag">&#9662;</span></div></div>
        <div class="ui-field"><span class="ui-lab">Status</span>
          <div class="ui-in">New <span class="ui-mag">&#9662;</span></div></div>
      </div>
      <div class="ui-row">
        <div class="ui-field"><span class="ui-lab">Phone ${num(2)}</span>
          <div class="ui-in filled"><span class="ui-badge">Whatsapp</span> +880 1711 000000</div></div>
      </div>
    </div>
  </div>
</div>`;

/* MK1 - the Meetings list, with the Product Services column */
const MK1 = `
<div class="ui">
  ${bar('Meetings')}
  <div class="ui-search">
    <div class="ui-sgrp">
      <span class="ui-sin ph">Search&hellip;</span>
      <span class="ui-sbtn">${ic('search', 13)}</span>
      <span class="ui-sbtn last">&#8942;</span>
    </div>
  </div>
  <div class="ui-ltop">
    <span class="ui-btn">Actions</span>
    <span class="ui-spacer"></span>
    <span class="ui-total">2 records found</span>
  </div>
  <div class="ui-lwrap">
    <table class="lt">
      <thead><tr><th>Name ${num(1)}</th><th>Parent</th>
        <th>Product Services ${num(2)}</th>
        <th>Status</th><th>Date Start</th><th>Assigned User</th></tr></thead>
      <tbody>
        <tr><td class="lk">Weekly sync</td><td>Mohsin Eli</td><td>Y ${num(3)}</td>
            <td><span class="bdg">Planned</span></td><td>Today 11:00 AM</td><td>Admin</td></tr>
        <tr><td class="lk">Quarterly review</td><td>MIH Jihad</td><td>X</td>
            <td><span class="bdg">Held</span></td><td>Yesterday 03:00 PM</td><td>Admin</td></tr>
      </tbody>
    </table>
  </div>
</div>`;

/* K2 / L2 - one kind of record, two different things pointed out */
const callRecord = (m = {}) => {
    const who = m.who || 'Mohsin Eli';
    const product = m.product || 'Y';

    return `
<div class="ui">
  ${bar('Calls &nbsp;&rsaquo;&nbsp; ' + who)}
  <div class="ui-body two">
    <div class="ui-main">
      <div class="ui-rhead">
        <span class="ui-rtitle">${who}</span>
        <span class="ui-actions"><span class="ui-btn">Edit</span><span class="ui-btn">&hellip;</span></span>
      </div>
      <div class="ui-card">
        <div class="ui-card-h">Overview</div>
        <div class="ui-card-b">
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Name</span>
              <div class="ui-in link">${who}</div></div>
            <div class="ui-field"><span class="ui-lab">Parent</span>
              <div class="ui-in link">${who} <span class="ui-mag">${ic('search', 13)}</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Status</span>
              <div class="ui-in"><span class="bdg">Planned</span></div></div>
            <div class="ui-field"><span class="ui-lab">Direction</span>
              <div class="ui-in">Outbound <span class="ui-mag">&#9662;</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Date Start</span>
              <div class="ui-in">${m.start || 'Today 04:00 PM'}</div></div>
            <div class="ui-field"><span class="ui-lab">Date End</span>
              <div class="ui-in">${m.end || 'Today 04:05 PM'}</div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Duration ${m.durMark || ''}</span>
              <div class="ui-in">${m.dur || '5m'}</div></div>
            <div class="ui-field"><span class="ui-lab">Product Services ${m.ps || ''} <span class="req">*</span></span>
              <div class="ui-in filled"><span class="ui-chip">${product} <span class="x">&times;</span></span>
                <span class="ui-mag">${ic('search', 13)}</span></div></div>
          </div>
          <div class="ui-row">
            <div class="ui-field"><span class="ui-lab">Call Date ${m.date || ''} <span class="req">*</span></span>
              <div class="ui-in">Today</div></div>
            <div class="ui-field"><span class="ui-lab">Call Time ${m.time || ''} <span class="req">*</span></span>
              <div class="ui-in">Today ${m.timeAt || '03:57 PM'}</div></div>
          </div>
          <div class="ui-field wide"><span class="ui-lab">Description</span>
            <div class="ui-in tall">${m.desc || 'test Y again'}</div></div>
        </div>
      </div>
    </div>
    <div class="ui-side">
      <div class="ui-card">
        <div class="ui-card-h">${ic('users', 13)} Attendees</div>
        <div class="ui-card-b">
          <div class="ui-in filled">Admin <span class="ui-mag">&#9662;</span></div>
        </div>
      </div>
      <div class="ui-card" style="margin-top:14px">
        <div class="ui-card-h">History <span class="cnt">1</span></div>
        <ul class="ui-hist">
          <li><span class="ui-ico">${ic('phone', 13)}</span>
            <span class="ui-h"><span class="ui-h-t">${m.desc || 'test Y again'}</span>
            <span class="ui-h-m">Call &middot; ${m.start || 'Today 04:00 PM'}</span></span></li>
        </ul>
      </div>
    </div>
  </div>
</div>`;
};

const K2 = callRecord({ durMark: num(1), ps: num(2) });

/* L1 / L2 - a brand-new call, and the same record once it is saved */
const L1 = callForm({
    date: num(1),
    dateFlash: true,
    dateHint: 'Today',
    time: num(2),
    timeFlash: true,
    timeHint: 'Today 03:57 PM',
    descLabel: num(3),
    descText: 'Agreed a two-year support contract',
    descFlash: true,
    chip: '<span class="ui-chip">X <span class="x">&times;</span></span>',
});

const L2 = callRecord({
    who: 'MIH Jihad',
    product: 'X',
    start: 'Today 03:57 PM',
    end: 'Today 04:02 PM',
    timeAt: '03:57 PM',
    desc: 'Agreed a two-year support contract',
    date: num(1),
    time: num(2),
});


/* =============================================================== appendix */
const fileTree = `
.htaccess
custom/Docs/WebPush.md
custom/Espo/Custom/Classes/Select/Call/TextFilter.php
custom/Espo/Custom/ConsoleCommands/WebPushGenerateVapidKeys.php
custom/Espo/Custom/Controllers/CProductService.php
custom/Espo/Custom/Controllers/PushSubscription.php
custom/Espo/Custom/Hooks/Call/DescriptionDiff.php
custom/Espo/Custom/Hooks/Meeting/DescriptionDiff.php
custom/Espo/Custom/Jobs/&#123;CallRouteReminders,MeetingReminders&#125;.php
custom/Espo/Custom/Notification/NotificationService.php
custom/Espo/Custom/Resources/routes.json
custom/Espo/Custom/Resources/layouts/&#123;Call,CProductService,Lead&#125;/&#123;detail,detailSmall&#125;.json
custom/Espo/Custom/Resources/layouts/Call/list.json
custom/Espo/Custom/Resources/layouts/Meeting/list.json
custom/Espo/Custom/Resources/layouts/Lead/filters.json
custom/Espo/Custom/Resources/metadata/app/&#123;client,clientNavbar,clientRecord,consoleCommands,scheduledJobs&#125;.json
custom/Espo/Custom/Resources/metadata/clientDefs/&#123;Call,Calendar,CProductService,Lead,Meeting,Note&#125;.json
custom/Espo/Custom/Resources/metadata/entityDefs/&#123;Call,CProductService,Lead,Meeting,Preferences,PushSubscription,Task&#125;.json
custom/Espo/Custom/Resources/metadata/logicDefs/Call.json
custom/Espo/Custom/Resources/metadata/recordDefs/&#123;CProductService,Lead&#125;.json
custom/Espo/Custom/Resources/metadata/scopes/&#123;Call,CProductService,Lead,PushSubscription&#125;.json
custom/Espo/Custom/Resources/metadata/selectDefs/&#123;Call,Lead&#125;.json
custom/Espo/Custom/Resources/i18n/&#123;37 locales&#125;/CProductService.json
custom/Espo/Custom/Resources/i18n/en_US/&#123;Call,Global,Lead,Meeting,ScheduledJob,Task&#125;.json
custom/Espo/Custom/Tools/Activities/&#123;Service.php,Api/Get.php,Api/GetListTyped.php&#125;
custom/Espo/Custom/WebPush/&#123;Base64Url,Der,Encryption,ProjectPath,PushNotificationService,PushPreferences,PushSender,SendResult,SubscriptionStore,VapidKeys&#125;.php
data/config.php
public/sw.js

client/custom/css/calendar-week.css
client/custom/img/cgit-logo-192.png
client/custom/src/web-push.js
client/custom/src/helpers/web-push-manager.js
client/custom/src/handlers/create-task-prefill.js
client/custom/src/handlers/defaults-preparator.js
client/custom/src/views/site/navbar/web-push.js
client/custom/src/views/modals/select-product-service.js
client/custom/src/views/calendar/calendar.js
client/custom/src/views/call/record/&#123;detail,edit,edit-small&#125;.js
client/custom/src/views/meeting/record/&#123;edit,edit-small&#125;.js
client/custom/src/views/lead/record/&#123;edit,edit-small&#125;.js
client/custom/src/views/record/panels/history.js
client/custom/src/views/fields/&#123;call-date,call-time,description-change,description-preview&#125;.js
client/custom/src/views/stream/notes/create.js
client/custom/res/templates/calendar/calendar.tpl
client/custom/res/templates/modals/select-product-service.tpl
client/custom/res/templates/site/navbar/web-push.tpl
client/custom/res/templates/stream/notes/create-call.tpl
`;

const TESTS = [
    ['webpush-infra-test.php', 'Web Push end-to-end', '186'],
    ['webpush-frontend-check.mjs', 'Web Push front end', '75'],
    ['sw-runtime-check.mjs', 'Web Push worker, run in isolation', '33'],
    ['check-all.mjs', 'Runs the four Web Push suites above at once', '-'],
    ['wp-meta-check.php', 'Web Push metadata', '10'],
    ['ps-autofill-check.mjs', 'Call product-service picker', '151'],
    ['meeting-autofill-check.mjs', 'Meeting autofill', '81'],
    ['meeting-check.mjs', 'Meeting views', '-'],
    ['hist-ps-check.mjs', 'History product-service filter', '29'],
    ['datetime-format-check.php', 'Date &amp; time format', '29'],
    ['handler-unit.mjs', 'Task prefill handler', '33'],
    ['task-prefill-check.mjs', 'Task prefill UI', '-'],
    ['task-prefill-meta.php', 'Task prefill metadata', '18'],
    ['test-diff-hook.php', 'Description change hook', '21'],
    ['test-dup-iso.php', 'Duplicate + date round-trip', '16'],
    ['test-dup-source.php', 'Duplicate detection', '16'],
    ['test-e2e.php', 'End-to-end scenarios', '26'],
    ['dup-api-check.mjs', 'Duplicate API', '-'],
    ['ui-api-check.mjs', 'UI + API contract', '-'],
];

const testRows = TESTS
    .map((t) => `<tr><td><code>${t[0]}</code></td><td>${t[1]}</td><td class="num">${t[2]}</td></tr>`)
    .join('\n');

const features = [
    ['1', 'Product Service catalogue', 'A new record type listing everything you sell, and the link between leads, calls and products.', '#catalogue'],
    ['2', 'Search and filter the lead list', 'Type a phone number or part of a website to find a lead, or narrow the list down to one product service.', '#find'],
    ['3', 'Opportunity amount fills itself in', 'Picking a product on the lead form works out its price for you, adding up several products.', '#amount'],
    ['4', 'Desktop notifications', 'A bell in the top bar turns on alerts that reach you even when the browser is closed.', '#a'],
    ['5', 'History shows only what matters', 'A record&rsquo;s history now lists only the activity belonging to its own product service.', '#b'],
    ['6', 'Calls show their product service', 'Every call carries its product, listed in its own column on the Calls list.', '#calls-ps'],
    ['7', 'Call date and time fill in', 'Two new fields on the call form arrive with today&rsquo;s date and the current time already in them.', '#call-date-time'],
    ['8', 'Calls fill themselves in', 'Choosing a lead completes the call or meeting form &mdash; or asks you which product applies.', '#c'],
    ['9', 'Duplicate, then describe', 'Duplicating a call copies everything except the description, which arrives empty &mdash; you must fill it in before the call can be saved.', '#d'],
    ['10', 'Local date and time format', 'While typing, dates read 02/10/2026 and times read 02:30 PM, in Dhaka time.', '#e'],
    ['11', 'Meetings start faster', 'The meeting name fills itself in and you are already on the invite.', '#f'],
    ['12', 'New records start with you', 'Opening any create form &mdash; product, account, call, meeting or lead &mdash; already has you set as its Assigned User.', '#lead-owner'],
    ['13', 'Week view matches the month', 'Today is marked, every day is headed by a weekday and a date, and each entry is a card showing its time and status.', '#calendar-week'],
    ['14', 'Find a call by its product', 'The search box on the Calls list matches the product a call is about, not only the call name.', '#calls-search'],
    ['15', 'Meetings remind you too', 'When a meeting&rsquo;s Date Start arrives, the assigned user is told &mdash; pop-up, notification and desktop alert, just like a call.', '#meeting-reminders'],
    ['16', 'Facebook and WhatsApp on the lead form', 'Source gains Facebook and Whatsapp, and a phone number can carry a Whatsapp label of its own.', '#lead-source'],
    ['17', 'Meetings show their product service', 'Every meeting carries its product, in its own column on the Meetings list &mdash; just like a call.', '#meetings-ps'],
];

const featureRows = features
    .map((f) => `<tr><td class="num">${f[0]}</td><td><a href="${f[3]}">${f[1]}</a></td><td>${f[2]}</td></tr>`)
    .join('\n');

/* ============================================ per-feature developer notes */
/* Closed by default: [sectionId, number, { lede, files, how, change }] */
const DEV = [
['catalogue', '1', {
  lede: 'A record type built from metadata alone &mdash; EspoCRM creates the table, the menu tab, the list and the detail view from JSON, so no core file is involved.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/scopes/CProductService.json', 'turns the entity on: <code>entity: true</code>, ACL, menu tab'],
    ['custom/Espo/Custom/Resources/metadata/entityDefs/CProductService.json', 'fields, links and indexes &mdash; <code>category</code>, <code>type</code>, <code>status</code>, <code>price</code>'],
    ['custom/Espo/Custom/Controllers/CProductService.php', 'API controller, extends the core record controller'],
    ['custom/Espo/Custom/Resources/metadata/clientDefs/CProductService.json', 'page icon and the Calls / Leads panels'],
    ['custom/Espo/Custom/Resources/layouts/CProductService/list.json', 'list columns'],
    ['custom/Espo/Custom/Resources/i18n/en_US/CProductService.json', 'labels and option names, mirrored across 37 locales'],
  ],
  how: [
    'The scope carries <code>isCustom: true</code> and <code>module: "Custom"</code>, so an upgrade leaves it alone.',
    'Leads and Calls each hold a required <code>linkMultiple</code> field <code>cProductServices</code>, through the relations <code>cLeadProductService</code> and <code>cCallProductService</code>.',
    '<code>price</code> is a currency field and is what the Lead form sums up in feature 3.',
  ],
  change: [
    'A new field needs an <code>entityDefs</code> entry <em>and</em> a cache clear, or the table column is never created.',
    'Labels live in <code>Resources/i18n/&lt;locale&gt;/CProductService.json</code> &mdash; add the key to every locale file or the field shows its API name.',
  ],
}],
['find', '2', {
  lede: 'Three metadata files: one widens what the list search looks at, one teaches it to match inside a website, and one puts the product filter first.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Lead.json', '<code>collection.textFilterFields</code> and <code>collection.fullTextSearch</code>'],
    ['custom/Espo/Custom/Resources/metadata/selectDefs/Lead.json', '<code>textFilterUseContainsAttributeList</code> &mdash; the website matches anywhere in the text'],
    ['custom/Espo/Custom/Resources/layouts/Lead/filters.json', 'order of the filter panel'],
  ],
  how: [
    '<code>textFilterFields</code> adds first name, last name, street, city, phone and website on top of the core three; each one becomes a <code>LIKE</code> clause built by <code>Espo\\Core\\Select\\Text\\DefaultFilter</code>.',
    'A plain <code>LIKE</code> only matches from the <em>start</em> of the value, so <code>cgit</code> would never find <code>https://cgitapps.com</code>. <code>textFilterUseContainsAttributeList</code> turns a field into a contains match &mdash; the same hook feature&nbsp;14 uses for the call product name.',
    'The website is a <code>url</code>-type field, so it stays off the fulltext index and is reached by the <code>LIKE</code> path alone; from four characters up, any fragment of the link finds the lead.',
    'For a phone field the server only runs the match when the input is digits, spaces or <code>+ ( ) -</code>, so typing <code>abc</code> never matches a phone number.',
    '<code>fullTextSearch: true</code> also switches global search to relevance order.',
  ],
  change: [
    'A field must exist in <code>entityDefs</code> first &mdash; an unknown name in <code>textFilterFields</code> is skipped silently.',
    '<code>filters.json</code> only sets the order; the widget each filter uses comes from core field metadata.',
  ],
}],
['amount', '3', {
  lede: 'Client-side only: the Lead form watches the product list, fetches the prices it has not seen yet and writes the total.',
  files: [
    ['client/custom/src/views/lead/record/edit.js', 'sums the product prices into Opportunity Amount'],
    ['client/custom/src/views/lead/record/edit-small.js', 'the same logic inside quick-create'],
    ['custom/Espo/Custom/Resources/layouts/Lead/detail.json', 'where the amount is displayed'],
  ],
  how: [
    '<code>metadata/clientDefs/Lead.json</code> registers both views under <code>recordViews.edit</code> and <code>recordViews.editSmall</code>.',
    'The view listens to <code>change:cProductServicesIds</code> and reacts only to changes made in the UI (<code>options.ui</code>), so a load does not rewrite the field.',
    'Prices come from <code>GET /CProductService?select=id,price</code>, are cached in <code>productPriceMap</code>, summed and rounded; an empty product list clears the amount.',
  ],
  change: [
    '<code>productPriceMap</code> lives as long as the page does, so a price edited in another tab is only picked up after a reload.',
    'The calculation never runs server side &mdash; the saved value is whatever the form held when Save was pressed.',
  ],
}],
['a', '4', {
  lede: 'Web Push, end to end: a navbar toggle, a service worker, a subscription record and a scheduled job that does the sending.',
  files: [
    ['client/custom/src/views/site/navbar/web-push.js', 'the bell; asks for permission only when you switch it on'],
    ['client/custom/src/helpers/web-push-manager.js', 'registers <code>sw.js</code> and calls the subscription API'],
    ['public/sw.js', 'receives the push and shows the system notification'],
    ['custom/Espo/Custom/Controllers/PushSubscription.php', '<code>action/vapidPublicKey | status | subscribe | unsubscribe</code>'],
    ['custom/Espo/Custom/Notification/NotificationService.php', '<code>notifyUser()</code> sends mail and push from one place'],
    ['custom/Espo/Custom/WebPush/*.php', 'VAPID keys, payload encryption and the HTTP sender'],
    ['client/custom/img/cgit-logo-192.png', 'the logo drawn on the system notification (192&times;192)'],
  ],
  how: [
    '<code>metadata/app/clientNavbar.json</code> adds the item and points it at <code>custom:views/site/navbar/web-push</code> (template <code>custom:site/navbar/web-push</code>).',
    'The subscription is a <code>PushSubscription</code> row with <code>acl: false</code>; muting is stored per user in the Preferences field <code>webPushMutedCategories</code>.',
    'A scheduled job (<code>metadata/app/scheduledJobs.json</code>, every minute) is what actually pushes &mdash; nothing is pushed from the page request itself.',
    'Full setup, tests and the production notes are in <code>custom/Docs/WebPush.md</code>.',
  ],
  change: [
    'A new category needs <code>PushPreferences::CATEGORIES</code>, a Preferences field in <code>entityDefs</code>, and a bump of <code>SW_VERSION</code> in <code>public/sw.js</code> or old workers keep the old list.',
    'The toast icon comes from <code>ICON</code> at the top of <code>public/sw.js</code>: give a replacement a new file name (the OS caches an icon against its URL) and bump <code>SW_VERSION</code>.',
    'Push only works over HTTPS. The VAPID keys sit in <code>data/webpush-config.php</code>, which is not in git.',
  ],
}],
['b', '5', {
  lede: 'The history panel keeps all of its behaviour and gains one filter: the parent record&rsquo;s product services.',
  files: [
    ['client/custom/src/views/record/panels/history.js', 'sends <code>productServiceIds</code> and refreshes after a save'],
    ['custom/Espo/Custom/Resources/metadata/app/clientRecord.json', 'swaps the panel view for every record type'],
    ['custom/Espo/Custom/Tools/Activities/Api/Get.php', 'reads the query parameter'],
    ['custom/Espo/Custom/Tools/Activities/Service.php', 'narrows the query to the product&rsquo;s calls'],
    ['custom/Espo/Custom/Resources/routes.json', 'overrides the core Activities routes'],
  ],
  how: [
    'Custom routes win because <code>Espo\\Core\\Utils\\Route::unify()</code> loads custom definitions first and skips duplicates, so <code>/Activities/:parentType/:id/:type</code> runs the custom controller.',
    'The view copies <code>cProductServicesIds</code> into <code>collection.data.productServiceIds</code>; <code>Service::getActivitiesQuery()</code> restricts Calls to that list and returns an empty id list for every other type.',
    'The panel refetches 150&nbsp;ms after <code>after:save</code>, so a call just made appears without a reload.',
  ],
  change: [
    'Turn the filter off by not sending <code>productServiceIds</code> &mdash; the API treats it as absent and returns everything.',
    'A record with no product service set is not filtered, so it still shows the full history.',
  ],
}],
['calls-ps', '6', {
  lede: 'A required link field plus two layouts &mdash; the column and the panel are metadata, not code.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Call.json', '<code>cProductServices</code>, <code>linkMultiple</code>, required'],
    ['custom/Espo/Custom/Resources/layouts/Call/list.json', 'the Product Services column, width 16, after Parent'],
    ['custom/Espo/Custom/Resources/metadata/clientDefs/Call.json', 'relationship panel on the detail view'],
    ['custom/Espo/Custom/Resources/i18n/en_US/Call.json', 'the column label'],
  ],
  how: [
    'The link is <code>hasMany</code> through relation <code>cCallProductService</code>, declared on both ends so the two records stay in step.',
    'Nothing visible was added in JavaScript &mdash; the column and the panel are read straight from layout JSON.',
  ],
  change: [
    'Removing <code>required: true</code> reopens the option of saving a call with no product.',
    'Layout edits need Admin &rarr; Clear Cache before the list rereads <code>layouts/Call/list.json</code>.',
  ],
}],
['call-date-time', '7', {
  lede: 'The defaults are still pure metadata; the relative wording is two tiny field views that only touch the form.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Call.json', 'the two fields, their defaults and their views'],
    ['client/custom/src/views/fields/call-date.js', 'the grey line under Call Date'],
    ['client/custom/src/views/fields/call-time.js', 'the grey line under Call Time'],
    ['custom/Espo/Custom/Resources/layouts/Call/detail.json', 'where they sit on the detail view'],
    ['custom/Espo/Custom/Resources/layouts/Call/detailSmall.json', 'and in the side panel'],
    ['custom/Espo/Custom/Resources/i18n/en_US/Call.json', '"Call Date" and "Call Time"'],
  ],
  how: [
    '<code>cCallDate</code> is a required <code>date</code> with <code>default: "javascript: return this.dateTime.getToday();"</code>.',
    '<code>cCallTime</code> is a required <code>datetime</code> with <code>default: "javascript: return this.dateTime.getNow(1);"</code> and <code>minuteStep: 30</code>.',
    'The <code>javascript:</code> prefix is evaluated by core against the model, so the value follows the user&rsquo;s own time zone rather than the server&rsquo;s.',
    'Both fields carry a client-side <code>view</code> key, which is how core picks a field&rsquo;s class per entity; the two views extend <code>views/fields/date</code> and <code>views/fields/datetime</code> untouched.',
    'The views append one <code>span.call-date-hint</code> under the field in edit mode only, and re-render it on <code>change:&lt;field&gt;</code>; the detail view keeps the wording core already writes.',
    'The line reads <b>Today</b>, <b>Tomorrow</b> or <b>Yesterday</b>, comparing the stored day against <code>moment.tz(...).startOf(\'day\')</code> in the user&rsquo;s zone &mdash; the same range test core uses on the detail view.',
  ],
  change: [
    'Neither field carries <code>duplicateIgnore</code>, so a duplicate (feature 9) copies them along with everything else.',
    'Metadata edits require a cache clear before the defaults change.',
    'Plain <code>client/custom/src</code> files load on demand and need no build step, but a cache clear still refreshes the metadata that points at them.',
  ],
}],
['c', '8', {
  lede: 'The Call form watches the Parent field, reads the lead, then either fills the product in or asks you which one applies &mdash; and the Meeting form watches the same way.',
  files: [
    ['client/custom/src/views/call/record/edit.js', 'autofill on <code>change:parentId</code>'],
    ['client/custom/src/views/call/record/edit-small.js', 'the same, inside quick-create'],
    ['client/custom/src/views/meeting/record/edit.js', 'the same watchers, on the Meeting form'],
    ['custom/Espo/Custom/Resources/metadata/clientDefs/Call.json', 'registers both views'],
    ['client/custom/src/views/modals/select-product-service.js', 'the product picker'],
    ['client/custom/res/templates/modals/select-product-service.tpl', 'its checkbox list'],
  ],
  how: [
    'The view reacts only to UI changes (<code>options.ui</code>) and requests <code>GET /Lead/&lt;id&gt;?select=id,name,cProductServicesIds,cProductServicesNames</code>.',
    'One product is written straight into <code>cProductServicesIds/Names</code>; several open the modal and wait for its <code>select</code> event.',
    'The call name is filled only while it is empty, so it never overwrites something you typed.',
    'The Meeting edit view carries these exact watchers and the same modal; opening a meeting whose products are already set leaves them alone.',
  ],
  change: [
    '<code>cProductServices</code> is required, and the modal starts with nothing selected &mdash; a multi-product lead left unanswered blocks Save.',
    'The modal is custom too: it is created as <code>custom:views/modals/select-product-service</code>.',
    'Meeting&rsquo;s <code>cProductServices</code> was marked required in <code>entityDefs/Meeting.json</code> when the prefill arrived, so both activity forms validate alike.',
  ],
}],
['d', '9', {
  lede: 'One field flag. Core&rsquo;s duplicator drops anything marked <code>duplicateIgnore</code>, so the copy arrives with an empty description.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Call.json', '<code>description</code> set to <code>required</code> + <code>duplicateIgnore</code>'],
    ['application/Espo/Core/Record/Duplicator/EntityDuplicator.php', 'core code that honours the flag &mdash; read-only reference'],
    ['custom/Espo/Custom/Hooks/Call/DescriptionDiff.php', 'records what is typed afterwards'],
    ['custom/Espo/Custom/Hooks/Meeting/DescriptionDiff.php', 'the same hook for meetings'],
  ],
  how: [
    'Duplicate on the detail view posts to <code>Call/action/getDuplicateAttributes</code>, then creates with <code>options.duplicateSourceId</code>.',
    '<code>Espo\\Core\\Record\\Service::getDuplicateAttributes()</code> runs the duplicator, which unsets every <code>duplicateIgnore</code> field.',
    '<code>status</code> is never copied by core, so a duplicate starts at its default (Planned).',
    '<code>DescriptionDiff</code> reads the <code>X-Duplicate-Source-Id</code> header so it knows the copy has no baseline text.',
  ],
  change: [
    'Delete <code>duplicateIgnore</code> from <code>entityDefs/Call.json</code> and duplicates behave exactly as they did before.',
    'Fields added later are copied by default &mdash; mark them <code>duplicateIgnore</code> if they should not be.',
  ],
}],
['e', '10', {
  lede: 'There is no feature code here at all: three values in one config file do the whole job.',
  files: [
    ['data/config.php', '<code>timeZone</code>, <code>dateFormat</code>, <code>timeFormat</code> and <code>weekStart</code>'],
  ],
  how: [
    'The file holds <code>timeZone: Asia/Dhaka</code>, <code>dateFormat: DD/MM/YYYY</code>, <code>timeFormat: hh:mm A</code> and <code>weekStart: 0</code>.',
    'PHP reads them through <code>Espo\\Core\\Utils\\Config</code>; the browser receives them from the config API and formats every date it draws.',
    'Timestamps are still stored in UTC &mdash; only the display changes.',
    'Nothing under <code>custom/</code> or <code>client/custom/</code> mentions these keys.',
  ],
  change: [
    'Admin &rarr; Settings writes the same values, so <code>data/config.php</code> is a starting point rather than a lock.',
    'Change the format in one place and the calendar, lists and forms all follow (the calendar week runs Sunday to Saturday because of <code>weekStart</code>).',
  ],
}],
['f', '11', {
  lede: 'Two client views: one copies the parent&rsquo;s name into the meeting name, the other puts you on the invite.',
  files: [
    ['client/custom/src/views/meeting/record/edit.js', 'name autofill, attendee prefill and the feature 8 product watchers'],
    ['client/custom/src/views/meeting/record/edit-small.js', 'extends the edit view for quick-create'],
    ['custom/Espo/Custom/Resources/metadata/clientDefs/Meeting.json', 'registers <code>recordViews.edit</code> and <code>editSmall</code>'],
  ],
  how: [
    '<code>fetchParentName()</code> runs on <code>change:parentId change:parentType</code>, requests <code>&lt;parentType&gt;/&lt;id&gt;?select=id,name</code>, and writes <code>name</code> only while it is empty or still holds a value this view wrote itself.',
    '<code>fillAttendees()</code> runs only for a new meeting with no attendees and sets <code>usersIds / usersNames / usersColumns</code> to the logged-in user.',
  ],
  change: [
    'The name step is skipped for parent types with no <code>name</code> field in <code>entityDefs</code>.',
    'Typing a name by hand stops the autofill for good &mdash; the view remembers what it wrote in <code>autoFilledName</code>.',
  ],
}],
['lead-owner', '12', {
  lede: 'One model-default preparator, wired into five scopes: core asks it for values just before a new form opens.',
  files: [
    ['client/custom/src/handlers/defaults-preparator.js', 'returns <code>assignedUserId</code> and <code>assignedUserName</code>'],
    ['custom/Espo/Custom/Resources/metadata/clientDefs/{Account,Call,CProductService,Lead,Meeting}.json', 'the key <code>modelDefaultsPreparator</code> in each'],
  ],
  how: [
    'Core <code>helpers/model/defaults-populator</code> calls <code>prepare(model)</code> for a new model only, then applies the result silently; anything supplied in the URL is applied afterwards and wins.',
    'The handler returns <code>{}</code> when the record already has an owner, or when the entity has no <code>assignedUser</code> field.',
    'Account got a clientDefs file of its own for the wiring; the other four already had one.',
    'The handler began life under <code>handlers/lead/</code> and was moved up one level when the other four scopes joined.',
    'Teams are not touched.',
  ],
  change: [
    '<code>prepare()</code> must never throw &mdash; the create form awaits it.',
    'Adding a sixth entity is one line in its clientDefs &mdash; the same handler serves them all.',
  ],
}],
['calendar-week', '13', {
  lede: 'A custom calendar view layered over the core CRM calendar: the same events, rendered the way Month already renders them.',
  files: [
    ['client/custom/src/views/calendar/calendar.js', '<code>titleFormat</code>, <code>dayHeaderContent</code>, <code>eventContent</code>, <code>eventClassNames</code>'],
    ['client/custom/res/templates/calendar/calendar.tpl', 'the toolbar: prev / next / Today, the date title, the mode buttons'],
    ['client/custom/css/calendar-week.css', 'the Month-matched styling'],
    ['custom/Espo/Custom/Resources/metadata/clientDefs/Calendar.json', 'registers the view, the template and the stylesheet'],
  ],
  how: [
    'Fields on an <code>Dep.extend</code> class are shadowed by class fields, so <code>template</code>, <code>titleFormat</code> and <code>events</code> are assigned inside <code>setup()</code> rather than at class level.',
    '<code>dayHeaderContent</code> builds the weekday and date whenever <code>arg.view.type.indexOf(\'timeGrid\') === 0</code> &mdash; that is Week and Day; Month returns <code>arg.text</code> untouched.',
    '<code>eventContent</code> adds the type and status chips when <code>hasEventMeta()</code> (all-day, or at least <code>MIN_META_DURATION</code> = 45 minutes) plus the attendee rows beneath.',
    'The title uses <code>titleFormat.week = \'D MMM YYYY\'</code> joined by core&rsquo;s <code>rangeSeparator</code> (<code>&nbsp;&ndash;&nbsp;</code>).',
  ],
  change: [
    'Custom CSS is appended to <code>cssList</code>, so <code>calendar-week.css</code> loads after <code>espo.css</code> &mdash; that is why plain <code>:root</code> overrides such as <code>--fc-today-bg-color</code> win.',
    'FullCalendar is told about every change through <code>setOption</code> from an instance-accessor setter, which runs before <code>render()</code>, so there is no flash of the old style.',
    'The toolbar is a <code>custom:</code> template &mdash; adding a button means editing <code>calendar.tpl</code>, never the core file.',
  ],
}],
['calls-search', '14', {
  lede: 'Two metadata entries and one small class &mdash; the search box is given one more field to match, and the join behind it is de-duplicated.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Call.json', '<code>collection.textFilterFields</code> gains <code>cProductServices.name</code>'],
    ['custom/Espo/Custom/Resources/metadata/selectDefs/Call.json', 'matches anywhere in the text, and picks the filter class'],
    ['custom/Espo/Custom/Classes/Select/Call/TextFilter.php', 'adds DISTINCT for the many-to-many join'],
  ],
  how: [
    'List search reads <code>entityDefs.Call.collection.textFilterFields</code>; a dotted entry such as <code>cProductServices.name</code> is left-joined and searched alongside <code>name</code> &mdash; the same shape core already uses for <code>CampaignLogRecord</code>.',
    'Both sides of the product link are <code>hasMany</code>, so the ORM makes it many-to-many through a middle table and one call joins one row per product. Core <code>DefaultFilter</code> adds DISTINCT only for <code>hasMany</code>, which would list a two-product call twice.',
    '<code>selectDefs.Call.textFilterClassName</code> therefore points at a subclass of <code>DefaultFilter</code> that calls <code>distinct()</code> whenever a joined attribute is in the filter, so no core file is touched.',
    '<code>selectDefs.Call.textFilterUseContainsAttributeList</code> makes the product name match anywhere in the text from four characters up; the call name keeps core behaviour.',
  ],
  change: [
    'Metadata only &mdash; clear the cache after any edit to <code>entityDefs/Call.json</code> or <code>selectDefs/Call.json</code>.',
    'Deleting the <code>cProductServices</code> field leaves the dotted entry behind: remove <code>collection.textFilterFields</code> and the <code>selectDefs</code> entries at the same time, or the search errors out.',
    'Drop <code>textFilterUseContainsAttributeList</code> and the product name matches from the start only, like the call name.',
    'The class is needed only while the relation is many-to-many; if the product link ever becomes a plain <code>belongsTo</code>, delete it along with the <code>textFilterClassName</code> line.',
  ],
}],
['meeting-reminders', '15', {
  lede: 'The twin of the Call Route reminder: a scheduled job scans for meetings whose Date Start has arrived and hands each one to the shared NotificationService.',
  files: [
    ['custom/Espo/Custom/Jobs/MeetingReminders.php', 'the scheduled job'],
    ['custom/Espo/Custom/Resources/metadata/app/scheduledJobs.json', 'registers it to run every minute'],
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Meeting.json', 'the marker field that remembers what was already notified'],
    ['custom/Espo/Custom/Resources/i18n/en_US/Meeting.json', 'the message and push wording'],
    ['custom/Espo/Custom/Resources/i18n/en_US/ScheduledJob.json', 'the job label in Admin &rarr; Scheduled Jobs'],
  ],
  how: [
    'The job reads <code>scopes.Meeting.activityStatusList</code> (Planned) and asks for every meeting whose <code>dateStart</code> is at or before now but inside the last <code>reminderPastHours</code> (default 24).',
    'A datetime marker field remembers which Date Start was already notified; a matching value short-circuits, so a scheduler that runs every minute produces exactly one notification.',
    'When the meeting is rescheduled the old notification row is deleted before the new one is created, so the panel never shows a stale time.',
    'Delivery goes through the shared NotificationService: persistent Notification, popup Reminder, WebSocket refresh and Web Push &mdash; category <code>meeting</code>, which already existed in the push preferences, so meeting pushes are distinguishable from call pushes.',
    'The scheduled job row is created by the metadata entry (<code>isDefault</code>) on install; on an existing install create it once from Admin &rarr; Scheduled Jobs or the API.',
  ],
  change: [
    'Clear the cache after editing any of the metadata files.',
    'The marker column is a plain datetime on the meeting table; removing the field means dropping the column and the marker comparisons together.',
    '<code>reminderPastHours</code> in the config widens or narrows the catch-up window for both the call and the meeting reminder.',
    'A third copy of this pattern (Task reminders) would mean three near-identical jobs &mdash; at that point extract a shared base job.',
  ],
}],
['lead-source', '16', {
  lede: 'Two option lists in one entityDefs file, plus their display labels in the lead language file.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Lead.json', '<code>fields.source.options</code> and <code>fields.phoneNumber.typeList</code>'],
    ['custom/Espo/Custom/Resources/i18n/en_US/Lead.json', 'the display labels, under <code>options</code>'],
  ],
  how: [
    'An <code>options</code> list on a select field replaces core&rsquo;s list outright; the empty string stays first so Source can still be left unset.',
    '<code>typeList</code> does the same for the phone field&rsquo;s type dropdown.',
    'The i18n <code>options</code> block maps every stored value to what is shown; a value with no label would render as its raw name.',
    'The labels here read exactly like the values, so a rename means editing both files together.',
  ],
  change: [
    'Clear the cache after editing either file &mdash; both are metadata, not code.',
    'A lead saved with a value that is later removed from the list still shows the old raw value.',
    'Dropping Whatsapp from <code>typeList</code> does not strip it from numbers already saved with that type.',
  ],
}],
['meetings-ps', '17', {
  lede: 'The same three-file pattern as the call column: a link field, a list layout and a label.',
  files: [
    ['custom/Espo/Custom/Resources/metadata/entityDefs/Meeting.json', '<code>cProductServices</code>, <code>linkMultiple</code>, required'],
    ['custom/Espo/Custom/Resources/layouts/Meeting/list.json', 'the Product Services column, width 16, after Parent'],
    ['custom/Espo/Custom/Resources/i18n/en_US/Meeting.json', 'the column label'],
  ],
  how: [
    'The link is <code>hasMany</code> through relation <code>cMeetingProductService</code>, declared on both ends so the two records stay in step.',
    'The meeting list layout is the call list&rsquo;s twin &mdash; same columns, same widths &mdash; so the two activity lists read identically.',
    'Nothing visible lives in JavaScript; like section 6, the column is read straight from layout JSON.',
  ],
  change: [
    'Removing <code>required: true</code> reopens the option of saving a meeting with no product.',
    'Layout edits need Admin &rarr; Clear Cache before the list rereads <code>layouts/Meeting/list.json</code>.',
  ],
}],
];

const devBlock = (id, num, d) => `
<details class="dev" id="dev-${id}">
  <summary><span class="dev-kicker">For developers</span><span class="dev-t">How feature ${num} is built</span></summary>
  <div class="dev-inner">
    <p class="dev-lede">${d.lede}</p>
    <div class="dev-h">Files touched</div>
    <ul class="dev-list">${d.files.map((f) => `<li><code>${f[0]}</code> <span class="k">&mdash;</span> ${f[1]}</li>`).join('')}</ul>
    <div class="dev-h">How it works</div>
    <ul class="dev-list">${d.how.map((t) => `<li>${t}</li>`).join('')}</ul>
    <div class="dev-h">If you change it</div>
    <ul class="dev-list">${d.change.map((t) => `<li>${t}</li>`).join('')}</ul>
  </div>
</details>`;

/* Insert each note just before the closing tag of its own section. */
const withDevNotes = (page) => {
  let out = page;
  for (const [id, num, doc] of DEV) {
    const start = out.indexOf(`<section id="${id}">`);
    if (start < 0) { throw new Error('section not found: ' + id); }
    const end = out.indexOf('</section>', start);
    if (end < 0) { throw new Error('section not closed: ' + id); }
    out = out.slice(0, end) + devBlock(id, num, doc) + '\n' + out.slice(end);
  }
  return out;
};

/* ==================================================================== CSS */
const CSS = `
:root{
  --bg:#f5f6f8; --panel:#fff; --ink:#26313d; --muted:#6b7684;
  --line:#e2e7ed; --accent:#3080f0; --accent-ink:#1f5fbd;
  --ok:#12855a; --warn:#9a6300;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);
  font:15.5px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.layout{display:flex;max-width:1180px;margin:0 auto;gap:26px;padding:0 20px}
nav{width:236px;flex:0 0 236px;position:sticky;top:0;align-self:flex-start;
  height:100vh;overflow-y:auto;padding:30px 4px 40px}
nav .brand{font-weight:700;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;
  color:#9aa5b1;margin:0 0 10px 10px}
nav ol{list-style:none;margin:0;padding:0}
nav li{margin:2px 0}
nav a{display:block;padding:7px 11px;border-radius:6px;color:#48545f;font-size:13.5px}
nav a:hover{background:#e9edf3;text-decoration:none;color:var(--accent-ink)}
nav a.active,nav a.active:hover{background:#e8f0fe;color:var(--accent-ink);font-weight:600;
  text-decoration:none;box-shadow:inset 3px 0 0 var(--accent)}
main{flex:1 1 auto;min-width:0;padding:30px 0 90px}
header.doc{margin-bottom:30px}
header.doc h1{margin:0 0 8px;font-size:30px;letter-spacing:-.02em;font-weight:700}
header.doc .sub{color:var(--muted);font-size:16px;margin:0 0 16px;max-width:64ch}
.meta{display:flex;flex-wrap:wrap;gap:9px}
.meta span{background:#fff;border:1px solid var(--line);border-radius:999px;
  padding:4px 13px;font-size:12.5px;color:#4b5765}
section{background:var(--panel);border:1px solid var(--line);border-radius:10px;
  padding:28px 34px 32px;margin-bottom:20px;scroll-margin-top:16px}
section.lead{padding-bottom:26px}
h2{margin:0 0 10px;font-size:21px;letter-spacing:-.01em}
h2 .tag{display:inline-flex;width:24px;height:24px;border-radius:6px;background:var(--accent);
  color:#fff;font-size:12.5px;font-weight:700;align-items:center;justify-content:center;
  vertical-align:-4px;margin-right:11px}
h3{margin:26px 0 8px;font-size:16px}
p{margin:10px 0;max-width:78ch}
ul{margin:10px 0 10px 20px;padding:0}
li{margin:6px 0}
code{font-family:Consolas,"SF Mono",Menlo,monospace;font-size:13px;
  background:#eef2f7;border:1px solid var(--line);border-radius:4px;padding:1px 5px}
.lede{font-size:16px;color:#3a4653;max-width:70ch}
.bullets{list-style:none;margin:16px 0 4px;padding:0;display:grid;gap:9px;max-width:80ch}
.bullets li{margin:0;padding-left:26px;position:relative;color:#41505f}
.bullets li::before{content:"";position:absolute;left:4px;top:9px;width:7px;height:7px;
  border-radius:50%;background:#c8d3e0}
.bullets li.yes::before{background:#12855a}
.bullets li.no::before{background:#e5484d}
.tablewrap{overflow-x:auto;margin:16px 0}
table{border-collapse:collapse;width:100%;font-size:14.5px}
th,td{border-bottom:1px solid var(--line);padding:11px 13px;text-align:left;vertical-align:top}
th{background:#fafbfc;font-size:12px;text-transform:uppercase;letter-spacing:.05em;
  color:#7b8794;font-weight:700}
tr:last-child td{border-bottom:none}
td.num{font-weight:700;text-align:center;color:var(--accent-ink);white-space:nowrap;width:38px}
.note{border-left:4px solid var(--accent);background:#f2f7ff;padding:13px 17px;
  border-radius:0 8px 8px 0;margin:18px 0;font-size:14.5px;color:#3a4653;max-width:82ch}
.note b{color:var(--accent-ink)}
.note.ok{border-left-color:var(--ok);background:#f1faf6}
.note.ok b{color:var(--ok)}
.note.plain{border-left-color:#c8d3e0;background:#fafbfc}
.note.plain b{color:#48545f}
footer{color:#9aa5b1;font-size:13px;text-align:center;padding:14px 0 46px}

/* ---- technical appendix (collapsed) ---- */
details.appx{background:#fff;border:1px solid var(--line);border-radius:10px;
  padding:0;overflow:hidden;margin-bottom:20px}
details.appx>summary{cursor:pointer;padding:20px 34px;font-size:15px;font-weight:600;
  color:#48545f;list-style:none}
details.appx>summary::-webkit-details-marker{display:none}
details.appx>summary::before{content:"\\25B8  ";color:var(--accent)}
details.appx[open]>summary::before{content:"\\25BE  "}
details.appx[open]>summary{border-bottom:1px solid var(--line);background:#fafbfc}
details.appx .inner{padding:24px 34px 30px}
details.appx h3{margin-top:6px}
details.appx h3:not(:first-child){margin-top:26px}

/* ---- per-feature developer notes (closed by default) ---- */
details.dev{margin-top:20px;background:#f7f9fc;border:1px solid var(--line);
  border-radius:10px;overflow:hidden}
details.dev>summary{cursor:pointer;list-style:none;padding:11px 18px;
  display:flex;align-items:center;gap:11px;color:#7b8794;font-size:13.5px;
  user-select:none}
details.dev>summary::-webkit-details-marker{display:none}
details.dev>summary::before{content:"\\25B8";color:var(--accent);font-size:11px}
details.dev[open]>summary::before{content:"\\25BE"}
details.dev>summary:hover{background:#eef2f7;color:#48545f}
details.dev[open]>summary{background:#eef2f7;border-bottom:1px solid var(--line);
  color:#48545f;font-weight:600}
.dev-kicker{font-size:9.5px;letter-spacing:.11em;text-transform:uppercase;
  font-weight:700;color:var(--accent-ink);background:#e9f1ff;border:1px solid #d3e2fb;
  border-radius:999px;padding:3px 9px}
.dev-t{color:inherit}
.dev-inner{padding:18px 24px 22px;background:#fff}
.dev-lede{margin:0 0 4px;font-size:13.5px;color:#5b6672;max-width:86ch}
.dev-h{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:#9aa5b1;
  font-weight:700;margin:20px 0 9px}
.dev-inner>p+.dev-h,.dev-lede+.dev-h{margin-top:14px}
.dev-h:first-child{margin-top:0}
.dev-list{list-style:none;margin:0;padding:0;display:grid;gap:8px;max-width:98ch}
.dev-list li{margin:0;padding-left:16px;position:relative;font-size:13.5px;
  line-height:1.62;color:#48545f}
.dev-list li::before{content:"";position:absolute;left:1px;top:8px;width:5px;height:5px;
  border-radius:50%;background:#c8d3e0}
.dev-list code{font-size:12.5px;background:#eef2f7;border:1px solid var(--line);
  border-radius:4px;padding:1px 5px;word-break:break-word}
.dev-list .k{color:#9aa5b1}
.codeblock{margin:14px 0;border:1px solid #1e293b;border-radius:8px;overflow:hidden}
.codeblock-h{background:#1e293b;color:#9fb0c6;font-size:11px;letter-spacing:.07em;
  text-transform:uppercase;padding:8px 14px;font-weight:700;font-family:Consolas,monospace}
.codeblock pre{margin:0;background:#0f172a;color:#e2e8f0;padding:15px 17px;
  overflow-x:auto;font-size:12.5px;line-height:1.55}
.codeblock code{background:none;border:none;padding:0;color:inherit;
  font-family:Consolas,"SF Mono",Menlo,monospace;font-size:12.5px}

/* ============================== EspoCRM screen renderings ================= */
.shot{margin:24px 0 6px}
.shot-cap{font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:#9aa5b1;
  font-weight:700;margin:0 0 10px}
.ui{border:1px solid #ccd4dc;border-radius:7px;overflow:hidden;background:#f5f6f8;
  font:13px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  color:#26313d;box-shadow:0 1px 4px rgba(20,30,45,.08)}
.ui *{box-sizing:border-box}
.ui svg{vertical-align:-2px}
.ui-top{background:#fff;border-bottom:1px solid #e4e9ef;padding:0 14px;height:44px;
  display:flex;align-items:center;gap:16px}
.ui-logo{font-weight:800;color:#3080f0;font-size:15px;letter-spacing:-.02em}
.ui-spacer{flex:1}
.ui-ic{width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;
  justify-content:center;color:#7b8794}
.ui-ic.bell.ring{background:#e8f5ee;color:#12855a;box-shadow:0 0 0 3px rgba(18,133,90,.13)}
.ui-ic.av{background:#e7ecf3;color:#4b5765;font-size:11.5px;font-weight:700}
.ui-crumbs{background:#fff;border-bottom:1px solid #e4e9ef;padding:8px 16px;
  font-size:12.5px;color:#8b97a5}
.ui-body{padding:18px}
.ui-body.alt{background:#f5f6f8}
.ui-body.two{display:flex;gap:16px;align-items:flex-start}
.ui-main{flex:1 1 auto;min-width:0}
.ui-side{flex:0 0 244px}
.ui-hd{font-size:12px;color:#8b97a5;font-weight:700;letter-spacing:.04em;
  text-transform:uppercase;margin-bottom:11px}
.ui-card{background:#fff;border:1px solid #e4e9ef;border-radius:5px}
.ui-card-h{padding:11px 15px;border-bottom:1px solid #eef1f5;font-weight:700;font-size:14px;
  display:flex;align-items:center;gap:8px}
.ui-actions{margin-left:auto;display:inline-flex;gap:8px}
.ui-card-b{padding:16px}
.ui-row{display:flex;gap:18px;flex-wrap:wrap}
.ui-field{flex:1 1 190px;min-width:165px;margin-bottom:15px}
.ui-field.wide{max-width:none}
.ui-lab{font-size:12.5px;color:#5b6b7c;font-weight:600;margin-bottom:5px;display:block}
.ui-lab .req{color:#e5484d}
.ui-in{border:1px solid #ccd4dc;border-radius:4px;background:#fff;padding:7px 10px;
  min-height:33px;display:flex;align-items:center;gap:7px;color:#26313d;font-size:13.5px}
.ui-in.link{color:#3080f0;font-weight:600;background:#f8fafc}
.ui-in.req{border-color:#e5484d;box-shadow:0 0 0 3px rgba(229,72,77,.11)}
.ui-in.filled{background:#f8fafc}
.ui-in.tall{min-height:64px;align-items:flex-start}
.ui-in.mute{color:#9aa5b1}
.ui-mag{margin-left:auto;color:#a7b1bd;display:inline-flex}
.ui-flash,.ui-in.flash{background:#fff6d6;border-color:#e7b93c;box-shadow:0 0 0 3px rgba(242,201,76,.28);
  font-weight:600}
.ui-badge{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;background:#fff1c2;color:#8a6100;border:1px solid #f0d073;
  border-radius:3px;padding:2px 6px;margin-left:auto;white-space:nowrap}
.ui-chip{display:inline-flex;align-items:center;gap:7px;background:#eaf1fd;
  border:1px solid #cddffb;color:#1f5fbd;border-radius:4px;padding:2px 9px;font-size:13px}
.ui-chip .x{color:#93aacf}
.ui-pair{display:flex;gap:6px;flex-wrap:wrap}
.ui-pair .ui-in{flex:1 1 110px;min-width:0}
.ui-btn{display:inline-flex;align-items:center;gap:6px;border-radius:4px;padding:6px 15px;
  font-size:13px;border:1px solid #ccd4dc;background:#fff;color:#26313d}
.ui-btn.pri{background:#3080f0;border-color:#3080f0;color:#fff;font-weight:600}
.ui-col{margin-top:13px}
/* record header + list view */
.ui-rhead{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.ui-rtitle{font-size:19px;font-weight:700;letter-spacing:-.01em}
.ui-ltop{background:#fff;border-bottom:1px solid #e4e9ef;padding:11px 16px;
  display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.ui-ltitle{font-size:16px;font-weight:700;display:inline-flex;align-items:center;gap:9px}
.ui-ltitle .cnt{background:#eef1f5;color:#6b7684;border-radius:999px;font-size:11.5px;
  font-weight:700;padding:1px 9px}
.ui-srch{display:inline-flex;align-items:center;gap:7px;border:1px solid #ccd4dc;
  border-radius:4px;padding:6px 12px;color:#9aa5b1;font-size:13px;min-width:170px;
  background:#fff}
.ui-lwrap{overflow-x:auto}
table.lt{width:100%;border-collapse:collapse;background:#fff;font-size:13.5px}
table.lt th{background:#fafbfc;color:#6b7684;font-size:11.5px;letter-spacing:.05em;
  text-transform:uppercase;font-weight:700;text-align:left;padding:11px 16px;
  border-bottom:1px solid #e4e9ef;white-space:nowrap}
table.lt td{padding:13px 16px;border-bottom:1px solid #eef1f5;vertical-align:middle}
table.lt tr:last-child td{border-bottom:none}
table.lt td.lk{color:#3080f0;font-weight:700}
table.lt td.r{text-align:right;font-family:Consolas,monospace;font-size:13px;
  white-space:nowrap;color:#26313d}
.bdg{display:inline-block;border-radius:999px;padding:2px 11px;font-size:11.5px;
  font-weight:700;letter-spacing:.02em;background:#eef1f5;color:#5b6b7c;
  border:1px solid #dde3ea}
.new{display:inline-block;font-size:9.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;background:#e8f5ee;color:#12855a;border:1px solid #bfe4d4;
  border-radius:3px;padding:1px 6px;vertical-align:2px}
.bdg.ok{background:#e8f5ee;color:#12855a;border:1px solid #bfe4d4}
.cnt{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;
  padding:0 6px;background:#eef1f5;color:#6b7684;border-radius:999px;font-size:11px;
  font-weight:700;margin-left:auto}
.ui-annot{display:flex;flex-wrap:wrap;gap:9px 22px;margin-top:12px;font-size:13.5px;
  color:#5b6b7c}
.ui-annot span{display:inline-flex;gap:8px;align-items:baseline}
.ui-annot b{color:var(--accent-ink);font-weight:800}
.shot>img.sshot{display:block;width:100%;height:auto;border:1px solid #ccd4dc;
  border-radius:7px;background:#fff;box-shadow:0 1px 4px rgba(20,30,45,.08)}
.ui-annot.plain span{gap:9px}
.ui-annot.plain span::before{content:"";width:6px;height:6px;border-radius:50%;
  background:#b9c4d0;flex:none}
.ui-num{display:inline-flex;width:16px;height:16px;border-radius:50%;background:#3080f0;
  color:#fff;font-size:10px;font-weight:800;align-items:center;justify-content:center;
  vertical-align:1px;font-style:normal}
/* bell states */
.ui-states{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:11px}
.st{background:#fff;border:1px solid #e4e9ef;border-radius:6px;padding:14px 10px;text-align:center}
.st b{display:block;font-size:13px;margin-top:8px}
.st i{display:block;font-style:normal;font-size:12px;color:#8b97a5;margin-top:3px}
.st-i{width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;
  justify-content:center;background:#f1f3f6;color:#9aa5b1}
.st-i.on{background:#e8f5ee;color:#12855a}
.st-i.bad{background:#fdecec;color:#e5484d}
.st-i.busy{background:#eaf1fd;color:#3080f0;font-size:16px}
/* desktop notification */
.ui.desk{position:relative;background:#20262f;padding:36px 22px;min-height:176px;
  border-color:#20262f}
.desk-bg{position:absolute;inset:0;
  background:radial-gradient(1100px 320px at 75% 0%,rgba(48,128,240,.32),transparent 60%),
             radial-gradient(800px 300px at 15% 100%,rgba(18,133,90,.20),transparent 60%)}
.desk-toast{position:relative;display:flex;gap:12px;align-items:flex-start;
  background:rgba(255,255,255,.98);border-radius:10px;padding:13px 15px;max-width:390px;
  box-shadow:0 14px 34px rgba(0,0,0,.42);margin-bottom:14px}
.desk-toast.dim{opacity:.7;transform:scale(.97);transform-origin:left top}
.desk-ic{width:31px;height:31px;border-radius:8px;background:#e8f5ee;color:#12855a;
  display:flex;align-items:center;justify-content:center;flex:0 0 31px}
.desk-ic.g{background:#eaf1fd;color:#3080f0}
.desk-txt{display:flex;flex-direction:column;gap:2px;min-width:0}
.desk-txt b{font-size:13px;color:#26313d}
.desk-txt span{font-size:13.5px;color:#26313d}
.desk-txt em{font-style:normal;font-size:12.5px;color:#8b97a5}
.desk-time{margin-left:auto;font-size:11.5px;color:#a7b1bd;white-space:nowrap}
/* history before / after */
.ba{display:flex;gap:16px;padding:18px;flex-wrap:wrap}
.ba-c{flex:1 1 290px;min-width:265px;background:#fff;border:1px solid #e4e9ef;
  border-radius:5px;overflow:hidden}
.ba-h{padding:11px 15px;border-bottom:1px solid #eef1f5;font-weight:700;font-size:13.5px;
  display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.ba-tag{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;background:#f1f3f6;
  color:#8b97a5;border-radius:999px;padding:2px 10px;font-weight:700}
.ba-tag.on{background:#eaf1fd;color:#1f5fbd;display:inline-flex;gap:5px;align-items:center}
.ui-hist{list-style:none;margin:0;padding:0}
.ui-hist li{display:flex;gap:12px;padding:12px 15px;border-bottom:1px solid #eef1f5;
  align-items:flex-start}
.ui-hist li:last-child{border-bottom:none}
.ui-ico{width:28px;height:28px;border-radius:5px;background:#eaf1fd;color:#3080f0;
  display:flex;align-items:center;justify-content:center;flex:0 0 28px}
.ui-ico.mut{background:#f1f3f6;color:#9aa5b1}
.ui-h{display:flex;flex-direction:column;gap:3px;min-width:0}
.ui-h-t{font-weight:600;font-size:13.5px}
.ui-h-m{color:#8b97a5;font-size:12.5px}
.ui-diff{background:#e9f7ef;border:1px solid #d3ecdd;color:#146c43;border-radius:4px;
  padding:3px 8px;font-size:12.5px;display:inline-flex;gap:6px;align-items:center;
  margin-top:5px;align-self:flex-start}
.ui-diff.mut{background:#f1f3f6;border-color:#e4e9ef;color:#6b7684}
.ba-drop{padding:12px 15px;display:flex;flex-direction:column;gap:7px;background:#fafbfc;
  border-top:1px dashed #e4e9ef}
.gone{font-size:12.5px;color:#b0b9c4;text-decoration:line-through}
/* modal */
.ui-overlay{position:relative;background:rgba(30,38,48,.5);padding:36px 20px;
  display:flex;justify-content:center}
.ui-modal{background:#fff;border-radius:7px;width:100%;max-width:430px;
  box-shadow:0 20px 48px rgba(0,0,0,.35)}
.ui-modal-h{padding:13px 17px;border-bottom:1px solid #eef1f5;font-weight:700;font-size:14.5px;
  display:flex;align-items:center}
.ui-modal-h .x{margin-left:auto;color:#a7b1bd;font-weight:400}
.ui-modal-b{padding:16px 17px}
.ui-modal-msg{color:#4b5765;font-size:13.5px}
.ui-modal-f{padding:13px 17px;border-top:1px solid #eef1f5;display:flex;
  justify-content:flex-end;gap:9px}
.ui-list{list-style:none;margin:15px 0 0;padding:0;border:1px solid #e4e9ef;border-radius:5px}
.ui-list li{display:flex;align-items:center;gap:11px;padding:11px 13px;
  border-bottom:1px solid #eef1f5}
.ui-list li:last-child{border-bottom:none}
.ui-list a{color:#3080f0;font-weight:700;text-decoration:none;font-size:14px}
.ui-list .cb{width:15px;height:15px;accent-color:#3080f0}
.ui-sub{color:#9aa5b1;font-size:12.5px;margin-left:auto}
/* alert */
.ui-alert{display:flex;gap:9px;align-items:flex-start;background:#fff8ef;
  border:1px solid #f3dcc0;border-left:4px solid #e08b2d;border-radius:0 5px 5px 0;
  padding:11px 14px;font-size:13.5px;color:#7a4a00;margin-bottom:15px}
.ui-alert b{color:#6a3f00}
.ui-err{display:flex;gap:6px;align-items:center;color:#e5484d;font-size:12.5px;
  margin-top:5px;font-weight:600}
.ui-hint{margin-top:3px;font-size:12px;color:#8794a1;line-height:1.3}
/* before/after table */
.ui.plain{background:none;border:none;box-shadow:none;padding:0;border-radius:0}
table.dt{width:100%;border-collapse:collapse;background:#fff;
  border:1px solid #e4e9ef;border-radius:7px;overflow:hidden;font-size:14.5px}
table.dt th{background:#fafbfc;color:#6b7684;font-size:11.5px;letter-spacing:.05em;
  text-transform:uppercase;text-align:left;padding:11px 15px;
  border-bottom:1px solid #e4e9ef;font-weight:700}
table.dt td{padding:11px 15px;border-bottom:1px solid #eef1f5}
table.dt tr:last-child td{border-bottom:none}
table.dt td.mono{font-family:Consolas,monospace;font-size:13.5px;color:#6b7684}
table.dt td.now{background:#f2f7ff;color:#1f5fbd;font-weight:700}
/* lead list: search row, Add Field menu, applied filter */
.ui-search{background:#fff;border-bottom:1px solid #e4e9ef;padding:11px 16px;
  display:flex;align-items:center;gap:12px}
.ui-sgrp{position:relative;display:flex;align-items:stretch;flex:1 1 auto;
  max-width:540px;min-width:0}
.ui-sin{flex:1 1 auto;min-width:0;border:1px solid #ccd4dc;border-right:none;
  border-radius:4px 0 0 4px;padding:7px 11px;font-size:13.5px;background:#fff;
  white-space:nowrap;overflow:hidden}
.ui-sin.ph{color:#9aa5b1}
.ui-sbtn{display:inline-flex;align-items:center;justify-content:center;
  border:1px solid #ccd4dc;background:#f7f9fb;color:#5b6b7c;padding:0 13px;
  font-size:14px;white-space:nowrap}
.ui-sbtn.last{border-left:none;border-radius:0 4px 4px 0;font-weight:700;color:#4b5765}
.ui-total{margin-left:auto;font-size:12.5px;color:#8b97a5;font-weight:600;
  white-space:nowrap}
.ui-menu{position:absolute;top:39px;right:0;z-index:6;min-width:240px;background:#fff;
  border:1px solid #e4e9ef;border-radius:6px;box-shadow:0 14px 30px rgba(20,30,45,.17);
  padding:5px 0 7px;font-size:13.5px}
.ui-menu .hdr{font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;
  color:#9aa5b1;font-weight:700;padding:8px 15px 4px}
.ui-menu .qbox{margin:3px 11px 8px;border:1px solid #ccd4dc;border-radius:4px;
  padding:6px 10px;color:#9aa5b1;font-size:13px;background:#fff}
.ui-menu ul{list-style:none;margin:0;padding:0}
.ui-menu li .mi{display:flex;align-items:center;gap:8px;padding:7px 15px;color:#3a4653}
.ui-menu li.hi .mi{background:#eaf1fd;color:#1f5fbd;font-weight:700}
.ui-menu .div{height:1px;background:#eef1f5;margin:6px 0}
.ui-adv{background:#fff;border-bottom:1px solid #e4e9ef;padding:12px 16px;
  display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
.ui-fbox{flex:0 1 320px;min-width:250px}
/* currency input (create / edit form) */
.ui-cur{display:flex;align-items:stretch}
.ui-cur .in{flex:1 1 auto;min-width:0;border:1px solid #ccd4dc;border-right:none;
  border-radius:4px 0 0 4px;padding:7px 10px;background:#fff;
  font-family:Consolas,"SF Mono",Menlo,monospace;font-size:13.5px;text-align:right;
  white-space:nowrap;overflow:hidden}
.ui-cur .ad{display:inline-flex;align-items:center;border:1px solid #ccd4dc;
  background:#f2f5f8;color:#5b6b7c;border-radius:0 4px 4px 0;padding:0 11px;
  font-size:13px;font-weight:600}
.ui-cur .in.flash{background:#fff6d6;border-color:#e7b93c;
  box-shadow:0 0 0 3px rgba(242,201,76,.28);font-weight:700}
/* agenda week calendar */
.ui.cal-ui{background:#fff}
.ui-ctb{background:#fff;border-bottom:1px solid #e4e9ef;padding:9px 16px;
  display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.cgrp{display:inline-flex;gap:4px;align-items:center}
.cbtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  border-radius:4px;padding:5px 12px;font-size:13px;color:#4b5765;
  border:1px solid transparent}
.cbtn.sq{padding:5px 7px;color:#8b97a5}
.cbtn.on{font-weight:700;color:#1f5fbd;box-shadow:inset 0 -2px 0 #3080f0;
  border-radius:4px 4px 0 0}
.ctb-title{font-size:14.5px;font-weight:700;letter-spacing:-.01em;color:#26313d}
.ctb-modes{margin-left:auto;display:inline-flex;gap:2px;align-items:center}
.cal{background:#fff;color:#26313d;
  font:12.5px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.cal-head,.cal-row{display:grid;grid-template-columns:54px repeat(7,minmax(0,1fr))}
.cal-head{background:#fafbfc;border-bottom:1px solid #dfe4ea}
.cal-head>div+div{border-left:1px solid #eef1f5}
.cal-hc{padding:7px 3px}
.cal-day-header{display:flex;align-items:baseline;justify-content:center;gap:4px}
.cal-dow{color:#26313d;font-weight:400}
.cal-dom{min-width:18px;text-align:center;color:#26313d;font-weight:600;
  font-variant-numeric:tabular-nums}
.cal-hc.today .cal-dow,.cal-hc.today .cal-dom{color:#9f7322}
.cal-row{min-height:92px}
.cal-row+.cal-row .cal-time,.cal-row+.cal-row .cal-c{border-top:1px solid #eef1f5}
.cal-time{font-size:11px;color:#8b97a5;text-align:right;padding:5px 8px 0 0;
  font-variant-numeric:tabular-nums}
.cal-c{border-left:1px solid #eef1f5;padding:4px;min-width:0;overflow:hidden}
.cal-c.today{background:#fcf8e3}
.cal-ev{border-radius:3px;color:#fff;padding:4px 6px;
  border:1px solid rgba(0,0,0,.10);box-shadow:0 1px 2px rgba(20,30,45,.12)}
.cal-ev-time{font-size:11.5px;opacity:.95}
.cal-ev-title{font-weight:600;line-height:1.35}
.cal-ev .ui-num{background:#fff;color:#1f5fbd;box-shadow:0 0 0 1px rgba(0,0,0,.16);
  vertical-align:0}
.cal-chip{display:inline-flex;align-items:center;gap:3px;max-width:100%;
  border:1px solid currentColor;border-radius:3px;padding:0 4px;font-size:10px;
  line-height:1.7;margin:3px 4px 0 0;overflow:hidden}
.cal-chip svg{flex:none}
.cal-chip-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal-ev-user{display:flex;align-items:center;gap:5px;font-size:11px;margin-top:4px;
  overflow:hidden;white-space:nowrap}
.cal-ev-user .av{width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.88);
  color:#4b5765;font-size:8.5px;font-weight:700;display:inline-flex;align-items:center;
  justify-content:center;flex:none}
@media(max-width:760px){
  .ui-body.two{flex-direction:column}
  .ui-side{flex:1 1 auto;width:100%}
}
@media(max-width:900px){
  nav{position:static;height:auto;width:auto;flex:none}
  .layout{flex-direction:column;padding:0 14px}
  section{padding:24px 20px 26px}
  details.appx>summary,details.appx .inner{padding-left:20px;padding-right:20px}
  details.dev>summary{padding-left:16px;padding-right:16px}
  .dev-inner{padding-left:18px;padding-right:18px}
}
@media print{
  nav{display:none}
  body{background:#fff}
  section{break-inside:avoid;border:1px solid #ccc}
  .shot{break-inside:avoid}
  details.appx{display:none}
  details.dev{display:none}
}
`;

/* =================================================================== PAGE */
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" sizes="100x100" href="https://cgit.pro/wp-content/uploads/2024/02/fav_cgit-100x100.png">
<title>EspoCRM &mdash; Feature Guide</title>
<style>${CSS}</style>
</head>
<body>
<div class="layout">
<nav>
  <div class="brand">Contents</div>
  <ol>
    <li><a href="#whats-new">What&rsquo;s new</a></li>
    <li><a href="#catalogue">1. Product Service catalogue</a></li>
    <li><a href="#find">2. Search &amp; filter leads</a></li>
    <li><a href="#amount">3. Opportunity amount</a></li>
    <li><a href="#a">4. Desktop notifications</a></li>
    <li><a href="#b">5. Smarter history</a></li>
    <li><a href="#calls-ps">6. Calls show their product</a></li>
    <li><a href="#call-date-time">7. Call date &amp; time</a></li>
    <li><a href="#c">8. Calls fill themselves in</a></li>
    <li><a href="#d">9. Duplicate calls</a></li>
    <li><a href="#e">10. Dates &amp; times</a></li>
    <li><a href="#f">11. Meetings</a></li>
    <li><a href="#lead-owner">12. New records start with you</a></li>
    <li><a href="#calendar-week">13. Calendar week view</a></li>
    <li><a href="#calls-search">14. Find a call by its product</a></li>
    <li><a href="#meeting-reminders">15. Meetings remind you too</a></li>
    <li><a href="#lead-source">16. Facebook and WhatsApp on the lead form</a></li>
    <li><a href="#meetings-ps">17. Meetings show their product</a></li>
    <li><a href="#status">Quality &amp; safety</a></li>
  </ol>
</nav>

<main>
<header class="doc">
  <h1>EspoCRM Feature Guide</h1>
  <p class="sub">Seventeen improvements made to this EspoCRM instance, explained in plain
  language with a picture of each screen.</p>
  <div class="meta">
    <span>EspoCRM 10.0.8</span>
    <span>17 features</span>
    <span>Updated 19 October 2026</span>
  </div>
</header>

<section id="whats-new" class="lead">
  <h2>What&rsquo;s new</h2>
  <p class="lede">Everything below was added without changing the EspoCRM program itself,
  so a future upgrade will not lose any of it. Feature&nbsp;1 is the foundation the
  others are built on.</p>
  <div class="tablewrap">
  <table>
    <thead><tr><th>#</th><th>Feature</th><th>In plain words</th></tr></thead>
    <tbody>
${featureRows}
    </tbody>
  </table>
  </div>
  <div class="note plain"><b>About the pictures.</b> Each feature below that changes a
  screen is illustrated with a rendering of the real EspoCRM screen &mdash; the same
  fields, buttons and wording you see in the application. Small numbered dots on a
  picture are explained in the line directly beneath it.</div>
</section>

<!-- ==================================================================== 1 -->
<section id="catalogue">
  <h2><span class="tag">1</span>The Product Service catalogue</h2>
  <p class="lede">A brand-new record type &mdash; <b>Product Services</b> &mdash; now sits
  in EspoCRM beside Calls. It is simply the list of everything you
  sell, and it is what ties a lead to the calls made about it.</p>

  ${shot('The Product Services list', G1,
      li(1, 'The list of everything you sell, with how many records there are') +
      li(2, 'Each row shows name, category, type, price and whether it is still offered') +
      li(3, 'Adding, searching and filtering work exactly as they do for any other record type'))}

  ${shot('A single product service', G2,
      li(1, 'The Overview panel holds the fields that describe the product'))}

  ${shot('How a lead is linked to a product service', G3,
      li(1, 'Every lead carries the product service it is about, shown on the lead itself'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th>Field</th><th>What it holds</th></tr></thead>
    <tbody>
      <tr><td><b>Name</b></td><td>The product or service in your own words &mdash; required</td></tr>
      <tr><td><b>Category</b></td><td>Software, Hardware, Service, Consulting or Other &mdash; required, defaults to Software</td></tr>
      <tr><td><b>Type</b></td><td>Product, Service, Package or Subscription &mdash; required, defaults to Product</td></tr>
      <tr><td><b>Price</b></td><td>In Taka (&#2547;) &mdash; the one currency this system uses &mdash; required</td></tr>
      <tr><td><b>Status</b></td><td>Active, Inactive or Discontinued &mdash; required, defaults to Active</td></tr>
      <tr><td><b>Description</b></td><td>Free text for anything worth noting</td></tr>
      <tr><td><b>Assigned To / Teams</b></td><td>Who looks after this product, and which teams see it</td></tr>
      <tr><td><b>Created / Modified</b></td><td>Recorded automatically</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Two products exist today: <b>X &mdash; &#2547;20,000.00</b> and <b>Y &mdash; &#2547;30,000.00</b>, both Active.</li>
    <li class="yes">A product service is <b>required on every lead and every call</b> &mdash; that single rule is what powers features 5, 6 and 8.</li>
    <li class="yes">Leads can be searched by phone number and filtered by product service &mdash; see section&nbsp;2.</li>
    <li class="yes">Leads and calls belonging to a product are listed on the product&rsquo;s own page.</li>
  </ul>
</section>

<!-- ==================================================================== 2 -->
<section id="find">
  <h2><span class="tag">2</span>Searching and filtering the lead list</h2>
  <p class="lede">Three changes make the Leads list quicker to work with: you can type a
  phone number into the search box and get the right person, you can find a lead by part
  of its website, and you can cut the list down to the leads belonging to one product service.</p>

  ${shot('Finding a lead by typing part of a phone number', G4,
      li(1, 'Type any part of the number &mdash; the country code, the last eight digits or the whole thing') +
      li(2, 'The list reports how many leads matched') +
      li(3, 'Only the leads that match remain'))}

  ${shot('Where the Product Service filter lives', G5,
      li(1, 'The &hellip; button beside the search box opens the filter list') +
      li(2, 'Every field you can filter the list by') +
      li(3, '<b>Product Services</b> is placed first, so it needs no searching for'))}

  ${shot('The list after the filter is chosen', G6,
      li(1, 'The chosen filter appears above the list, with the product you picked') +
      li(2, 'The list is narrowed to the leads for that product') +
      li(3, 'Click the <b>Y</b> on the chip to take the filter off again'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th>Where the list search looks</th><th>Example that works</th></tr></thead>
    <tbody>
      <tr><td>Name (first and last)</td><td><code>jihad</code></td></tr>
      <tr><td>Account name</td><td><code>Delta</code></td></tr>
      <tr><td>Email address</td><td><code>sales@</code></td></tr>
      <tr><td>Address &mdash; street and city</td><td><code>Dhaka</code></td></tr>
      <tr><td><b>Phone number</b> <span class="new">new</span></td><td><code>01716099707</code>,
          <code>017</code> or <code>1820154087</code></td></tr>
      <tr><td><b>Website</b> <span class="new">new</span></td><td><code>cgitapps</code>,
          <code>example.com</code> or <code>https://zz-website</code></td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Part of a number is enough &mdash; the search looks inside the number, so <b>017</b>,
        <b>16099707</b> and a full number all find the same lead.</li>
    <li class="yes">Part of a website is enough &mdash; the search looks <em>inside</em> the
        link, so <b>cgitapps</b>, <b>example.com</b> and a full web address all find the same lead.</li>
    <li class="yes">The search box in the application&rsquo;s top bar finds leads by number as well.</li>
    <li class="yes">You can also filter by status, assigned user, team, date, industry and the rest &mdash;
        the product filter simply sits at the top of the list.</li>
    <li class="yes">More than one product can be chosen at a time, and several filters can be used together.</li>
    <li class="yes">Everything is cleared with the &times; button next to the search box.</li>
    <li class="no">Meetings and emails are not affected &mdash; this applies to the Leads list only.</li>
  </ul>
</section>

<!-- ==================================================================== 3 -->
<section id="amount">
  <h2><span class="tag">3</span>The opportunity amount fills itself in</h2>
  <p class="lede">While you are creating a lead, choosing its product service also works
  out the <b>Opportunity Amount</b> on the same form from that product&rsquo;s price.
  Choose two products and the two prices are added together.</p>

  ${shot('A new lead with one product chosen', H1,
      li(1, 'The product service you picked &mdash; the same field from section&nbsp;1') +
      li(2, 'The price of that product is put straight into Opportunity Amount') +
      li(3, 'Marked so you can see it was filled in for you, not by you'))}

  ${shot('The same lead after a second product is added', H2,
      li(1, 'A second product can be added to the same lead') +
      li(2, 'The prices are added together: 20,000.00 + 30,000.00 = 50,000.00') +
      li(3, 'The total replaces the previous figure automatically'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:44%">What you do</th><th>What happens to Opportunity Amount</th></tr></thead>
    <tbody>
      <tr><td>choose one product service</td><td>that product&rsquo;s price is put in &mdash;
          &#2547;20,000.00 for product X</td></tr>
      <tr><td>choose a second product service</td><td>the two prices are added together &mdash;
          &#2547;20,000.00 + &#2547;30,000.00 = &#2547;50,000.00</td></tr>
      <tr><td>take every product back out</td><td>the field is emptied</td></tr>
      <tr><td>type a figure of your own and leave the products alone</td><td>your figure stays exactly as you typed it</td></tr>
      <tr><td>type a figure of your own, then change the products again</td><td>your figure is replaced by the new total</td></tr>
      <tr><td>pick a product that has no price yet</td><td>it adds nothing &mdash; the rest still count</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Works both on the full lead form and on the smaller quick-create window.</li>
    <li class="yes">The amount sits in the <b>Details</b> panel, just below Status and Source.</li>
    <li class="yes">Amounts are always whole Taka &mdash; a price with a fraction is rounded.</li>
    <li class="yes">Nothing is saved until you press Save, so the figure can still be corrected by hand.</li>
    <li class="no">The price used is the product&rsquo;s price at that moment. If you change a
        product&rsquo;s price later, leads already saved keep the amount they were given.</li>
  </ul>
</section>

<!-- ==================================================================== 4 -->
<section id="a">
  <h2><span class="tag">4</span>Desktop notifications</h2>
  <p class="lede">A bell in the top bar lets you switch on alerts that reach your
  computer directly &mdash; a call reminder, for example, will still arrive with the
  browser closed.</p>

  ${shot('The bell in the top bar', A1,
      li(1, 'The bell &mdash; click it once to turn notifications on or off') +
      li(2, 'Green means on; grey means off or unavailable; red means the browser has blocked them'))}

  ${shot('What then arrives on your desktop', A2,
      li(1, 'A normal system notification, shown by Windows / the browser') +
      li(2, 'Clicking it opens that record straight away'))}

  <ul class="bullets">
    <li class="yes">Notifications are only ever switched on by you clicking the bell &mdash; no pop-ups appear on their own.</li>
    <li class="yes">You can mute individual categories from your preferences.</li>
    <li class="yes">The same bell shows at a glance whether notifications are on, off or blocked.</li>
    <li class="yes">The banner carries your own logo rather than the EspoCRM one.</li>
    <li class="no">Needs HTTPS (or localhost) and the scheduled job to be running.</li>
  </ul>

  <div class="note"><b>Brave says &ldquo;Notifications were not enabled&rdquo;?</b>
  Brave blocks web push by default, so the bell turns on and then quietly fails.
  Open <code>brave://settings/privacy</code>, switch on <b>Use Google services for
  push messaging</b>, close Brave completely and start it again, then click the bell
  once more. The restart is required &mdash; the switch does nothing until Brave is
  reopened. Chrome, Edge and Firefox need no extra step.</div>
</section>

<!-- ==================================================================== 2 -->
<section id="b">
  <h2><span class="tag">5</span>Smarter history</h2>
  <p class="lede">A record&rsquo;s History panel used to list every activity in the
  company. It now shows only the activity belonging to that record&rsquo;s own product
  service (the catalogue from section&nbsp;1), so you see the relevant calls and nothing
  else.</p>

  ${shot('The same History panel, before and after', B,
      li(1, 'A chip shows which product service the list is filtered to') +
      li(2, 'Activity belonging to other products is removed') +
      li(3, 'Meetings and emails carry no product service, so they are hidden while a filter is on'))}

  <ul class="bullets">
    <li class="yes">The filter switches on automatically &mdash; nothing to click.</li>
    <li class="yes">A record with no product service still shows its full history.</li>
    <li class="yes">The list refreshes as soon as you save the record.</li>
  </ul>
</section>

<!-- ==================================================================== 6 -->
<section id="calls-ps">
  <h2><span class="tag">6</span>Every call shows its product service</h2>
  <p class="lede">A call now carries the product it is about, exactly as a lead does.
  It gets its own column in the Calls list, so you can see at a glance which product
  a call belongs to without opening anything &mdash; and it is required, so no call
  is ever filed against nothing at all.</p>

  ${shot('The Calls list', K1,
      li(1, 'Name, Parent, Status, Date Start and Assigned User are all exactly as they were') +
      li(2, 'A new <b>Product Services</b> column sits between Parent and Status') +
      li(3, 'The product each call is about &mdash; Y or X &mdash; readable straight from the list'))}
</section>

<!-- ==================================================================== 7 -->
<section id="call-date-time">
  <h2><span class="tag">7</span>Call date and time fill themselves in</h2>
  <p class="lede">Two fields &mdash; <b>Call Date</b> and <b>Call Time</b> &mdash; now sit on
  every call form, and both arrive already filled in: today&rsquo;s date, and the time
  right now. A small grey line under each one spells out what those boxes mean &mdash;
  <b>Today</b>, <b>Today 03:57 PM</b> &mdash; so nothing has to be decoded before the
  call can be saved.</p>

  ${shot('A new call, the moment it is opened', L1,
      li(1, 'Call Date is already set to today, and its grey line reads <b>Today</b>') +
      li(2, 'Call Time is already set to the current minute, and its line reads <b>Today 03:57 PM</b>') +
      li(3, 'Fill in the description and the whole form is complete'))}

  ${shot('How the two fields read once the call is saved', L2,
      li(1, 'Call Date reads simply <b>Today</b>') +
      li(2, 'Call Time reads <b>Today 03:57 PM</b> &mdash; the exact minute the call was made'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:40%">About</th><th>What happens</th></tr></thead>
    <tbody>
      <tr><td><b>Call Date</b></td><td>a date field, defaulted to the day you open the form</td></tr>
      <tr><td><b>Call Time</b></td><td>a date-and-time field, defaulted to the moment you open the form</td></tr>
      <tr><td>Both fields</td><td>required &mdash; a call cannot be saved without them</td></tr>
      <tr><td>The time picker</td><td>offers half-hour steps, while the default is the exact minute you opened the form</td></tr>
      <tr><td>In the form</td><td>they read <b>02/10/2026</b> and <b>03:57 PM</b>, the local format from section&nbsp;10</td></tr>
      <tr><td>The grey line</td><td>under each field spells the value out as <b>Today</b>, <b>Tomorrow</b> or <b>Yesterday</b> &mdash; and moves the moment you pick another day</td></tr>
      <tr><td>Any other date</td><td>the Call Date line stays silent, since the box already reads that date; the Call Time line shows the full date and time</td></tr>
      <tr><td>On the saved record</td><td>they read <b>Today</b> and <b>Today 03:57 PM</b></td></tr>
      <tr><td>After saving</td><td>they never move on their own &mdash; correct them by hand if the call was logged at another time</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Both fields sit just below Date Start, Date End, Duration and Product Services &mdash; in the full form and the small pop-up alike.</li>
    <li class="yes">Because they arrive filled in, saving a call needs only two things: pick the lead and write the note.</li>
    <li class="yes">The grey line is only there to be read &mdash; the real date and time stay in the boxes, and that is what gets saved.</li>
    <li class="yes">They describe <i>when the call was logged</i>; Date Start and Date End still describe <i>when it happens</i>.</li>
    <li class="yes">The values are stored, so the figure you read is the figure that was true at the time.</li>
  </ul>
</section>

<!-- ==================================================================== 8 -->
<section id="c">
  <h2><span class="tag">8</span>Calls fill themselves in</h2>
  <p class="lede">When you set a call&rsquo;s parent to a lead, the form completes
  itself: the name comes from the lead and the product service &mdash; from the catalogue
  in section&nbsp;1 &mdash; is chosen for you. If that lead covers several products, you
  are asked which one applies. The same happens on a meeting: set its parent to a lead
  and the products arrive there too.</p>

  ${shot('The moment a lead is chosen', C1,
      li(1, 'Name is taken from the lead, unless you have typed your own') +
      li(2, 'Parent is set to the lead') +
      li(3, 'Product service fills itself in &mdash; a required field you no longer chase'))}

  ${shot('When the lead covers several products, you pick', C2,
      li(1, 'Only the products belonging to that lead are offered') +
      li(2, 'Tick the ones you want &mdash; the Select button stays disabled until you do') +
      li(3, 'Or click a product name to take just that one and close the box'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:46%">If the lead&hellip;</th><th>Then</th></tr></thead>
    <tbody>
      <tr><td>has no product service</td><td>nothing happens &mdash; the field is left for you</td></tr>
      <tr><td>has exactly one product service</td><td>it is filled in straight away, no questions asked</td></tr>
      <tr><td>has two or more product services</td><td>a selection box opens so you can choose</td></tr>
      <tr><td>you tick nothing in the box</td><td>nothing is applied and the field stays as it was</td></tr>
      <tr><td>you already filled the field yourself</td><td>your choice is never overwritten</td></tr>
      <tr><td>you change your mind and pick a different lead</td><td>the previous answer is replaced with the new lead&rsquo;s products</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Meetings behave the same &mdash; parent a lead and the products fill themselves in, picker included, even in the small calendar form.</li>
    <li class="yes">Product Services is required on a meeting too, so a multi-product lead left unanswered blocks Save there just as it does on a call.</li>
  </ul>
</section>

<!-- ==================================================================== 4 -->
<section id="d">
  <h2><span class="tag">9</span>Duplicate calls start with a clean description</h2>
  <p class="lede">Open the &hellip; menu on any call and choose <b>Duplicate</b>. A brand-new
  call form opens with everything carried over from the original &mdash; the parent, the dates,
  the duration, the product service and the attendees &mdash; except the <b>Description</b>,
  which arrives empty. Nothing stops you duplicating; you simply have to write what the new
  call was about before it can be saved.</p>

  ${shot('The form that Duplicate opens', D,
      li(1, 'Parent comes across exactly as it was, with the dates, duration and attendees') +
      li(2, 'So does the product service &mdash; the new call is still about the same product') +
      li(3, 'Description is empty and required, so saving is refused until you type it'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:44%">On the duplicated form</th><th>What happens</th></tr></thead>
    <tbody>
      <tr><td>Name and Parent</td><td>carried over from the original call</td></tr>
      <tr><td>Date Start, Date End and Duration</td><td>carried over</td></tr>
      <tr><td>Call Date and Call Time</td><td>carried over</td></tr>
      <tr><td>Product Services, attendees, assigned user</td><td>carried over</td></tr>
      <tr><td><b>Description</b></td><td><b>emptied &mdash; you must type it before the call can be saved</b></td></tr>
      <tr><td>The &ldquo;reminder already sent&rdquo; mark</td><td>cleared, so the new call is treated as its own record</td></tr>
      <tr><td>The old history note</td><td>not copied &mdash; the new record starts its own</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Duplicating is never blocked &mdash; the empty description is the only thing between you and Save.</li>
    <li class="yes">Because Description is required, no duplicate can ever be filed with a blank note.</li>
    <li class="yes">The original call is left exactly as it was; nothing on it is edited or removed.</li>
    <li class="no">Status is not carried over either &mdash; the new call starts at Planned, its default.</li>
  </ul>
</section>

<!-- ==================================================================== 5 -->
<section id="e">
  <h2><span class="tag">10</span>Dates and times in local format</h2>
  <p class="lede">The whole application now uses the 12-hour clock and day-first dates,
  set to Dhaka time. Nothing needed reprogramming &mdash; it was a setting.</p>

  ${shot('Everywhere dates and times appear', E,
      li(1, 'The highlighted column is what you see now'))}

  <ul class="bullets">
    <li class="yes">While you are typing, dates read <b>02/10/2026</b> and times read <b>02:30 PM</b>.</li>
    <li class="yes">Lists and record pages keep the friendly reading &mdash; <b>Today</b>, <b>Yesterday</b>, <b>02 Oct</b>, <b>Today 03:57 PM</b> &mdash; exactly as before.</li>
    <li class="yes">Time zone is Asia/Dhaka (UTC+6) throughout.</li>
    <li class="yes">Stored records are untouched &mdash; only the display changed, so no data was migrated.</li>
    <li class="no">The date separator changed from a full stop to a slash; it can be put back in one line if preferred.</li>
  </ul>
</section>

<!-- ==================================================================== 6 -->
<section id="f">
  <h2><span class="tag">11</span>Meetings start faster</h2>
  <p class="lede">Creating a meeting used to need two bits of typing before you could
  save. Now the meeting name fills itself in from whoever the meeting is about, and you
  are already listed in the attendance panel.</p>

  ${shot('A new meeting, a moment after the parent was chosen', F,
      li(1, 'Parent set to a lead, account, contact, opportunity or case') +
      li(2, 'The name takes the parent&rsquo;s name &mdash; highlighted because it was filled in for you; a name you type yourself is never overwritten') +
      li(3, 'You are already on the invite, so the meeting can be saved immediately'))}

  <ul class="bullets">
    <li class="yes">Switching the parent updates the name automatically.</li>
    <li class="yes">Typing your own name first is respected &mdash; it will not be replaced.</li>
    <li class="yes">Attendance is only pre-filled on a new meeting; existing meetings are never altered.</li>
    <li class="yes">Smaller pop-up forms behave the same way.</li>
  </ul>
</section>

<!-- ==================================================================== 12 -->
<section id="lead-owner">
  <h2><span class="tag">12</span>New records start with you as their owner</h2>
  <p class="lede">Opening any of the five create forms &mdash; a product, an account,
  a call, a meeting or a lead &mdash; used to leave <b>Assigned User</b> empty, so a new
  record arrived with nobody on it and it was easy to forget who was meant to look after
  it. They now arrive already set to <b>you</b> &mdash; whoever happens to be signed in.</p>

  ${shot('A new lead, with its owner already set', M1,
      li(1, 'Assigned User already holds the person creating the lead') +
      li(2, 'Teams is left empty &mdash; it is yours to fill in only if you want to'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:44%">What you do</th><th>Who the record belongs to</th></tr></thead>
    <tbody>
      <tr><td>open any of the five create forms</td><td>you &mdash; set before the form even opens</td></tr>
      <tr><td>open a record that already exists</td><td>unchanged &mdash; only new records are affected</td></tr>
      <tr><td>pick somebody else, then save</td><td>the person you picked &mdash; the starting value is only a suggestion</td></tr>
      <tr><td>leave it alone and press Save</td><td>you</td></tr>
      <tr><td>sign in as somebody else and create a record</td><td>that person &mdash; it is always whoever is signed in</td></tr>
      <tr><td>use the smaller pop-up form instead</td><td>you &mdash; it behaves exactly the same way</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">One less field to fill in on every record you create.</li>
    <li class="yes">The five are product, account, call, meeting and lead &mdash; every other entity keeps core&rsquo;s behaviour.</li>
    <li class="yes">It is only a starting point &mdash; nothing is saved until you press Save.</li>
    <li class="yes">The record goes on showing you as its owner until somebody changes it.</li>
    <li class="no">Records brought in by import, by another integration or by a workflow are not touched.</li>
    <li class="no">Existing records are never re-assigned &mdash; the rule applies only while a record is being created.</li>
  </ul>
</section>

<!-- ==================================================================== 13 -->
<section id="calendar-week">
  <h2><span class="tag">13</span>The calendar week reads like the month</h2>
  <p class="lede">The <b>Week</b> view is where the day is actually spent, and it did not
  look like the rest of the calendar: today was not marked in any way, each day was headed
  by a single line of <b>Mon 05</b>, and an entry showed nothing but its time and its title.
  Week now follows the <b>Month</b> view&rsquo;s language, so the two screens read the same.</p>

  ${shot('The calendar, week view', CAL,
      li(1, 'The range you are looking at, with both ends named') +
      li(2, 'Today &mdash; its column is tinted and its heading turns amber') +
      li(3, 'The mode you are in stays underlined') +
      li(4, 'An entry long enough to read carries its type, its status and the people on it') +
      li(5, 'A short entry keeps to its time and its title'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:44%">Where</th><th>What you see now</th></tr></thead>
    <tbody>
      <tr><td>The day headings, in Week and Day</td><td>the weekday over the date &mdash; <b>Mon</b> in ordinary weight, <b>5</b> in bold, centred on the column</td></tr>
      <tr><td>Today, in Week and Day</td><td>the column carries the same pale tint as today&rsquo;s cell in Month, and its heading is amber</td></tr>
      <tr><td>An entry of 45 minutes or more</td><td>time, title, then a chip for the record type and a chip for its status &mdash; a tick when it is finished</td></tr>
      <tr><td>An entry shorter than 45 minutes</td><td>time and title only, exactly as before</td></tr>
      <tr><td>An all-day entry</td><td>the type and status chips are always shown</td></tr>
      <tr><td>People on the entry</td><td>still listed under the title, with their avatar</td></tr>
      <tr><td>The title at the top</td><td>the range itself &mdash; <b>4 Oct 2026 &ndash; 10 Oct 2026</b> &mdash; instead of the month name</td></tr>
      <tr><td>Hour marks and entry times</td><td>tabular figures, so they line up down the gutter</td></tr>
      <tr><td>Under 560px wide</td><td>the weekday and the date stack instead of running out of room</td></tr>
      <tr><td>Month and Timeline</td><td>not part of this change &mdash; no weekday-and-date headings, no chips</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Today is unmistakable at a glance, in both Week and Day.</li>
    <li class="yes">The two chips answer &ldquo;what is this and where is it up to&rdquo; without opening the record.</li>
    <li class="yes">Times are aligned down the gutter and across the entries, so a busy day is easy to scan.</li>
    <li class="yes">Only the rendering changed &mdash; the same events, colours, filters, drag-and-drop, week navigation and refresh are all exactly as they were.</li>
    <li class="yes">It is four small files in the project&rsquo;s own folders; the EspoCRM program itself is untouched.</li>
    <li class="no">Entries under 45 minutes stay plain on purpose &mdash; two chips on a one-line bar would crowd it out.</li>
    <li class="no">Month keeps its own headings; the type and status chips are a Week and Day feature.</li>
  </ul>
</section>

<!-- ==================================================================== 14 -->
<section id="calls-search">
  <h2><span class="tag">14</span>Find a call by its product</h2>
  <p class="lede">The search box on the Calls list no longer looks at the call name alone.
  Type the name of a product service and the calls about that product come back too
  &mdash; no need to open each call to see what it was about.</p>

  ${shot('Searching the Calls list', K1s,
      li(1, 'A product service name is typed into the search box') +
      li(2, 'A call about Y and X is still one row, listed once') +
      li(3, 'The total counts the calls shown, not the joined rows'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:40%">You type</th><th>What comes back</th></tr></thead>
    <tbody>
      <tr><td><b>MIH</b></td><td>every call whose name starts with MIH, exactly as before</td></tr>
      <tr><td><b>Y</b></td><td>every call about the product service Y</td></tr>
      <tr><td><b>Widget</b></td><td>calls about <b>ZetaWidget5000</b> &mdash; a product name matches anywhere in the text</td></tr>
      <tr><td><b>ZZZZQQ</b></td><td>nothing, because nothing matches</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">A call about two products is still one row &mdash; searching never shows the same call twice.</li>
    <li class="yes">Sorting keeps working while a search is on, whatever column the list is ordered by.</li>
    <li class="yes">Filters, primary filters and the count above the list behave exactly as they did.</li>
    <li class="no">A product name matches anywhere in the text from four characters up; a shorter search still matches from the start of the name.</li>
    <li class="no">The call name itself still matches from the start only &mdash; that is core EspoCRM behaviour and was left alone.</li>
    <li class="no">The Leads list keeps its own search, which matches the lead fields from section&nbsp;2 and does not look at products.</li>
  </ul>
</section>

<!-- ==================================================================== 15 -->
<section id="meeting-reminders">
  <h2><span class="tag">15</span>Meetings remind you too</h2>
  <p class="lede">The reminder that already fires for calls now fires for meetings: the moment a
  meeting&rsquo;s Date Start arrives, the person it is assigned to is told &mdash; a pop-up while the
  app is open, a line in the notification panel, and a desktop notification if the bell from
  section&nbsp;4 is on. Nothing has to be set up.</p>

  ${shot('The reminder when a meeting starts', MR1,
      li(1, 'The title reads Meeting Reminder') +
      li(2, 'The meeting is named, and told that it is starting now'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:40%">About</th><th>What happens</th></tr></thead>
    <tbody>
      <tr><td><b>Who is reminded</b></td><td>the meeting&rsquo;s Assigned User</td></tr>
      <tr><td><b>When</b></td><td>the moment the meeting&rsquo;s Date Start is reached &mdash; once, not every minute</td></tr>
      <tr><td>Meetings already passed</td><td>a meeting whose time has just gone by still catches up with one reminder, for up to a day</td></tr>
      <tr><td>Status</td><td>only while the meeting is still <b>Planned</b> &mdash; Held or Not Held meetings are left alone</td></tr>
      <tr><td>Where it appears</td><td>pop-up, notification panel and desktop notification, the same three places as the call reminder</td></tr>
      <tr><td>Meeting time changed</td><td>the old reminder disappears and a new one waits for the new time</td></tr>
      <tr><td>Clicking it</td><td>opens the meeting, from the notification or the desktop alert alike</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">Nothing has to be set up: every planned meeting with an assigned user and a Date Start is covered from now on.</li>
    <li class="yes">The reminder fires once per meeting time, however often the scheduler runs.</li>
    <li class="yes">Meeting reminders travel the same road as call reminders &mdash; pop-up, panel and push &mdash; and are labelled separately, so one can be muted without the other.</li>
  </ul>
</section>

<!-- ================================================16 -->
<section id="lead-source">
  <h2><span class="tag">16</span>Facebook and WhatsApp on the lead form</h2>
  <p class="lede">Two of the ways leads actually arrive were missing from the form. The
  <b>Source</b> dropdown now lists <b>Facebook</b> and <b>Whatsapp</b> alongside the
  built-in entries, and the small type list next to <b>Phone</b> gained a <b>Whatsapp</b>
  label, so a WhatsApp number can say what it is.</p>

  ${shot('The Details panel of a new lead', LS1,
      li(1, 'Source now offers Facebook and Whatsapp, before Others') +
      li(2, 'The phone type list gained Whatsapp, between Fax and Other'))}

  <div class="tablewrap">
  <table>
    <thead><tr><th style="width:44%">Where</th><th>What changed</th></tr></thead>
    <tbody>
      <tr><td><b>Source</b> on the lead form</td><td>two more entries &mdash; <b>Whatsapp</b> and <b>Facebook</b> &mdash; sitting before Others</td></tr>
      <tr><td><b>Phone</b>&rsquo;s type list</td><td>a <b>Whatsapp</b> label between Fax and Other, so the number says it is a WhatsApp one</td></tr>
      <tr><td>Filters and lists</td><td>the new sources appear everywhere the source list does &mdash; filter by Facebook with no extra setup</td></tr>
      <tr><td>Leads already saved</td><td>untouched &mdash; their source keeps whatever it had</td></tr>
      <tr><td>Other entities</td><td>unchanged &mdash; these two lists belong to the lead alone</td></tr>
    </tbody>
  </table>
  </div>

  <ul class="bullets">
    <li class="yes">An empty source is still allowed &mdash; the first entry in the list is deliberately blank.</li>
    <li class="yes">Both lists are plain labels: renaming Whatsapp to WhatsApp everywhere is a one-word change.</li>
    <li class="no">The phone type is a label only &mdash; it does not dial or open WhatsApp for you.</li>
  </ul>
</section>

<!-- ================================================17 -->
<section id="meetings-ps">
  <h2><span class="tag">17</span>Every meeting shows its product service</h2>
  <p class="lede">Meetings now carry their product exactly the way calls do. The Meetings
  list has its own <b>Product Services</b> column, sitting between Parent and Status, so
  the product a meeting is about can be read straight from the list &mdash; and the field
  is required, so no meeting is ever filed against nothing at all.</p>

  ${shot('The Meetings list', MK1,
      li(1, 'Name, Parent, Status, Date Start and Assigned User are as they were') +
      li(2, 'A <b>Product Services</b> column sits between Parent and Status') +
      li(3, 'The product each meeting is about &mdash; Y or X &mdash; readable straight from the list'))}
</section>

<!-- ==================================================================== 7 -->
<section id="status">
  <h2>Quality &amp; safety</h2>
  <ul class="bullets">
    <li class="yes">No part of the EspoCRM core program was modified &mdash; everything lives in the project&rsquo;s own extension folders.</li>
    <li class="yes">An EspoCRM upgrade will therefore not overwrite any of this work.</li>
    <li class="yes">Nothing here stores data outside the existing database tables.</li>
  </ul>
</section>

<footer>
  EspoCRM Feature Guide &middot; version 1.6 &middot; updated 19 October 2026
</footer>
</main>
</div>
<script>
(function () {
  var links = document.querySelectorAll('nav a[href^="#"]');
  var items = [];
  for (var i = 0; i < links.length; i++) {
    var id = links[i].getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) items.push({ link: links[i], el: el });
  }
  if (!items.length) return;
  function mark() {
    var line = 150;
    var chosen = 0;
    for (var j = 0; j < items.length; j++) {
      if (items[j].el.getBoundingClientRect().top <= line) chosen = j;
    }
    var atEnd = (window.innerHeight + window.pageYOffset) >= (document.documentElement.scrollHeight - 4);
    if (atEnd) chosen = items.length - 1;
    for (var k = 0; k < items.length; k++) {
      var on = (k === chosen);
      if (on) {
        items[k].link.classList.add('active');
        items[k].link.setAttribute('aria-current', 'location');
      } else {
        items[k].link.classList.remove('active');
        items[k].link.removeAttribute('aria-current');
      }
    }
  }
  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () { queued = false; mark(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  mark();
})();
</script>
</body>
</html>
`;

fs.mkdirSync(OUT, { recursive: true });
const page = withDevNotes(html);
fs.writeFileSync(path.join(OUT, 'index.html'), page, 'utf8');
console.log('written:', path.join(OUT, 'index.html'), page.length, 'bytes');
