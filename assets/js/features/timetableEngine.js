/* features/timetableEngine.js — v4 Dynamic Timetable Engine
   Generates a per-day study plan from startDate to endDate
   based on priority weights and curriculum topics.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Timetable = (function () {

  var PRIORITY_WEIGHTS = {
    placement_focus: { java:25, dsa:30, aptitude:20, web:10, cyber:10, networking:5 },
    cybersec_focus:  { java:15, dsa:15, aptitude:5,  web:5,  cyber:30, networking:30 },
    balanced:        { java:20, dsa:20, aptitude:15, web:10, cyber:20, networking:15 }
  };

  // Subject icons for rendering
  var SUBJ_ICONS = {
    java:'bi-cup-hot-fill', dsa:'bi-diagram-3-fill', cyber:'bi-shield-lock-fill',
    aptitude:'bi-calculator-fill', web:'bi-code-slash', networking:'bi-router-fill',
    revision:'bi-arrow-repeat'
  };

  /* ── Date helpers ───────────────────────────────────────── */

  function toDateStr(d) { return d.toISOString().slice(0, 10); }

  function parseDate(str) {
    var p = str.split('-');
    return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
  }

  /* ── Public API ─────────────────────────────────────────── */

  function totalDays(s) {
    var p = s.placement;
    if (!p || !p.startDate || !p.endDate) return 90;
    return Math.max(1, Math.round(
      (parseDate(p.endDate) - parseDate(p.startDate)) / 86400000
    ) + 1);
  }

  function daysRemaining(s) {
    var p = s.placement;
    if (!p || !p.endDate) return null;
    var end   = parseDate(p.endDate);
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((end - today) / 86400000));
  }

  function currentDayIndex(s) {
    var startStr = (s.placement && s.placement.startDate) || s.joinDate;
    if (!startStr) return 1;
    var start = parseDate(startStr); start.setHours(0, 0, 0, 0);
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var diff  = Math.floor((today - start) / 86400000);
    return Math.max(1, diff + 1);
  }

  function percentElapsed(s) {
    var N = totalDays(s);
    return Math.min(100, Math.round((currentDayIndex(s) / N) * 100));
  }

  function recommendedHoursPerDay(s) {
    var dr = daysRemaining(s);
    if (!dr || dr <= 0) return 6;
    var base = s.placement && s.placement.targetHoursPerDay ? s.placement.targetHoursPerDay : 6;
    // If behind: bump slightly; if ahead: lower slightly
    var elapsed = percentElapsed(s);
    var loggedDays = Object.keys(s.dailyActivity || {}).length;
    var avgHoursLogged = loggedDays > 0
      ? Object.values(s.dailyActivity).reduce(function (a, d) { return a + (d.hours || 0); }, 0) / loggedDays
      : base;
    if (avgHoursLogged < base * 0.7) return Math.min(12, base + 1);
    return base;
  }

  function todayKey() { return toDateStr(new Date()); }

  function todayData(s) {
    return s.timetable && s.timetable.days && s.timetable.days[todayKey()];
  }

  function subjIcon(key) { return SUBJ_ICONS[key] || 'bi-book'; }

  /* ── Task-string builders ───────────────────────────────── */

  function buildTasksForTopic(subj, item, sessionIdx, totalSessions) {
    var t = item.topic;
    var sessionLabel = totalSessions > 1 ? ' (session ' + (sessionIdx + 1) + '/' + totalSessions + ')' : '';
    var templates = {
      java: [
        'Study ' + t + ': read theory, write a small program' + sessionLabel,
        'Practise ' + t + ': solve 3 coding exercises' + sessionLabel,
        'Review ' + t + ': prepare 2 interview Q&A answers' + sessionLabel
      ],
      dsa: [
        'Learn ' + t + ': understand theory + time/space complexity' + sessionLabel,
        'Solve 5 LeetCode problems tagged ' + t + sessionLabel,
        'Review ' + t + ' patterns — draw diagrams and trace examples' + sessionLabel
      ],
      cyber: [
        'Study ' + t + ': read notes + watch a short video' + sessionLabel,
        'Practise ' + t + ': hands-on lab or TryHackMe room' + sessionLabel,
        'Write a cheat-sheet entry for ' + t + sessionLabel
      ],
      aptitude: [
        'Study ' + t + ' — learn all formulas and shortcuts' + sessionLabel,
        'Solve 10 ' + t + ' problems under 15-minute timer' + sessionLabel,
        'Review errors on ' + t + ' — redo incorrect problems' + sessionLabel
      ],
      web: [
        'Study ' + t + ' concepts from MDN or docs' + sessionLabel,
        'Build a small demo applying ' + t + sessionLabel,
        'Add ' + t + ' to your portfolio project' + sessionLabel
      ],
      networking: [
        'Study ' + t + ': core concepts + protocol details' + sessionLabel,
        'Draw a ' + t + ' diagram from memory' + sessionLabel,
        'Answer 3 common interview questions on ' + t + sessionLabel
      ]
    };
    var pool = templates[subj] || templates.java;
    return pool[sessionIdx % pool.length];
  }

  function buildAllTaskStrings(subj, mode) {
    if (!window.SHIBI_CURRICULUM || !SHIBI_CURRICULUM[subj]) return [];
    var tasks = [];
    SHIBI_CURRICULUM[subj].forEach(function (item) {
      if (mode === 'compressed' && !item.mustHave) return;
      var nsess = Math.max(1, Math.ceil(item.estHours / 2));
      for (var i = 0; i < nsess; i++) {
        tasks.push(buildTasksForTopic(subj, item, i, nsess));
      }
    });
    return tasks;
  }

  /* ── Week/Month builders ────────────────────────────────── */

  function buildWeeks(startDate, endDate, days, hpd) {
    var weeks = [];
    var cur   = new Date(startDate);
    var weekNum = 1;
    while (cur <= endDate) {
      var wStart = new Date(cur);
      var wEnd   = new Date(cur); wEnd.setDate(wEnd.getDate() + 6);
      if (wEnd > endDate) wEnd = new Date(endDate);
      var items = [];
      var wd = new Date(wStart);
      while (wd <= wEnd) {
        var ds = toDateStr(wd);
        var day = days[ds];
        if (day) {
          day.tasks.forEach(function (t, ti) {
            items.push({ id: ds + '_' + ti, text: t, done: false });
          });
        }
        wd.setDate(wd.getDate() + 1);
      }
      weeks.push({
        weekNum: weekNum++,
        startDate: toDateStr(wStart),
        endDate:   toDateStr(wEnd),
        items:     items,
        hoursTarget: 7 * (hpd || 6)
      });
      cur.setDate(cur.getDate() + 7);
    }
    return weeks;
  }

  function buildMonths(startDate, endDate) {
    var months = [];
    var cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    var num = 1;
    while (cur <= endDate) {
      var mStart = new Date(Math.max(startDate.getTime(), cur.getTime()));
      var mEndRaw = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
      var mEnd   = new Date(Math.min(endDate.getTime(), mEndRaw.getTime()));
      months.push({
        monthNum:  num++,
        startDate: toDateStr(mStart),
        endDate:   toDateStr(mEnd),
        milestones: [
          { id:'rev_' + num, text:'Monthly revision: review all topics from this month', done:false },
          { id:'mck_' + num, text:'Take a full mock test or timed aptitude test', done:false },
          { id:'prj_' + num, text:'Complete or update a portfolio/GitHub project', done:false }
        ]
      });
      cur.setMonth(cur.getMonth() + 1);
    }
    return months;
  }

  /* ── Core generate ──────────────────────────────────────── */

  function generate(s) {
    var p = s.placement;
    if (!p || !p.startDate || !p.endDate) {
      SHIBI.Utils.toast('Set start and end dates in Prep Setup first.');
      return false;
    }

    var startDate = parseDate(p.startDate);
    var endDate   = parseDate(p.endDate);

    if (endDate <= startDate) {
      SHIBI.Utils.toast('End date must be after start date.');
      return false;
    }

    var N = Math.round((endDate - startDate) / 86400000) + 1;
    if (N < 7)   { SHIBI.Utils.toast('Minimum 7 days required for a timetable.'); return false; }
    if (N > 365) { SHIBI.Utils.toast('Maximum 365 days allowed.'); return false; }

    var hpd      = p.targetHoursPerDay || 6;
    var priority = p.priority || 'balanced';
    var weak     = p.weakSubjects || [];
    var mode     = N < 21 ? 'compressed' : N > 180 ? 'extended' : 'standard';

    // Phase boundaries (0-indexed)
    var phaseA_end = Math.floor(N * 0.35);
    var phaseB_end = phaseA_end + Math.floor(N * 0.40);

    // Build weights (with weak-subject boost)
    var base = PRIORITY_WEIGHTS[priority] || PRIORITY_WEIGHTS.balanced;
    var weights = {}; var totalW = 0;
    Object.keys(base).forEach(function (k) {
      weights[k] = weak.includes(k) ? Math.round(base[k] * 1.4) : base[k];
      totalW += weights[k];
    });
    // Normalise
    Object.keys(weights).forEach(function (k) {
      weights[k] = weights[k] / totalW * 100;
    });

    // Build all task strings per subject (flat ordered lists)
    var queues = {};
    ['java', 'dsa', 'cyber', 'aptitude', 'web', 'networking'].forEach(function (subj) {
      queues[subj] = buildAllTaskStrings(subj, mode);
    });

    // Save snapshot of old timetable for undo
    var oldDays = (s.timetable && s.timetable.days) ? s.timetable.days : {};

    var days = {};
    var d = new Date(startDate);

    for (var i = 0; i < N; i++) {
      var dateStr = toDateStr(d);
      var phase   = i < phaseA_end ? 'Foundation' : i < phaseB_end ? 'Building' : 'Placement Sprint';
      var isLight = ((i + 1) % 7 === 0) && N > 14;
      var budget  = isLight ? Math.max(2, Math.floor(hpd * 0.5)) : hpd;

      var tasks  = [];
      var subjMap = {};

      if (isLight) {
        // Revision day
        var revTasks = [
          'Revision day: review notes from the past 6 days — focus on weak points',
          'Self-quiz: answer 10 questions from recent topics without looking',
          'Re-solve 3 problems you found difficult this week'
        ];
        revTasks.forEach(function (t) { tasks.push(t); });
        subjMap.revision = revTasks;
      } else {
        // Bresenham distribution: each subject contributes its share of tasks
        Object.keys(queues).forEach(function (subj) {
          var allT = queues[subj];
          if (!allT || allT.length === 0) return;

          // Weighted Bresenham: subject gets floor(N * weight/100) tasks total
          var allocatedTotal = Math.floor(N * (weights[subj] || 0) / 100);
          if (allocatedTotal === 0) return;

          var expectedByNow = Math.floor((i + 1) * allocatedTotal / N);
          var expectedPrev  = Math.floor(i       * allocatedTotal / N);
          var numToday = expectedByNow - expectedPrev;

          for (var ti = 0; ti < numToday; ti++) {
            var taskIdx = expectedPrev + ti;
            if (taskIdx < allT.length) {
              var taskStr = allT[taskIdx];
              tasks.push(taskStr);
              if (!subjMap[subj]) subjMap[subj] = [];
              subjMap[subj].push(taskStr);
            }
          }
        });

        // Fallback: ensure no completely empty day
        if (tasks.length === 0) {
          var fill = 'Quick aptitude drill: solve 5 problems from any recent topic';
          tasks.push(fill);
          subjMap.aptitude = [fill];
        }
      }

      // Preserve existing completion state
      var existing = oldDays[dateStr] || {};

      days[dateStr] = {
        dayIndex:       i + 1,
        phase:          phase,
        isLight:        isLight,
        tasks:          tasks,
        subjects:       subjMap,
        estimatedHours: budget,
        done:           existing.done           || false,
        completedTasks: existing.completedTasks || []
      };

      d.setDate(d.getDate() + 1);
    }

    // Commit to state
    if (!s.timetable) s.timetable = {};
    s.timetable._prevSnapshot = oldDays;
    s.timetable.days      = days;
    s.timetable.weeks     = buildWeeks(startDate, endDate, days, hpd);
    s.timetable.months    = buildMonths(startDate, endDate);
    s.timetable.generatedAt = Date.now();
    s.timetable.mode      = mode;

    // Update state.placement
    p.setupComplete = true;
    p.endDate       = p.endDate   || p.targetDate;   // keep in sync
    p.targetDate    = p.endDate;                      // legacy mirror

    SHIBI.State.save(s);
    return N;
  }

  function regenerate(s, opts) {
    opts = opts || {};
    // generate() already preserves done marks by matching dateStr
    return generate(s);
  }

  /* ── Auto-adjust for missed days ────────────────────────── */

  function shouldAutoAdjust(s) {
    var days = s.timetable && s.timetable.days;
    if (!days) return false;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var missed = 0;
    for (var i = 1; i <= 3; i++) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var ds  = toDateStr(d);
      var day = days[ds];
      if (!day) continue;
      var pct = day.tasks.length > 0
        ? (day.completedTasks.length / day.tasks.length) * 100 : 100;
      if (pct < 30) missed++;
    }
    return missed >= 3;
  }

  function adjustForMissedDays(s) {
    var days = s.timetable && s.timetable.days;
    if (!days) return false;
    var today = new Date(); today.setHours(0, 0, 0, 0);

    // Collect uncompleted tasks from last 5 days
    var missedTasks = [];
    for (var i = 1; i <= 5; i++) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var ds  = toDateStr(d);
      var day = days[ds];
      if (!day || day.done) continue;
      day.tasks.forEach(function (t) {
        if (!day.completedTasks.includes(t)) missedTasks.push(t);
      });
    }

    if (missedTasks.length === 0) return false;

    // Save snapshot before adjustment
    s.timetable._prevSnapshot = JSON.parse(JSON.stringify(days));

    // Redistribute: one missed task per upcoming day (up to 7)
    var redistributed = 0;
    for (var k = 0; k < 7 && redistributed < missedTasks.length; k++) {
      var fd = new Date(today); fd.setDate(fd.getDate() + k + 1);
      var fds = toDateStr(fd);
      if (days[fds]) {
        days[fds].tasks.push('📌 Catch-up: ' + missedTasks[redistributed]);
        redistributed++;
      }
    }

    s.timetable.lastAdjusted   = Date.now();
    s.timetable.adjustedCount  = redistributed;
    SHIBI.State.save(s);
    return redistributed;
  }

  function undoAdjustment(s) {
    if (s.timetable && s.timetable._prevSnapshot) {
      s.timetable.days = s.timetable._prevSnapshot;
      delete s.timetable._prevSnapshot;
      delete s.timetable.lastAdjusted;
      delete s.timetable.adjustedCount;
      SHIBI.State.save(s);
      return true;
    }
    return false;
  }

  return {
    totalDays, daysRemaining, currentDayIndex, percentElapsed,
    recommendedHoursPerDay, generate, regenerate,
    adjustForMissedDays, undoAdjustment, shouldAutoAdjust,
    todayKey, todayData, subjIcon
  };
})();
