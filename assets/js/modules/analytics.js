/* modules/analytics.js — all Chart.js charts + timeline indicator */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Analytics = (function () {

  var charts = {};

  function destroyChart(key) {
    if (charts[key]) { charts[key].destroy(); charts[key] = null; }
  }

  function build(s) {
    var accent  = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#00ffd0';
    var textCol = getComputedStyle(document.body).getPropertyValue('--text-mute').trim() || '#8a9bb8';
    var gridCol = 'rgba(255,255,255,0.04)';

    Chart.defaults.color       = textCol;
    Chart.defaults.font.family = 'JetBrains Mono';
    Chart.defaults.font.size   = 11;

    var palette = [accent, '#ec4899', '#facc15', '#22c55e', '#a855f7', '#3b82f6'];

    /* ── 1. Skills doughnut ── */
    var skillKeys   = SHIBI.Trackers.allKeys();
    var skillData   = skillKeys.map(function (k) { return SHIBI.Trackers.pct(s, k); });
    var skillLabels = skillKeys.map(function (k) { return SHIBI.Trackers.TRACKER_DEFS[k].label; });

    destroyChart('skills');
    var scEl = document.getElementById('skillsChart');
    if (scEl) {
      charts.skills = new Chart(scEl, {
        type: 'doughnut',
        data: {
          labels: skillLabels,
          datasets: [{ data: skillData, backgroundColor: palette, borderColor: 'rgba(0,0,0,0.4)', borderWidth: 2 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '60%',
          plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } } }
        }
      });
    }

    /* ── 2. Task pie ── */
    var done    = s.tasks.filter(function (t) { return t.done; }).length;
    var pending = s.tasks.filter(function (t) { return !t.done; }).length;

    destroyChart('tasks');
    var tcEl = document.getElementById('taskChart');
    if (tcEl) {
      charts.tasks = new Chart(tcEl, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{ data: [done || 0.001, pending || 0.001], backgroundColor: [accent, '#ff4d6d'], borderColor: 'rgba(0,0,0,0.4)', borderWidth: 2 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    /* ── 3. Weekly hours bar ── */
    destroyChart('weekly');
    var wcEl = document.getElementById('weeklyChart');
    if (wcEl) {
      charts.weekly = new Chart(wcEl, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Hours studied',
            data: s.weeklyHours,
            backgroundColor: accent + '80',
            borderColor: accent,
            borderWidth: 2,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { grid: { color: gridCol } }, y: { grid: { color: gridCol }, beginAtZero: true } }
        }
      });
    }

    /* ── 4. Quiz performance line chart ── */
    destroyChart('quizPerf');
    var qpEl = document.getElementById('quizPerfChart');
    if (qpEl) {
      if (s.quizHistory && s.quizHistory.length > 0) {
        var last10 = s.quizHistory.slice(-10);
        charts.quizPerf = new Chart(qpEl, {
          type: 'line',
          data: {
            labels: last10.map(function (q, i) { return q.subject.slice(0, 8) + (i + 1); }),
            datasets: [{
              label: 'Score %',
              data: last10.map(function (q) { return q.pct !== undefined ? q.pct : Math.round((q.score / q.total) * 100); }),
              borderColor: accent,
              backgroundColor: accent + '20',
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: accent,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, max: 100, grid: { color: gridCol } },
              x: { grid: { color: gridCol } }
            },
            plugins: { legend: { display: false } }
          }
        });
      } else {
        var ctx = qpEl.getContext('2d');
        if (ctx) {
          ctx.fillStyle = textCol;
          ctx.font = '13px JetBrains Mono';
          ctx.textAlign = 'center';
          ctx.fillText('No quiz history yet — take a test first!', qpEl.width / 2, qpEl.height / 2 || 60);
        }
      }
    }

    /* ── 5. Radar: weak vs strong ── */
    destroyChart('radar');
    var radarEl = document.getElementById('radarChart');
    if (radarEl && s.quizHistory && s.quizHistory.length > 0) {
      var subjectAvg = {};
      var subjectCount = {};
      s.quizHistory.forEach(function (q) {
        var sub = q.subject;
        if (sub === 'Weekly Mock') return;
        var p = q.pct !== undefined ? q.pct : Math.round((q.score / q.total) * 100);
        if (!subjectAvg[sub]) { subjectAvg[sub] = 0; subjectCount[sub] = 0; }
        subjectAvg[sub] += p;
        subjectCount[sub]++;
      });
      var radarLabels = Object.keys(subjectAvg);
      var radarData   = radarLabels.map(function (k) { return Math.round(subjectAvg[k] / subjectCount[k]); });

      if (radarLabels.length >= 3) {
        charts.radar = new Chart(radarEl, {
          type: 'radar',
          data: {
            labels: radarLabels,
            datasets: [{
              label: 'Quiz Avg %',
              data: radarData,
              borderColor: accent,
              backgroundColor: accent + '25',
              borderWidth: 2,
              pointBackgroundColor: accent,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              r: {
                min: 0, max: 100,
                grid: { color: 'rgba(255,255,255,0.06)' },
                angleLines: { color: 'rgba(255,255,255,0.06)' },
                pointLabels: { color: textCol, font: { size: 11 } },
                ticks: { display: false }
              }
            },
            plugins: { legend: { display: false } }
          }
        });
      }
    } else if (radarEl) {
      var rctx = radarEl.getContext('2d');
      if (rctx) {
        rctx.fillStyle = textCol;
        rctx.font = '12px JetBrains Mono';
        rctx.textAlign = 'center';
        rctx.fillText('Take quizzes in 3+ subjects to see radar chart', radarEl.width / 2, (radarEl.height || 120) / 2);
      }
    }

    /* ── 6. Timeline indicator ── */
    buildTimeline(s);
  }

  function buildTimeline(s) {
    var el = document.getElementById('progressTimeline');
    if (!el || !window.SHIBI_WEEKLY_TARGETS) return;

    el.innerHTML = '';
    var currentWeek = SHIBI.Targets.getCurrentWeek(s);

    for (var w = 1; w <= 12; w++) {
      var week = SHIBI_WEEKLY_TARGETS.find(function (x) { return x.weekNum === w; });
      if (!week) continue;

      var total = week.items.length;
      var done  = week.items.filter(function (item) {
        return s.weeklyTargetsDone && s.weeklyTargetsDone['w' + w + '_' + item.id];
      }).length;

      var pct    = total > 0 ? Math.round((done / total) * 100) : 0;
      var status = '';
      var label  = '';

      if (w < currentWeek) {
        // past week
        if (pct >= 80)       { status = 'timeline-green';  label = '✓'; }
        else if (pct >= 40)  { status = 'timeline-yellow'; label = '~'; }
        else                 { status = 'timeline-red';    label = '✗'; }
      } else if (w === currentWeek) {
        status = 'timeline-current';
        label  = 'NOW';
      } else {
        status = 'timeline-future';
        label  = '';
      }

      var seg = document.createElement('div');
      seg.className = 'timeline-week ' + status;
      seg.title     = 'Week ' + w + ': ' + (week.title || '') + ' (' + pct + '% done)';
      seg.innerHTML =
        '<div class="tl-week-num">W' + w + '</div>' +
        '<div class="tl-week-bar">' +
          (w <= currentWeek
            ? '<div class="tl-fill" style="width:' + pct + '%"></div>'
            : '<div class="tl-fill tl-fill-empty" style="width:0%"></div>') +
        '</div>' +
        '<div class="tl-week-label">' + label + '</div>';
      el.appendChild(seg);
    }
  }

  return { build, buildTimeline };
})();
