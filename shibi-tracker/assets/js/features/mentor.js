/* features/mentor.js — Feature 1: AI Study Mentor + Feature 8: Weakness Detection
   Rule-based analysis of state → priority-ranked suggestions.
   No external API. Reads tracker %, hours, quiz scores, streak, targets.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Mentor = (function () {

  /* ── priority levels ── */
  var P = { CRITICAL: 'critical', HIGH: 'high', NORMAL: 'normal', WIN: 'win' };

  /* ── expected 90-day progress at current day ── */
  function expectedPct(s) {
    var day = SHIBI.Targets ? SHIBI.Targets.getCurrentDay(s) : 1;
    return Math.min(100, Math.round((day / 90) * 100));
  }

  /* ── weakness score per track ── */
  function trackWeaknessScore(s, key) {
    var pct  = SHIBI.Trackers ? SHIBI.Trackers.pct(s, key) : 0;
    var exp  = expectedPct(s);
    var gap  = Math.max(0, exp - pct);

    // factor in recent activity (hours last 7 days)
    var recentHours = 0;
    if (s.dailyActivity) {
      var now = new Date();
      for (var i = 0; i < 7; i++) {
        var d = new Date(now); d.setDate(d.getDate() - i);
        var k = d.toISOString().slice(0, 10);
        recentHours += (s.dailyActivity[k] ? (s.dailyActivity[k].hours || 0) : 0);
      }
    }
    var activityPenalty = recentHours < 3 ? 20 : 0;

    return gap + activityPenalty;
  }

  /* ── compute top 2 weakest tracks ── */
  function computeWeakAreas(s) {
    var keys = ['java', 'dsa', 'cyber', 'aptitude', 'web', 'networking'];
    var labels = { java:'Java', dsa:'DSA', cyber:'Cybersec', aptitude:'Aptitude', web:'Web Dev', networking:'Networking' };
    var scored = keys.map(function (k) {
      return { key: k, label: labels[k], score: trackWeaknessScore(s, k), pct: SHIBI.Trackers ? SHIBI.Trackers.pct(s, k) : 0 };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored;
  }

  /* ── quiz average per subject ── */
  function quizAvg(s, subject) {
    if (!s.quizHistory || s.quizHistory.length === 0) return -1;
    var attempts = s.quizHistory.filter(function (q) {
      return q.subject && q.subject.toLowerCase().includes(subject.toLowerCase());
    });
    if (attempts.length === 0) return -1;
    var sum = attempts.reduce(function (acc, q) { return acc + (q.pct !== undefined ? q.pct : Math.round((q.score / q.total) * 100)); }, 0);
    return Math.round(sum / attempts.length);
  }

  /* ── main suggestion generator ── */
  function generateSuggestions(s) {
    var suggestions = [];
    var today = SHIBI.Time ? SHIBI.Time.todayStr() : new Date().toISOString().slice(0, 10);
    var weak  = computeWeakAreas(s);
    var exp   = expectedPct(s);

    // CRITICAL: behind schedule on weakest track
    if (weak[0] && (exp - weak[0].pct) >= 20) {
      suggestions.push({
        priority: P.CRITICAL,
        icon: 'bi-exclamation-triangle-fill',
        title: weak[0].label + ' is behind schedule',
        body: 'Expected ' + exp + '% overall — you\'re at ' + weak[0].pct + '%. Study ' + weak[0].label + ' for at least 1 hour today to close the gap.',
        action: 'Open ' + weak[0].label,
        actionSection: 'section-' + weak[0].key
      });
    }

    // CRITICAL: no hours logged today
    if ((s.hoursToday || 0) === 0) {
      suggestions.push({
        priority: P.CRITICAL,
        icon: 'bi-clock-history',
        title: 'No study hours logged today',
        body: 'You haven\'t logged any hours today. Open the Pomodoro timer and start a 25-minute focused session right now.',
        action: 'Start Pomodoro',
        actionSection: 'section-pomodoro'
      });
    }

    // HIGH: DSA needs attention (placement requires 150+ problems)
    if (s.dsaSolved < 50) {
      suggestions.push({
        priority: P.HIGH,
        icon: 'bi-diagram-3-fill',
        title: 'DSA problem count is low (' + s.dsaSolved + ' solved)',
        body: 'Aim for at least 100+ problems before placements. Solve 3 problems today — mix Easy and Medium.',
        action: 'Open DSA',
        actionSection: 'section-dsa'
      });
    }

    // HIGH: second weakest area
    if (weak[1] && (exp - weak[1].pct) >= 15) {
      suggestions.push({
        priority: P.HIGH,
        icon: 'bi-lightning-charge-fill',
        title: weak[1].label + ' needs attention (' + weak[1].pct + '% done)',
        body: 'Your ' + weak[1].label + ' track is falling behind. Block 45 minutes this week to push it forward.',
        action: 'Open ' + weak[1].label,
        actionSection: 'section-' + weak[1].key
      });
    }

    // HIGH: streak about to break
    if (s.streak > 0 && s.lastActiveDate !== today) {
      suggestions.push({
        priority: P.HIGH,
        icon: 'bi-fire',
        title: 'Your ' + s.streak + '-day streak is at risk',
        body: 'Log at least one activity today to keep the streak alive. Even 30 minutes counts.',
        action: 'Log Hours',
        actionSection: 'section-home'
      });
    }

    // NORMAL: quiz performance below threshold
    var quizAvgAll = -1;
    if (s.quizHistory && s.quizHistory.length > 0) {
      var sum = s.quizHistory.reduce(function (a, q) { return a + (q.pct !== undefined ? q.pct : Math.round((q.score / q.total) * 100)); }, 0);
      quizAvgAll = Math.round(sum / s.quizHistory.length);
    }
    if (quizAvgAll >= 0 && quizAvgAll < 60) {
      suggestions.push({
        priority: P.NORMAL,
        icon: 'bi-patch-question-fill',
        title: 'Quiz average is ' + quizAvgAll + '% — aim for 70%+',
        body: 'Take a topic test on your weakest subject today. Review the explanations for every wrong answer.',
        action: 'Take a Test',
        actionSection: 'section-tests'
      });
    }

    // NORMAL: next best topic recommendation
    var nextTopic = getNextBestTopic(s);
    if (nextTopic) {
      suggestions.push({
        priority: P.NORMAL,
        icon: 'bi-bookmark-fill',
        title: 'Next best topic: ' + nextTopic.label,
        body: 'You\'re ' + nextTopic.pct + '% through ' + nextTopic.track + '. Starting "' + nextTopic.topic + '" would push you to ' + Math.min(100, nextTopic.pct + nextTopic.gain) + '%.',
        action: 'Open ' + nextTopic.track,
        actionSection: 'section-' + nextTopic.key
      });
    }

    // NORMAL: TryHackMe labs are low
    if ((s.thmLabs || 0) < 5) {
      suggestions.push({
        priority: P.NORMAL,
        icon: 'bi-shield-lock-fill',
        title: 'Complete more TryHackMe labs (' + (s.thmLabs || 0) + ' done)',
        body: 'Aim for 10+ labs. TryHackMe Pre-Security path is a great starting point — start with "Linux Fundamentals".',
        action: 'View Cyber Labs',
        actionSection: 'section-labs'
      });
    }

    // NORMAL: no interview prep yet
    var practicedCount = Object.keys(s.interviewPracticed || {}).length;
    if (practicedCount < 5) {
      suggestions.push({
        priority: P.NORMAL,
        icon: 'bi-mic-fill',
        title: 'Start interview preparation now',
        body: 'Practice "Tell me about yourself" and 5 HR questions today. Early preparation builds confidence.',
        action: 'Open Interview Prep',
        actionSection: 'section-interview'
      });
    }

    // WIN: good streak
    if (s.streak >= 7) {
      suggestions.push({
        priority: P.WIN,
        icon: 'bi-trophy-fill',
        title: 'Outstanding! ' + s.streak + '-day study streak',
        body: 'You\'ve studied consistently for ' + s.streak + ' days. This discipline is what separates placed candidates from the rest.',
        action: null,
        actionSection: null
      });
    }

    // WIN: overall good progress
    var overall = SHIBI.Trackers ? SHIBI.Trackers.overallPct(s) : 0;
    if (overall >= 50) {
      suggestions.push({
        priority: P.WIN,
        icon: 'bi-stars',
        title: 'Great overall progress: ' + overall + '% complete',
        body: 'You\'ve covered more than half the curriculum. Keep this momentum going into the placement prep phase.',
        action: null,
        actionSection: null
      });
    }

    // sort: CRITICAL first, then HIGH, NORMAL, WIN
    var order = { critical: 0, high: 1, normal: 2, win: 3 };
    suggestions.sort(function (a, b) { return order[a.priority] - order[b.priority]; });
    return suggestions;
  }

  function getNextBestTopic(s) {
    if (!SHIBI.Trackers) return null;
    var defs  = SHIBI.Trackers.TRACKER_DEFS;
    var best  = null;
    var bestScore = -1;

    Object.keys(defs).forEach(function (key) {
      var def = defs[key];
      var completed = s.trackers[key] ? s.trackers[key].completed : [];
      var remaining = def.topics.filter(function (t) { return !completed.includes(t); });
      if (remaining.length === 0) return;
      var pct = SHIBI.Trackers.pct(s, key);
      var gain = Math.round(100 / def.topics.length);
      // prefer tracks with mid-level completion (more progress impact)
      var score = (100 - pct) * 0.6 + gain * 0.4;
      if (score > bestScore) {
        bestScore = score;
        best = { key: key, track: def.label, topic: remaining[0], pct: pct, gain: gain, label: def.label };
      }
    });
    return best;
  }

  /* ── render to section-mentor ── */
  function render(s) {
    var container = document.getElementById('mentorSuggestions');
    if (!container) return;

    var suggestions = generateSuggestions(s);
    var weak = computeWeakAreas(s);

    var iconColor = { critical: 'var(--accent-red)', high: 'var(--accent-yellow)', normal: 'var(--accent)', win: 'var(--accent-green)' };
    var borderColor = { critical: 'rgba(255,77,109,0.4)', high: 'rgba(250,204,21,0.4)', normal: 'var(--border)', win: 'rgba(34,197,94,0.4)' };

    container.innerHTML = suggestions.map(function (sg) {
      return '<div class="mentor-suggestion-card glass" style="border-color:' + borderColor[sg.priority] + '">' +
        '<div class="msg-head">' +
          '<i class="bi ' + sg.icon + '" style="color:' + iconColor[sg.priority] + '"></i>' +
          '<span class="msg-priority ' + sg.priority + '">' + sg.priority.toUpperCase() + '</span>' +
          '<span class="msg-title">' + SHIBI.Utils.escapeHtml(sg.title) + '</span>' +
        '</div>' +
        '<p class="msg-body">' + SHIBI.Utils.escapeHtml(sg.body) + '</p>' +
        (sg.action ? '<button class="mini-btn mentor-action-btn" data-section="' + sg.actionSection + '">' + sg.action + ' →</button>' : '') +
      '</div>';
    }).join('') || '<div class="text-muted-soft p-4 text-center">Looking great! No critical issues found.</div>';

    container.querySelectorAll('.mentor-action-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.section) SHIBI.Nav.show(btn.dataset.section);
      });
    });

    // render weak areas panel
    renderWeakAreas(s, weak);

    // update home banner
    updateHomeBanner(s, suggestions);
  }

  function renderWeakAreas(s, weak) {
    var el = document.getElementById('weakAreasPanel');
    if (!el) return;
    var top3 = weak.slice(0, 3);
    el.innerHTML = top3.map(function (w) {
      var pct = w.pct;
      var barColor = pct < 30 ? 'var(--accent-red)' : pct < 60 ? 'var(--accent-yellow)' : 'var(--accent-green)';
      return '<div class="weak-area-row">' +
        '<span class="weak-label">' + w.label + '</span>' +
        '<div class="weak-bar-wrap"><div class="weak-bar" style="width:' + pct + '%;background:' + barColor + '"></div></div>' +
        '<span class="weak-pct">' + pct + '%</span>' +
      '</div>';
    }).join('');
  }

  /* ── pin top suggestion on home ── */
  function updateHomeBanner(s, suggestions) {
    var banner = document.getElementById('mentorHomeBanner');
    if (!banner) return;
    if (!suggestions || suggestions.length === 0) { banner.style.display = 'none'; return; }
    var top = suggestions[0];
    var colorMap = { critical: 'var(--accent-red)', high: 'var(--accent-yellow)', normal: 'var(--accent)', win: 'var(--accent-green)' };
    var col = colorMap[top.priority];
    banner.style.display = 'flex';
    banner.style.borderLeftColor = col;
    banner.innerHTML =
      '<i class="bi ' + top.icon + '" style="color:' + col + ';font-size:20px;flex-shrink:0"></i>' +
      '<div style="flex:1">' +
        '<div class="mentor-home-title">' + SHIBI.Utils.escapeHtml(top.title) + '</div>' +
        '<div class="mentor-home-body">' + SHIBI.Utils.escapeHtml(top.body) + '</div>' +
      '</div>' +
      (top.action ? '<button class="mini-btn" style="flex-shrink:0" data-section="' + top.actionSection + '">' + top.action + '</button>' : '');

    banner.querySelectorAll('[data-section]').forEach(function (btn) {
      btn.addEventListener('click', function () { SHIBI.Nav.show(btn.dataset.section); });
    });
  }

  /* ── home weak areas mini card ── */
  function renderHomeWeakCard(s) {
    var el = document.getElementById('homeWeakCard');
    if (!el) return;
    var weak = computeWeakAreas(s);
    var top2 = weak.slice(0, 2);
    el.innerHTML = '<div class="panel-head" style="margin-bottom:8px"><h3 style="font-size:13px"><i class="bi bi-activity"></i> Weak Areas</h3></div>' +
      top2.map(function (w) {
        var col = w.pct < 30 ? 'var(--accent-red)' : w.pct < 60 ? 'var(--accent-yellow)' : 'var(--accent-green)';
        return '<div class="weak-area-row" style="margin-bottom:6px">' +
          '<span class="weak-label">' + w.label + '</span>' +
          '<div class="weak-bar-wrap"><div class="weak-bar" style="width:' + w.pct + '%;background:' + col + '"></div></div>' +
          '<span class="weak-pct">' + w.pct + '%</span>' +
        '</div>';
      }).join('') +
      '<button class="mini-btn w-100 mt-2" onclick="SHIBI.Nav.show(\'section-mentor\')">Full Analysis →</button>';
  }

  function init(s) {
    render(s);
    renderHomeWeakCard(s);

    var refreshBtn = document.getElementById('mentorRefreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', function () { render(s); SHIBI.Utils.toast('Suggestions refreshed'); });
  }

  return { init, render, generateSuggestions, computeWeakAreas, getWeakAreas: computeWeakAreas, updateHomeBanner, renderHomeWeakCard };
})();
