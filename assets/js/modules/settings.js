/* modules/settings.js — full theme and customization handler */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Settings = (function () {

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function apply(s) {
    var cfg = s.settings;

    /* ── Accent colour ── */
    document.documentElement.style.setProperty('--accent', cfg.accent);
    var rgb = hexToRgb(cfg.accent);
    if (rgb) {
      document.documentElement.style.setProperty(
        '--accent-glow', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.45)'
      );
    }

    /* ── Light mode ── */
    document.body.classList.toggle('light-mode', !!cfg.light);

    /* ── Matrix & particles ── */
    var matrix    = document.getElementById('matrix-bg');
    var particles = document.getElementById('particles');
    if (matrix)    matrix.style.opacity = cfg.reducedMotion ? '0' : String(cfg.bgDim || 0.18);
    if (matrix)    matrix.style.display = (cfg.matrix && !cfg.reducedMotion) ? 'block' : 'none';
    if (particles) particles.style.display = (cfg.particles && !cfg.reducedMotion) ? 'block' : 'none';

    /* ── Card style ── */
    document.body.classList.remove('card-solid', 'card-neon');
    if (cfg.cardStyle === 'solid')  document.body.classList.add('card-solid');
    if (cfg.cardStyle === 'neon')   document.body.classList.add('card-neon');

    /* ── Font scale ── */
    document.body.classList.remove('font-sm', 'font-lg');
    if (cfg.fontScale === 'sm') document.body.classList.add('font-sm');
    if (cfg.fontScale === 'lg') document.body.classList.add('font-lg');

    /* ── Reduced motion ── */
    document.body.classList.toggle('reduced-motion', !!cfg.reducedMotion);

    /* ── Compact mode ── */
    document.body.classList.toggle('compact-mode', !!cfg.compactMode);

    /* ── Sync UI controls ── */
    _syncControls(cfg);
  }

  function _syncControls(cfg) {
    var tm = document.getElementById('toggleMatrix');
    var tp = document.getElementById('toggleParticles');
    var tl = document.getElementById('toggleLight');
    var tr = document.getElementById('toggleReducedMotion');
    var tc = document.getElementById('toggleCompact');
    var bd = document.getElementById('bgDimSlider');
    var bdv = document.getElementById('bgDimValue');

    if (tm) tm.checked = !!cfg.matrix;
    if (tp) tp.checked = !!cfg.particles;
    if (tl) tl.checked = !!cfg.light;
    if (tr) tr.checked = !!cfg.reducedMotion;
    if (tc) tc.checked = !!cfg.compactMode;
    if (bd) { bd.value = cfg.bgDim !== undefined ? cfg.bgDim : 0.18; }
    if (bdv) bdv.textContent = Math.round((cfg.bgDim || 0.18) * 100) + '%';

    /* accent swatches */
    document.querySelectorAll('.swatch').forEach(function (sw) {
      sw.classList.toggle('active', sw.dataset.accent === cfg.accent);
    });

    /* card style buttons */
    document.querySelectorAll('.card-style-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.cardStyle === (cfg.cardStyle || 'glass'));
    });

    /* font scale buttons */
    document.querySelectorAll('.font-scale-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.fontScale === (cfg.fontScale || 'default'));
    });
  }

  function init(s) {
    apply(s);

    /* accent swatches */
    document.querySelectorAll('.swatch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        s.settings.accent = sw.dataset.accent;
        SHIBI.State.save(s); apply(s);
      });
    });

    /* background effect toggles */
    var tm = document.getElementById('toggleMatrix');
    var tp = document.getElementById('toggleParticles');
    var tl = document.getElementById('toggleLight');
    var tt = document.getElementById('themeToggle');
    var rb = document.getElementById('resetAllBtn');

    if (tm) tm.addEventListener('change', function (e) {
      s.settings.matrix = e.target.checked; SHIBI.State.save(s); apply(s);
    });
    if (tp) tp.addEventListener('change', function (e) {
      s.settings.particles = e.target.checked; SHIBI.State.save(s); apply(s);
    });
    if (tl) tl.addEventListener('change', function (e) {
      s.settings.light = e.target.checked; SHIBI.State.save(s); apply(s);
    });
    if (tt) tt.addEventListener('click', function () {
      s.settings.light = !s.settings.light; SHIBI.State.save(s); apply(s);
    });

    /* reduced motion */
    var tr = document.getElementById('toggleReducedMotion');
    if (tr) tr.addEventListener('change', function (e) {
      s.settings.reducedMotion = e.target.checked; SHIBI.State.save(s); apply(s);
    });

    /* compact mode */
    var tc = document.getElementById('toggleCompact');
    if (tc) tc.addEventListener('change', function (e) {
      s.settings.compactMode = e.target.checked; SHIBI.State.save(s); apply(s);
    });

    /* bg dim slider */
    var bd  = document.getElementById('bgDimSlider');
    var bdv = document.getElementById('bgDimValue');
    if (bd) bd.addEventListener('input', function () {
      var val = parseFloat(bd.value);
      s.settings.bgDim = val;
      if (bdv) bdv.textContent = Math.round(val * 100) + '%';
      var matrix = document.getElementById('matrix-bg');
      if (matrix && !s.settings.reducedMotion) matrix.style.opacity = String(val);
      SHIBI.State.save(s);
    });

    /* card style buttons */
    document.querySelectorAll('.card-style-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        s.settings.cardStyle = btn.dataset.cardStyle;
        SHIBI.State.save(s); apply(s);
      });
    });

    /* font scale buttons */
    document.querySelectorAll('.font-scale-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        s.settings.fontScale = btn.dataset.fontScale;
        SHIBI.State.save(s); apply(s);
      });
    });

    /* reset all */
    if (rb) rb.addEventListener('click', function () {
      if (confirm('Erase ALL local data? This cannot be undone.')) SHIBI.State.reset();
    });
  }

  return { init, apply };
})();
