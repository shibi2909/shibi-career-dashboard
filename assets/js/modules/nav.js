/* modules/nav.js — sidebar navigation */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Nav = (function () {

  function show(id) {
    document.querySelectorAll('.content-section').forEach(function (s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
    var target = document.getElementById(id);
    if (target) target.classList.add('active');
    var link = document.querySelector('.nav-link[data-section="' + id + '"]');
    if (link) link.classList.add('active');
    document.getElementById('sidebar')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'section-analytics') setTimeout(function () { SHIBI.Analytics.build(window._SHIBI_STATE); }, 60);
  }

  function init() {
    // FIX BUG-01: use event delegation at document level so dynamically-injected
    // [data-section] elements (e.g. "Setup Now" from renderHomeBanner) also work.
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-section]');
      if (!el) return;
      var id = el.dataset.section;
      if (id) { e.preventDefault(); SHIBI.Nav.show(id); }
    });

    var toggle = document.getElementById('sidebarToggle');
    if (toggle) toggle.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  return { init, show };
})();
