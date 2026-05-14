/* modules/utils.js — shared utilities */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Utils = (function () {

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function escapeAttr(str) { return escapeHtml(str); }

  function toast(msg) {
    var stack = document.getElementById('toastStack');
    if (!stack) return;
    var t = document.createElement('div');
    t.className = 'toast-msg';
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateX(40px)';
      setTimeout(function () { t.remove(); }, 320);
    }, 2500);
  }

  return { escapeHtml, escapeAttr, toast };
})();
