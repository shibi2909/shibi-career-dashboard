/* modules/pomodoro.js — SVG ring timer */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Pomodoro = (function () {

  var timer = null, remaining = 25 * 60, duration = 25 * 60, running = false;
  var CIRCUMFERENCE = 565.48;
  var _s;
  // FIX BUG-F: AudioContext pre-warmed during user gesture (Start click) so it is
  // already in "running" state when the timer fires (which is NOT a user gesture).
  var _audioCtx = null;

  // FIX BUG-13: request notification permission once on first start
  function requestNotifPermission() {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(function () {});
    }
  }

  // FIX BUG-A/F: playCompletionSound reuses the pre-warmed _audioCtx (created during
  // the Start button click = user gesture). Creating a new AudioContext here (inside
  // a setInterval callback) would leave it suspended → silent.
  function playCompletionSound() {
    try {
      var ctx = _audioCtx;
      if (!ctx || ctx.state === 'closed') return;
      if (ctx.state === 'suspended') { ctx.resume(); return; } // still suspended, skip
      // 3 ascending beeps: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      [[523, 0], [659, 0.2], [784, 0.4]].forEach(function (pair) {
        var freq = pair[0], startOffset = pair[1];
        var osc  = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        var t = ctx.currentTime + startOffset;
        var dur = startOffset === 0.4 ? 0.3 : 0.15; // last beep slightly longer
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t); osc.stop(t + dur + 0.01);
      });
    } catch (e) { /* fail silently */ }
  }

  // FIX BUG-06: visual completion popup
  function showCompletionPopup(pomoToday) {
    var existing = document.getElementById('pomoCompletionPopup');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'pomoCompletionPopup';
    overlay.className = 'pomo-popup-overlay';
    overlay.innerHTML =
      '<div class="pomo-popup-card glass">' +
        '<div class="pomo-popup-icon">🍅</div>' +
        '<h3 class="pomo-popup-title">Session Complete!</h3>' +
        '<p class="pomo-popup-xp">+20 XP earned</p>' +
        '<p class="pomo-popup-count">Sessions today: <strong>' + pomoToday + '</strong></p>' +
        '<button class="mini-btn primary" id="pomoPopupContinue">Continue</button>' +
      '</div>';
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(function () { overlay.classList.add('visible'); });

    function dismiss() { overlay.classList.remove('visible'); setTimeout(function () { overlay.remove(); }, 350); }
    document.getElementById('pomoPopupContinue').addEventListener('click', dismiss);
    setTimeout(dismiss, 6000);

    // FIX BUG-13: browser notification
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('SHIBI.OS — Focus Complete', {
          body: '25-minute session done. +20 XP earned!',
          icon: '🍅'
        });
      }
    } catch (e) {}

    // FIX BUG-11: flash XP pill with glow
    var pill = document.getElementById('xpPill');
    if (pill) {
      pill.classList.add('xp-glow');
      setTimeout(function () { pill.classList.remove('xp-glow'); }, 1200);
    }
  }

  function display() {
    var m = String(Math.floor(remaining / 60)).padStart(2, '0');
    var sec = String(remaining % 60).padStart(2, '0');
    var pt = document.getElementById('pomoTime');
    var pr = document.getElementById('pomoRing');
    if (pt) pt.textContent = m + ':' + sec;
    if (pr) {
      var progress = remaining / duration;
      pr.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
    }
  }

  function setMode(min) {
    duration = min * 60;
    remaining = duration;
    if (timer) { clearInterval(timer); timer = null; running = false; }
    var sb = document.getElementById('pomoStart');
    if (sb) sb.innerHTML = '<i class="bi bi-play-fill"></i> Start';
    display();
  }

  function init(s) {
    _s = s;

    document.querySelectorAll('.pomo-mode-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pomo-mode-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setMode(parseInt(btn.dataset.min));
      });
    });

    var startBtn = document.getElementById('pomoStart');
    if (startBtn) startBtn.addEventListener('click', function () {
      if (running) {
        clearInterval(timer); timer = null; running = false;
        startBtn.innerHTML = '<i class="bi bi-play-fill"></i> Resume';
        return;
      }
      running = true;
      startBtn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
      // FIX BUG-F: warm up AudioContext during this click handler (= user gesture)
      // so it is already "running" when the timer fires later.
      try {
        if (!_audioCtx) {
          _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (_audioCtx.state === 'suspended') {
          _audioCtx.resume().catch(function () {});
        }
      } catch (e) { _audioCtx = null; }
      // FIX BUG-13: request notification permission on first start
      requestNotifPermission();
      timer = setInterval(function () {
        remaining--;
        if (remaining <= 0) {
          clearInterval(timer); timer = null; running = false;
          if (duration === 25 * 60) {
            _s.pomoToday++;
            _s.pomoTotal++;
            // FIX BUG-03: add hours so home dashboard "Hours Today" updates
            var hoursThisSession = 25 / 60;
            _s.hoursToday = +(_s.hoursToday + hoursThisSession).toFixed(4);
            var idx = SHIBI.Time.dayOfWeekIdx();
            _s.weeklyHours[idx] = +(_s.weeklyHours[idx] + hoursThisSession).toFixed(4);
            SHIBI.State.markStudy(_s);
            SHIBI.Gamify.addXP(_s, 20, 'Pomodoro session complete');
            SHIBI.State.save(_s);
            // FIX BUG-03: refresh home KPIs immediately
            if (window.SHIBI && SHIBI.Home) SHIBI.Home.render(_s);
          }
          var pc = document.getElementById('pomoCount');
          if (pc) pc.textContent = _s.pomoToday;
          if (startBtn) startBtn.innerHTML = '<i class="bi bi-play-fill"></i> Start';
          remaining = duration;
          display();
          // FIX BUG-06: sound + popup (replaces simple toast for focus sessions only)
          if (duration === 25 * 60) {
            playCompletionSound();
            showCompletionPopup(_s.pomoToday);
          } else {
            SHIBI.Utils.toast('Break over! Time to focus. 🎯');
          }
          SHIBI.Gamify.checkBadges(_s);
        } else {
          display();
        }
      }, 1000);
    });

    var resetBtn = document.getElementById('pomoReset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (timer) clearInterval(timer);
      timer = null; running = false; remaining = duration;
      if (startBtn) startBtn.innerHTML = '<i class="bi bi-play-fill"></i> Start';
      display();
    });

    var pc = document.getElementById('pomoCount');
    if (pc) pc.textContent = s.pomoToday;
    display();
  }

  return { init };
})();
