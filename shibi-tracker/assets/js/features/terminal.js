/* features/terminal.js — Feature 14: Command Terminal */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Terminal = (function () {

  var history  = [];
  var histIdx  = -1;
  var isOpen   = false;
  var _state   = null;

  var CMD_NAMES = [
    'help', 'clear', 'exit', 'whoami', 'xp', 'status', 'streak', 'countdown',
    'add task ', 'show pending', 'show done', 'start pomodoro', 'stop pomodoro',
    'show weak', 'log hours ', 'dsa +1', 'lab done ', 'challenge solved ', 'open '
  ];

  // ─── Output helpers ───────────────────────────────────────────
  function getOut()  { return document.getElementById('terminalOutput'); }
  function getInp()  { return document.getElementById('terminalInput'); }
  function getOv()   { return document.getElementById('terminalOverlay'); }

  function append(html, cls) {
    var out = getOut();
    if (!out) return;
    var d = document.createElement('div');
    d.className = 'term-line ' + (cls || '');
    d.innerHTML  = html;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  function pr() { return '<span class="term-prompt">shibi@os:~$</span> '; }

  // ─── Command runner ───────────────────────────────────────────
  function run(raw) {
    var trimmed = raw.trim();
    append(pr() + SHIBI.Utils.escapeHtml(raw), 'term-echo');
    if (!trimmed) return;
    history.unshift(raw);
    histIdx = -1;
    var lower = trimmed.toLowerCase();

    if (lower.startsWith('open '))              { cmdOpen(lower.slice(5).trim()); return; }
    if (lower.startsWith('add task '))          { cmdAddTask(trimmed.slice(9).trim()); return; }
    if (lower.startsWith('log hours '))         { cmdLogHours(lower.slice(10).trim()); return; }
    if (lower.startsWith('lab done '))          { cmdLabDone(trimmed.slice(9).trim()); return; }
    if (lower.startsWith('challenge solved '))  { cmdChallengeSolved(lower.slice(17).trim()); return; }

    var cmds = {
      'help': cmdHelp, 'clear': cmdClear, 'exit': cmdExit,
      'whoami': cmdWhoami, 'xp': cmdXP, 'status': cmdStatus,
      'streak': cmdStreak, 'countdown': cmdCountdown,
      'show pending': cmdPending, 'show done': cmdDone,
      'start pomodoro': cmdStartPomo, 'stop pomodoro': cmdStopPomo,
      'show weak': cmdShowWeak, 'dsa +1': cmdDsaPlus,
      'add task': function () { append('Usage: <strong>add task</strong> &lt;task name&gt;', 'term-warn'); },
      'log hours': function () { append('Usage: <strong>log hours</strong> &lt;number&gt;', 'term-warn'); },
      'lab done': function () { append('Usage: <strong>lab done</strong> &lt;lab-name&gt;', 'term-warn'); },
      'challenge solved': function () { append('Usage: <strong>challenge solved</strong> &lt;easy|medium|hard&gt;', 'term-warn'); },
      'open': function () { append('Usage: <strong>open</strong> &lt;section&gt; e.g. open dsa', 'term-warn'); }
    };

    if (cmds[lower]) { cmds[lower](); }
    else { append('command not found: <span style="color:var(--accent-red)">' + SHIBI.Utils.escapeHtml(trimmed) + '</span> — type <strong>help</strong>', 'term-err'); }
  }

  // ─── Commands ──────────────────────────────────────────────────
  function cmdHelp() {
    append('<span style="color:var(--accent)">SHIBI.OS Terminal v3</span> — available commands:', '');
    var list = [
      ['help',                         'show this list'],
      ['whoami',                       'display your profile'],
      ['xp',                           'current XP and level'],
      ['status',                       'progress for each tracker'],
      ['streak',                       'current study streak'],
      ['countdown',                    'days left to placement target'],
      ['show pending',                 'list pending planner tasks'],
      ['show done',                    'list last 10 completed tasks'],
      ['add task &lt;name&gt;',        'add a task to planner'],
      ['log hours &lt;n&gt;',          'log n study hours'],
      ['dsa +1',                       'add 1 DSA problem solved'],
      ['lab done &lt;name&gt;',        'record a cyber lab as done'],
      ['challenge solved &lt;diff&gt;','mark daily challenge solved'],
      ['start pomodoro',               'start 25-min focus session'],
      ['stop pomodoro',                'stop Pomodoro timer'],
      ['show weak',                    'show weakest study areas'],
      ['open &lt;section&gt;',         'navigate (e.g. open notes)'],
      ['clear',                        'clear terminal output'],
      ['exit',                         'close terminal']
    ];
    list.forEach(function (row) {
      append('  <span style="color:var(--accent);display:inline-block;min-width:240px">' +
        row[0] + '</span><span style="color:var(--text-mute)">— ' + row[1] + '</span>', '');
    });
  }

  function cmdClear() { var o = getOut(); if (o) o.innerHTML = ''; }
  function cmdExit()  { close(); }

  function cmdWhoami() {
    var s = _state;
    append('<span style="color:var(--accent)">SHIBI</span> — placement seeker · code warrior · cyber learner', 'term-ok');
    append('Level: <span style="color:var(--accent)">' + (s.level || 1) +
      '</span>  XP: <span style="color:var(--accent)">' + (s.xp || 0) + '</span>', '');
  }

  function cmdXP() {
    var s = _state;
    var lvl = s.level || 1, xp = s.xp || 0, need = lvl * 200;
    var pct = Math.min(100, Math.round(xp / need * 100));
    var bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
    append('LVL <span style="color:var(--accent)">' + lvl + '</span>  ' +
      '<span style="color:var(--accent)">' + xp + '</span>/' + need + ' XP  [' + bar + '] ' + pct + '%', 'term-ok');
  }

  function cmdStatus() {
    var keys = SHIBI.Trackers.allKeys();
    keys.forEach(function (k) {
      var p   = SHIBI.Trackers.pct(_state, k);
      var bar = '█'.repeat(Math.round(p / 10)) + '░'.repeat(10 - Math.round(p / 10));
      var col = p >= 80 ? 'var(--accent-green)' : p >= 40 ? 'var(--accent)' : 'var(--accent-yellow)';
      append('<span style="display:inline-block;min-width:120px">' + k + '</span>' +
        ' [<span style="color:' + col + '">' + bar + '</span>] ' + p + '%', '');
    });
  }

  function cmdStreak() {
    append('Streak: <span style="color:var(--accent-yellow)">' + (_state.streak || 0) + '</span> days  ' +
      'DSA solved: <span style="color:var(--accent)">' + (_state.dsaSolved || 0) + '</span>', 'term-ok');
  }

  function cmdCountdown() {
    if (window.SHIBI && SHIBI.Countdown && SHIBI.Countdown.getDaysLeft) {
      var d = SHIBI.Countdown.getDaysLeft(_state);
      if (d === null) append('No placement date set — visit Countdown section to configure.', 'term-warn');
      else append('<span style="color:var(--accent)">' + d + '</span> days until your placement target.', 'term-ok');
    } else {
      append('Countdown module not loaded.', 'term-err');
    }
  }

  function cmdPending() {
    var pending = (_state.tasks || []).filter(function (t) { return !t.done; });
    if (!pending.length) { append('No pending tasks.', 'term-ok'); return; }
    pending.forEach(function (t, i) {
      append((i + 1) + '. ' + SHIBI.Utils.escapeHtml(t.text), '');
    });
  }

  function cmdDone() {
    var done = (_state.tasks || []).filter(function (t) { return t.done; });
    if (!done.length) { append('No completed tasks yet.', 'term-warn'); return; }
    done.slice(-10).forEach(function (t, i) {
      append('<span style="color:var(--accent-green)">✓</span> ' + SHIBI.Utils.escapeHtml(t.text), '');
    });
  }

  function cmdAddTask(name) {
    if (!name) { append('Usage: <strong>add task</strong> &lt;task name&gt;', 'term-warn'); return; }
    if (!_state.tasks) _state.tasks = [];
    _state.tasks.push({ id: Date.now(), text: name, done: false, created: Date.now() });
    SHIBI.State.save(_state);
    append('Task added: <span style="color:var(--accent)">' + SHIBI.Utils.escapeHtml(name) + '</span>', 'term-ok');
  }

  function cmdStartPomo() {
    SHIBI.Nav.show('section-pomodoro');
    if (SHIBI.Pomodoro && SHIBI.Pomodoro.autoStart) SHIBI.Pomodoro.autoStart();
    append('Navigating to Pomodoro. Focus!', 'term-ok');
    setTimeout(close, 400);
  }

  function cmdStopPomo() {
    if (SHIBI.Pomodoro && SHIBI.Pomodoro.stop) SHIBI.Pomodoro.stop();
    append('Pomodoro stopped.', 'term-ok');
  }

  function cmdShowWeak() {
    if (window.SHIBI && SHIBI.Mentor && SHIBI.Mentor.getWeakAreas) {
      var weak = SHIBI.Mentor.getWeakAreas(_state);
      if (!weak || !weak.length) { append('No weak areas detected — great work!', 'term-ok'); return; }
      weak.slice(0, 5).forEach(function (w, i) {
        append((i + 1) + '. <span style="color:var(--accent-yellow)">' + w.key + '</span>' +
          '  score: ' + (w.score !== undefined ? w.score.toFixed(1) : '?'), '');
      });
    } else {
      append('Mentor module not loaded.', 'term-err');
    }
  }

  function cmdLogHours(n) {
    var h = parseFloat(n);
    if (isNaN(h) || h <= 0) { append('Usage: <strong>log hours</strong> &lt;number&gt;', 'term-warn'); return; }
    _state.hoursToday = (_state.hoursToday || 0) + h;
    SHIBI.State.markStudy(_state);
    SHIBI.State.bumpActivity(_state, 'hours', h);
    SHIBI.State.save(_state);
    append('Logged <span style="color:var(--accent)">' + h + 'h</span>  Total today: ' +
      _state.hoursToday.toFixed(1) + 'h', 'term-ok');
  }

  function cmdDsaPlus() {
    _state.dsaSolved = (_state.dsaSolved || 0) + 1;
    _state.dsaToday  = (_state.dsaToday  || 0) + 1;
    SHIBI.State.bumpActivity(_state, 'problemsSolved', 1);
    SHIBI.Gamify.addXP(_state, 5, 'DSA +1');
    SHIBI.State.save(_state);
    append('DSA total: <span style="color:var(--accent)">' + _state.dsaSolved + '</span>', 'term-ok');
  }

  function cmdLabDone(name) {
    if (!name) { append('Usage: <strong>lab done</strong> &lt;lab-name&gt;', 'term-warn'); return; }
    _state.thmLabs = (_state.thmLabs || 0) + 1;
    SHIBI.Gamify.addXP(_state, 15, 'Lab done: ' + name);
    SHIBI.State.save(_state);
    append('Lab recorded. TryHackMe total: <span style="color:var(--accent)">' + _state.thmLabs + '</span>', 'term-ok');
  }

  function cmdChallengeSolved(diff) {
    if (!diff || !['easy','medium','hard'].includes(diff)) {
      append('Usage: <strong>challenge solved</strong> &lt;easy|medium|hard&gt;', 'term-warn');
      return;
    }
    var key = new Date().toISOString().slice(0, 10);
    if (!_state.dailyChallenges) _state.dailyChallenges = {};
    if (!_state.dailyChallenges[key]) _state.dailyChallenges[key] = {};
    if (_state.dailyChallenges[key][diff]) {
      append("Today's " + diff + " challenge already marked.", 'term-warn');
      return;
    }
    _state.dailyChallenges[key][diff] = true;
    var xp = { easy: 10, medium: 20, hard: 30 }[diff];
    SHIBI.Gamify.addXP(_state, xp, 'Challenge (' + diff + ')');
    SHIBI.State.save(_state);
    append(diff + ' challenge solved! +' + xp + ' XP', 'term-ok');
  }

  function cmdOpen(section) {
    var map = {
      home:'section-home', overview:'section-home',
      mentor:'section-mentor', ai:'section-mentor',
      countdown:'section-countdown',
      heatmap:'section-heatmap',
      targets:'section-targets',
      mission:'section-mission',
      java:'section-java',
      dsa:'section-dsa',
      cyber:'section-cyber', cybersec:'section-cyber',
      labs:'section-labs',
      networking:'section-networking', net:'section-networking',
      aptitude:'section-aptitude', apt:'section-aptitude',
      web:'section-web', webdev:'section-web',
      challenge:'section-challenge', daily:'section-challenge',
      interview:'section-interview',
      companies:'section-companies',
      planner:'section-planner',
      resume:'section-resume',
      tests:'section-tests', quiz:'section-tests',
      analytics:'section-analytics',
      pomodoro:'section-pomodoro', pomo:'section-pomodoro',
      badges:'section-badges', achievements:'section-badges',
      github:'section-github',
      resources:'section-resources',
      settings:'section-settings',
      roadmap:'section-roadmap',
      notes:'section-notes',
      readiness:'section-readiness'
    };
    var sid = map[section] || ('section-' + section);
    if (document.getElementById(sid)) {
      SHIBI.Nav.show(sid);
      append('Navigating to <span style="color:var(--accent)">' + SHIBI.Utils.escapeHtml(section) + '</span>', 'term-ok');
      setTimeout(close, 300);
    } else {
      append('Unknown section: <span style="color:var(--accent-red)">' + SHIBI.Utils.escapeHtml(section) + '</span>', 'term-err');
    }
  }

  // ─── Tab autocomplete ──────────────────────────────────────────
  function tabComplete(val) {
    var lower   = val.toLowerCase();
    var matches = CMD_NAMES.filter(function (c) { return c.startsWith(lower); });
    if (matches.length === 1) {
      var inp = getInp();
      if (inp) inp.value = matches[0];
    } else if (matches.length > 1) {
      append(matches.map(function (m) { return m.trim(); }).join('  '), 'term-hint');
    }
  }

  // ─── Overlay build ────────────────────────────────────────────
  function build() {
    if (document.getElementById('terminalOverlay')) return;
    var ov = document.createElement('div');
    ov.id  = 'terminalOverlay';
    ov.className = 'terminal-overlay';
    ov.style.display = 'none';
    ov.innerHTML =
      '<div class="terminal-window">' +
        '<div class="terminal-header">' +
          '<span class="term-title"><i class="bi bi-terminal-fill"></i> SHIBI.OS — Terminal</span>' +
          '<div class="term-header-dots">' +
            '<span class="term-dot red"></span><span class="term-dot yellow"></span><span class="term-dot green"></span>' +
          '</div>' +
          '<button class="term-close-btn" id="termClose"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="terminal-output" id="terminalOutput"></div>' +
        '<div class="terminal-input-row">' +
          '<span class="term-prompt-static">shibi@os:~$</span>' +
          '<input class="terminal-input" id="terminalInput" type="text" autocomplete="off" spellcheck="false" placeholder="type a command, press Tab to autocomplete..." />' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    document.getElementById('termClose').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });

    var inp = document.getElementById('terminalInput');
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var raw = inp.value;
        inp.value = '';
        run(raw);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        histIdx = Math.min(histIdx + 1, history.length - 1);
        if (history[histIdx] !== undefined) inp.value = history[histIdx];
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        histIdx = Math.max(histIdx - 1, -1);
        inp.value = histIdx === -1 ? '' : (history[histIdx] || '');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        tabComplete(inp.value);
      } else if (e.key === 'Escape') {
        close();
      }
    });

    // Welcome message
    append('<span style="color:var(--accent)">SHIBI.OS v3</span> — Command Terminal', '');
    append('Type <strong>help</strong> for available commands. Use ↑↓ for history, Tab to autocomplete.', 'term-hint');
    append('', '');
  }

  function show() {
    isOpen = true;
    var ov = getOv();
    if (!ov) { build(); ov = getOv(); }
    ov.style.display = 'flex';
    var inp = getInp();
    if (inp) setTimeout(function () { inp.focus(); }, 60);
  }

  function close() {
    isOpen = false;
    var ov = getOv();
    if (ov) ov.style.display = 'none';
  }

  function toggle(s) {
    _state = s;
    if (isOpen) close();
    else show();
  }

  function init(s) {
    _state = s;
    build();
  }

  return { init, toggle, show, close };
})();
