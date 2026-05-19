/* features/prepSetup.js — v4 Preparation Setup Wizard
   5-step guided wizard to configure personalised timetable.
   Section: section-prep-setup. Auto-opens first-run banner on home.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.PrepSetup = (function () {

  var currentStep = 1;
  var TOTAL_STEPS = 5;

  /* ── Helpers ──────────────────────────────────────────── */

  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  }

  function daysBetween(a, b) {
    if (!a || !b) return 0;
    return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000) + 1);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  /* ── First-run home banner ────────────────────────────── */

  function renderHomeBanner(s) {
    var el = document.getElementById('prepSetupBanner');
    if (!el) return;
    if (s.placement && s.placement.setupComplete) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'flex';
    el.innerHTML =
      '<div class="prep-banner-icon"><i class="bi bi-calendar2-week-fill"></i></div>' +
      '<div class="prep-banner-text">' +
        '<strong>Welcome! Your personalised timetable is not set up yet.</strong>' +
        '<p>Pick your prep start &amp; end dates to unlock a day-by-day study plan.</p>' +
      '</div>' +
      '<a href="#" class="mini-btn primary prep-banner-btn" data-section="section-prep-setup">' +
        '<i class="bi bi-arrow-right-circle-fill"></i> Setup Now' +
      '</a>';
  }

  /* ── Day hero strip on home ───────────────────────────── */

  function renderDayStrip(s) {
    var el = document.getElementById('dayHeroStrip');
    if (!el) return;
    if (!s.placement || !s.placement.setupComplete) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'flex';
    var dayIdx    = SHIBI.Timetable.currentDayIndex(s);
    var totalD    = SHIBI.Timetable.totalDays(s);
    var remaining = SHIBI.Timetable.daysRemaining(s);
    var recHpd    = SHIBI.Timetable.recommendedHoursPerDay(s);
    var pct       = SHIBI.Timetable.percentElapsed(s);
    var col       = remaining <= 7 ? 'var(--accent-red)' :
                    remaining <= 30 ? 'var(--accent-yellow)' : 'var(--accent)';

    el.innerHTML =
      '<div class="day-strip-item">' +
        '<div class="day-strip-val" style="color:' + col + '">' + dayIdx + '</div>' +
        '<div class="day-strip-lbl">DAY</div>' +
      '</div>' +
      '<div class="day-strip-divider"></div>' +
      '<div class="day-strip-item">' +
        '<div class="day-strip-val">' + totalD + '</div>' +
        '<div class="day-strip-lbl">TOTAL DAYS</div>' +
      '</div>' +
      '<div class="day-strip-divider"></div>' +
      '<div class="day-strip-item">' +
        '<div class="day-strip-val" style="color:' + col + '">' + (remaining !== null ? remaining : '—') + '</div>' +
        '<div class="day-strip-lbl">DAYS LEFT</div>' +
      '</div>' +
      '<div class="day-strip-divider"></div>' +
      '<div class="day-strip-item">' +
        '<div class="day-strip-val">' + recHpd + 'h</div>' +
        '<div class="day-strip-lbl">REC. TODAY</div>' +
      '</div>' +
      '<div class="day-strip-progress">' +
        '<div class="day-strip-bar"><div class="day-strip-fill" style="width:' + pct + '%;background:' + col + '"></div></div>' +
        '<div class="day-strip-pct">' + pct + '% elapsed</div>' +
      '</div>' +
      '<a href="#" class="mini-btn outline ms-auto" data-section="section-mission" style="white-space:nowrap">' +
        '<i class="bi bi-map-fill"></i> Today\'s Plan' +
      '</a>';
  }

  /* ── Wizard step HTML builders ────────────────────────── */

  function stepIndicatorHtml(active) {
    var html = '<div class="prep-steps-bar">';
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var cls = i === active ? 'prep-step-dot active' :
                i < active  ? 'prep-step-dot done'   : 'prep-step-dot';
      html += '<div class="' + cls + '">' +
        (i < active ? '<i class="bi bi-check-lg"></i>' : i) +
      '</div>';
      if (i < TOTAL_STEPS) html += '<div class="prep-step-line' + (i < active ? ' done' : '') + '"></div>';
    }
    return html + '</div>';
  }

  function renderStep(s, step) {
    var container = document.getElementById('prepWizardBody');
    if (!container) return;

    var p = s.placement || {};
    var html = stepIndicatorHtml(step);

    if (step === 1) {
      html +=
        '<div class="prep-step-content">' +
          '<h3 class="prep-step-title"><i class="bi bi-calendar-plus"></i> When do you start?</h3>' +
          '<p class="text-muted-soft">Choose your preparation start date. Defaults to today.</p>' +
          '<input type="date" id="psStartDate" class="prep-date-input" value="' + (p.startDate || today()) + '" />' +
          '<p class="prep-hint">You can pick a past date if you already started studying.</p>' +
        '</div>';
    } else if (step === 2) {
      var minEnd = p.startDate || today();
      html +=
        '<div class="prep-step-content">' +
          '<h3 class="prep-step-title"><i class="bi bi-calendar-check"></i> When is your placement target?</h3>' +
          '<p class="text-muted-soft">Pick your campus drive, exam date, or deadline.</p>' +
          '<input type="date" id="psEndDate" class="prep-date-input" value="' + (p.endDate || '') + '" min="' + minEnd + '" />' +
          '<div id="psDatePreview" class="prep-date-preview" style="margin-top:12px"></div>' +
        '</div>';
    } else if (step === 3) {
      html +=
        '<div class="prep-step-content">' +
          '<h3 class="prep-step-title"><i class="bi bi-clock-history"></i> Daily availability</h3>' +
          '<p class="text-muted-soft">How many hours per day can you realistically study?</p>' +
          '<div class="prep-slider-wrap">' +
            '<span class="prep-slider-min">3h</span>' +
            '<input type="range" id="psHoursSlider" min="3" max="10" step="0.5" value="' + (p.targetHoursPerDay || 6) + '" class="prep-slider" />' +
            '<span class="prep-slider-max">10h</span>' +
          '</div>' +
          '<div class="prep-slider-val" id="psHoursVal">' + (p.targetHoursPerDay || 6) + ' hours / day</div>' +
        '</div>';
    } else if (step === 4) {
      var priority = p.priority || 'balanced';
      var opts = [
        { val:'balanced',        icon:'bi-yin-yang',           label:'Balanced',        desc:'Equal focus on all subjects — best for most students' },
        { val:'placement_focus', icon:'bi-briefcase-fill',    label:'Placement Focus', desc:'Heavy on DSA + Aptitude + Java — optimised for coding rounds' },
        { val:'cybersec_focus',  icon:'bi-shield-lock-fill',  label:'Cybersec Focus',  desc:'Heavy on Cyber + Networking — optimised for SOC / security roles' }
      ];
      html +=
        '<div class="prep-step-content">' +
          '<h3 class="prep-step-title"><i class="bi bi-crosshair"></i> What is your primary goal?</h3>' +
          '<p class="text-muted-soft">This adjusts how topics are weighted across your timetable.</p>' +
          '<div class="prep-priority-grid">' +
            opts.map(function (o) {
              return '<label class="prep-priority-card ' + (priority === o.val ? 'selected' : '') + '">' +
                '<input type="radio" name="psPriority" value="' + o.val + '"' + (priority === o.val ? ' checked' : '') + ' style="display:none">' +
                '<i class="bi ' + o.icon + '"></i>' +
                '<strong>' + o.label + '</strong>' +
                '<span>' + o.desc + '</span>' +
              '</label>';
            }).join('') +
          '</div>' +
        '</div>';
    } else if (step === 5) {
      var weak = p.weakSubjects || [];
      var subjects = [
        { key:'java',      label:'Java',        icon:'bi-cup-hot-fill' },
        { key:'dsa',       label:'DSA',         icon:'bi-diagram-3-fill' },
        { key:'aptitude',  label:'Aptitude',    icon:'bi-calculator-fill' },
        { key:'cyber',     label:'Cybersec',    icon:'bi-shield-lock-fill' },
        { key:'networking',label:'Networking',  icon:'bi-router-fill' },
        { key:'web',       label:'Web Dev',     icon:'bi-code-slash' }
      ];
      html +=
        '<div class="prep-step-content">' +
          '<h3 class="prep-step-title"><i class="bi bi-bar-chart-steps"></i> Any weak areas to emphasise?</h3>' +
          '<p class="text-muted-soft">These subjects get ~40% more coverage in your timetable. Skip if unsure.</p>' +
          '<div class="prep-chips-grid">' +
            subjects.map(function (subj) {
              var sel = weak.includes(subj.key) ? 'selected' : '';
              return '<button class="prep-chip ' + sel + '" data-key="' + subj.key + '">' +
                '<i class="bi ' + subj.icon + '"></i> ' + subj.label +
              '</button>';
            }).join('') +
          '</div>' +
          '<p class="text-muted-soft" style="font-size:11px;margin-top:8px">Click to toggle. Selected = needs more attention.</p>' +
          '<div class="prep-preview-card" id="psFinalPreview">' + buildFinalPreview(s) + '</div>' +
        '</div>';
    }

    // Navigation buttons
    html += '<div class="prep-nav-row">' +
      (step > 1 ? '<button class="mini-btn outline" id="psPrevBtn"><i class="bi bi-arrow-left"></i> Back</button>' : '<div></div>') +
      (step < TOTAL_STEPS
        ? '<button class="mini-btn primary" id="psNextBtn">Next <i class="bi bi-arrow-right"></i></button>'
        : '<button class="mini-btn primary" id="psGenerateBtn"><i class="bi bi-lightning-charge-fill"></i> Generate My Timetable</button>') +
    '</div>';

    container.innerHTML = html;

    // Wire events for this step
    wireStepEvents(s, step);
  }

  function buildFinalPreview(s) {
    var p = s.placement || {};
    var n = daysBetween(p.startDate, p.endDate);
    var weeks = Math.ceil(n / 7);
    var hpd   = p.targetHoursPerDay || 6;
    var mode  = n < 21 ? 'Compressed (high intensity)' : n > 180 ? 'Extended (deep dive)' : 'Standard';
    if (!p.startDate || !p.endDate || n === 0) {
      return '<p class="text-muted-soft">Complete steps 1 &amp; 2 to see your preview.</p>';
    }
    return '<div class="prep-preview-grid">' +
      '<div class="prep-prev-item"><span class="prep-prev-val">' + n + '</span><span class="prep-prev-lbl">Total Days</span></div>' +
      '<div class="prep-prev-item"><span class="prep-prev-val">' + weeks + '</span><span class="prep-prev-lbl">Weeks</span></div>' +
      '<div class="prep-prev-item"><span class="prep-prev-val">' + hpd + 'h</span><span class="prep-prev-lbl">Daily Target</span></div>' +
      '<div class="prep-prev-item"><span class="prep-prev-val">' + mode + '</span><span class="prep-prev-lbl">Mode</span></div>' +
      '<div class="prep-prev-item"><span class="prep-prev-val">' + fmtDate(p.startDate) + '</span><span class="prep-prev-lbl">Start</span></div>' +
      '<div class="prep-prev-item"><span class="prep-prev-val">' + fmtDate(p.endDate) + '</span><span class="prep-prev-lbl">End</span></div>' +
    '</div>';
  }

  /* ── Event wiring per step ────────────────────────────── */

  function wireStepEvents(s, step) {
    var next = document.getElementById('psNextBtn');
    var prev = document.getElementById('psPrevBtn');
    var gen  = document.getElementById('psGenerateBtn');

    if (prev) prev.addEventListener('click', function () { goToStep(s, step - 1); });

    if (step === 1 && next) {
      next.addEventListener('click', function () {
        var v = document.getElementById('psStartDate').value;
        if (!v) { SHIBI.Utils.toast('Please pick a start date.'); return; }
        if (!s.placement) s.placement = {};
        s.placement.startDate = v;
        goToStep(s, 2);
      });
    }

    if (step === 2) {
      var endInp = document.getElementById('psEndDate');
      var preview = document.getElementById('psDatePreview');
      if (endInp && preview) {
        endInp.addEventListener('change', function () {
          var n = daysBetween(s.placement.startDate, endInp.value);
          preview.innerHTML = n > 0
            ? '<strong>' + n + ' days</strong> · ' + Math.ceil(n/7) + ' weeks · Mode: ' +
              (n < 21 ? 'Compressed' : n > 180 ? 'Extended' : 'Standard')
            : '<span style="color:var(--accent-red)">End date must be after start date</span>';
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          var v = endInp ? endInp.value : '';
          if (!v) { SHIBI.Utils.toast('Please pick an end date.'); return; }
          if (daysBetween(s.placement.startDate, v) < 7) {
            SHIBI.Utils.toast('Need at least 7 days between start and end.'); return;
          }
          s.placement.endDate   = v;
          s.placement.targetDate = v;  // keep legacy mirror
          goToStep(s, 3);
        });
      }
    }

    if (step === 3) {
      var slider = document.getElementById('psHoursSlider');
      var valEl  = document.getElementById('psHoursVal');
      if (slider && valEl) {
        slider.addEventListener('input', function () {
          valEl.textContent = slider.value + ' hours / day';
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          s.placement.targetHoursPerDay = parseFloat(slider ? slider.value : 6);
          goToStep(s, 4);
        });
      }
    }

    if (step === 4 && next) {
      next.addEventListener('click', function () {
        var sel = document.querySelector('input[name="psPriority"]:checked');
        s.placement.priority = sel ? sel.value : 'balanced';
        goToStep(s, 5);
      });
    }

    if (step === 5) {
      // Chip toggle
      document.querySelectorAll('.prep-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('selected');
          var weak = [];
          document.querySelectorAll('.prep-chip.selected').forEach(function (c) {
            weak.push(c.dataset.key);
          });
          s.placement.weakSubjects = weak;
          // Update preview
          var prev2 = document.getElementById('psFinalPreview');
          if (prev2) prev2.innerHTML = buildFinalPreview(s);
        });
      });

      if (gen) {
        gen.addEventListener('click', function () {
          var weak2 = [];
          document.querySelectorAll('.prep-chip.selected').forEach(function (c) {
            weak2.push(c.dataset.key);
          });
          s.placement.weakSubjects = weak2;
          var n = SHIBI.Timetable.generate(s);
          if (n) {
            SHIBI.Utils.toast('✅ Timetable ready — ' + n + ' days mapped! 🗓️');
            renderHomeBanner(s);
            renderDayStrip(s);
            // FIX BUG-B: navigate to section-mission so user sees the timetable immediately
            // (without this, user stays on section-prep-setup and never sees the plan)
            setTimeout(function () {
              if (window.SHIBI && SHIBI.Nav) SHIBI.Nav.show('section-mission');
            }, 400); // brief delay so toast is visible first
          }
        });
      }
    }
  }

  function goToStep(s, step) {
    currentStep = step;
    renderStep(s, step);
  }

  /* ── Section render ───────────────────────────────────── */

  function renderSection(s) {
    var section = document.getElementById('section-prep-setup');
    if (!section) return;

    var p = s.placement || {};
    var hasTimetable = !!(s.timetable && s.timetable.generatedAt);

    // If already set up, show management view
    if (hasTimetable) {
      var n    = SHIBI.Timetable.totalDays(s);
      var mode = s.timetable.mode || 'standard';
      section.innerHTML =
        '<div class="section-head"><div>' +
          '<p class="prompt-line"><span class="prompt-symbol">~/prep $</span> ./setup --manage</p>' +
          '<h1 class="page-title"><i class="bi bi-calendar2-week"></i> Prep <span class="accent">Setup</span></h1>' +
          '<p class="page-sub">Your personalised timetable is active.</p>' +
        '</div></div>' +

        '<div class="panel glass mb-3">' +
          '<div class="panel-head"><h3><i class="bi bi-check-circle-fill" style="color:var(--accent-green)"></i> Timetable Active</h3></div>' +
          '<div class="prep-manage-grid">' +
            '<div><span class="text-muted-soft">Start</span><br><strong>' + fmtDate(p.startDate) + '</strong></div>' +
            '<div><span class="text-muted-soft">End</span><br><strong>' + fmtDate(p.endDate) + '</strong></div>' +
            '<div><span class="text-muted-soft">Total</span><br><strong>' + n + ' days</strong></div>' +
            '<div><span class="text-muted-soft">Mode</span><br><strong>' + mode + '</strong></div>' +
            '<div><span class="text-muted-soft">Priority</span><br><strong>' + (p.priority || 'balanced') + '</strong></div>' +
            '<div><span class="text-muted-soft">Daily target</span><br><strong>' + (p.targetHoursPerDay || 6) + 'h</strong></div>' +
          '</div>' +
          '<button class="mini-btn outline mt-3" id="psRebuildBtn">' +
            '<i class="bi bi-arrow-repeat"></i> Rebuild Timetable (new dates)' +
          '</button>' +
        '</div>';

      var rb = document.getElementById('psRebuildBtn');
      if (rb) {
        rb.addEventListener('click', function () {
          if (confirm('Rebuild timetable? Existing completion marks on past dates are PRESERVED.')) {
            p.setupComplete = false;
            currentStep = 1;
            renderSection(s);
          }
        });
      }
      return;
    }

    // Wizard view
    section.innerHTML =
      '<div class="section-head"><div>' +
        '<p class="prompt-line"><span class="prompt-symbol">~/prep $</span> ./setup --wizard</p>' +
        '<h1 class="page-title"><i class="bi bi-calendar2-week"></i> Prep <span class="accent">Setup</span></h1>' +
        '<p class="page-sub">Set your dates and generate a personalised day-by-day study plan.</p>' +
      '</div></div>' +

      '<div class="panel glass" style="max-width:640px;margin:0 auto">' +
        '<div id="prepWizardBody"></div>' +
      '</div>';

    renderStep(s, currentStep);
  }

  /* ── Init ─────────────────────────────────────────────── */

  function init(s) {
    if (!s.placement) s.placement = {};
    renderHomeBanner(s);
    renderDayStrip(s);
    renderSection(s);

    // Auto-adjust check on load
    if (SHIBI.Timetable.shouldAutoAdjust(s)) {
      var count = SHIBI.Timetable.adjustForMissedDays(s);
      if (count) {
        var missionEl = document.getElementById('missionAdjustBanner');
        if (missionEl) {
          missionEl.style.display = 'flex';
          missionEl.innerHTML =
            '<i class="bi bi-lightning-charge-fill" style="font-size:18px"></i>' +
            '<div>Your timetable was auto-adjusted — <strong>' + count + '</strong> missed tasks redistributed across the next 7 days.</div>' +
            '<button class="mini-btn outline ms-auto" id="undoAdjustBtn">Undo</button>';
          var undoBtn = document.getElementById('undoAdjustBtn');
          if (undoBtn) {
            undoBtn.addEventListener('click', function () {
              SHIBI.Timetable.undoAdjustment(s);
              missionEl.style.display = 'none';
              if (SHIBI.Missions) SHIBI.Missions.render(s);
              SHIBI.Utils.toast('Timetable adjustment undone.');
            });
          }
        }
      }
    }
  }

  return { init, renderSection, renderHomeBanner, renderDayStrip };
})();
