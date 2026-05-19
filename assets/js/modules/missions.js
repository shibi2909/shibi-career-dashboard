/* modules/missions.js — Mission Roadmap renderer (v4: dynamic timetable or fallback to 90-day static) */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Missions = (function () {

  function hasTimetable(s) {
    return !!(s.timetable && s.timetable.generatedAt && Object.keys(s.timetable.days || {}).length > 0);
  }

  function getCurrentDay(s) {
    if (window.SHIBI && SHIBI.Timetable) return SHIBI.Timetable.currentDayIndex(s);
    return SHIBI.Targets.getCurrentDay(s);
  }

  function getTotalDays(s) {
    if (window.SHIBI && SHIBI.Timetable) return SHIBI.Timetable.totalDays(s);
    return 90;
  }

  function toggleRoadmapTask(s, day, taskIdx) {
    var key = 'day' + day + '_task' + taskIdx;
    if (!s.roadmapTasksDone) s.roadmapTasksDone = {};
    if (s.roadmapTasksDone[key]) {
      delete s.roadmapTasksDone[key];
    } else {
      s.roadmapTasksDone[key] = true;
      SHIBI.Gamify.addXP(s, 5, 'Roadmap task completed');
    }
    SHIBI.State.save(s);
    render(s);
  }

  function markDayComplete(s, day) {
    if (!s.roadmapDaysDone) s.roadmapDaysDone = {};
    if (s.roadmapDaysDone['d' + day]) {
      delete s.roadmapDaysDone['d' + day];
      SHIBI.Utils.toast('Day ' + day + ' unmarked');
    } else {
      s.roadmapDaysDone['d' + day] = true;
      SHIBI.Gamify.addXP(s, 40, 'Day ' + day + ' marked complete');
      SHIBI.Utils.toast('Day ' + day + ' complete! +40 XP');
      SHIBI.Gamify.checkBadges(s);
    }
    SHIBI.State.save(s);
    render(s);
  }

  function subjectIconHtml(key) {
    var icons = { java:'bi-cup-hot-fill', dsa:'bi-diagram-3-fill', cyber:'bi-shield-lock-fill',
      aptitude:'bi-calculator-fill', coding:'bi-code-slash', revision:'bi-arrow-repeat' };
    return '<i class="bi ' + (icons[key] || 'bi-book') + '"></i>';
  }

  function renderTodayCard(s, dayData) {
    var el = document.getElementById('missionTodayCard');
    if (!el) return;
    var day = dayData.day;
    var dayKey = 'day' + day;
    var isDayDone = s.roadmapDaysDone && s.roadmapDaysDone['d' + day];
    if (!s.roadmapTasksDone) s.roadmapTasksDone = {};

    var subjectCards = '';
    var subjects = [
      { key: 'java',     label: 'Java' },
      { key: 'dsa',      label: 'DSA' },
      { key: 'cyber',    label: 'Cyber' },
      { key: 'aptitude', label: 'Aptitude' }
    ];

    subjects.forEach(function (subj) {
      var items = dayData[subj.key];
      if (!items || items.length === 0) return;
      subjectCards += '<div class="mission-subject-card">' +
        '<div class="mission-subject-head">' + subjectIconHtml(subj.key) + ' ' + subj.label + '</div>' +
        '<ul>' + items.map(function (t) { return '<li>' + SHIBI.Utils.escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
        '</div>';
    });

    var tasksHtml = dayData.tasks.map(function (task, idx) {
      var tKey = dayKey + '_task' + idx;
      var done = !!s.roadmapTasksDone[tKey];
      return '<li class="roadmap-task-item ' + (done ? 'done' : '') + '" data-day="' + day + '" data-idx="' + idx + '">' +
        '<span class="task-check ' + (done ? 'checked' : '') + '">' + (done ? '✓' : '') + '</span>' +
        '<span>' + SHIBI.Utils.escapeHtml(task) + '</span>' +
        '</li>';
    }).join('');

    el.innerHTML =
      '<div class="mission-day-header">' +
        '<div>' +
          '<div class="mission-day-number">DAY ' + day + ' OF ' + (window._SHIBI_STATE ? getTotalDays(window._SHIBI_STATE) : 90) + '</div>' +
          '<div class="mission-phase-tag">' + dayData.phase + '</div>' +
        '</div>' +
        '<div class="mission-hours-badge">~' + dayData.estimatedHours + 'h</div>' +
      '</div>' +
      '<div class="mission-subjects-grid">' + subjectCards + '</div>' +
      '<div class="mission-tasks-section">' +
        '<h5>Today\'s Tasks</h5>' +
        '<ul class="roadmap-task-list">' + tasksHtml + '</ul>' +
      '</div>' +
      '<button class="btn-neon mt-3 w-100 ' + (isDayDone ? 'day-done' : '') + '" id="markDayCompleteBtn">' +
        (isDayDone ? '✓ Day Complete (undo)' : 'Mark Day ' + day + ' Complete ✓') +
      '</button>';

    el.querySelectorAll('.roadmap-task-item').forEach(function (li) {
      li.addEventListener('click', function () {
        toggleRoadmapTask(window._SHIBI_STATE, parseInt(li.dataset.day), parseInt(li.dataset.idx));
      });
    });

    var markBtn = document.getElementById('markDayCompleteBtn');
    if (markBtn) markBtn.addEventListener('click', function () {
      markDayComplete(window._SHIBI_STATE, day);
    });
  }

  function renderNextDaysScroller(s, currentDay) {
    var el = document.getElementById('missionNextDays');
    if (!el) return;
    var html = '';

    // Timetable path
    if (hasTimetable(s)) {
      // FIX BUG-B: show the next 7 timetable days starting from today or the
      // first future day in the timetable (handles the case where today is before start date)
      var allTimetableDays = Object.keys(s.timetable.days).sort();
      var todayIso = new Date().toISOString().slice(0, 10);
      // Find first day >= today, or fallback to first day in timetable
      var startIdx = 0;
      for (var di = 0; di < allTimetableDays.length; di++) {
        if (allTimetableDays[di] >= todayIso) { startIdx = di; break; }
        if (di === allTimetableDays.length - 1) startIdx = 0; // all past
      }
      var shown = 0;
      for (var j = startIdx; j < allTimetableDays.length && shown < 7; j++, shown++) {
        var fds = allTimetableDays[j];
        var td = s.timetable.days[fds];
        if (!td) continue;
        var topicPreview = td.subjects ? Object.values(td.subjects)[0] : null;
        var preview = topicPreview && topicPreview.length > 0 ? SHIBI.Utils.escapeHtml(topicPreview[0].slice(0, 35) + (topicPreview[0].length > 35 ? '…' : '')) : td.phase;
        html += '<div class="mini-day-card ' + (td.done ? 'done' : '') + '">' +
          '<div class="mini-day-num">Day ' + td.dayIndex + '</div>' +
          '<div class="mini-day-phase">' + SHIBI.Utils.escapeHtml(td.phase) + '</div>' +
          '<div style="font-size:10px;color:var(--text-dim);margin-top:2px;font-family:var(--font-mono)">' + preview + '</div>' +
          '<div class="mini-day-hours">' + td.estimatedHours + 'h</div>' +
          '</div>';
      }
      el.innerHTML = html || '<p class="text-muted-soft">No upcoming days in timetable range.</p>';
      return;
    }

    // Fallback: static roadmap
    if (!window.SHIBI_ROADMAP_90) return;
    var totalDaysVal = getTotalDays(s);
    for (var i = currentDay; i < Math.min(currentDay + 7, totalDaysVal); i++) {
      var d = SHIBI_ROADMAP_90[i];
      if (!d) continue;
      var done = s.roadmapDaysDone && s.roadmapDaysDone['d' + d.day];
      html += '<div class="mini-day-card ' + (done ? 'done' : '') + '">' +
        '<div class="mini-day-num">Day ' + d.day + '</div>' +
        '<div class="mini-day-phase">' + d.phase + '</div>' +
        '<div class="mini-day-hours">' + d.estimatedHours + 'h</div>' +
        '</div>';
    }
    el.innerHTML = html;
  }

  function renderAccordion(s) {
    var el = document.getElementById('missionAccordion');
    if (!el) return;

    // Timetable path: group by weeks or months
    if (hasTimetable(s)) {
      var weeks = (s.timetable && s.timetable.weeks) || [];
      if (weeks.length === 0) {
        el.innerHTML = '<p class="text-muted-soft p-3">No timetable data yet.</p>';
        return;
      }
      el.innerHTML = weeks.map(function (w, wi) {
        var rows = Object.keys(s.timetable.days)
          .filter(function (ds) { return ds >= w.startDate && ds <= w.endDate; })
          .sort()
          .map(function (ds) {
            var td = s.timetable.days[ds];
            return '<div class="accordion-day-row ' + (td.done ? 'done' : '') + '">' +
              '<span class="acc-day-num">Day ' + td.dayIndex + '</span>' +
              '<span class="acc-day-phase">' + td.phase + (td.isLight ? ' ☀️' : '') + '</span>' +
              '<span class="acc-day-tasks">' + td.tasks.length + ' tasks</span>' +
              '<span class="acc-day-hours">' + td.estimatedHours + 'h</span>' +
              (td.done ? '<span class="acc-done-badge">✓</span>' : '') +
              '</div>';
          }).join('');
        return '<div class="accordion-item glass mb-2">' +
          '<button class="accordion-toggle" data-target="tacc-' + wi + '">' +
            'Week ' + w.weekNum + ' (' + w.startDate + ' → ' + w.endDate + ')' +
            ' <i class="bi bi-chevron-down"></i></button>' +
          '<div class="accordion-body" id="tacc-' + wi + '" style="display:none">' + rows + '</div>' +
          '</div>';
      }).join('');
      el.querySelectorAll('.accordion-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var body = document.getElementById(btn.dataset.target);
          if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
        });
      });
      return;
    }

    // Fallback: static 90-day accordion
    if (!window.SHIBI_ROADMAP_90) return;
    var months = [
      { label: 'Month 1 — Foundation (Days 1-30)',      start: 0,  end: 30  },
      { label: 'Month 2 — Building (Days 31-60)',        start: 30, end: 60  },
      { label: 'Month 3 — Placement Prep (Days 61-90)', start: 60, end: 90  }
    ];
    el.innerHTML = months.map(function (m, mi) {
      var daysSlice = SHIBI_ROADMAP_90.slice(m.start, m.end);
      var rows = daysSlice.map(function (d) {
        var done = s.roadmapDaysDone && s.roadmapDaysDone['d' + d.day];
        return '<div class="accordion-day-row ' + (done ? 'done' : '') + '">' +
          '<span class="acc-day-num">Day ' + d.day + '</span>' +
          '<span class="acc-day-phase">' + d.phase + '</span>' +
          '<span class="acc-day-tasks">' + d.tasks.length + ' tasks</span>' +
          '<span class="acc-day-hours">' + d.estimatedHours + 'h</span>' +
          (done ? '<span class="acc-done-badge">✓</span>' : '') +
          '</div>';
      }).join('');
      return '<div class="accordion-item glass mb-2">' +
        '<button class="accordion-toggle" data-target="acc-' + mi + '">' + m.label + ' <i class="bi bi-chevron-down"></i></button>' +
        '<div class="accordion-body" id="acc-' + mi + '" style="display:none">' + rows + '</div>' +
        '</div>';
    }).join('');
    el.querySelectorAll('.accordion-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var body = document.getElementById(btn.dataset.target);
        if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
      });
    });
  }

  /* ── Timetable today card ─────────────────────────────── */

  function renderTimetableTodayCard(s) {
    var el = document.getElementById('missionTodayCard');
    if (!el) return;
    var tdayKey  = SHIBI.Timetable.todayKey();
    var tdayData = s.timetable.days[tdayKey];
    var dayIdx   = SHIBI.Timetable.currentDayIndex(s);
    var totalD   = SHIBI.Timetable.totalDays(s);
    var remain   = SHIBI.Timetable.daysRemaining(s);

    // FIX BUG-07: when today is outside range, show the nearest valid day instead of
    // a blank "outside range" message so the user always sees a real daily plan.
    if (!tdayData) {
      var allKeys = Object.keys(s.timetable.days).sort();
      if (allKeys.length === 0) {
        el.innerHTML = '<p class="text-muted-soft p-3">No timetable days found. Re-run Prep Setup.</p>';
        return;
      }
      // Pick first future day, or last past day if all days are past
      var nearestKey = allKeys[0];
      for (var ki = 0; ki < allKeys.length; ki++) {
        if (allKeys[ki] >= tdayKey) { nearestKey = allKeys[ki]; break; }
        nearestKey = allKeys[ki];
      }
      tdayData = s.timetable.days[nearestKey];
      tdayKey  = nearestKey;
      // Update the day index label to match the nearest day
      dayIdx = tdayData.dayIndex;
    }

    var isDone = tdayData.done;

    var tasksHtml = tdayData.tasks.map(function (task, idx) {
      var done = tdayData.completedTasks && tdayData.completedTasks.includes(task);
      return '<li class="roadmap-task-item ' + (done ? 'done' : '') + '" data-task="' + SHIBI.Utils.escapeAttr(task) + '">' +
        '<span class="task-check ' + (done ? 'checked' : '') + '">' + (done ? '✓' : '') + '</span>' +
        '<span>' + SHIBI.Utils.escapeHtml(task) + '</span>' +
        '</li>';
    }).join('');

    var subjHtml = '';
    Object.keys(tdayData.subjects || {}).forEach(function (subj) {
      var tasks2 = tdayData.subjects[subj];
      if (!tasks2 || !tasks2.length) return;
      var icon = SHIBI.Timetable.subjIcon(subj);
      subjHtml += '<div class="mission-subject-card">' +
        '<div class="mission-subject-head"><i class="bi ' + icon + '"></i> ' + subj.charAt(0).toUpperCase() + subj.slice(1) + '</div>' +
        '<ul>' + tasks2.map(function (t) { return '<li>' + SHIBI.Utils.escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
        '</div>';
    });

    el.innerHTML =
      '<div class="mission-day-header">' +
        '<div>' +
          '<div class="mission-day-number">DAY ' + dayIdx + ' OF ' + totalD + '</div>' +
          '<div class="mission-phase-tag">' + tdayData.phase + (tdayData.isLight ? ' ☀️ Light day' : '') + '</div>' +
        '</div>' +
        '<div class="mission-hours-badge">~' + tdayData.estimatedHours + 'h</div>' +
        (remain !== null ? '<div class="badge-soft" style="font-size:11px">' + remain + ' days left</div>' : '') +
      '</div>' +
      '<div class="mission-subjects-grid">' + subjHtml + '</div>' +
      '<div class="mission-tasks-section">' +
        '<h5>Today\'s Tasks</h5>' +
        '<ul class="roadmap-task-list">' + tasksHtml + '</ul>' +
      '</div>' +
      '<div class="d-flex gap-2 mt-3">' +
        '<button class="btn-neon w-100 ' + (isDone ? 'day-done' : '') + '" id="markTimetableDayBtn">' +
          (isDone ? '✓ Day Complete (undo)' : 'Mark Day ' + dayIdx + ' Complete ✓') +
        '</button>' +
        '<button class="mini-btn outline" id="missedYesterdayBtn" title="Redistribute missed tasks from yesterday">' +
          '<i class="bi bi-arrow-repeat"></i> Missed yesterday' +
        '</button>' +
      '</div>';

    // Task completion toggles
    el.querySelectorAll('.roadmap-task-item').forEach(function (li) {
      li.addEventListener('click', function () {
        var task = li.dataset.task;
        var day  = s.timetable.days[tdayKey];
        if (!day) return;
        if (!day.completedTasks) day.completedTasks = [];
        var idx2 = day.completedTasks.indexOf(task);
        if (idx2 >= 0) day.completedTasks.splice(idx2, 1);
        else { day.completedTasks.push(task); SHIBI.Gamify.addXP(s, 5, 'Task completed'); }
        SHIBI.State.save(s);
        renderTimetableTodayCard(s);
      });
    });

    var markBtn = document.getElementById('markTimetableDayBtn');
    if (markBtn) markBtn.addEventListener('click', function () {
      var day = s.timetable.days[tdayKey];
      if (!day) return;
      day.done = !day.done;
      if (day.done) SHIBI.Gamify.addXP(s, 40, 'Day ' + dayIdx + ' complete');
      SHIBI.State.save(s);
      renderTimetableTodayCard(s);
      SHIBI.Utils.toast(day.done ? 'Day ' + dayIdx + ' complete! +40 XP' : 'Day ' + dayIdx + ' unmarked');
    });

    var missedBtn = document.getElementById('missedYesterdayBtn');
    if (missedBtn) missedBtn.addEventListener('click', function () {
      var count = SHIBI.Timetable.adjustForMissedDays(s);
      if (count) {
        SHIBI.Utils.toast('Redistributed ' + count + ' missed tasks across the next 7 days.');
        render(s);
      } else {
        SHIBI.Utils.toast('No missed tasks detected in the last 5 days.');
      }
    });
  }

  function render(s) {
    var currentDay = getCurrentDay(s);
    var totalD     = getTotalDays(s);

    // Timetable path
    if (hasTimetable(s)) {
      // FIX BUG-08: check and auto-adjust for missed days each time section is entered
      if (window.SHIBI && SHIBI.Timetable && SHIBI.Timetable.shouldAutoAdjust(s)) {
        var adjustCount = SHIBI.Timetable.adjustForMissedDays(s);
        if (adjustCount) {
          var adjBanner = document.getElementById('missionAdjustBanner');
          if (adjBanner) {
            adjBanner.style.display = 'flex';
            adjBanner.innerHTML =
              '<i class="bi bi-lightning-charge-fill" style="font-size:18px"></i>' +
              '<div>Timetable auto-adjusted — <strong>' + adjustCount + '</strong> missed topics redistributed across next 7 days.</div>' +
              '<button class="mini-btn outline ms-auto" id="undoAdjustBtn">Undo</button>';
            var undoBtn = document.getElementById('undoAdjustBtn');
            if (undoBtn) undoBtn.addEventListener('click', function () {
              SHIBI.Timetable.undoAdjustment(s);
              adjBanner.style.display = 'none';
              render(s);
              SHIBI.Utils.toast('Timetable adjustment undone.');
            });
          }
        }
      }
      renderTimetableTodayCard(s);
      renderNextDaysScroller(s, currentDay);
      renderAccordion(s);
      // Progress bar
      var daysComplete = Object.values(s.timetable.days).filter(function (d) { return d.done; }).length;
      var pctEl = document.getElementById('missionProgressPct');
      var barEl = document.getElementById('missionProgressBar');
      if (pctEl) pctEl.textContent = daysComplete + '/' + totalD + ' days complete (' + Math.round((daysComplete / totalD) * 100) + '%)';
      if (barEl) barEl.style.width  = Math.round((daysComplete / totalD) * 100) + '%';
      return;
    }

    // Static 90-day fallback
    if (!window.SHIBI_ROADMAP_90) return;
    var dayData = SHIBI_ROADMAP_90[currentDay - 1];
    if (!dayData) return;

    renderTodayCard(s, dayData);
    renderNextDaysScroller(s, currentDay);
    renderAccordion(s);

    // progress bar
    var daysComplete = Object.keys(s.roadmapDaysDone || {}).length;
    var pctEl = document.getElementById('missionProgressPct');
    var barEl = document.getElementById('missionProgressBar');
    if (pctEl) pctEl.textContent = daysComplete + '/90 days complete (' + Math.round((daysComplete / 90) * 100) + '%)';
    if (barEl) barEl.style.width = Math.round((daysComplete / 90) * 100) + '%';
  }

  function init(s) {
    render(s);
  }

  return { init, render };
})();
