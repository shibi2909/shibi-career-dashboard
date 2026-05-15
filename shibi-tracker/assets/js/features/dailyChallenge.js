/* features/dailyChallenge.js — Feature 7: Daily Coding Challenge */
window.SHIBI = window.SHIBI || {};
window.SHIBI.DailyChallenge = (function () {

  /* Deterministic date hash → same 3 problems every day */
  function dateHash() {
    var d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  function pickForDay(arr, seed) {
    return arr[seed % arr.length];
  }

  function getDailyChallenges() {
    if (!window.SHIBI_CHALLENGES) return null;
    var h = dateHash();
    return {
      easy:   pickForDay(SHIBI_CHALLENGES.easy,   h),
      medium: pickForDay(SHIBI_CHALLENGES.medium, Math.floor(h / 7)),
      hard:   pickForDay(SHIBI_CHALLENGES.hard,   Math.floor(h / 31))
    };
  }

  function getTodayKey() { return new Date().toISOString().slice(0, 10); }

  function getTodayState(s) {
    var key = getTodayKey();
    return (s.dailyChallenges && s.dailyChallenges[key]) || { easy: false, medium: false, hard: false };
  }

  function isSolvedToday(s, diff) {
    return !!getTodayState(s)[diff];
  }

  function getStats(s) {
    var all = s.dailyChallenges || {};
    var total = 0, days = 0;
    var byDiff = { easy: 0, medium: 0, hard: 0 };
    Object.keys(all).forEach(function (k) {
      var d = all[k];
      var dayHad = false;
      ['easy','medium','hard'].forEach(function (diff) {
        if (d[diff]) { total++; byDiff[diff]++; dayHad = true; }
      });
      if (dayHad) days++;
    });
    return { total: total, days: days, byDiff: byDiff, streak: s.dailyChallengeStreak || 0 };
  }

  function challengeCardHtml(s, challenge, diff) {
    if (!challenge) return '';
    var solved = isSolvedToday(s, diff);
    var diffColors = { easy: 'easy', medium: 'med', hard: 'hard' };
    var diffLabel = diff.charAt(0).toUpperCase() + diff.slice(1);
    var examples = challenge.examples.map(function (ex) {
      return '<div class="challenge-example"><span class="example-label">Input:</span> <code>' + SHIBI.Utils.escapeHtml(ex.input) + '</code><br><span class="example-label">Output:</span> <code>' + SHIBI.Utils.escapeHtml(ex.output) + '</code></div>';
    }).join('');

    return '<div class="challenge-card glass ' + (solved ? 'challenge-solved' : '') + '">' +
      '<div class="challenge-card-head">' +
        '<span class="diff-tag ' + diffColors[diff] + '">' + diffLabel + '</span>' +
        '<span class="challenge-topic badge-soft">' + challenge.topic + '</span>' +
        '<span class="challenge-title">' + SHIBI.Utils.escapeHtml(challenge.title) + '</span>' +
        (solved ? '<span class="challenge-done-badge"><i class="bi bi-check-circle-fill" style="color:var(--accent-green)"></i> Solved!</span>' : '') +
      '</div>' +
      '<p class="challenge-statement">' + SHIBI.Utils.escapeHtml(challenge.statement) + '</p>' +
      '<div class="challenge-examples">' + examples + '</div>' +
      '<details class="challenge-hint"><summary><i class="bi bi-lightbulb"></i> Hint</summary><p>' + SHIBI.Utils.escapeHtml(challenge.hint) + '</p></details>' +
      '<div class="challenge-actions">' +
        (challenge.leetcodeUrl ? '<a href="' + challenge.leetcodeUrl + '" target="_blank" rel="noopener" class="mini-btn"><i class="bi bi-box-arrow-up-right"></i> Open on LeetCode</a>' : '') +
        (solved
          ? '<button class="mini-btn outline challenge-unsolve-btn" data-diff="' + diff + '">Unmark</button>'
          : '<button class="mini-btn primary challenge-solve-btn" data-diff="' + diff + '"><i class="bi bi-check-lg"></i> Mark Solved</button>') +
      '</div>' +
    '</div>';
  }

  function updateStreak(s) {
    var today = getTodayKey();
    var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    var yKey = yesterday.toISOString().slice(0, 10);
    var todayState = getTodayState(s);
    var todayHasSolved = todayState.easy || todayState.medium || todayState.hard;

    if (s.dailyChallengeLast === today) return; // already updated today
    if (todayHasSolved) {
      var lastWasYesterday = s.dailyChallengeLast === yKey;
      s.dailyChallengeStreak = lastWasYesterday ? (s.dailyChallengeStreak || 0) + 1 : 1;
      s.dailyChallengeLast   = today;
    }
  }

  function render(s) {
    var container = document.getElementById('dailyChallengeContent');
    if (!container) return;

    var challenges = getDailyChallenges();
    var stats      = getStats(s);
    if (!challenges) { container.innerHTML = '<p class="text-muted-soft">Loading challenges...</p>'; return; }

    var today = getTodayKey();
    var todaySolved = getTodayState(s);
    var solvedCount = (todaySolved.easy ? 1 : 0) + (todaySolved.medium ? 1 : 0) + (todaySolved.hard ? 1 : 0);

    container.innerHTML =
      // date + stats strip
      '<div class="challenge-date-strip">' +
        '<span class="challenge-date">' + SHIBI.Time.fmtDateLong(new Date()) + '</span>' +
        '<span class="badge-soft">' + solvedCount + '/3 today</span>' +
        '<span class="badge-soft"><i class="bi bi-fire"></i> ' + stats.streak + ' day streak</span>' +
        '<span class="badge-soft">Total: ' + stats.total + ' solved</span>' +
      '</div>' +

      // three challenge cards
      challengeCardHtml(s, challenges.easy,   'easy') +
      challengeCardHtml(s, challenges.medium, 'medium') +
      challengeCardHtml(s, challenges.hard,   'hard') +

      // overall stats panel
      '<div class="panel glass mt-4">' +
        '<div class="panel-head"><h3>Your Challenge Stats</h3></div>' +
        '<div class="row g-3">' +
          stat(stats.total, 'Total Solved', 'bi-code-square') +
          stat(stats.byDiff.easy, 'Easy', 'bi-circle', 'var(--accent-green)') +
          stat(stats.byDiff.medium, 'Medium', 'bi-circle-half', 'var(--accent-yellow)') +
          stat(stats.byDiff.hard, 'Hard', 'bi-circle-fill', 'var(--accent-red)') +
          stat(stats.days, 'Active Days', 'bi-calendar-check') +
          stat(stats.streak, 'Current Streak', 'bi-fire', 'var(--accent-yellow)') +
        '</div>' +
      '</div>';

    // listeners
    container.querySelectorAll('.challenge-solve-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var diff = btn.dataset.diff;
        var key  = getTodayKey();
        if (!s.dailyChallenges) s.dailyChallenges = {};
        if (!s.dailyChallenges[key]) s.dailyChallenges[key] = {};
        s.dailyChallenges[key][diff] = true;

        var xpAmt = { easy: 10, medium: 20, hard: 30 }[diff] || 10;
        SHIBI.Gamify.addXP(s, xpAmt, 'Daily challenge solved (' + diff + ')');
        SHIBI.State.markStudy(s);
        SHIBI.State.bumpActivity(s, 'problemsSolved', 1);
        updateStreak(s);
        SHIBI.State.save(s);
        render(s);
        SHIBI.Utils.toast('Challenge solved! +' + xpAmt + ' XP');
        SHIBI.Gamify.checkBadges(s);
      });
    });

    container.querySelectorAll('.challenge-unsolve-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = getTodayKey();
        if (s.dailyChallenges && s.dailyChallenges[key]) {
          s.dailyChallenges[key][btn.dataset.diff] = false;
          SHIBI.State.save(s);
          render(s);
        }
      });
    });
  }

  function stat(val, label, icon, color) {
    return '<div class="col-6 col-md-4 col-lg-2">' +
      '<div class="kpi-card glass">' +
        '<div class="kpi-icon" ' + (color ? 'style="color:' + color + '"' : '') + '><i class="bi ' + icon + '"></i></div>' +
        '<div class="kpi-val" style="font-size:22px">' + val + '</div>' +
        '<div class="kpi-label">' + label + '</div>' +
      '</div>' +
    '</div>';
  }

  function init(s) {
    render(s);
  }

  return { init, render, getDailyChallenges };
})();
