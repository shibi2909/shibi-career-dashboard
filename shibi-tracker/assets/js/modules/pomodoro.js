/* modules/pomodoro.js — SVG ring timer */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Pomodoro = (function () {

  var timer = null, remaining = 25 * 60, duration = 25 * 60, running = false;
  var CIRCUMFERENCE = 565.48;
  var _s;

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
      timer = setInterval(function () {
        remaining--;
        if (remaining <= 0) {
          clearInterval(timer); timer = null; running = false;
          if (duration === 25 * 60) {
            _s.pomoToday++;
            _s.pomoTotal++;
            SHIBI.State.markStudy(_s);
            SHIBI.Gamify.addXP(_s, 20, 'Pomodoro session complete');
            SHIBI.State.save(_s);
          }
          var pc = document.getElementById('pomoCount');
          if (pc) pc.textContent = _s.pomoToday;
          if (startBtn) startBtn.innerHTML = '<i class="bi bi-play-fill"></i> Start';
          remaining = duration;
          display();
          SHIBI.Utils.toast('Session complete! Take a break. +20 XP');
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
