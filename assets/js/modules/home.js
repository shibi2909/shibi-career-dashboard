/* modules/home.js — overview section + KPIs + repos + search + clock */
window.SHIBI = window.SHIBI || {};

var QUOTES = [
  "Code is like humor. When you have to explain it, it's bad. — Cory House",
  "First, solve the problem. Then, write the code. — John Johnson",
  "The expert in anything was once a beginner.",
  "Discipline is choosing between what you want now and what you want most.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Hackers don't break in. They log in.",
  "Stay paranoid. Stay curious. Stay coding.",
  "Hard skills get the interview. Soft skills get the offer.",
  "Every bug you fix is one you'll never write again."
];

window.SHIBI.Home = (function () {

  function render(s) {
    var d = new Date();
    var dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.textContent = '// ' + SHIBI.Time.fmtDateLong(d);

    var qIdx = (d.getDate() + d.getMonth()) % QUOTES.length;
    var qEl = document.getElementById('dailyQuote');
    if (qEl) qEl.textContent = QUOTES[qIdx];

    var ks = document.getElementById('kpiStreak');
    var kp = document.getElementById('kpiProgress');
    var kh = document.getElementById('kpiHours');
    var kd = document.getElementById('kpiDone');
    var kt = document.getElementById('kpiTotal');
    if (ks) ks.textContent = s.streak;
    if (kp) kp.textContent = SHIBI.Trackers.overallPct(s) + '%';
    if (kh) kh.textContent = s.hoursToday.toFixed(1) + 'h';

    var done  = s.tasks.filter(function (t) { return t.done; }).length;
    var total = s.tasks.length;
    if (kd) kd.textContent = done;
    if (kt) kt.textContent = total;

    var pct = Math.min(100, (s.hoursToday / 6) * 100);
    var hb  = document.getElementById('hoursBar');
    var hbg = document.getElementById('hoursTodayBadge');
    if (hb)  hb.style.width = pct + '%';
    if (hbg) hbg.textContent = s.hoursToday.toFixed(1) + ' h today';

    var sp = document.getElementById('snapPending');
    var sd = document.getElementById('snapDone');
    var st = document.getElementById('snapTotal');
    if (sp) sp.textContent = s.tasks.filter(function (t) { return !t.done; }).length;
    if (sd) sd.textContent = done;
    if (st) st.textContent = total;

    SHIBI.Planner.renderGoals(s);
    SHIBI.Status.render(s);
    SHIBI.Gamify.updateXPPill(s);
    // FIX BUG-C: render prep summary strip every time home is shown
    renderPrepSummary(s);
  }

  // FIX BUG-C: show prep summary strip on section-home after setup is complete
  function renderPrepSummary(s) {
    var strip   = document.getElementById('prepSummaryStrip');
    var content = document.getElementById('prepSummaryContent');
    if (!strip || !content) return;

    var p = s.placement || {};
    if (!p.setupComplete || !p.startDate || !p.endDate) {
      strip.style.display = 'none';
      return;
    }
    strip.style.display = '';

    function parseD(str) { var pts = str.split('-'); return new Date(+pts[0], +pts[1]-1, +pts[2]); }
    function fmtD(str) {
      if (!str) return '—';
      var d = parseD(str);
      return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    }
    var today     = new Date(); today.setHours(0,0,0,0);
    var start     = parseD(p.startDate); start.setHours(0,0,0,0);
    var end       = parseD(p.endDate);   end.setHours(0,0,0,0);
    var totalDays = Math.max(1, Math.round((end - start) / 86400000) + 1);
    var dayIdx    = Math.min(totalDays, Math.max(1, Math.round((today - start) / 86400000) + 1));
    var remaining = Math.max(0, Math.round((end - today) / 86400000));
    var pct       = Math.min(100, Math.round((dayIdx / totalDays) * 100));
    var weakHtml  = (p.weakSubjects || []).map(function (w) {
      return '<span class="prep-chip">' + SHIBI.Utils.escapeHtml(w) + '</span>';
    }).join('');
    var priorityLabels = { placement_focus:'Placement Focus', cybersec_focus:'Cybersec Focus', balanced:'Balanced' };
    var priorityLabel  = priorityLabels[p.priority || 'balanced'] || 'Balanced';
    var urgColor = remaining <= 7 ? 'var(--accent-red)' : remaining <= 30 ? 'var(--accent-yellow)' : 'var(--accent)';

    content.innerHTML =
      '<div class="prep-summary-grid">' +
        '<div class="prep-summary-item"><div class="prep-val">' + SHIBI.Utils.escapeHtml(fmtD(p.startDate)) + '</div><div class="prep-label">START DATE</div></div>' +
        '<div class="prep-summary-item"><div class="prep-val">' + SHIBI.Utils.escapeHtml(fmtD(p.endDate)) + '</div><div class="prep-label">END DATE</div></div>' +
        '<div class="prep-summary-item"><div class="prep-val">' + totalDays + '</div><div class="prep-label">TOTAL DAYS</div></div>' +
        '<div class="prep-summary-item"><div class="prep-val" style="color:' + urgColor + '">Day ' + dayIdx + ' / ' + totalDays + '</div><div class="prep-label">PROGRESS</div></div>' +
        '<div class="prep-summary-item"><div class="prep-val" style="color:' + urgColor + '">' + remaining + '</div><div class="prep-label">DAYS LEFT</div></div>' +
        '<div class="prep-summary-item"><div class="prep-val">' + (p.targetHoursPerDay || 6) + 'h</div><div class="prep-label">DAILY TARGET</div></div>' +
        '<div class="prep-summary-item"><div class="prep-val" style="font-size:13px">' + SHIBI.Utils.escapeHtml(priorityLabel) + '</div><div class="prep-label">PRIORITY</div></div>' +
      '</div>' +
      '<div class="progress-track mt-2" style="height:6px"><div class="progress-fill" style="width:' + pct + '%;background:' + urgColor + '"></div></div>' +
      (weakHtml ? '<div class="prep-chips mt-2">' + weakHtml + '</div>' : '') +
      '<p style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);margin-top:6px">' + pct + '% elapsed</p>';
  }

  function initActions(s) {
    document.querySelectorAll('[data-hours]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var h = parseFloat(btn.dataset.hours);
        s.hoursToday = +(s.hoursToday + h).toFixed(2);
        var idx = SHIBI.Time.dayOfWeekIdx();
        s.weeklyHours[idx] = +(s.weeklyHours[idx] + h).toFixed(2);
        SHIBI.State.markStudy(s);
        SHIBI.State.save(s);
        render(s);
        SHIBI.Gamify.checkBadges(s);
        SHIBI.Utils.toast('+' + h + 'h logged');
      });
    });

    var rh = document.getElementById('resetHours');
    if (rh) rh.addEventListener('click', function () {
      s.hoursToday = 0;
      s.weeklyHours[SHIBI.Time.dayOfWeekIdx()] = 0;
      SHIBI.State.save(s);
      render(s);
    });
  }

  function initRepos(s) {
    renderRepos(s);
    var addRepoBtn = document.getElementById('addRepoBtn');
    if (addRepoBtn) addRepoBtn.addEventListener('click', function () {
      var name = document.getElementById('repoName');
      var link = document.getElementById('repoLink');
      if (!name || !link || !name.value.trim() || !link.value.trim()) {
        SHIBI.Utils.toast('Both fields required'); return;
      }
      s.repos.push({ id: Date.now(), name: name.value.trim(), url: link.value.trim() });
      name.value = ''; link.value = '';
      SHIBI.State.save(s);
      renderRepos(s);
      SHIBI.Utils.toast('Repository added');
    });
  }

  function renderRepos(s) {
    var ul = document.getElementById('repoList');
    if (!ul) return;
    ul.innerHTML = '';
    var cnt = document.getElementById('repoCount');
    var emp = document.getElementById('repoEmpty');
    if (cnt) cnt.textContent = s.repos.length;
    if (emp) emp.style.display = s.repos.length ? 'none' : 'block';
    s.repos.forEach(function (r) {
      var li = document.createElement('li');
      li.innerHTML =
        '<i class="bi bi-git"></i>' +
        '<a href="' + SHIBI.Utils.escapeAttr(r.url) + '" target="_blank" rel="noopener">' + SHIBI.Utils.escapeHtml(r.name) + '</a>' +
        '<button class="task-action del" title="Delete"><i class="bi bi-x-lg"></i></button>';
      li.querySelector('.del').addEventListener('click', function () {
        s.repos = s.repos.filter(function (x) { return x.id !== r.id; });
        SHIBI.State.save(s); renderRepos(s);
      });
      ul.appendChild(li);
    });
  }

  function startClock() {
    var el = document.getElementById('topClock');
    if (!el) return;
    function tick() { el.textContent = SHIBI.Time.fmtTimeWithSec12(new Date()); }
    tick();
    setInterval(tick, 1000);
  }

  function initSearch(s) {
    var box = document.getElementById('searchBox');
    if (!box) return;
    var map = [
      { keys: ['home', 'overview', 'dashboard'], id: 'section-home' },
      { keys: ['target', 'goal'], id: 'section-targets' },
      { keys: ['mission', 'roadmap', '90'], id: 'section-mission' },
      { keys: ['java'], id: 'section-java' },
      { keys: ['dsa', 'coding', 'algo'], id: 'section-dsa' },
      { keys: ['cyber', 'security', 'soc'], id: 'section-cyber' },
      { keys: ['network'], id: 'section-networking' },
      { keys: ['apt', 'aptitude', 'quant'], id: 'section-aptitude' },
      { keys: ['web', 'react', 'html', 'css', 'js'], id: 'section-web' },
      { keys: ['plan', 'task', 'todo'], id: 'section-planner' },
      { keys: ['test', 'quiz', 'mock'], id: 'section-tests' },
      { keys: ['chart', 'analytic', 'stat'], id: 'section-analytics' },
      { keys: ['pomo', 'focus', 'timer'], id: 'section-pomodoro' },
      { keys: ['badge', 'award', 'achiev'], id: 'section-badges' },
      { keys: ['github', 'repo', 'project'], id: 'section-github' },
      { keys: ['resource', 'link', 'youtube'], id: 'section-resources' },
      { keys: ['setting', 'theme', 'color'], id: 'section-settings' }
    ];
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var q = box.value.toLowerCase().trim();
      if (!q) return;
      if (q.startsWith('add task ')) {
        var text = box.value.slice(9).trim();
        if (text) {
          s.tasks.push({ id: Date.now(), text: text, prio: 'medium', done: false });
          SHIBI.State.save(s);
          SHIBI.Planner.renderTasks(s);
          render(s);
          SHIBI.Nav.show('section-planner');
          box.value = '';
          SHIBI.Utils.toast('Task added via command');
          return;
        }
      }
      for (var i = 0; i < map.length; i++) {
        if (map[i].keys.some(function (k) { return q.includes(k); })) {
          SHIBI.Nav.show(map[i].id);
          box.value = '';
          return;
        }
      }
      SHIBI.Utils.toast('No match — try: java, dsa, planner...');
    });
  }

  return { render, initActions, initRepos, startClock, initSearch, renderPrepSummary };
})();
