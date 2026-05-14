/* modules/missions.js — 90-day mission card renderer */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Missions = (function () {

  function getCurrentDay(s) {
    return SHIBI.Targets.getCurrentDay(s);
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
          '<div class="mission-day-number">DAY ' + day + ' OF 90</div>' +
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
    if (!el || !window.SHIBI_ROADMAP_90) return;
    var html = '';
    for (var i = currentDay; i < Math.min(currentDay + 7, 90); i++) {
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
    if (!el || !window.SHIBI_ROADMAP_90) return;

    var months = [
      { label: 'Month 1 — Foundation (Days 1-30)',  start: 0,  end: 30  },
      { label: 'Month 2 — Building (Days 31-60)',   start: 30, end: 60  },
      { label: 'Month 3 — Placement Prep (Days 61-90)', start: 60, end: 90 }
    ];

    el.innerHTML = months.map(function (m, mi) {
      var days = SHIBI_ROADMAP_90.slice(m.start, m.end);
      var rows = days.map(function (d) {
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

  function render(s) {
    if (!window.SHIBI_ROADMAP_90) return;
    var currentDay = getCurrentDay(s);
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
