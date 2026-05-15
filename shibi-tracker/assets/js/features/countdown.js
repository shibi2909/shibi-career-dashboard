/* features/countdown.js — Feature 2: Placement Countdown
   SVG ring showing days until target placement date.
   Also adds a compact pill to the topbar.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Countdown = (function () {

  var CIRCUMFERENCE = 565.48; // 2π × r(90)

  function getDaysLeft(s) {
    if (!s.placement || !s.placement.targetDate) return null;
    var target = new Date(s.placement.targetDate);
    var today  = new Date(); today.setHours(0, 0, 0, 0);
    var diff = Math.ceil((target - today) / 86400000);
    return diff;
  }

  function getTotalDays(s) {
    if (!s.placement || !s.placement.targetDate) return 90;
    var joinDate   = new Date(s.joinDate || s.placement.targetDate);
    var targetDate = new Date(s.placement.targetDate);
    var diff = Math.ceil((targetDate - joinDate) / 86400000);
    return Math.max(1, diff);
  }

  function getRequiredHoursPerDay(s) {
    var daysLeft = getDaysLeft(s);
    if (!daysLeft || daysLeft <= 0) return 0;
    var totalHoursTarget = (s.placement.targetHoursPerDay || 6) * getTotalDays(s);
    var hoursLogged = Object.values(s.dailyActivity || {}).reduce(function (sum, d) { return sum + (d.hours || 0); }, 0);
    var remaining = Math.max(0, totalHoursTarget - hoursLogged);
    return Math.round((remaining / daysLeft) * 10) / 10;
  }

  function updateTopbarPill(s) {
    var pill = document.getElementById('countdownPill');
    if (!pill) return;
    var days = getDaysLeft(s);
    if (days === null) { pill.style.display = 'none'; return; }
    pill.style.display = 'inline-flex';
    if (days <= 0) {
      pill.textContent = 'PLACEMENT DAY!';
      pill.style.color = 'var(--accent-green)';
    } else {
      pill.textContent = days + 'd left';
      pill.style.color = days <= 14 ? 'var(--accent-red)' : days <= 30 ? 'var(--accent-yellow)' : 'var(--accent)';
    }
  }

  function renderSetup(s) {
    var section = document.getElementById('section-countdown');
    if (!section) return;
    section.innerHTML =
      '<div class="section-head"><div>' +
        '<p class="prompt-line"><span class="prompt-symbol">~/prep $</span> ./countdown</p>' +
        '<h1 class="page-title"><i class="bi bi-calendar-event"></i> Placement <span class="accent">Countdown</span></h1>' +
        '<p class="page-sub">Set your target placement date. Track how much time is left.</p>' +
      '</div></div>' +
      '<div class="panel glass" style="max-width:480px;margin:0 auto">' +
        '<div class="panel-head"><h3><i class="bi bi-calendar-plus"></i> Set Target Date</h3></div>' +
        '<p class="text-muted-soft">When are your placements? (campus drive, walk-in, or target date)</p>' +
        '<div class="task-form">' +
          '<input type="date" id="placementDateInput" class="countdown-date-input" style="flex:1;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:10px 14px;border-radius:8px;font-family:var(--font-mono);outline:none" />' +
          '<button class="mini-btn primary" id="setPlacementDateBtn"><i class="bi bi-check-lg"></i> Set Date</button>' +
        '</div>' +
        '<div class="task-form mt-2">' +
          '<label class="text-muted-soft" style="font-family:var(--font-mono);font-size:12px;flex-shrink:0">Daily target (hours):</label>' +
          '<input type="number" id="placementHoursTarget" min="1" max="16" value="' + ((s.placement && s.placement.targetHoursPerDay) || 6) + '" style="width:70px;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:8px;border-radius:8px;font-family:var(--font-mono);outline:none" />' +
        '</div>' +
      '</div>';

    var btn = document.getElementById('setPlacementDateBtn');
    if (btn) btn.addEventListener('click', function () {
      var val  = document.getElementById('placementDateInput').value;
      var hrs  = parseInt(document.getElementById('placementHoursTarget').value) || 6;
      if (!val) { SHIBI.Utils.toast('Please pick a date'); return; }
      if (!s.placement) s.placement = {};
      s.placement.targetDate        = val;
      s.placement.targetHoursPerDay = hrs;
      SHIBI.State.save(s);
      render(s);
      updateTopbarPill(s);
      SHIBI.Utils.toast('Placement date set!');
    });
  }

  function render(s) {
    updateTopbarPill(s);
    var days = getDaysLeft(s);
    if (days === null) { renderSetup(s); return; }

    var section = document.getElementById('section-countdown');
    if (!section) return;

    var total     = getTotalDays(s);
    var elapsed   = Math.max(0, total - Math.max(0, days));
    var pct       = Math.min(100, Math.round((elapsed / total) * 100));
    var ringOffset = CIRCUMFERENCE * (1 - Math.min(1, elapsed / total));

    var reqH  = getRequiredHoursPerDay(s);
    var totalHoursTarget = (s.placement.targetHoursPerDay || 6) * total;
    var hoursLogged = Object.values(s.dailyActivity || {}).reduce(function (a, d) { return a + (d.hours || 0); }, 0);
    var currentDay = Math.min(90, Math.max(1, elapsed + 1));

    var urgencyColor = days <= 7 ? 'var(--accent-red)' : days <= 30 ? 'var(--accent-yellow)' : 'var(--accent)';

    section.innerHTML =
      '<div class="section-head"><div>' +
        '<p class="prompt-line"><span class="prompt-symbol">~/prep $</span> ./countdown --target=' + s.placement.targetDate + '</p>' +
        '<h1 class="page-title"><i class="bi bi-calendar-event"></i> Placement <span class="accent">Countdown</span></h1>' +
        '<p class="page-sub">Stay on track. Every day counts.</p>' +
      '</div></div>' +

      '<div class="row g-3">' +

        // Big ring
        '<div class="col-md-4">' +
          '<div class="panel glass text-center" style="padding:32px 20px">' +
            '<div style="position:relative;width:200px;height:200px;margin:0 auto">' +
              '<svg viewBox="0 0 200 200" style="width:100%;height:100%;transform:rotate(-90deg)">' +
                '<circle cx="100" cy="100" r="90" fill="none" stroke="var(--bg-elev)" stroke-width="10"></circle>' +
                '<circle cx="100" cy="100" r="90" fill="none" stroke="' + urgencyColor + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="565.48" stroke-dashoffset="' + ringOffset + '" style="filter:drop-shadow(0 0 8px ' + urgencyColor + ');transition:stroke-dashoffset .6s"></circle>' +
              '</svg>' +
              '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
                '<div style="font-family:var(--font-display);font-size:48px;font-weight:900;color:' + urgencyColor + ';text-shadow:0 0 20px ' + urgencyColor + ';line-height:1">' + Math.max(0, days) + '</div>' +
                '<div style="font-family:var(--font-mono);font-size:11px;color:var(--text-mute);letter-spacing:2px;margin-top:4px">DAYS LEFT</div>' +
              '</div>' +
            '</div>' +
            '<div style="font-family:var(--font-mono);font-size:11px;color:var(--text-mute);margin-top:12px">Target: ' + s.placement.targetDate + '</div>' +
            '<button class="mini-btn outline mt-2" id="changePlacementDateBtn" style="font-size:11px">Change Date</button>' +
          '</div>' +
        '</div>' +

        // Stats
        '<div class="col-md-8">' +
          '<div class="row g-3">' +
            stat('Day ' + currentDay + ' of ' + total, 'Journey Progress', 'bi-signpost-fill') +
            stat(pct + '% elapsed', 'Time Used', 'bi-hourglass-split') +
            stat(reqH + 'h / day', 'Required to Stay On Track', 'bi-lightning-charge-fill') +
            stat(hoursLogged.toFixed(1) + 'h', 'Total Hours Logged', 'bi-clock-fill') +
            stat(totalHoursTarget + 'h', 'Total Hours Target', 'bi-bullseye') +
            stat(Math.max(0, totalHoursTarget - hoursLogged).toFixed(1) + 'h', 'Hours Remaining', 'bi-battery-half') +
          '</div>' +
        '</div>' +
      '</div>';

    var chBtn = document.getElementById('changePlacementDateBtn');
    if (chBtn) chBtn.addEventListener('click', function () {
      if (!s.placement) s.placement = {};
      s.placement.targetDate = null;
      SHIBI.State.save(s);
      renderSetup(s);
    });
  }

  function stat(val, label, icon) {
    return '<div class="col-6 col-md-4">' +
      '<div class="kpi-card glass">' +
        '<div class="kpi-icon"><i class="bi ' + icon + '"></i></div>' +
        '<div class="kpi-val" style="font-size:22px">' + val + '</div>' +
        '<div class="kpi-label">' + label + '</div>' +
      '</div>' +
    '</div>';
  }

  function init(s) {
    render(s);
    updateTopbarPill(s);
  }

  return { init, render, updateTopbarPill, getDaysLeft };
})();
