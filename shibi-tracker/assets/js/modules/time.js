/* modules/time.js — 12-hour AM/PM time helpers */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Time = (function () {

  function fmtTime12(date) {
    var h = date.getHours(), m = date.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  function fmtTimeWithSec12(date) {
    var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' ' + ampm;
  }

  function fmtDateLong(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function weekStartStr() {
    var d = new Date();
    var day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d.toISOString().slice(0, 10);
  }

  function dayOfWeekIdx() {
    return (new Date().getDay() + 6) % 7;
  }

  return { fmtTime12, fmtTimeWithSec12, fmtDateLong, todayStr, weekStartStr, dayOfWeekIdx };
})();
