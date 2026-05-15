/* features/heatmap.js — Feature 3: GitHub-style skill activity heatmap
   52-week × 7-day grid coloured by daily study intensity.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Heatmap = (function () {

  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  /* intensity level 0-4 from daily activity score */
  function intensity(dayData) {
    if (!dayData) return 0;
    var score = (dayData.hours || 0) * 10 + (dayData.problemsSolved || 0) * 5 + (dayData.tasksDone || 0) * 3;
    if (score === 0) return 0;
    if (score < 15)  return 1;
    if (score < 35)  return 2;
    if (score < 60)  return 3;
    return 4;
  }

  function intensityColor(level) {
    var opacities = [0, 0.15, 0.35, 0.6, 1];
    return 'rgba(var(--accent-rgb, 0,255,208),' + opacities[level] + ')';
  }

  /* Build a 52-week grid starting from 52 weeks ago (Mon-aligned) */
  function buildGrid(s) {
    var cells = [];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    // find last Monday 52 weeks ago
    var startDay = new Date(today);
    startDay.setDate(startDay.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // go to Monday
    startDay.setDate(startDay.getDate() - 51 * 7); // 52 weeks back

    for (var i = 0; i < 52 * 7; i++) {
      var d = new Date(startDay);
      d.setDate(d.getDate() + i);
      var key = d.toISOString().slice(0, 10);
      var dayData = s.dailyActivity ? s.dailyActivity[key] : null;
      var isFuture = d > today;
      cells.push({
        date:     key,
        level:    isFuture ? -1 : intensity(dayData),
        data:     dayData,
        isFuture: isFuture,
        isToday:  key === today.toISOString().slice(0, 10)
      });
    }
    return cells;
  }

  function computeStats(s) {
    var act = s.dailyActivity || {};
    var activeDays  = 0;
    var missedDays  = 0;
    var longest     = 0;
    var current     = s.streak || 0;
    var bestDay     = null;
    var bestScore   = 0;
    var run         = 0;
    var today       = new Date(); today.setHours(0, 0, 0, 0);
    var startDay    = new Date(today); startDay.setDate(startDay.getDate() - 364);

    for (var d = new Date(startDay); d <= today; d.setDate(d.getDate() + 1)) {
      var k = d.toISOString().slice(0, 10);
      var score = intensity(act[k]);
      if (score > 0) {
        activeDays++;
        run++;
        longest = Math.max(longest, run);
        var total = (act[k].hours || 0) * 10 + (act[k].problemsSolved || 0) * 5 + (act[k].tasksDone || 0) * 3;
        if (total > bestScore) { bestScore = total; bestDay = k; }
      } else {
        missedDays++;
        run = 0;
      }
    }
    return { activeDays: activeDays, missedDays: missedDays, longestStreak: longest, currentStreak: current, bestDay: bestDay };
  }

  function render(s) {
    var container = document.getElementById('heatmapGrid');
    if (!container) return;

    var cells = buildGrid(s);
    var stats  = computeStats(s);

    // month labels row — compute month of first day of each column
    var monthLabels = [];
    var prevMonth   = -1;
    for (var col = 0; col < 52; col++) {
      var cellDate = new Date(cells[col * 7].date);
      var m = cellDate.getMonth();
      if (m !== prevMonth) {
        monthLabels.push({ col: col, label: cellDate.toLocaleString('default', { month: 'short' }) });
        prevMonth = m;
      }
    }

    var monthRow = '<div class="heatmap-months">';
    var currentCol = 0;
    monthLabels.forEach(function (ml) {
      // add spacer for cols before this label
      monthRow += '<span style="grid-column-start:' + (ml.col + 2) + '">' + ml.label + '</span>';
    });
    monthRow += '</div>';

    var dayLabels = '<div class="heatmap-day-labels">' +
      DAYS.map(function (d, i) {
        return i % 2 === 0 ? '<span>' + d[0] + '</span>' : '<span></span>';
      }).join('') +
      '</div>';

    var grid = '<div class="heatmap-cells">';
    for (var c = 0; c < 52; c++) {
      for (var r = 0; r < 7; r++) {
        var cell = cells[c * 7 + r];
        if (!cell) continue;
        var color = cell.isFuture ? 'var(--bg-elev)' : cell.level === 0 ? 'rgba(255,255,255,0.04)' : ('rgba(0,255,208,' + [0, 0.15, 0.35, 0.6, 1][cell.level] + ')');
        var title  = cell.date + (cell.data ? ' · ' + (cell.data.hours || 0).toFixed(1) + 'h · ' + (cell.data.problemsSolved || 0) + ' problems · ' + (cell.data.tasksDone || 0) + ' tasks' : ' · no activity');
        var todayCls = cell.isToday ? ' heatmap-today' : '';
        grid += '<div class="heatmap-cell' + todayCls + '" title="' + title + '" style="background:' + color + (cell.isToday ? ';box-shadow:0 0 0 2px var(--accent)' : '') + '"></div>';
      }
    }
    grid += '</div>';

    container.innerHTML =
      '<div class="heatmap-wrapper">' + monthRow + '<div class="heatmap-inner">' + dayLabels + grid + '</div></div>' +
      '<div class="heatmap-legend">' +
        '<span class="text-muted-soft" style="font-size:11px">Less</span>' +
        [0,1,2,3,4].map(function (l) {
          var c = l === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,255,208,' + [0,0.15,0.35,0.6,1][l] + ')';
          return '<div style="width:14px;height:14px;border-radius:3px;background:' + c + '"></div>';
        }).join('') +
        '<span class="text-muted-soft" style="font-size:11px">More</span>' +
      '</div>' +
      '<div class="row g-3 mt-3">' +
        heatStat(stats.activeDays, 'Active Days', 'bi-calendar-check-fill', 'var(--accent-green)') +
        heatStat(stats.missedDays, 'Missed Days', 'bi-calendar-x-fill', 'var(--accent-red)') +
        heatStat(stats.longestStreak, 'Longest Streak', 'bi-fire', 'var(--accent-yellow)') +
        heatStat(stats.currentStreak, 'Current Streak', 'bi-lightning-charge-fill', 'var(--accent)') +
        heatStat(stats.bestDay || '—', 'Most Active Day', 'bi-stars', 'var(--accent)') +
      '</div>';
  }

  function heatStat(val, label, icon, color) {
    return '<div class="col-6 col-md-4 col-lg-2-4">' +
      '<div class="kpi-card glass">' +
        '<div class="kpi-icon" style="color:' + color + '"><i class="bi ' + icon + '"></i></div>' +
        '<div class="kpi-val" style="font-size:22px">' + val + '</div>' +
        '<div class="kpi-label">' + label + '</div>' +
      '</div>' +
    '</div>';
  }

  function init(s) {
    render(s);
  }

  return { init, render };
})();
