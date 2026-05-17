/* features/i18n.js — v4 Bilingual Infrastructure (Phase 4 stub)
   Full Malayalam content is Phase 2. This file sets up:
   - SHIBI.I18n.lang, setLang, toggle, applyAll, init
   - Global body[data-content-lang] attribute
   - Per-block toggle handler
   Phase 2 will populate data-ml attributes throughout.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.I18n = (function () {

  var _lang = 'en';

  function lang() { return _lang; }

  function setLang(code, s) {
    _lang = code === 'ml' ? 'ml' : 'en';
    document.body.setAttribute('data-content-lang', _lang);
    // Persist
    if (s && s.settings) {
      s.settings.contentLang = _lang;
      SHIBI.State.save(s);
    }
    applyAll();
    updatePill();
  }

  function toggle(s) {
    setLang(_lang === 'en' ? 'ml' : 'en', s);
    var msg = _lang === 'ml'
      ? 'Malayalam content mode ON — toggle bilingual blocks individually'
      : 'English content mode ON';
    SHIBI.Utils.toast(msg);
  }

  /* Walk DOM and apply current lang to all bilingual-blocks */
  function applyAll() {
    document.querySelectorAll('.bilingual-block').forEach(function (el) {
      if (el.dataset.langOverride) return; // per-block override is sticky
      el.setAttribute('data-block-lang', _lang);
    });
  }

  /* Wire the per-block 🌐 toggle buttons */
  function bindBlockToggles() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-toggle');
      if (!btn) return;
      var block = btn.closest('.bilingual-block');
      if (!block) return;
      var cur = block.getAttribute('data-block-lang') || _lang;
      var next = cur === 'en' ? 'ml' : 'en';
      block.setAttribute('data-block-lang', next);
      block.setAttribute('data-lang-override', 'true');
      btn.textContent = next === 'ml' ? '🌐 English' : '🌐 മലയാളം';
    });
  }

  function updatePill() {
    var pill = document.getElementById('langTogglePill');
    if (!pill) return;
    pill.innerHTML = _lang === 'en'
      ? '<span class="lang-pill-en active">EN</span> | <span class="lang-pill-ml">മല</span>'
      : '<span class="lang-pill-en">EN</span> | <span class="lang-pill-ml active">മല</span>';
  }

  /* Build a standard bilingual-block HTML wrapper */
  function block(enHtml, mlHtml, extraClass) {
    return '<div class="bilingual-block ' + (extraClass || '') + '" data-block-lang="' + _lang + '">' +
      '<span class="lang-en">' + enHtml + '</span>' +
      '<span class="lang-ml">' + (mlHtml || enHtml) + '</span>' +
      '<button class="lang-toggle mini-btn outline" style="font-size:11px;padding:2px 6px;margin-left:6px">' +
        (_lang === 'en' ? '🌐 മലയാളം' : '🌐 English') +
      '</button>' +
    '</div>';
  }

  function init(s) {
    _lang = (s && s.settings && s.settings.contentLang) || 'en';
    document.body.setAttribute('data-content-lang', _lang);
    updatePill();
    applyAll();
    bindBlockToggles();
  }

  return { lang, setLang, toggle, applyAll, updatePill, block, init };
})();
