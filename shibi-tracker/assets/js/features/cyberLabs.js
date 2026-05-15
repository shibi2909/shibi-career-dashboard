/* features/cyberLabs.js — Feature 6: Cyber Lab Tracker */
window.SHIBI = window.SHIBI || {};
window.SHIBI.CyberLabs = (function () {

  var filters = { platform: 'all', difficulty: 'all', topic: 'all' };

  function getLabState(s, lab) {
    return (s.labsDone && s.labsDone[lab.id]) || { done: false, notes: '', completedDate: null };
  }

  function getStats(s) {
    if (!window.SHIBI_CYBER_LABS) return {};
    var stats = { total: 0, done: 0, easy: 0, medium: 0, hard: 0, xp: 0 };
    SHIBI_CYBER_LABS.forEach(function (lab) {
      stats.total++;
      var st = getLabState(s, lab);
      if (st.done) {
        stats.done++;
        stats[lab.difficulty.replace('medium','medium')]++;
        stats.xp += lab.xpReward;
      }
    });
    return stats;
  }

  function render(s) {
    var container = document.getElementById('cyberLabsList');
    if (!container || !window.SHIBI_CYBER_LABS) return;

    var labs = SHIBI_CYBER_LABS.filter(function (lab) {
      var matchPlat = filters.platform === 'all' || lab.platform === filters.platform;
      var matchDiff = filters.difficulty === 'all' || lab.difficulty === filters.difficulty;
      var matchTopic = filters.topic === 'all' || lab.topic === filters.topic;
      return matchPlat && matchDiff && matchTopic;
    });

    var stats = getStats(s);

    // stats row
    var statsEl = document.getElementById('cyberLabsStats');
    if (statsEl) {
      statsEl.innerHTML =
        '<span class="badge-soft"><i class="bi bi-check2-all"></i> ' + stats.done + '/' + stats.total + ' done</span>' +
        '<span class="badge-soft diff-tag easy">Easy: ' + (stats.easy || 0) + '</span>' +
        '<span class="badge-soft diff-tag med">Medium: ' + (stats.medium || 0) + '</span>' +
        '<span class="badge-soft" style="color:var(--accent)">XP from labs: ' + stats.xp + '</span>';
    }

    container.innerHTML = labs.map(function (lab) {
      var st   = getLabState(s, lab);
      var dTag = { easy: 'easy', medium: 'med', hard: 'hard' }[lab.difficulty] || 'easy';
      var platformLabel = lab.platform === 'tryhackme' ? 'TryHackMe' : 'HackTheBox';
      var platformColor = lab.platform === 'tryhackme' ? '#88cc14' : '#9fef00';
      return '<div class="cyber-lab-row glass ' + (st.done ? 'lab-done' : '') + '">' +
        '<div class="lab-check"><input type="checkbox" class="lab-checkbox" data-lab-id="' + lab.id + '" ' + (st.done ? 'checked' : '') + ' /></div>' +
        '<div class="lab-info">' +
          '<div class="lab-name">' + SHIBI.Utils.escapeHtml(lab.name) + '</div>' +
          '<div class="lab-meta">' +
            '<span class="diff-tag ' + dTag + '">' + lab.difficulty + '</span>' +
            '<span class="badge-soft" style="color:' + platformColor + ';font-size:10px">' + platformLabel + '</span>' +
            '<span class="badge-soft" style="font-size:10px">' + lab.topic + '</span>' +
            '<span class="badge-soft" style="font-size:10px;color:var(--accent)">+' + lab.xpReward + ' XP</span>' +
          '</div>' +
          '<textarea class="lab-notes" placeholder="Notes (auto-saved)..." data-lab-id="' + lab.id + '" rows="1" style="width:100%;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:6px 10px;border-radius:6px;font-family:var(--font-mono);font-size:11px;resize:vertical;margin-top:6px;outline:none">' + SHIBI.Utils.escapeHtml(st.notes || '') + '</textarea>' +
        '</div>' +
        '<a href="' + lab.url + '" target="_blank" rel="noopener" class="mini-btn" style="font-size:11px;flex-shrink:0">Open →</a>' +
      '</div>';
    }).join('') || '<p class="text-muted-soft text-center p-4">No labs match the current filter.</p>';

    // attach events
    container.querySelectorAll('.lab-checkbox').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = cb.dataset.labId;
        var lab = SHIBI_CYBER_LABS.find(function (l) { return l.id === id; });
        if (!s.labsDone) s.labsDone = {};
        if (!s.labsDone[id]) s.labsDone[id] = { done: false, notes: '' };
        s.labsDone[id].done = cb.checked;
        if (cb.checked) {
          s.labsDone[id].completedDate = new Date().toISOString();
          if (lab) {
            SHIBI.Gamify.addXP(s, lab.xpReward, 'Cyber lab: ' + lab.name);
            SHIBI.State.markStudy(s);
            SHIBI.State.bumpActivity(s, 'score', lab.xpReward);
            SHIBI.Utils.toast('Lab completed! +' + lab.xpReward + ' XP');
            // bump TryHackMe counter for existing tracker
            if (lab.platform === 'tryhackme') { s.thmLabs = (s.thmLabs || 0) + 1; }
          }
        }
        SHIBI.State.save(s);
        render(s);
        SHIBI.Gamify.checkBadges(s);
      });
    });

    container.querySelectorAll('.lab-notes').forEach(function (ta) {
      ta.addEventListener('input', function () {
        var id = ta.dataset.labId;
        if (!s.labsDone) s.labsDone = {};
        if (!s.labsDone[id]) s.labsDone[id] = { done: false, notes: '' };
        s.labsDone[id].notes = ta.value;
        SHIBI.State.save(s);
      });
    });
  }

  function initFilters(s) {
    var platform = document.getElementById('labFilterPlatform');
    var difficulty = document.getElementById('labFilterDifficulty');
    var topic = document.getElementById('labFilterTopic');

    if (platform) platform.addEventListener('change', function () { filters.platform = platform.value; render(s); });
    if (difficulty) difficulty.addEventListener('change', function () { filters.difficulty = difficulty.value; render(s); });
    if (topic) topic.addEventListener('change', function () { filters.topic = topic.value; render(s); });
  }

  function init(s) {
    render(s);
    initFilters(s);
  }

  return { init, render };
})();
