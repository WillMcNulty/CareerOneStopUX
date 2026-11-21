/* CareerOneStop redesign prototype (CS 4501 P4). Static, no build step. Routes live in the page address
   after "#", so the browser Back button and "Back to N results" return to the same filtered list (B3). */
(function () {
  'use strict';
  var D = window.DATA;
  var app = document.getElementById('app');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('en-US'); }
  function nameOf(list, id) { for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i][1]; return id; }
  function csv(v) { return v ? v.split(',').filter(Boolean) : []; }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('c1p4.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('c1p4.' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var sess = {
    get: function (k) { try { return sessionStorage.getItem('c1p4.' + k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem('c1p4.' + k, v); } catch (e) { } }
  };

  /* ---------- dates ---------- */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dayFrom(offset) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
  function fmt(d, year) { return MON[d.getMonth()] + ' ' + d.getDate() + (year ? ', ' + d.getFullYear() : ''); }
  function deadlineHTML(a) {
    var d = fmt(dayFrom(a.dueIn), true);
    if (a.dueIn < 0) return '<strong>' + d + '</strong> <span class="closed">Deadline passed</span>';
    var left = a.dueIn === 0 ? 'due today' : a.dueIn === 1 ? '1 day left' : a.dueIn + ' days left';
    return '<strong>' + d + '</strong> (' + left + ')' + (a.dueIn <= 14 ? ' <span class="soon">Due soon</span>' : '');
  }

  /* ---------- routing ---------- */
  function qs(obj) {
    var u = new URLSearchParams();
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if (Array.isArray(v)) { if (v.length) u.set(k, v.join(',')); }
      else if (v !== '' && v !== null && v !== undefined && v !== false) u.set(k, v);
    });
    var s = u.toString();
    return s ? '?' + s : '';
  }
  function parse() {
    var h = location.hash.replace(/^#/, '') || '/';
    var i = h.indexOf('?');
    return { path: i < 0 ? h : h.slice(0, i), q: new URLSearchParams(i < 0 ? '' : h.slice(i + 1)) };
  }
  function render() {
    var r = parse(), p = r.path.split('/').filter(Boolean), html, nav = '';
    if (!p.length) { html = vHome(); nav = 'home'; }
    else if (p[0] === 'search') { html = vSearch(r.q.get('q') || ''); nav = 'home'; }
    else if (p[0] === 'scholarships' && p[1] === 'profile') { html = vProfile(); nav = 'sch'; }
    else if (p[0] === 'scholarships' && p[1]) { html = vAward(p[1], r.q); nav = 'sch'; }
    else if (p[0] === 'scholarships') { html = vSch(r.q); nav = 'sch'; }
    else if (p[0] === 'jobs' && p[1]) { html = vJob(p[1], r.q); nav = 'jobs'; }
    else if (p[0] === 'jobs') { html = vJobs(r.q); nav = 'jobs'; }
    else if (p[0] === 'saved') { html = vSaved(p[1] === 'jobs' ? 'jobs' : 'sch'); nav = 'saved'; }
    else if (p[0] === 'ni') { html = vNI(decodeURIComponent(p[1] || 'This page')); }
    else { html = vNI('This page'); }
    app.innerHTML = html;
    $$('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === nav); });
    updateSavedCount();
    window.scrollTo(0, 0);
  }

  /* ---------- saved items (no account needed, 1.7) ---------- */
  function saved(kind) { return store.get(kind === 'jobs' ? 'savedJobs' : 'savedSch', []); }
  function setSaved(kind, ids) { store.set(kind === 'jobs' ? 'savedJobs' : 'savedSch', ids); }
  function isSaved(kind, id) { return saved(kind).indexOf(id) >= 0; }
  function updateSavedCount() { $('#savedN').textContent = saved('sch').length + saved('jobs').length; }
  function saveBtn(kind, id, small) {
    var on = isSaved(kind, id);
    return '<button type="button" class="btn save' + (small ? ' small' : '') + '" data-save="' + kind + ':' + id + '" aria-pressed="' + on + '">' + (on ? 'Saved ✓' : 'Save') + '</button>';
  }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  /* ---------- notices and toast ---------- */
  function notice(title, body) {
    $('#noticeT').textContent = title; $('#noticeB').textContent = body;
    var d = $('#notice'); if (d.showModal) d.showModal(); else alert(title + '\n\n' + body);
  }
  var toastTimer;
  function toast(html) {
    var t = $('#toast'); t.innerHTML = html; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 9000);
  }

  /* ---------- shared pieces ---------- */
  function opts(list, sel, first) {
    return (first ? '<option value="">' + first + '</option>' : '') + list.map(function (o) {
      return '<option value="' + o[0] + '"' + (String(o[0]) === String(sel) ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
    }).join('');
  }
  function multi(name, sel) {
    return '<div class="multi" data-multi="' + name + '"><input type="search" placeholder="Type to search majors" aria-label="Search majors">' +
      '<div class="bubbles">' + D.MAJORS.map(function (m) {
        var on = sel.indexOf(m[0]) >= 0;
        return '<button type="button" class="bubble' + (on ? ' on' : '') + '" data-v="' + m[0] + '" aria-pressed="' + on + '">' + esc(m[1]) + '</button>';
      }).join('') + '</div></div>';
  }
  function multiVal(root, name) { return $$('[data-multi="' + name + '"] .bubble.on', root).map(function (b) { return b.getAttribute('data-v'); }); }
  function checked(form, name) { return $$('input[name="' + name + '"]:checked', form).map(function (i) { return i.value; }); }
  function gpaOk(v) { return v === '' || (/^\d(\.\d{1,2})?$/.test(v) && parseFloat(v) <= 4); }
  function pager(total, ps, p, base, params) {
    var pages = Math.max(1, Math.ceil(total / ps));
    if (pages < 2) return '';
    function link(n, label) { var o = Object.assign({}, params, { p: n > 1 ? n : '' }); return '<a class="btn small" href="#' + base + qs(o) + '">' + label + '</a>'; }
    return '<div class="pager">' + (p > 1 ? link(p - 1, '← Previous') : '') + '<span>Page ' + p + ' of ' + pages + '</span>' + (p < pages ? link(p + 1, 'Next →') : '') + '</div>';
  }
  function psSelect(ps) { return '<label>Show <select data-sel="ps">' + opts([[10, '10'], [25, '25'], [50, '50']], ps) + '</select> per page</label>'; }
  function recover(items, match, state, variants) {
    return variants.map(function (v) {
      var s2 = Object.assign({}, state, v.patch, { p: 1 });
      return { label: v.label, n: items.filter(function (x) { return match(x, s2); }).length, state: s2 };
    }).filter(function (v) { return v.n > 0; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 3);
  }

  /* ================= HOME ================= */
  function vHome() {
    function card(href, ico, title, text) { return '<a class="card" href="' + href + '"><div class="ico" aria-hidden="true">' + ico + '</div><strong>' + title + '</strong><span>' + text + '</span></a>'; }
    return '<section class="hero"><h1>What are you looking for?</h1>' +
      '<form id="siteSearch" class="sitesearch" autocomplete="off"><label class="sr" for="ss">Search the site</label>' +
      '<input id="ss" type="search" placeholder="Search the site, for example: nursing scholarships or analyst jobs">' +
      '<button class="btn primary">Search</button><div id="ssSug" class="sug" hidden></div></form>' +
      '<p class="hint">Type what you need and we will point you to the right tool.</p></section>' +
      '<section class="cards4">' +
      card('#/jobs', '💼', 'Find a Job', 'Browse and search job postings.') +
      card('#/scholarships/profile', '🎓', 'Find Scholarships', 'Money for school you do not pay back.') +
      card('#/ni/Explore%20Careers', '🧭', 'Explore Careers', 'Learn about occupations.') +
      card('#/ni/Get%20Training', '💻', 'Get Training', 'Find programs and courses.') + '</section>';
  }
  function direction(t) {
    t = t.toLowerCase();
    var sch = /scholar|grant|aid|tuition|award|college|school|fafsa|pay for|money|fund/.test(t);
    var job = /job|work|career|hiring|salary|position|opening|employ|intern|analyst|nurse|engineer|designer|assistant/.test(t);
    return sch && !job ? 'sch' : job && !sch ? 'job' : 'both';
  }
  function dirLinks(text) {
    var d = direction(text);
    var job = { k: 'job', href: '#/jobs' + qs({ q: text }), t: 'Find a Job', s: 'Search job postings for “' + esc(text) + '”' };
    var sch = { k: 'sch', href: '#/scholarships/profile', t: 'Find Scholarships', s: 'Answer a few optional questions, then browse awards' };
    var list = d === 'sch' ? [sch, job] : [job, sch];
    return list.map(function (x, i) { return { href: x.href, html: '<strong>' + x.t + '</strong>' + (d !== 'both' && i === 0 ? '<span class="tagx">Suggested</span>' : '') + '<small>' + x.s + '</small>' }; });
  }
  function vSearch(text) {
    return '<h1>Where would you like to look for “' + esc(text) + '”?</h1>' +
      '<p class="hint">This prototype does not search the whole site. It points you to one of the two tools below.</p>' +
      '<div class="dirs">' + dirLinks(text).map(function (l) { return '<a class="card" style="text-decoration:none;color:inherit" href="' + l.href + '">' + l.html.replace('<small>', '<br><small style="margin:0">') + '</a>'; }).join('') + '</div>';
  }

  /* ================= SCHOLARSHIPS ================= */
  var AMTS = [[0, 'Any amount'], [1000, 'More than $1,000'], [2500, 'More than $2,500'], [5000, 'More than $5,000'], [10000, 'More than $10,000']];
  var DUES = [[0, 'Any deadline'], [30, 'Due in the next 30 days'], [60, 'Due in the next 60 days'], [90, 'Due in the next 90 days']];
  var PER = { yr: 'per year', total: 'one-time total', sem: 'per semester' };
  var CIT = { cr: 'U.S. citizens and permanent residents', cit: 'U.S. citizens only (permanent residents cannot apply)', any: 'No citizenship requirement' };
  function yearlyAmt(a) { return a.per === 'sem' ? a.amt * 2 : a.amt; }
  function amtText(a) { return money(a.amt) + ' ' + PER[a.per] + (a.per === 'sem' ? ' (' + money(a.amt * 2) + ' per year)' : ''); }
  function schState(q) {
    return {
      deg: csv(q.get('deg')), maj: csv(q.get('maj')), gpa: q.get('gpa') || '', amt: +(q.get('amt') || 0), nat: q.get('nat') !== '0',
      st: q.get('st') || '', grp: csv(q.get('grp')), due: +(q.get('due') || 0), sort: q.get('sort') || 'deadline', ps: +(q.get('ps') || 10), p: +(q.get('p') || 1)
    };
  }
  function schParams(s) {
    return { deg: s.deg, maj: s.maj, gpa: s.gpa, amt: s.amt || '', nat: s.nat ? '' : '0', st: s.st, grp: s.grp, due: s.due || '', sort: s.sort === 'deadline' ? '' : s.sort, ps: s.ps === 10 ? '' : s.ps, p: s.p > 1 ? s.p : '' };
  }
  function schHref(s) { return '#/scholarships' + qs(schParams(s)); }
  function schMatch(a, s) {
    if (s.deg.length && !a.deg.some(function (d) { return s.deg.indexOf(d) >= 0; })) return false;
    if (s.maj.length && a.maj[0] !== 'any' && !a.maj.some(function (m) { return s.maj.indexOf(m) >= 0; })) return false;
    if (s.gpa !== '' && a.gpa > parseFloat(s.gpa)) return false;
    if (s.amt && !(yearlyAmt(a) > s.amt)) return false;
    if (a.st ? a.st !== s.st : !s.nat) return false;                                   /* B1: a state adds awards; it never hides national ones */
    if (a.grp.length && !a.grp.some(function (g) { return s.grp.indexOf(g) >= 0; })) return false; /* DS3: groups add targeted awards */
    if (s.due && !(a.dueIn >= 0 && a.dueIn <= s.due)) return false;
    return true;
  }
  function schSort(list, sort) {
    list.sort(function (a, b) {
      var ca = a.dueIn < 0, cb = b.dueIn < 0;
      if (ca !== cb) return ca ? 1 : -1;                                                 /* 1.8: passed deadlines go last */
      if (sort === 'amount') return yearlyAmt(b) - yearlyAmt(a) || a.dueIn - b.dueIn;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return a.dueIn - b.dueIn;
    });
  }
  function schChips(s) {
    var c = [];
    function add(label, patch) { c.push('<span class="chip">' + esc(label) + '<a href="' + schHref(Object.assign({}, s, patch, { p: 1 })) + '" aria-label="Remove filter: ' + esc(label) + '">✕</a></span>'); }
    s.deg.forEach(function (d) { add(nameOf(D.DEGREES, d), { deg: s.deg.filter(function (x) { return x !== d; }) }); });
    s.maj.forEach(function (m) { add(nameOf(D.MAJORS, m), { maj: s.maj.filter(function (x) { return x !== m; }) }); });
    if (s.gpa !== '') add('Your GPA: ' + s.gpa, { gpa: '' });
    if (s.amt) add(nameOf(AMTS, s.amt), { amt: 0 });
    if (s.nat) add('Open nationwide', { nat: false });
    if (s.st) add(nameOf(D.STATES, s.st) + ' residents', { st: '' });
    s.grp.forEach(function (g) { add('For: ' + nameOf(D.GROUPS, g), { grp: s.grp.filter(function (x) { return x !== g; }) }); });
    if (s.due) add(nameOf(DUES, s.due), { due: 0 });
    return c;
  }
  function whoList(a) {
    var w = [a.deg.map(function (d) { return nameOf(D.DEGREES, d); }).join(' or ') + ' students',
      a.maj[0] === 'any' ? 'Any major' : 'Majors: ' + a.maj.map(function (m) { return nameOf(D.FIELDS, m); }).join(', '),
      a.st ? 'Residents of ' + nameOf(D.STATES, a.st) + ' only' : 'Residents of any U.S. state',
      a.gpa ? 'GPA of ' + a.gpa.toFixed(2) + ' or higher' : 'No minimum GPA'];
    if (a.grp.length) w.push('Set aside for: ' + a.grp.map(function (g) { return nameOf(D.GROUPS, g); }).join(', '));
    w.push(CIT[a.cit]);
    return w;
  }
  function matchLine(a, s) {
    if (!s.deg.length && !s.maj.length && s.gpa === '' && !s.st) return '';
    var m = [];
    if (s.deg.length) m.push(a.deg.filter(function (d) { return s.deg.indexOf(d) >= 0; }).map(function (d) { return nameOf(D.DEGREES, d); }).join(', '));
    if (s.maj.length) m.push(a.maj[0] === 'any' ? 'Open to any major' : a.maj.filter(function (x) { return s.maj.indexOf(x) >= 0; }).map(function (x) { return nameOf(D.FIELDS, x); }).join(', '));
    m.push(a.st ? 'Open to ' + nameOf(D.STATES, a.st) + ' residents' : 'Open nationwide');
    if (s.gpa !== '') m.push(a.gpa ? 'Needs GPA ' + a.gpa.toFixed(2) + ' (yours ' + s.gpa + ')' : 'No minimum GPA');
    return '<p class="match">✓ Matches you: ' + m.map(esc).join(' | ') + '</p>';
  }
  function awardCard(a, s) {
    var tags = [a.deg.map(function (d) { return nameOf(D.DEGREES, d); }).join(' / '), a.maj[0] === 'any' ? 'Any major' : a.maj.map(function (m) { return nameOf(D.FIELDS, m); }).join(' / '),
      a.st ? nameOf(D.STATES, a.st) + ' residents' : 'Open nationwide', a.gpa ? 'GPA ' + a.gpa.toFixed(2) + '+' : 'No minimum GPA'];
    a.grp.forEach(function (g) { tags.push('For: ' + nameOf(D.GROUPS, g)); });
    if (a.cit === 'cit') tags.push('U.S. citizens only');
    return '<article class="card award"><div class="top"><h3><a href="#/scholarships/' + a.id + '">' + esc(a.name) + '</a></h3>' + saveBtn('sch', a.id, true) + '</div>' +
      '<p class="facts"><span class="amt">Award: <strong>' + amtText(a) + '</strong></span> &nbsp;|&nbsp; Deadline: ' + deadlineHTML(a) + '</p>' +
      matchLine(a, s) + '<p class="tags">' + tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</p></article>';
  }
  function schFilters(s) {
    return '<form id="schFilters" class="card filters" novalidate><h2>Filters</h2>' +
      '<fieldset class="fgroup"><legend>Degree you will be pursuing next school year</legend>' + D.DEGREES.map(function (d) { return '<label><input type="checkbox" name="deg" value="' + d[0] + '"' + (s.deg.indexOf(d[0]) >= 0 ? ' checked' : '') + '> ' + esc(d[1]) + '</label>'; }).join('') + '</fieldset>' +
      '<fieldset class="fgroup"><legend>Your major (or intended major)</legend>' + multi('maj', s.maj) + '<p class="hint">Pick one or more. Awards open to any major are always included.</p></fieldset>' +
      '<div class="fgroup"><label class="flabel" for="fgpa">Your GPA (4.0 scale)</label><input id="fgpa" name="gpa" type="text" inputmode="decimal" placeholder="e.g. 3.75" value="' + esc(s.gpa) + '"><p class="hint">Hides awards that need a higher GPA than yours. Leave blank for any.</p><p class="err" id="gpaErr" hidden>Enter a GPA between 0 and 4.0, for example 3.4.</p></div>' +
      '<fieldset class="fgroup"><legend>Award amount</legend>' + AMTS.map(function (a) { return '<label><input type="radio" name="amt" value="' + a[0] + '"' + (s.amt === a[0] ? ' checked' : '') + '> ' + a[1] + '</label>'; }).join('') + '<p class="hint">Compared by the amount for one year.</p></fieldset>' +
      '<fieldset class="fgroup"><legend>Open to residents of</legend><label><input type="checkbox" name="nat"' + (s.nat ? ' checked' : '') + '> Scholarships open nationwide</label>' +
      '<label for="fst" style="margin-top:6px">Also add awards for residents of:</label><select id="fst" name="st">' + opts(D.STATES, s.st, 'No state selected') + '</select><p class="hint">Choosing a state adds that state’s awards. It never hides nationwide awards.</p></fieldset>' +
      '<fieldset class="fgroup"><legend>Does any of this describe you? (optional)</legend>' + D.GROUPS.map(function (g) { return '<label><input type="checkbox" name="grp" value="' + g[0] + '"' + (s.grp.indexOf(g[0]) >= 0 ? ' checked' : '') + '> ' + esc(g[1]) + '</label>'; }).join('') + '<p class="hint">Checking a box adds awards set aside for that group.</p></fieldset>' +
      '<div class="fgroup"><label class="flabel" for="fdue">Deadline</label><select id="fdue" name="due">' + opts(DUES, s.due) + '</select></div>' +
      '<p class="dirty" id="schDirty" hidden>You changed a filter. Select “Show results” to apply it.</p>' +
      '<div class="actions"><button class="btn primary">Show results</button><a class="btn link" href="#/scholarships' + qs({ sort: s.sort === 'deadline' ? '' : s.sort, ps: s.ps === 10 ? '' : s.ps }) + '">Clear filters</a></div>' +
      '<p class="hint">Clear filters removes every filter above and turns “Scholarships open nationwide” back on. It keeps your sort order, your profile and your saved items.</p></form>';
  }
  function vSch(q) {
    var s = schState(q);
    var all = D.awards.filter(function (a) { return schMatch(a, s); });
    schSort(all, s.sort);
    var pages = Math.max(1, Math.ceil(all.length / s.ps)), p = Math.min(s.p, pages);
    sess.set('lastSch', location.hash || '#/scholarships'); sess.set('lastSchN', all.length);
    var chips = schChips(s), body;
    if (!all.length) {
      var v = [];
      if (s.amt) v.push({ label: 'Remove the “' + nameOf(AMTS, s.amt).toLowerCase() + '” minimum', patch: { amt: 0 } });
      if (!s.nat) v.push({ label: 'Include scholarships open nationwide', patch: { nat: true } });
      if (s.gpa !== '') v.push({ label: 'Remove your GPA', patch: { gpa: '' } });
      if (s.deg.length) v.push({ label: 'Remove the degree filter', patch: { deg: [] } });
      if (s.maj.length) v.push({ label: 'Remove the major filter', patch: { maj: [] } });
      if (s.due) v.push({ label: 'Remove the deadline filter', patch: { due: 0 } });
      var rec = recover(D.awards, schMatch, s, v);
      body = '<div class="card empty"><div class="ico" aria-hidden="true">🔍</div><h2>No scholarships found</h2>' +
        (rec.length ? '<p>Try changing one filter:</p>' + rec.map(function (r) { return '<a class="btn" href="' + schHref(r.state) + '">' + esc(r.label) + ' → <strong>' + r.n + ' award' + (r.n === 1 ? '' : 's') + ' available</strong></a>'; }).join('') : '') +
        '<a class="btn link" href="#/scholarships">Clear all filters</a></div>';
    } else {
      body = '<div class="list">' + all.slice((p - 1) * s.ps, p * s.ps).map(function (a) { return awardCard(a, s); }).join('') + '</div>' + pager(all.length, s.ps, p, '/scholarships', schParams(s));
    }
    var prof = store.get('profile', null);
    return '<h1>Find Scholarships</h1><div class="layout">' + schFilters(s) + '<section>' +
      (prof ? '<div class="profilebar">These results started from your scholarship profile. <a href="#/scholarships/profile">Edit profile</a></div>' : '<div class="profilebar">Want results that fit you? <a href="#/scholarships/profile">Answer a few optional questions</a></div>') +
      '<div class="rhead"><h2>Scholarship results (' + all.length + ')</h2><div class="ctl"><label>Sort: <select data-sel="sort">' + opts([['deadline', 'Deadline (soonest first)'], ['amount', 'Amount (highest first)'], ['name', 'Name (A to Z)']], s.sort) + '</select></label>' + psSelect(s.ps) + '</div></div>' +
      '<div class="chips"><span>Filters in use:</span>' + (chips.length ? chips.join('') : '<span>none</span>') + '</div>' + body + '</section></div>';
  }
  function vProfile() {
    var pr = store.get('profile', { deg: '', maj: [], st: '', gpa: '', grp: [] });
    return '<a class="back" href="#/">← Back to home</a><h1>Scholarship profile (optional)</h1>' +
      '<p>Answer what you like. Your answers become filters you can change at any time. You can also skip this step.</p>' +
      '<form id="profile" class="card form" novalidate>' +
      '<fieldset class="q inline"><legend>1. What degree will you be pursuing next school year?</legend>' + D.DEGREES.map(function (d) { return '<label><input type="radio" name="deg" value="' + d[0] + '"' + (pr.deg === d[0] ? ' checked' : '') + '> ' + esc(d[1]) + '</label>'; }).join('') + '</fieldset>' +
      '<fieldset class="q"><legend>2. What is your major (or intended major)?</legend>' + multi('maj', pr.maj) + '<p class="hint">Pick one or more. Not on the list? Choose “Other / not listed”. Awards open to any major are always included.</p></fieldset>' +
      '<div class="q"><label class="ql" for="pst">3. Which state is your permanent home?</label><select id="pst" name="st">' + opts(D.STATES, pr.st, 'Select a state (A–Z)…') + '</select><p class="hint">Adds awards for that state’s residents. Scholarships open nationwide are always included.</p></div>' +
      '<div class="q"><label class="ql" for="pgpa">4. What is your GPA? (4.0 scale)</label><input id="pgpa" name="gpa" type="text" inputmode="decimal" placeholder="e.g. 3.75" value="' + esc(pr.gpa) + '" size="8"><p class="err" id="gpaErr" hidden>Enter a GPA between 0 and 4.0, for example 3.4.</p></div>' +
      '<fieldset class="q"><legend>5. Does any of this describe you?</legend>' + D.GROUPS.map(function (g) { return '<label><input type="checkbox" name="grp" value="' + g[0] + '"' + (pr.grp.indexOf(g[0]) >= 0 ? ' checked' : '') + '> ' + esc(g[1]) + '</label>'; }).join('') + '<p class="hint">Checking a box adds awards set aside for that group. It never hides other awards.</p></fieldset>' +
      '<div class="actions"><button class="btn primary">Show my scholarships</button><a class="btn" href="#/scholarships">Skip</a></div></form>';
  }
  function vAward(id, q) {
    var a = byId(D.awards, id); if (!a) return vNI('That scholarship');
    var fromSaved = q.get('from') === 'saved', n = sess.get('lastSchN');
    var back = fromSaved ? '<a class="back" href="#/saved/scholarships">← Back to saved scholarships</a>'
      : '<a class="back" href="' + (sess.get('lastSch') || '#/scholarships') + '">← Back to ' + (n !== null ? n + ' result' + (n === '1' ? '' : 's') : 'results') + '</a>';
    var who = whoList(a);
    function sec(t, html, open) { return '<details class="sec"' + (open ? ' open' : '') + '><summary>' + t + '</summary><div>' + html + '</div></details>'; }
    return back + '<div class="detail"><section><h1>' + esc(a.name) + '</h1><p class="hint">Offered by ' + esc(a.sponsor) + '</p>' +
      '<div class="two"><div class="card box"><h2>Scholarship summary</h2><dl><dt>Award</dt><dd><strong>' + amtText(a) + '</strong></dd><dt>Deadline</dt><dd>' + deadlineHTML(a) + '</dd>' +
      '<dt>Who can apply</dt><dd>' + esc(who.slice(0, 3).join('; ')) + '</dd><dt>How to apply</dt><dd>' + esc(a.submit) + '</dd></dl></div>' +
      '<div class="card box"><h2>Sponsor contact</h2><p>✉ ' + esc(a.email) + '<br>☎ ' + esc(a.phone) + '<br>🌐 ' + esc(a.web) + '</p></div></div>' +
      '<div class="two"><div class="card check"><h2>Eligibility checklist</h2><p class="hint">Tick each one that is true for you.</p>' + who.map(function (w) { return '<label><input type="checkbox"> ' + esc(w) + '</label>'; }).join('') + '</div>' +
      '<div class="card cta"><button type="button" class="btn primary" data-notice="app">Go to application ↗</button>' + saveBtn('sch', a.id) + '<p class="hint">Saving needs no account. Saved items stay on this device.</p></div></div>' +
      sec('Eligibility', '<p>To apply you must meet <mark>all</mark> of these: </p><ul>' + who.map(function (w) { return '<li><mark>' + esc(w) + '</mark></li>'; }).join('') + '</ul><p>Applicants must be enrolled, or accepted for enrollment, at an accredited U.S. college or university for the next school year.</p>') +
      sec('How to apply', '<p>Submit: <mark>' + esc(a.submit) + '</mark>.</p><p>Everything must arrive by <mark>' + fmt(dayFrom(a.dueIn), true) + '</mark>. Late or incomplete applications are not reviewed.</p>') +
      sec('Selection criteria', '<p>' + esc(a.selection) + '</p><p>The award is ' + amtText(a) + '. ' + (a.per === 'total' ? 'It is paid once and cannot be renewed.' : 'It can be renewed if you stay enrolled and keep the required GPA.') + '</p>') +
      sec('About the sponsor', '<p>' + esc(a.sponsor) + ' supports students through scholarships and mentoring. (Simulated sponsor for this prototype.)</p>') +
      '</section><aside class="card side" id="savedSide">' + savedSide() + '</aside></div>';
  }
  function savedSide() {
    var list = saved('sch').map(function (i) { return byId(D.awards, i); }).filter(Boolean).sort(function (a, b) { return a.dueIn - b.dueIn; });
    return '<h2>Saved scholarships (' + list.length + ')</h2>' + (list.length ? '<ul>' + list.map(function (a) { return '<li><a href="#/scholarships/' + a.id + '?from=saved">' + esc(a.name) + '</a><br>' + amtText(a) + '<br>Due ' + fmt(dayFrom(a.dueIn), true) + '</li>'; }).join('') + '</ul><a href="#/saved/scholarships">Open saved list</a>'
      : '<p class="hint">Nothing saved yet. Select Save on any scholarship to keep it here.</p>');
  }

  /* ================= SAVED ================= */
  function vSaved(kind) {
    var isJ = kind === 'jobs';
    var list = saved(kind).map(function (i) { return byId(isJ ? D.jobs : D.awards, i); }).filter(Boolean);
    list.sort(function (a, b) { return isJ ? a.ago - b.ago : a.dueIn - b.dueIn; });
    var rows = list.map(function (x) {
      return '<article class="card srow"><div><h3>★ ' + esc(isJ ? x.title : x.name) + '</h3>' +
        (isJ ? '<div>' + esc(x.emp) + ' · ' + esc(cityLabel(x.cityId)) + '</div><div>Pay: ' + payText(x) + '</div><div>Posted: <strong>' + fmt(dayFrom(-x.ago), true) + '</strong> | ' + agoText(x) + (x.open ? '' : ' <span class="closed">No longer accepting applications</span>') + '</div>'
          : '<div>Amount: <strong>' + amtText(x) + '</strong></div><div>Deadline: ' + deadlineHTML(x).replace(' (', ' | ').replace(')', '') + '</div>') +
        '</div><div class="acts"><a class="btn small" href="#/' + (isJ ? 'jobs' : 'scholarships') + '/' + x.id + '?from=saved">View</a><button type="button" class="btn small" data-remove="' + kind + ':' + x.id + '">Remove</button></div></article>';
    }).join('');
    return '<h1>Saved</h1><div class="tabs"><a href="#/saved/scholarships" class="' + (isJ ? '' : 'on') + '">Scholarships (' + saved('sch').length + ')</a><a href="#/saved/jobs" class="' + (isJ ? 'on' : '') + '">Jobs (' + saved('jobs').length + ')</a></div>' +
      '<div class="rhead"><h2>Saved ' + (isJ ? 'jobs' : 'scholarships') + ' (' + list.length + ') <span class="pill">' + (isJ ? 'Sorted by date posted, newest first' : 'Sorted by deadline') + '</span></h2><button type="button" class="btn" data-notice="email">✉ Email my list</button></div>' +
      '<div class="list" style="margin-top:10px">' + (rows || '<div class="card empty"><p>Nothing saved yet.</p><a class="btn" href="#/' + (isJ ? 'jobs' : 'scholarships') + '">Browse ' + (isJ ? 'jobs' : 'scholarships') + '</a></div>') + '</div>' +
      '<p class="hint">Saved items are kept on this device. No account is needed.</p>';
  }

  /* ================= JOBS ================= */
  var PAYS = [[0, 'Any'], [40000, '$40,000 or more per year'], [60000, '$60,000 or more per year'], [80000, '$80,000 or more per year'], [100000, '$100,000 or more per year']];
  var EXPS = [['', 'Any'], ['entry', 'Entry level (0 to 1 year)'], ['mid', 'Up to 3 years']], EXPV = { entry: 1, mid: 3 };
  var EDUS = [['', 'Any'], ['hs', 'High school diploma or less'], ['as', 'Associate degree or less'], ['ba', "Bachelor's degree or less"]], EDUV = { hs: 0, as: 1, ba: 2 };
  var EDUN = ['High school diploma', 'Associate degree', "Bachelor's degree", "Master's degree", 'Doctorate'];
  var SCHS = [['', 'Any'], ['ft', 'Full-time'], ['pt', 'Part-time']];
  var RADS = [[0, 'This city only'], [10, 'City + within 10 miles'], [25, 'City + within 25 miles']];
  function city(id) { for (var i = 0; i < D.cities.length; i++) if (D.cities[i].id === id) return D.cities[i]; return null; }
  function cityLabel(id) { var c = city(id); return c ? c.label : id; }
  function yearly(j) { if (!j.pay) return null; if (j.pay.t === 'yr') return j.pay.a; return j.pay.h ? j.pay.a * j.pay.h * 52 : null; }
  function schedText(j) { return (j.sched === 'pt' ? 'Part-time' : 'Full-time') + (j.pay && j.pay.t === 'hr' && j.pay.h ? ' (' + j.pay.h + ' hrs/week)' : ''); }
  function payText(j) {
    var p = j.pay;
    if (!p) return '<span class="paynl">Not listed</span>';
    if (p.t === 'yr') return '<strong>' + money(p.a) + '/yr</strong>';
    var rate = money(p.a) + (p.b ? '–' + money(p.b) : '') + '/hr';
    if (!p.h) return '<strong>' + rate + '</strong> · no yearly estimate (hours not posted)';
    return '<strong>' + rate + '</strong> | ' + money(p.a * p.h * 52) + (p.b ? '–' + money(p.b * p.h * 52) : '') + '/yr (est.)';
  }
  function payMath(j) {
    var p = j.pay; if (!p || p.t !== 'hr' || !p.h) return '';
    return 'Yearly estimate = hourly pay × hours per week × 52 weeks: ' + money(p.a) + ' × ' + p.h + ' × 52 = ' + money(p.a * p.h * 52) + (p.b ? ' (up to ' + money(p.b * p.h * 52) + ' at the top rate)' : '') + '. The employer posted the hourly rate; the yearly figure is our estimate.';
  }
  function needsText(j) { return EDUN[j.edu] + ' · ' + (j.exp === 0 ? 'No experience required' : j.exp === 1 ? '0 to 1 year experience' : j.exp + '+ years experience'); }
  function agoText(j) { return j.ago === 0 ? 'posted today' : j.ago === 1 ? 'posted yesterday' : 'posted ' + j.ago + ' days ago'; }
  function jobState(q) {
    return { q: q.get('q') || '', city: q.get('city') || '', bad: q.get('bad') || '', r: +(q.get('r') || 0), pay: +(q.get('pay') || 0), field: q.get('field') || '', exp: q.get('exp') || '', edu: q.get('edu') || '', sched: q.get('sched') || '', sort: q.get('sort') || 'new', ps: +(q.get('ps') || 10), p: +(q.get('p') || 1) };
  }
  function jobParams(s) { return { q: s.q, city: s.city, bad: s.bad, r: s.city && s.r ? s.r : '', pay: s.pay || '', field: s.field, exp: s.exp, edu: s.edu, sched: s.sched, sort: s.sort === 'new' ? '' : s.sort, ps: s.ps === 10 ? '' : s.ps, p: s.p > 1 ? s.p : '' }; }
  function jobHref(s) { return '#/jobs' + qs(jobParams(s)); }
  function jobMatch(j, s) {
    if (s.q) { var t = (j.title + ' ' + j.emp + ' ' + nameOf(D.FIELDS, j.field)).toLowerCase(); if (!s.q.toLowerCase().split(/\s+/).filter(Boolean).every(function (w) { return t.indexOf(w) >= 0; })) return false; }
    if (s.city) { var c = city(s.city); if (!(j.cityId === s.city || (c && c.metro && j.metro === s.city && j.mi <= s.r))) return false; }   /* B4 */
    if (s.pay) { var y = yearly(j); if (y === null || y < s.pay) return false; }                                                          /* B5, B11 */
    if (s.field && j.field !== s.field) return false;
    if (s.exp && j.exp > EXPV[s.exp]) return false;
    if (s.edu && j.edu > EDUV[s.edu]) return false;
    if (s.sched && j.sched !== s.sched) return false;
    return true;
  }
  function jobSort(list, s) {
    list.sort(function (a, b) {
      if (s.city) { var ia = a.cityId === s.city, ib = b.cityId === s.city; if (ia !== ib) return ia ? -1 : 1; }                           /* chosen city first */
      if (s.sort === 'pay') { var ya = yearly(a), yb = yearly(b); if (ya === null || yb === null) return ya === yb ? a.ago - b.ago : ya === null ? 1 : -1; return yb - ya; }
      if (s.sort === 'dist') return a.mi - b.mi || a.ago - b.ago;
      return a.ago - b.ago;
    });
  }
  function jobChips(s) {
    var c = [];
    function add(label, patch) { c.push('<span class="chip">' + esc(label) + '<a href="' + jobHref(Object.assign({}, s, patch, { p: 1 })) + '" aria-label="Remove filter: ' + esc(label) + '">✕</a></span>'); }
    if (s.q) add('Keyword: ' + s.q, { q: '' });
    if (s.city) add(cityLabel(s.city) + (s.r ? ' + ' + s.r + ' miles' : ' only'), { city: '', r: 0 });
    if (s.pay) add(nameOf(PAYS, s.pay), { pay: 0 });
    if (s.field) add('Field: ' + nameOf(D.FIELDS, s.field), { field: '' });
    if (s.exp) add(nameOf(EXPS, s.exp), { exp: '' });
    if (s.edu) add(nameOf(EDUS, s.edu), { edu: '' });
    if (s.sched) add(nameOf(SCHS, s.sched), { sched: '' });
    return c;
  }
  function jobRow(j, s) {
    var dist = esc(cityLabel(j.cityId)) + (s.city ? ' · ' + j.mi + ' mi' : '');
    return '<article class="card jrow"><div class="jcells">' +
      '<div><a href="#/jobs/' + j.id + '"><strong>' + esc(j.title) + '</strong></a>' + (j.open && j.ago <= 3 ? '<span class="new">New</span>' : '') + (j.open ? '' : ' <span class="closed">Closed</span>') + '<div class="sub">' + esc(j.emp) + '</div></div>' +
      '<div data-l="Pay">' + payText(j) + '<div class="sub">' + schedText(j) + '</div></div>' +
      '<div data-l="Needs">' + needsText(j) + '</div><div data-l="Where">' + dist + '</div><div data-l="Posted">' + fmt(dayFrom(-j.ago)) + '</div>' +
      '<div class="c-act">' + saveBtn('jobs', j.id, true) + '<button type="button" class="btn small" data-more aria-expanded="false">More ▾</button></div></div>' +
      '<div class="jmore" hidden><p><strong>Field:</strong> ' + esc(nameOf(D.FIELDS, j.field)) + ' &nbsp; <strong>Schedule:</strong> ' + schedText(j) + ' &nbsp; <strong>Status:</strong> <span class="status' + (j.open ? '' : ' no') + '">' + (j.open ? 'Accepting applications' : 'No longer accepting applications') + '</span></p>' +
      (payMath(j) ? '<p>' + payMath(j) + '</p>' : '') + '<p>' + esc(jobDesc(j).split('\n')[0]) + '</p><a class="btn small" href="#/jobs/' + j.id + '">View full posting</a></div></article>';
  }
  function jobDesc(j) {
    return j.emp + ' is hiring a ' + j.title + ' to join its ' + nameOf(D.FIELDS, j.field).replace(/ \(.*/, '').toLowerCase() + ' team in ' + cityLabel(j.cityId) + '.\n' +
      'You will work with a small team, learn the organization’s tools and processes, and take on your own projects within the first few months.\n' +
      'This is a simulated posting written for a usability study.';
  }
  function vJobs(q) {
    var s = jobState(q);
    var all = D.jobs.filter(function (j) { return jobMatch(j, s); });
    jobSort(all, s);
    var pages = Math.max(1, Math.ceil(all.length / s.ps)), p = Math.min(s.p, pages);
    sess.set('lastJobs', location.hash || '#/jobs'); sess.set('lastJobsN', all.length);
    var chips = jobChips(s), body;
    var scope = s.city ? ' in ' + esc(cityLabel(s.city)) + (s.r ? ' and within ' + s.r + ' miles' : ' (this city only)') : ' in all locations';
    if (!all.length) {
      var v = [];
      if (s.city && s.r < 10) v.push({ label: 'Expand to 10 miles around ' + cityLabel(s.city), patch: { r: 10 } });
      if (s.city && s.r < 25) v.push({ label: 'Expand to 25 miles around ' + cityLabel(s.city), patch: { r: 25 } });
      if (s.q) v.push({ label: 'Remove the keyword “' + s.q + '”', patch: { q: '' } });
      if (s.pay) v.push({ label: 'Remove the minimum pay', patch: { pay: 0 } });
      if (s.field) v.push({ label: 'Remove the field filter', patch: { field: '' } });
      if (s.exp) v.push({ label: 'Remove the experience filter', patch: { exp: '' } });
      if (s.edu) v.push({ label: 'Remove the education filter', patch: { edu: '' } });
      if (s.sched) v.push({ label: 'Remove the schedule filter', patch: { sched: '' } });
      if (s.city) v.push({ label: 'Search all locations', patch: { city: '', r: 0 } });
      var rec = recover(D.jobs, jobMatch, s, v);
      body = '<div class="card empty"><div class="ico" aria-hidden="true">🔍</div><h2>No jobs match your search</h2>' +
        (rec.length ? '<p>Try changing one thing:</p>' + rec.map(function (r) { return '<a class="btn" href="' + jobHref(r.state) + '">' + esc(r.label) + ' → <strong>' + r.n + ' job' + (r.n === 1 ? '' : 's') + '</strong></a>'; }).join('') : '') +
        '<a class="btn link" href="#/jobs">Clear search and filters</a></div>';
    } else {
      body = '<div class="jcols" aria-hidden="true"><span>Job</span><span>Pay</span><span>Needs</span><span>Where</span><span>Posted</span><span></span></div><div class="list">' +
        all.slice((p - 1) * s.ps, p * s.ps).map(function (j) { return jobRow(j, s); }).join('') + '</div>' + pager(all.length, s.ps, p, '/jobs', jobParams(s));
    }
    function fsel(id, label, list, val) { return '<div class="fgroup"><label class="flabel" for="' + id + '">' + label + '</label><select id="' + id + '">' + opts(list, val) + '</select></div>'; }
    return '<h1>Find a Job</h1>' +
      '<form id="jobSearch" class="card jsearch" autocomplete="off" novalidate><div><label for="jq">Job title or keyword</label><input id="jq" type="text" placeholder="e.g. analyst, nurse, designer" value="' + esc(s.q) + '"></div>' +
      '<div class="cityw"><label for="jcity">City or ZIP code</label><input id="jcity" type="text" placeholder="Start typing, then pick from the list" value="' + esc(s.city ? cityLabel(s.city) : s.bad) + '" data-city="' + esc(s.city) + '" role="combobox" aria-expanded="false" aria-controls="citySug"><div id="citySug" class="sug" hidden></div></div>' +
      '<div><label for="jr">Search area</label><select id="jr">' + opts(RADS, s.r) + '</select></div><div><button class="btn primary">Search</button></div></form>' +
      (s.bad ? '<p class="err">City not recognized: “' + esc(s.bad) + '”. No city filter is applied, so jobs from all locations are shown. Pick a city from the suggestions to search one place.</p>' : '') +
      '<div class="layout"><form id="jobFilters" class="card filters"><h2>Filters</h2>' +
      fsel('fpay', 'Minimum pay', PAYS, s.pay) + '<p class="hint" style="margin-top:-10px">Hourly pay is converted to a yearly estimate (hourly × hours per week × 52). Jobs with no pay or no hours listed are hidden when a minimum is set.</p>' +
      fsel('ffield', 'Field', [['', 'Any']].concat(D.FIELDS), s.field) + fsel('fexp', 'Experience', EXPS, s.exp) + fsel('fedu', 'Education', EDUS, s.edu) + fsel('fsched', 'Schedule', SCHS, s.sched) +
      '<p class="dirty" id="jobDirty" hidden>You changed a filter. Select “Show results” to apply it.</p>' +
      '<div class="actions"><button class="btn primary">Show results</button><a class="btn link" href="#/jobs' + qs({ q: s.q, city: s.city, r: s.city && s.r ? s.r : '', sort: s.sort === 'new' ? '' : s.sort, ps: s.ps === 10 ? '' : s.ps }) + '">Clear filters</a></div>' +
      '<p class="hint">Clear filters resets the five filters above to “Any”. It keeps your keyword, city, search area, sort order and saved items.</p></form>' +
      '<section><div class="rhead"><h2>' + all.length + ' job' + (all.length === 1 ? '' : 's') + ' found' + scope + '</h2><div class="ctl"><label>Sort: <select data-sel="sort">' + opts([['new', 'Newest'], ['pay', 'Pay (highest first)'], ['dist', 'Distance (nearest first)']], s.sort) + '</select></label>' + psSelect(s.ps) + '</div></div>' +
      (s.city && s.r ? '<p class="hint">Jobs in ' + esc(cityLabel(s.city)) + ' are listed first, then nearby towns.</p>' : '') +
      '<div class="chips"><span>Search and filters in use:</span>' + (chips.length ? chips.join('') : '<span>none (showing every job)</span>') + '</div>' + body + '</section></div>';
  }
  function vJob(id, q) {
    var j = byId(D.jobs, id); if (!j) return vNI('That job');
    var n = sess.get('lastJobsN');
    var back = q.get('from') === 'saved' ? '<a class="back" href="#/saved/jobs">← Back to saved jobs</a>'
      : '<a class="back" href="' + (sess.get('lastJobs') || '#/jobs') + '">← Back to ' + (n !== null ? n + ' job' + (n === '1' ? '' : 's') : 'jobs') + '</a>';
    return back + '<div class="rhead"><h1>' + esc(j.title) + '</h1><div class="ctl">' + saveBtn('jobs', j.id) + '<button type="button" class="btn" data-notice="share">Share</button></div></div>' +
      '<p>' + esc(cityLabel(j.cityId)) + ' • ' + esc(j.emp) + '</p>' +
      '<div class="two"><div class="card box"><h2>Pay</h2><p>' + (j.pay ? payText(j) : 'Pay: <span class="paynl">Not listed</span> by the employer') + '<br>' + schedText(j) + '</p>' + (payMath(j) ? '<p class="hint">' + payMath(j) + '</p>' : '') + '</div>' +
      '<div class="card box"><h2>Location</h2><p>📍 ' + esc(cityLabel(j.cityId)) + ' • ' + j.mi + ' miles from the center of ' + esc(cityLabel(j.metro)) + '</p></div>' +
      '<div class="card box"><h2>Requirements</h2><ul style="margin:0;padding-left:18px"><li>' + EDUN[j.edu] + '</li><li>' + (j.exp === 0 ? 'No experience required' : j.exp === 1 ? '0 to 1 year of experience' : j.exp + ' or more years of experience') + '</li><li>Field: ' + esc(nameOf(D.FIELDS, j.field)) + '</li></ul></div>' +
      '<div class="card box"><h2>Status</h2><p class="status' + (j.open ? '' : ' no') + '">' + (j.open ? '✓ Accepting applications' : '✕ No longer accepting applications') + '</p><p>Posted ' + fmt(dayFrom(-j.ago), true) + ' (' + agoText(j).replace('posted ', '') + ')</p></div></div>' +
      '<div class="card"><h2>Job description</h2>' + jobDesc(j).split('\n').map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>' +
      '<p style="text-align:center;margin-top:14px">' + (j.open ? '<button type="button" class="btn primary" data-notice="apply">Apply for this job ↗</button>' : '<span class="closed">This posting is closed. You can no longer apply.</span>') + '</p>';
  }

  /* ================= NOT IMPLEMENTED ================= */
  function vNI(name) {
    return '<div class="card empty"><h1>' + esc(name) + '</h1><p><strong>Not implemented in this prototype.</strong></p><p>This prototype covers two tools: Find Scholarships and Find a Job.</p>' +
      '<button type="button" class="btn primary" data-back>← Go back</button><a class="btn" href="#/">Home</a></div>';
  }
  var NOTICES = {
    app: ['Go to application', 'This would open the sponsor’s own application page for this scholarship in a new tab. It is not part of this prototype.'],
    apply: ['Apply for this job', 'This would open the employer’s application page in a new tab. It is not part of this prototype.'],
    email: ['Email my list', 'This would email your saved list to an address you enter. Sending email is not implemented in this prototype.'],
    share: ['Share', 'This would let you copy a link or send this posting to someone. It is not implemented in this prototype.']
  };

  /* ================= EVENTS ================= */
  function citySuggest(text) {
    var t = text.trim().toLowerCase(); if (!t) return [];
    return D.cities.filter(function (c) { return c.label.toLowerCase().indexOf(t) === 0 || (c.zip && /^\d{3,5}$/.test(t) && t.indexOf(c.zip) === 0); })
      .sort(function (a, b) { return b.pop - a.pop; }).slice(0, 6);                                                                     /* B13: most likely city first */
  }
  function pickCity(input, c) { input.value = c.label; input.setAttribute('data-city', c.id); var box = $('#citySug'); box.hidden = true; input.setAttribute('aria-expanded', 'false'); }
  function readJobs() {
    var prev = jobState(parse().q), ci = $('#jcity'), text = ci.value.trim(), cid = ci.getAttribute('data-city') || '', bad = '';
    if (text && !cid) {
      var exact = D.cities.filter(function (c) { return c.label.toLowerCase() === text.toLowerCase(); })[0];
      if (exact) cid = exact.id; else bad = text;                                                                                        /* HE-02 */
    }
    if (!text) cid = '';
    return { q: $('#jq').value.trim(), city: cid, bad: bad, r: cid ? +$('#jr').value : 0, pay: +$('#fpay').value, field: $('#ffield').value, exp: $('#fexp').value, edu: $('#fedu').value, sched: $('#fsched').value, sort: prev.sort, ps: prev.ps, p: 1 };
  }
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.id === 'siteSearch') { e.preventDefault(); var t = $('#ss').value.trim(); if (t) location.hash = '/search' + qs({ q: t }); }
    else if (f.id === 'profile' || f.id === 'schFilters') {
      e.preventDefault();
      var gpa = f.gpa.value.trim();
      if (!gpaOk(gpa)) { $('#gpaErr', f).hidden = false; f.gpa.focus(); return; }                                                       /* HE-09 */
      if (f.id === 'profile') {
        var deg = checked(f, 'deg')[0] || '';
        var pr = { deg: deg, maj: multiVal(f, 'maj'), st: f.st.value, gpa: gpa, grp: checked(f, 'grp') };
        store.set('profile', pr);
        location.hash = '/scholarships' + qs(schParams({ deg: deg ? [deg] : [], maj: pr.maj, gpa: gpa, amt: 0, nat: true, st: pr.st, grp: pr.grp, due: 0, sort: 'deadline', ps: 10, p: 1 }));
      } else {
        var prev = schState(parse().q);
        var s = { deg: checked(f, 'deg'), maj: multiVal(f, 'maj'), gpa: gpa, amt: +(checked(f, 'amt')[0] || 0), nat: f.nat.checked, st: f.st.value, grp: checked(f, 'grp'), due: +f.due.value, sort: prev.sort, ps: prev.ps, p: 1 };
        var h = schHref(s); if (h === location.hash) render(); else location.hash = h.slice(1);
      }
    }
    else if (f.id === 'jobSearch' || f.id === 'jobFilters') { e.preventDefault(); var hj = jobHref(readJobs()); if (hj === location.hash) render(); else location.hash = hj.slice(1); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-save],[data-remove],[data-undo],[data-notice],[data-more],[data-back],.bubble,[data-cityid]');
    if (!t) { var sg = $('#citySug'); if (sg && !e.target.closest('.cityw')) sg.hidden = true; var s2 = $('#ssSug'); if (s2 && !e.target.closest('#siteSearch')) s2.hidden = true; return; }
    if (t.hasAttribute('data-save')) {
      var a = t.getAttribute('data-save').split(':'), ids = saved(a[0]), i = ids.indexOf(a[1]);
      if (i >= 0) ids.splice(i, 1); else ids.push(a[1]);
      setSaved(a[0], ids); updateSavedCount();
      $$('[data-save="' + a[0] + ':' + a[1] + '"]').forEach(function (b) { var on = i < 0; b.setAttribute('aria-pressed', on); b.textContent = on ? 'Saved ✓' : 'Save'; });
      var side = $('#savedSide'); if (side) side.innerHTML = savedSide();
    } else if (t.hasAttribute('data-remove')) {
      var r = t.getAttribute('data-remove').split(':'), list = saved(r[0]), item = byId(r[0] === 'jobs' ? D.jobs : D.awards, r[1]);
      setSaved(r[0], list.filter(function (x) { return x !== r[1]; })); render();
      toast('Removed “' + esc(item.title || item.name) + '” from your saved list. <button type="button" data-undo="' + r[0] + ':' + r[1] + '">Undo</button>');   /* HE-04 */
    } else if (t.hasAttribute('data-undo')) {
      var u = t.getAttribute('data-undo').split(':'), l2 = saved(u[0]); if (l2.indexOf(u[1]) < 0) l2.push(u[1]); setSaved(u[0], l2); $('#toast').hidden = true; render();
    } else if (t.hasAttribute('data-notice')) { var nn = NOTICES[t.getAttribute('data-notice')]; notice(nn[0], nn[1]); }
    else if (t.hasAttribute('data-more')) {
      var more = $('.jmore', t.closest('.jrow')), open = more.hidden; more.hidden = !open; t.setAttribute('aria-expanded', open); t.textContent = open ? 'Less ▴' : 'More ▾';
    } else if (t.hasAttribute('data-back')) { history.back(); }
    else if (t.classList.contains('bubble')) {
      var on = !t.classList.contains('on'); t.classList.toggle('on', on); t.setAttribute('aria-pressed', on);
      var d = $('#schDirty'); if (d && t.closest('#schFilters')) d.hidden = false;
    } else if (t.hasAttribute('data-cityid')) { pickCity($('#jcity'), city(t.getAttribute('data-cityid'))); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-sel')) {
      var r = parse(), isJ = r.path.indexOf('/jobs') === 0, s = isJ ? jobState(r.q) : schState(r.q);
      s[t.getAttribute('data-sel')] = t.getAttribute('data-sel') === 'ps' ? +t.value : t.value; s.p = 1;
      location.hash = (isJ ? jobHref(s) : schHref(s)).slice(1);
    } else if (t.closest('#schFilters')) { $('#schDirty').hidden = false; }
    else if (t.closest('#jobFilters')) { $('#jobDirty').hidden = false; }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'ss') {
      var box = $('#ssSug'), v = t.value.trim();
      if (!v) { box.hidden = true; return; }
      box.innerHTML = dirLinks(v).map(function (l) { return '<a href="' + l.href + '">' + l.html + '</a>'; }).join(''); box.hidden = false;
    } else if (t.id === 'jcity') {
      t.setAttribute('data-city', '');
      var list = citySuggest(t.value), sb = $('#citySug');
      sb.innerHTML = list.length ? list.map(function (c, i) { return '<button type="button" data-cityid="' + c.id + '"' + (i === 0 ? ' class="act"' : '') + '>' + esc(c.label) + '<small>' + c.pop.toLocaleString('en-US') + ' people</small></button>'; }).join('')
        : (t.value.trim() ? '<button type="button" disabled>No matching city. Check the spelling.</button>' : '');
      sb.hidden = !sb.innerHTML; t.setAttribute('aria-expanded', !sb.hidden);
    } else if (t.closest('.multi')) {
      var q = t.value.trim().toLowerCase();
      $$('.bubble', t.closest('.multi')).forEach(function (b) { b.hidden = !!q && b.textContent.toLowerCase().indexOf(q) < 0 && !b.classList.contains('on'); });
    } else if (t.name === 'gpa') { var er = $('#gpaErr'); if (er) er.hidden = true; if (t.closest('#schFilters')) $('#schDirty').hidden = false; }
  });
  document.addEventListener('keydown', function (e) {
    if (e.target.id !== 'jcity') return;
    var sb = $('#citySug'); if (!sb || sb.hidden) return;
    var items = $$('button[data-cityid]', sb); if (!items.length) return;
    var i = items.findIndex(function (b) { return b.classList.contains('act'); });
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items.forEach(function (b) { b.classList.remove('act'); }); i = (i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length; items[i].classList.add('act'); }
    else if (e.key === 'Enter') { e.preventDefault(); pickCity(e.target, city(items[Math.max(i, 0)].getAttribute('data-cityid'))); }
    else if (e.key === 'Escape') { sb.hidden = true; }
  });

  $('#protoNote').textContent = 'Student prototype for a usability class. Not affiliated with CareerOneStop. All jobs and scholarships are simulated sample data, last updated ' + D.updated + '.';
  window.addEventListener('hashchange', render);
  render();
})();
