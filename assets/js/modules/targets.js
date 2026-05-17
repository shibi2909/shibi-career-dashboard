/* modules/targets.js — target-based preparation engine */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Targets = (function () {

  function getJoinDate(s) {
    // v4: prefer timetable start date; fallback to joinDate
    var startStr = (s.placement && s.placement.startDate) || s.joinDate;
    return startStr ? new Date(startStr + 'T00:00:00') : new Date();
  }

  function getTotalDays(s) {
    if (window.SHIBI && SHIBI.Timetable) return SHIBI.Timetable.totalDays(s);
    return 90;
  }

  function getCurrentDay(s) {
    var start = getJoinDate(s);
    var now   = new Date(); now.setHours(0, 0, 0, 0);
    var diff  = Math.floor((now - start) / 86400000);
    return Math.max(1, Math.min(getTotalDays(s), diff + 1));
  }

  function getCurrentWeek(s) {
    var total = getTotalDays(s);
    var maxW  = Math.ceil(total / 7);
    return Math.min(maxW, Math.max(1, Math.ceil(getCurrentDay(s) / 7)));
  }

  function getCurrentMonth(s) {
    var total = getTotalDays(s);
    var maxM  = Math.ceil(total / 30);
    return Math.min(maxM, Math.max(1, Math.ceil(getCurrentDay(s) / 30)));
  }

  function getMonthlyDonePct(s, monthIdx) {
    if (!window.SHIBI_MONTHLY_TARGETS) return 0;
    var m = SHIBI_MONTHLY_TARGETS[monthIdx];
    if (!m) return 0;
    var total = m.targets.length;
    var done  = m.targets.filter(function (t) {
      return s.monthlyTargetsDone && s.monthlyTargetsDone[m.id + '_' + t.id];
    }).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  function getWeeklyDonePct(s, weekNum) {
    if (!window.SHIBI_WEEKLY_TARGETS) return 0;
    var w = SHIBI_WEEKLY_TARGETS.find(function (x) { return x.weekNum === weekNum; });
    if (!w) return 0;
    var total = w.items.length;
    var done  = w.items.filter(function (i) {
      return s.weeklyTargetsDone && s.weeklyTargetsDone['w' + weekNum + '_' + i.id];
    }).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  function getStatus(s) {
    var monthIdx = getCurrentMonth(s) - 1;
    var weekNum  = getCurrentWeek(s);
    var mPct = getMonthlyDonePct(s, monthIdx);
    var wPct = getWeeklyDonePct(s, weekNum);
    var avg  = Math.round((mPct + wPct) / 2);
    if (avg >= 90) return 'excellent';
    if (avg >= 70) return 'on_track';
    if (avg >= 45) return 'behind';
    return 'critical';
  }

  function toggleMonthlyTarget(s, monthId, targetId) {
    if (!s.monthlyTargetsDone) s.monthlyTargetsDone = {};
    var key = monthId + '_' + targetId;
    if (s.monthlyTargetsDone[key]) {
      delete s.monthlyTargetsDone[key];
    } else {
      s.monthlyTargetsDone[key] = true;
      SHIBI.Gamify.addXP(s, 10, 'Monthly target completed');
    }
    SHIBI.State.save(s);
    render(s);
  }

  function toggleWeeklyTarget(s, weekNum, itemId) {
    if (!s.weeklyTargetsDone) s.weeklyTargetsDone = {};
    var key = 'w' + weekNum + '_' + itemId;
    if (s.weeklyTargetsDone[key]) {
      delete s.weeklyTargetsDone[key];
    } else {
      s.weeklyTargetsDone[key] = true;
      SHIBI.Gamify.addXP(s, 8, 'Weekly target completed');
    }
    SHIBI.State.save(s);
    render(s);
  }

  function statusPillHtml(status) {
    var map = {
      excellent: '<span class="status-pill-excellent">🚀 EXCELLENT PROGRESS</span>',
      on_track:  '<span class="status-pill-on-track">🟢 ON TRACK</span>',
      behind:    '<span class="status-pill-behind">🟡 BEHIND SCHEDULE</span>',
      critical:  '<span class="status-pill-critical">🔴 CRITICAL</span>'
    };
    return map[status] || map.on_track;
  }

  function progressBarHtml(pct) {
    return '<div class="progress-track mt-2 mb-1"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<small class="text-muted-soft">' + pct + '% complete</small>';
  }

  function render(s) {
    var sec = document.getElementById('section-targets');
    if (!sec) return;

    var currentDay   = getCurrentDay(s);
    var currentWeek  = getCurrentWeek(s);
    var currentMonth = getCurrentMonth(s);
    var status       = getStatus(s);

    // status banner
    var sb = document.getElementById('targetStatusBanner');
    if (sb) sb.innerHTML = statusPillHtml(status) +
      ' <span class="target-day-badge">Day ' + currentDay + ' · Week ' + currentWeek + ' · Month ' + currentMonth + '</span>';

    // TODAY box — from roadmap
    var todayBox = document.getElementById('todayTargetBox');
    if (todayBox && window.SHIBI_ROADMAP_90) {
      var dayData = SHIBI_ROADMAP_90[currentDay - 1];
      if (dayData) {
        var tasksHtml = dayData.tasks.map(function (t) {
          return '<li class="target-task-item"><i class="bi bi-arrow-right-circle"></i> ' + SHIBI.Utils.escapeHtml(t) + '</li>';
        }).join('');
        todayBox.innerHTML =
          '<div class="today-target-header">' +
            '<div class="today-day-num">DAY ' + currentDay + '</div>' +
            '<div class="today-phase">' + (dayData.phase || '') + ' · ~' + dayData.estimatedHours + 'h</div>' +
          '</div>' +
          '<ul class="target-task-list">' + tasksHtml + '</ul>';
      }
    }

    // THIS WEEK
    renderWeeklyPanel(s, currentWeek);

    // THIS MONTH
    renderMonthlyPanel(s, currentMonth);
  }

  function renderWeeklyPanel(s, weekNum) {
    var panel = document.getElementById('weeklyTargetPanel');
    if (!panel || !window.SHIBI_WEEKLY_TARGETS) return;
    var w = SHIBI_WEEKLY_TARGETS.find(function (x) { return x.weekNum === weekNum; });
    if (!w) return;
    var pct = getWeeklyDonePct(s, weekNum);
    var html = '<h5>' + w.title + '</h5>' + progressBarHtml(pct) + '<ul class="target-check-list">';
    w.items.forEach(function (item) {
      var done = s.weeklyTargetsDone && s.weeklyTargetsDone['w' + weekNum + '_' + item.id];
      html +=
        '<li class="target-item ' + (done ? 'done' : '') + '" data-week="' + weekNum + '" data-item="' + item.id + '">' +
          '<span class="target-check ' + (done ? 'checked' : '') + '">' + (done ? '✓' : '') + '</span>' +
          '<span class="target-text">' + SHIBI.Utils.escapeHtml(item.text) + '</span>' +
          '<span class="target-type-tag type-' + item.type + '">' + item.type + '</span>' +
        '</li>';
    });
    html += '</ul>';
    panel.innerHTML = html;

    panel.querySelectorAll('.target-item').forEach(function (li) {
      li.addEventListener('click', function () {
        var w = parseInt(li.dataset.week);
        var id = li.dataset.item;
        toggleWeeklyTarget(window._SHIBI_STATE, w, id);
      });
    });
  }

  function renderMonthlyPanel(s, monthNum) {
    var panel = document.getElementById('monthlyTargetPanel');
    if (!panel || !window.SHIBI_MONTHLY_TARGETS) return;
    var m = SHIBI_MONTHLY_TARGETS[monthNum - 1];
    if (!m) return;
    var pct = getMonthlyDonePct(s, monthNum - 1);
    var html = '<h5>' + m.title + '</h5><p class="text-muted-soft">' + m.subtitle + '</p>' + progressBarHtml(pct) + '<ul class="target-check-list">';
    m.targets.forEach(function (t) {
      var done = s.monthlyTargetsDone && s.monthlyTargetsDone[m.id + '_' + t.id];
      html +=
        '<li class="target-item ' + (done ? 'done' : '') + '" data-month="' + m.id + '" data-target="' + t.id + '">' +
          '<span class="target-check ' + (done ? 'checked' : '') + '">' + (done ? '✓' : '') + '</span>' +
          '<span class="target-text">' + SHIBI.Utils.escapeHtml(t.text) + '</span>' +
          '<span class="target-cat-tag">' + t.category + '</span>' +
        '</li>';
    });
    html += '</ul>';
    panel.innerHTML = html;

    panel.querySelectorAll('.target-item').forEach(function (li) {
      li.addEventListener('click', function () {
        toggleMonthlyTarget(window._SHIBI_STATE, li.dataset.month, li.dataset.target);
      });
    });
  }

  function init(s) {
    render(s);
    // join date setup if not set
    if (!s.joinDate) {
      s.joinDate = SHIBI.Time.todayStr();
      SHIBI.State.save(s);
    }
  }

  return { init, render, getCurrentDay, getCurrentWeek, getCurrentMonth, getStatus };
})();
