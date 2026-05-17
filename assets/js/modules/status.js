/* modules/status.js — placement readiness + status calculator */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Status = (function () {

  function computeReadiness(s) {
    // 40% tracker progress
    var trackerScore = SHIBI.Trackers.overallPct(s) * 0.4;

    // 20% quiz average
    var quizAvg = 0;
    if (s.quizHistory && s.quizHistory.length > 0) {
      var sum = s.quizHistory.reduce(function (a, q) {
        return a + Math.round((q.score / q.total) * 100);
      }, 0);
      quizAvg = sum / s.quizHistory.length;
    }
    var quizScore = quizAvg * 0.2;

    // 10% streak (cap at 90 days)
    var streakScore = Math.min(100, (s.streak / 90) * 100) * 0.1;

    // 10% study hours (assume 6h/day × 90 days = 540h total target)
    var totalHours = (s.weeklyHours || []).reduce(function (a, h) { return a + h; }, 0) + (s.hoursToday || 0);
    var hourScore  = Math.min(100, (totalHours / 540) * 100) * 0.1;

    // 20% targets done — monthly + weekly combined
    var targetsDoneScore = 0;
    if (window.SHIBI_MONTHLY_TARGETS && window.SHIBI_WEEKLY_TARGETS) {
      var totalTargets = 0, doneTargets = 0;
      SHIBI_MONTHLY_TARGETS.forEach(function (m) {
        m.targets.forEach(function (t) {
          totalTargets++;
          if (s.monthlyTargetsDone && s.monthlyTargetsDone[m.id + '_' + t.id]) doneTargets++;
        });
      });
      SHIBI_WEEKLY_TARGETS.forEach(function (w) {
        w.items.forEach(function (item) {
          totalTargets++;
          if (s.weeklyTargetsDone && s.weeklyTargetsDone['w' + w.weekNum + '_' + item.id]) doneTargets++;
        });
      });
      targetsDoneScore = totalTargets > 0 ? (doneTargets / totalTargets) * 100 * 0.2 : 0;
    }

    return Math.round(trackerScore + quizScore + streakScore + hourScore + targetsDoneScore);
  }

  function getLabel(pct) {
    if (pct >= 90) return 'excellent';
    if (pct >= 70) return 'on_track';
    if (pct >= 45) return 'behind';
    return 'critical';
  }

  function getMessage(label) {
    if (!window.SHIBI_MENTOR_MESSAGES) return '';
    var arr = SHIBI_MENTOR_MESSAGES[label];
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getNextAction(label) {
    var actions = {
      excellent:  'Keep today\'s study hours above target.',
      on_track:   'Finish today\'s roadmap tasks before the day ends.',
      behind:     'Open the Targets section and clear at least one pending item.',
      critical:   'Pick the easiest topic in your weakest tracker and start now.'
    };
    return actions[label] || '';
  }

  function render(s) {
    var pct     = computeReadiness(s);
    var label   = getLabel(pct);
    var msg     = getMessage(label);
    var action  = getNextAction(label);

    var labelMap = {
      excellent: { text: '🚀 EXCELLENT PROGRESS', cls: 'status-pill-excellent' },
      on_track:  { text: '🟢 ON TRACK',            cls: 'status-pill-on-track' },
      behind:    { text: '🟡 BEHIND SCHEDULE',      cls: 'status-pill-behind' },
      critical:  { text: '🔴 CRITICAL',             cls: 'status-pill-critical' }
    };

    var banner = document.getElementById('mentorBanner');
    if (!banner) return;

    var info = labelMap[label];
    banner.className = 'mentor-banner ' + info.cls;
    banner.innerHTML =
      '<div class="mentor-top">' +
        '<span class="mentor-status-pill">' + info.text + '</span>' +
        '<span class="mentor-readiness">' + pct + '% placement-ready</span>' +
      '</div>' +
      '<p class="mentor-message">' + msg + '</p>' +
      '<p class="mentor-action"><i class="bi bi-arrow-right-circle-fill"></i> ' + action + '</p>';
  }

  return { computeReadiness, getLabel, getMessage, render };
})();
