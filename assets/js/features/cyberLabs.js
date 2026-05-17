/* features/cyberLabs.js — Cyber Labs Tracker
   Exposes SHIBI.Labs (also aliased as SHIBI.CyberLabs for backward compat).
   28 seed labs embedded; user-added labs stored in state.labsCustom[].
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Labs = (function () {

  /* ── Seed labs (28 real labs) ──────────────────────────── */
  var SEED_LABS = [
    // TryHackMe (18)
    {id:'s01',name:'Pre-Security Path',      platform:'tryhackme',difficulty:'easy',  topic:'Networking',  url:'https://tryhackme.com/path/outline/presecurity',        xpReward:30},
    {id:'s02',name:'Linux Fundamentals Pt 1',platform:'tryhackme',difficulty:'easy',  topic:'Linux',       url:'https://tryhackme.com/room/linuxfundamentalspart1',     xpReward:30},
    {id:'s03',name:'Linux Fundamentals Pt 2',platform:'tryhackme',difficulty:'easy',  topic:'Linux',       url:'https://tryhackme.com/room/linuxfundamentalspart2',     xpReward:30},
    {id:'s04',name:'Linux Fundamentals Pt 3',platform:'tryhackme',difficulty:'easy',  topic:'Linux',       url:'https://tryhackme.com/room/linuxfundamentalspart3',     xpReward:30},
    {id:'s05',name:'Network Fundamentals',   platform:'tryhackme',difficulty:'easy',  topic:'Networking',  url:'https://tryhackme.com/room/networkfundamentals',        xpReward:30},
    {id:'s06',name:'How The Web Works',      platform:'tryhackme',difficulty:'easy',  topic:'Web Security',url:'https://tryhackme.com/room/howthewebworks',             xpReward:30},
    {id:'s07',name:'Intro to Cybersecurity', platform:'tryhackme',difficulty:'easy',  topic:'Cybersec',    url:'https://tryhackme.com/room/introductiontocybersecurity',xpReward:30},
    {id:'s08',name:'Nmap',                   platform:'tryhackme',difficulty:'medium',topic:'Recon',       url:'https://tryhackme.com/room/furthernmap',               xpReward:50},
    {id:'s09',name:'Wireshark: The Basics',  platform:'tryhackme',difficulty:'medium',topic:'Networking',  url:'https://tryhackme.com/room/wiresharkthebasics',        xpReward:50},
    {id:'s10',name:'Burp Suite: The Basics', platform:'tryhackme',difficulty:'medium',topic:'Web Security',url:'https://tryhackme.com/room/burpsuitebasics',           xpReward:50},
    {id:'s11',name:'OWASP Top 10 - 2021',    platform:'tryhackme',difficulty:'medium',topic:'Web Security',url:'https://tryhackme.com/room/owasptop102021',            xpReward:50},
    {id:'s12',name:'OWASP Juice Shop',       platform:'tryhackme',difficulty:'medium',topic:'Web Security',url:'https://tryhackme.com/room/owaspjuiceshop',            xpReward:50},
    {id:'s13',name:'Blue (EternalBlue)',      platform:'tryhackme',difficulty:'medium',topic:'Windows',    url:'https://tryhackme.com/room/blue',                       xpReward:50},
    {id:'s14',name:'Advent of Cyber 2023',   platform:'tryhackme',difficulty:'easy',  topic:'Mixed',       url:'https://tryhackme.com/room/adventofcyber2023',          xpReward:30},
    {id:'s15',name:'Jr Pentester Path',      platform:'tryhackme',difficulty:'medium',topic:'Pentesting',  url:'https://tryhackme.com/path/outline/jrpenetrationtester',xpReward:50},
    {id:'s16',name:'SOC Level 1 Path',       platform:'tryhackme',difficulty:'medium',topic:'SOC',         url:'https://tryhackme.com/path/outline/soclevel1',          xpReward:50},
    {id:'s17',name:'Splunk: Basics',         platform:'tryhackme',difficulty:'medium',topic:'SIEM',        url:'https://tryhackme.com/room/splunk101',                  xpReward:50},
    {id:'s18',name:'Investigating Windows',  platform:'tryhackme',difficulty:'hard',  topic:'Forensics',   url:'https://tryhackme.com/room/investigatingwindows',       xpReward:80},
    // HackTheBox Starting Point (10)
    {id:'s19',name:'Meow',       platform:'htb',difficulty:'easy',  topic:'Linux/FTP',   url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s20',name:'Fawn',       platform:'htb',difficulty:'easy',  topic:'FTP',         url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s21',name:'Dancing',    platform:'htb',difficulty:'easy',  topic:'SMB',         url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s22',name:'Redeemer',   platform:'htb',difficulty:'easy',  topic:'Redis',       url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s23',name:'Explosion',  platform:'htb',difficulty:'easy',  topic:'RDP/Windows', url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s24',name:'Mongod',     platform:'htb',difficulty:'easy',  topic:'MongoDB',     url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s25',name:'Preignition',platform:'htb',difficulty:'easy',  topic:'Web/Brute',   url:'https://app.hackthebox.com/starting-point',xpReward:30},
    {id:'s26',name:'Three',      platform:'htb',difficulty:'medium',topic:'AWS/Cloud',   url:'https://app.hackthebox.com/starting-point',xpReward:50},
    {id:'s27',name:'Ignition',   platform:'htb',difficulty:'medium',topic:'Web',         url:'https://app.hackthebox.com/starting-point',xpReward:50},
    {id:'s28',name:'Bike',       platform:'htb',difficulty:'medium',topic:'SSTI',        url:'https://app.hackthebox.com/starting-point',xpReward:50}
  ];

  /* ── Filter state ──────────────────────────────────────── */
  var activeFilters = { platform: 'all', difficulty: 'all' };
  var noteTimers    = {};

  /* ── State helpers ─────────────────────────────────────── */

  // Ensure labsCustom array exists on state
  function ensureState(s) {
    if (!s.labsCustom) s.labsCustom = [];
    if (s.thmLabs === undefined) s.thmLabs = 0;
  }

  function getCustomLabs(s) { return s.labsCustom || []; }

  function isAlreadyAdded(s, seedId) {
    return getCustomLabs(s).some(function (l) { return l.seedId === seedId; });
  }

  function getStats(s) {
    var labs = getCustomLabs(s);
    var done = labs.filter(function (l) { return l.done; }).length;
    var xp   = labs.reduce(function (acc, l) { return acc + (l.done ? (l.xpReward || 30) : 0); }, 0);
    return {
      total:      labs.length,
      done:       done,
      inProgress: labs.length - done,
      xpEarned:   xp
    };
  }

  /* ── XP award (defensive — works with or without Gamify) ── */
  function awardXP(s, amount, reason) {
    if (window.SHIBI && SHIBI.Gamify && SHIBI.Gamify.addXP) {
      SHIBI.Gamify.addXP(s, amount, reason);
    } else {
      SHIBI.Utils.toast('+' + amount + ' XP — ' + reason);
    }
  }

  /* ── Platform badge HTML ───────────────────────────────── */
  function platformBadge(p) {
    var colors = { tryhackme:'#1db954', htb:'#9FEF00', linux:'#00ffd0', networking:'#a855f7', custom:'#8a9bb8' };
    var labels = { tryhackme:'THM', htb:'HTB', linux:'Linux', networking:'Net', custom:'Custom' };
    return '<span class="platform-badge" style="color:' + (colors[p]||'#8a9bb8') + ';border-color:' + (colors[p]||'#8a9bb8') + '">' + (labels[p]||p) + '</span>';
  }

  function diffBadge(d) {
    var cls = { easy:'easy', medium:'med', hard:'hard' }[d] || 'med';
    return '<span class="diff-tag ' + cls + '">' + d.toUpperCase() + '</span>';
  }

  /* ── Render stats row ──────────────────────────────────── */
  function renderStats(s) {
    var el  = document.getElementById('labStatsRow');
    if (!el) return;
    var st  = getStats(s);
    el.innerHTML = [
      {val: st.total,      label:'Total Labs',      icon:'bi-collection-fill'},
      {val: st.done,       label:'Completed',       icon:'bi-check-circle-fill'},
      {val: st.inProgress, label:'In Progress',     icon:'bi-hourglass-split'},
      {val: st.xpEarned,   label:'XP from Labs',    icon:'bi-gem'}
    ].map(function (k) {
      return '<div class="col-6 col-md-3"><div class="kpi-card glass">' +
        '<div class="kpi-icon"><i class="bi ' + k.icon + '"></i></div>' +
        '<div class="kpi-val">' + k.val + '</div>' +
        '<div class="kpi-label">' + k.label + '</div>' +
      '</div></div>';
    }).join('');
  }

  /* ── Render filter chips ───────────────────────────────── */
  function renderFilters() {
    var el = document.getElementById('labFilterChips');
    if (!el) return;
    var platforms   = ['all','tryhackme','htb','custom'];
    var difficulties = ['all','easy','medium','hard'];
    el.innerHTML =
      '<div class="lab-filter-group">' +
      platforms.map(function (p) {
        return '<button class="lab-filter-chip' + (activeFilters.platform === p ? ' active' : '') + '" data-filter-type="platform" data-filter-val="' + p + '">' +
          (p === 'all' ? 'All Platforms' : p === 'tryhackme' ? 'TryHackMe' : p === 'htb' ? 'HackTheBox' : 'Custom') +
        '</button>';
      }).join('') +
      '</div>' +
      '<div class="lab-filter-group" style="margin-top:8px">' +
      difficulties.map(function (d) {
        return '<button class="lab-filter-chip' + (activeFilters.difficulty === d ? ' active' : '') + '" data-filter-type="difficulty" data-filter-val="' + d + '">' +
          d.charAt(0).toUpperCase() + d.slice(1) +
        '</button>';
      }).join('') +
      '</div>';

    el.querySelectorAll('.lab-filter-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilters[btn.dataset.filterType] = btn.dataset.filterVal;
        render(window._SHIBI_STATE);
      });
    });
  }

  /* ── Render my labs list ───────────────────────────────── */
  function renderMyLabs(s) {
    var el    = document.getElementById('myLabsList');
    var empty = document.getElementById('myLabsEmpty');
    var count = document.getElementById('myLabsCount');
    if (!el) return;

    var labs = getCustomLabs(s).filter(function (l) {
      if (activeFilters.platform   !== 'all' && l.platform   !== activeFilters.platform)   return false;
      if (activeFilters.difficulty !== 'all' && l.difficulty !== activeFilters.difficulty) return false;
      return true;
    });

    if (count) count.textContent = getCustomLabs(s).length + ' labs';
    if (empty) empty.style.display = labs.length ? 'none' : '';

    el.innerHTML = labs.map(function (lab) {
      return '<li class="task-item lab-row' + (lab.done ? ' lab-done' : '') + '" data-lab-id="' + lab.id + '">' +
        '<span class="task-check ' + (lab.done ? 'checked' : '') + '" data-action="toggle">' + (lab.done ? '✓' : '') + '</span>' +
        '<div class="lab-info">' +
          '<span class="lab-name">' + SHIBI.Utils.escapeHtml(lab.name) + '</span>' +
          '<div class="lab-badges">' + platformBadge(lab.platform) + diffBadge(lab.difficulty) +
            '<span class="badge-soft" style="font-size:10px">' + SHIBI.Utils.escapeHtml(lab.topic) + '</span>' +
          '</div>' +
          '<textarea class="lab-notes-area" placeholder="Notes..." data-action="note">' + SHIBI.Utils.escapeHtml(lab.notes || '') + '</textarea>' +
        '</div>' +
        '<div class="lab-actions">' +
          (lab.url ? '<a href="' + SHIBI.Utils.escapeAttr(lab.url) + '" target="_blank" rel="noopener" class="mini-btn outline" title="Open lab"><i class="bi bi-box-arrow-up-right"></i></a>' : '') +
          '<button class="mini-btn outline" data-action="delete" title="Remove lab"><i class="bi bi-trash3"></i></button>' +
        '</div>' +
      '</li>';
    }).join('');

    // Wire events
    el.querySelectorAll('[data-action="toggle"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.closest('[data-lab-id]').dataset.labId;
        toggleLabDone(s, id);
      });
    });
    el.querySelectorAll('[data-action="delete"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.closest('[data-lab-id]').dataset.labId;
        deleteCustomLab(s, id);
      });
    });
    el.querySelectorAll('[data-action="note"]').forEach(function (ta) {
      ta.addEventListener('input', function () {
        var id = ta.closest('[data-lab-id]').dataset.labId;
        clearTimeout(noteTimers[id]);
        noteTimers[id] = setTimeout(function () { saveLabNote(s, id, ta.value); }, 300);
      });
    });
  }

  /* ── Render recommended labs ───────────────────────────── */
  function renderRecommended(s) {
    var el = document.getElementById('recommendedLabs');
    if (!el) return;
    var shown = SEED_LABS.filter(function (lab) {
      if (isAlreadyAdded(s, lab.id)) return false;
      if (activeFilters.platform   !== 'all' && lab.platform   !== activeFilters.platform)   return false;
      if (activeFilters.difficulty !== 'all' && lab.difficulty !== activeFilters.difficulty) return false;
      return true;
    });
    if (!shown.length) {
      el.innerHTML = '<p class="text-muted-soft p-3">All recommended labs added! Great work.</p>';
      return;
    }
    el.innerHTML = shown.map(function (lab) {
      return '<div class="rec-lab-card glass">' +
        '<div class="rec-lab-name">' + SHIBI.Utils.escapeHtml(lab.name) + '</div>' +
        '<div class="rec-lab-meta">' + platformBadge(lab.platform) + diffBadge(lab.difficulty) +
          '<span class="badge-soft" style="font-size:10px">' + SHIBI.Utils.escapeHtml(lab.topic) + '</span>' +
        '</div>' +
        '<button class="mini-btn add-btn" data-seed-id="' + lab.id + '">+ Add</button>' +
      '</div>';
    }).join('');

    el.querySelectorAll('.add-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var seed = SEED_LABS.find(function (l) { return l.id === btn.dataset.seedId; });
        if (seed) addLab(s, seed);
      });
    });
  }

  /* ── Public actions ────────────────────────────────────── */

  function addLab(s, labOrSeed) {
    ensureState(s);
    var newLab = {
      id:         'lab_' + Date.now(),
      seedId:     labOrSeed.id || null,
      name:       labOrSeed.name,
      platform:   labOrSeed.platform || 'custom',
      difficulty: labOrSeed.difficulty || 'medium',
      topic:      labOrSeed.topic || '',
      url:        labOrSeed.url  || '',
      done:       false,
      notes:      '',
      xpReward:   labOrSeed.xpReward || ({ easy:30, medium:50, hard:80 }[labOrSeed.difficulty] || 50),
      completedAt:null
    };
    s.labsCustom.push(newLab);
    SHIBI.State.save(s);
    render(s);
    SHIBI.Utils.toast('Lab added: ' + newLab.name);
  }

  function toggleLabDone(s, id) {
    ensureState(s);
    var lab = s.labsCustom.find(function (l) { return l.id === id; });
    if (!lab) return;
    lab.done = !lab.done;
    lab.completedAt = lab.done ? new Date().toISOString().slice(0,10) : null;
    if (lab.done) {
      // Keep thmLabs count in sync for THM labs
      if (lab.platform === 'tryhackme') s.thmLabs = (s.thmLabs || 0) + 1;
      awardXP(s, lab.xpReward, 'Lab complete: ' + lab.name);
      SHIBI.State.markStudy(s);
    }
    SHIBI.State.save(s);
    render(s);
  }

  function deleteCustomLab(s, id) {
    ensureState(s);
    s.labsCustom = s.labsCustom.filter(function (l) { return l.id !== id; });
    SHIBI.State.save(s);
    render(s);
    SHIBI.Utils.toast('Lab removed.');
  }

  function saveLabNote(s, id, text) {
    var lab = (s.labsCustom || []).find(function (l) { return l.id === id; });
    if (lab) { lab.notes = text; SHIBI.State.save(s); }
  }

  /* ── Wire "Add Custom Lab" form ────────────────────────── */
  function wireAddForm(s) {
    var toggleBtn = document.getElementById('toggleAddLabForm');
    var form      = document.getElementById('addLabForm');
    var addBtn    = document.getElementById('addLabBtn');
    if (toggleBtn && form) {
      toggleBtn.addEventListener('click', function () {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      });
    }
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var name = (document.getElementById('newLabName')  || {}).value || '';
        var plat = (document.getElementById('newLabPlatform') || {}).value || 'custom';
        var diff = (document.getElementById('newLabDifficulty') || {}).value || 'medium';
        var topic= (document.getElementById('newLabTopic') || {}).value || '';
        var url  = (document.getElementById('newLabUrl')   || {}).value || '';
        if (!name.trim()) { SHIBI.Utils.toast('Enter a lab name.'); return; }
        addLab(s, { name:name.trim(), platform:plat, difficulty:diff, topic:topic.trim(), url:url.trim() });
        ['newLabName','newLabTopic','newLabUrl'].forEach(function (id) {
          var el = document.getElementById(id); if (el) el.value = '';
        });
        if (form) form.style.display = 'none';
      });
    }
  }

  /* ── Main render ───────────────────────────────────────── */
  function render(s) {
    ensureState(s);
    renderStats(s);
    renderFilters();
    renderMyLabs(s);
    renderRecommended(s);
  }

  function init(s) {
    ensureState(s);
    render(s);
    wireAddForm(s);
  }

  return { init, render, addLab, toggleLabDone, deleteCustomLab, saveLabNote, getStats };
})();
// Backward-compat alias — must be set AFTER IIFE assigns window.SHIBI.Labs
window.SHIBI.CyberLabs = window.SHIBI.Labs;
