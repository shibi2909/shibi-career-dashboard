/* modules/trackers.js — tracker render for all subjects */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Trackers = (function () {

  var TRACKER_DEFS = {
    java: {
      label: 'Java',
      topics: ['Basics & Syntax', 'OOP', 'Collections', 'Exception Handling',
               'JDBC', 'File Handling', 'Multithreading', 'Streams API']
    },
    dsa: {
      label: 'DSA',
      topics: ['Arrays', 'Strings', 'Linked Lists', 'Stack',
               'Queue', 'Trees', 'Graphs', 'Recursion', 'Sorting', 'Searching']
    },
    cyber: {
      label: 'Cybersecurity',
      topics: ['Linux', 'Nmap', 'Wireshark', 'Burp Suite',
               'SOC concepts', 'SIEM basics', 'OWASP Top 10', 'TryHackMe labs',
               'Threat hunting', 'Incident response']
    },
    aptitude: {
      label: 'Aptitude',
      topics: ['Percentages', 'Ratio', 'Probability', 'Time & Work',
               'Profit & Loss', 'Logical reasoning', 'Quantitative aptitude']
    },
    web: {
      label: 'Web Dev',
      topics: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'ReactJS basics']
    },
    networking: {
      label: 'Networking',
      topics: ['OSI Model', 'TCP/IP', 'DNS', 'HTTP/HTTPS',
               'Ports & Protocols', 'Firewalls', 'VPN', 'Routing', 'Switching']
    }
  };

  function pct(s, key) {
    var def = TRACKER_DEFS[key];
    if (!def || !s.trackers[key]) return 0;
    var total = def.topics.length;
    var done  = s.trackers[key].completed.length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }

  function allKeys() { return Object.keys(TRACKER_DEFS); }

  function totalCompleted(s) {
    return allKeys().reduce(function (acc, k) {
      return acc + (s.trackers[k] ? s.trackers[k].completed.length : 0);
    }, 0);
  }

  function totalPossible() {
    return allKeys().reduce(function (acc, k) {
      return acc + TRACKER_DEFS[k].topics.length;
    }, 0);
  }

  function overallPct(s) {
    var t = totalPossible();
    return t === 0 ? 0 : Math.round((totalCompleted(s) / t) * 100);
  }

  function renderOne(s, key, listId, barId, pctId) {
    var def = TRACKER_DEFS[key];
    var ul  = document.getElementById(listId);
    if (!ul) return;
    ul.innerHTML = '';

    if (!s.trackers[key]) s.trackers[key] = { completed: [] };

    def.topics.forEach(function (topic) {
      var li = document.createElement('li');
      var checked = s.trackers[key].completed.includes(topic);
      if (checked) li.classList.add('checked');
      li.innerHTML =
        '<span class="check-box">' + (checked ? '✓' : '') + '</span>' +
        '<span class="topic-label">' + topic + '</span>' +
        '<button class="topic-guide-btn mini-btn" data-tracker="' + key + '" data-topic="' + topic + '" title="Open guide"><i class="bi bi-book-fill"></i></button>';

      li.querySelector('.topic-label').addEventListener('click', function () {
        var arr = s.trackers[key].completed;
        var idx = arr.indexOf(topic);
        if (idx > -1) {
          // FIX BUG-04: uncheck — splice and deduct XP (min 0)
          arr.splice(idx, 1);
          s.xp = Math.max(0, (s.xp || 0) - 10);
          // Recalculate level after XP change
          var newLvl = 1;
          while (s.xp >= (newLvl + 1) * 200) newLvl++;
          s.level = newLvl;
        } else {
          arr.push(topic);
          SHIBI.Gamify.addXP(s, 10, 'Completed topic: ' + topic);
        }
        SHIBI.State.markStudy(s);
        SHIBI.State.save(s);
        renderAll(s);
        // FIX BUG-12: update home KPIs (progress %, XP pill, hours bar) after toggle
        if (window.SHIBI && SHIBI.Home) SHIBI.Home.render(s);
        SHIBI.Gamify.updateXPPill(s);
        SHIBI.Gamify.checkBadges(s);
      });

      li.querySelector('.check-box').addEventListener('click', function () {
        li.querySelector('.topic-label').click();
      });

      li.querySelector('.topic-guide-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.SHIBI.Guides) SHIBI.Guides.openModal(key, topic);
      });

      ul.appendChild(li);
    });

    var p = pct(s, key);
    var barEl = document.getElementById(barId);
    var pctEl = document.getElementById(pctId);
    if (barEl) barEl.style.width = p + '%';
    if (pctEl) pctEl.textContent = p + '%';
  }

  function renderAll(s) {
    renderOne(s, 'java',       'javaList',   'javaBar',   'javaPct');
    renderOne(s, 'dsa',        'dsaList',    'dsaBar',    'dsaPct');
    renderOne(s, 'cyber',      'cyberList',  'cyberBar',  'cyberPct');
    renderOne(s, 'aptitude',   'aptList',    'aptBar',    'aptPct');
    renderOne(s, 'web',        'webList',    'webBar',    'webPct');
    renderOne(s, 'networking', 'netList',    'netBar',    'netPct');

    // DSA counters
    var ds = document.getElementById('dsaSolved');
    var dt = document.getElementById('dsaToday');
    var dk = document.getElementById('dsaStreak');
    if (ds) ds.textContent = s.dsaSolved;
    if (dt) dt.textContent = s.dsaToday;
    if (dk) dk.textContent = s.dsaStreak;

    // THM
    var thm = document.getElementById('thmCount');
    if (thm) thm.textContent = s.thmLabs + ' labs';

    // Projects
    var proj = document.getElementById('projCount');
    if (proj) proj.textContent = s.miniProjects + ' built';

    // Aptitude weekly
    var aptPct = Math.min(100, (s.aptWeek / 35) * 100);
    var awb = document.getElementById('aptWeekBar');
    var awv = document.getElementById('aptWeekVal');
    if (awb) awb.style.width = aptPct + '%';
    if (awv) awv.textContent = s.aptWeek;
  }

  function initActions(s) {
    // DSA plus
    var dpb = document.getElementById('dsaPlusBtn');
    if (dpb) dpb.addEventListener('click', function () {
      s.dsaSolved++;
      s.dsaToday++;
      if (s.dsaToday === 1) s.dsaStreak++;
      SHIBI.State.markStudy(s);
      SHIBI.Gamify.addXP(s, 15, 'DSA problem solved');
      SHIBI.State.save(s);
      renderAll(s);
      SHIBI.Gamify.checkBadges(s);
      SHIBI.Utils.toast('Problem solved 🎉 +15 XP');
    });

    // THM labs
    var lp = document.getElementById('labPlus');
    var lr = document.getElementById('labReset');
    if (lp) lp.addEventListener('click', function () {
      s.thmLabs++;
      SHIBI.State.markStudy(s);
      SHIBI.Gamify.addXP(s, 30, 'TryHackMe lab completed');
      SHIBI.State.save(s);
      renderAll(s);
      SHIBI.Utils.toast('Lab completed! +30 XP');
    });
    if (lr) lr.addEventListener('click', function () {
      if (confirm('Reset lab count?')) { s.thmLabs = 0; SHIBI.State.save(s); renderAll(s); }
    });

    // Mini projects
    var pp = document.getElementById('projPlus');
    var pr = document.getElementById('projReset');
    if (pp) pp.addEventListener('click', function () {
      s.miniProjects++;
      SHIBI.State.markStudy(s);
      SHIBI.Gamify.addXP(s, 50, 'Mini project completed');
      SHIBI.State.save(s);
      renderAll(s);
      SHIBI.Utils.toast('Project built 🚀 +50 XP');
    });
    if (pr) pr.addEventListener('click', function () {
      if (confirm('Reset project count?')) { s.miniProjects = 0; SHIBI.State.save(s); renderAll(s); }
    });

    // Aptitude questions
    document.querySelectorAll('[data-apt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var q = parseInt(btn.dataset.apt);
        s.aptWeek += q;
        SHIBI.State.markStudy(s);
        SHIBI.State.save(s);
        renderAll(s);
        SHIBI.Utils.toast('+' + q + ' questions logged');
      });
    });
    var ar = document.getElementById('aptReset');
    if (ar) ar.addEventListener('click', function () { s.aptWeek = 0; SHIBI.State.save(s); renderAll(s); });
  }

  return { renderAll, renderOne, initActions, pct, overallPct, totalCompleted, totalPossible, allKeys, TRACKER_DEFS };
})();
