/* features/focus.js — Feature 10: Focus Mode */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Focus = (function () {

  var active   = false;
  var audioCtx = null;
  var audioOn  = false;

  function createAmbientNoise() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    var ctx     = new Ctx();
    var bufSize = ctx.sampleRate * 2;
    var buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var data    = buf.getChannelData(0);
    for (var i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.06;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop   = true;
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;
    var gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    return { ctx: ctx, gain: gain };
  }

  function toggleAudio() {
    if (!audioCtx) audioCtx = createAmbientNoise();
    if (!audioCtx) return;
    audioOn = !audioOn;
    audioCtx.gain.gain.value = audioOn ? 0.3 : 0;
    var btn = document.getElementById('focusAudioBtn');
    if (btn) btn.innerHTML = audioOn ? '<i class="bi bi-volume-up-fill"></i>' : '<i class="bi bi-volume-mute-fill"></i>';
  }

  function enter(s) {
    active = true;
    document.body.classList.add('focus-mode');
    if (!s.focusSessions) s.focusSessions = 0;
    s.focusSessions++;
    SHIBI.State.save(s);
    var btn = document.getElementById('focusModeToggle');
    if (btn) { btn.innerHTML = '<i class="bi bi-fullscreen-exit"></i>'; btn.title = 'Exit Focus Mode (ESC)'; }
    var bar = document.getElementById('focusBar');
    if (bar) bar.style.display = 'flex';
    if (window.SHIBI && SHIBI.Pomodoro && SHIBI.Pomodoro.autoStart) SHIBI.Pomodoro.autoStart();
    SHIBI.Utils.toast('Focus Mode ON — ESC to exit');
  }

  function exit() {
    active = false;
    document.body.classList.remove('focus-mode');
    if (audioCtx && audioOn) { audioCtx.gain.gain.value = 0; audioOn = false; }
    var btn = document.getElementById('focusModeToggle');
    if (btn) { btn.innerHTML = '<i class="bi bi-fullscreen"></i>'; btn.title = 'Enter Focus Mode'; }
    var bar = document.getElementById('focusBar');
    if (bar) bar.style.display = 'none';
    var abtn = document.getElementById('focusAudioBtn');
    if (abtn) abtn.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
  }

  function toggle(s) { if (active) exit(); else enter(s); }

  function init(s) {
    // Focus-mode toggle button (inserted after themeToggle)
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn && !document.getElementById('focusModeToggle')) {
      var btn    = document.createElement('button');
      btn.id     = 'focusModeToggle';
      btn.className = 'icon-btn';
      btn.title  = 'Enter Focus Mode';
      btn.innerHTML = '<i class="bi bi-fullscreen"></i>';
      btn.addEventListener('click', function () { toggle(s); });
      themeBtn.parentNode.insertBefore(btn, themeBtn.nextSibling);
    }

    // Terminal icon button (inserted after focusModeToggle)
    if (!document.getElementById('terminalToggleBtn')) {
      var termBtn    = document.createElement('button');
      termBtn.id     = 'terminalToggleBtn';
      termBtn.className = 'icon-btn';
      termBtn.title  = 'Open Terminal (`)';
      termBtn.innerHTML = '<i class="bi bi-terminal-fill"></i>';
      termBtn.addEventListener('click', function () {
        if (window.SHIBI && SHIBI.Terminal) SHIBI.Terminal.toggle(s);
      });
      var fBtn = document.getElementById('focusModeToggle');
      if (fBtn) fBtn.parentNode.insertBefore(termBtn, fBtn.nextSibling);
    }

    // Focus bar (visible only in focus mode)
    if (!document.getElementById('focusBar')) {
      var bar   = document.createElement('div');
      bar.id    = 'focusBar';
      bar.className = 'focus-bar';
      bar.style.display = 'none';
      bar.innerHTML =
        '<span class="focus-bar-label"><i class="bi bi-lightning-charge-fill"></i> FOCUS MODE</span>' +
        '<button class="icon-btn" id="focusAudioBtn" title="Toggle ambient sound"><i class="bi bi-volume-mute-fill"></i></button>' +
        '<button class="mini-btn outline" id="focusExitBtn"><i class="bi bi-fullscreen-exit"></i> Exit (ESC)</button>';
      document.body.appendChild(bar);
      document.getElementById('focusAudioBtn').addEventListener('click', toggleAudio);
      document.getElementById('focusExitBtn').addEventListener('click', exit);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active) { exit(); return; }
      if (e.key === '`') {
        var el = document.activeElement;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        if (window.SHIBI && SHIBI.Terminal) SHIBI.Terminal.toggle(s);
      }
    });
  }

  return { init, enter, exit, toggle, isActive: function () { return active; } };
})();
