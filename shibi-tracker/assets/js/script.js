/* script.js — SHIBI.OS v2 thin orchestrator */
document.addEventListener('DOMContentLoaded', function () {

  // Load and migrate state
  var s = SHIBI.State.load();
  s = SHIBI.State.dailyReset(s);

  // expose state globally so module event handlers can reference it
  window._SHIBI_STATE = s;

  // Apply saved settings (theme, accent, etc.)
  SHIBI.Settings.init(s);

  // Navigation
  SHIBI.Nav.init();

  // Home / Overview
  SHIBI.Home.render(s);
  SHIBI.Home.initActions(s);
  SHIBI.Home.initRepos(s);
  SHIBI.Home.startClock();
  SHIBI.Home.initSearch(s);

  // Trackers (Java, DSA, Cyber, Aptitude, Web, Networking)
  SHIBI.Trackers.renderAll(s);
  SHIBI.Trackers.initActions(s);

  // Planner
  SHIBI.Planner.init(s);

  // Pomodoro
  SHIBI.Pomodoro.init(s);

  // Gamification — badges + XP
  SHIBI.Gamify.renderBadges(s);
  SHIBI.Gamify.updateXPPill(s);
  SHIBI.Gamify.checkBadges(s);

  // Status (mentor banner in overview)
  SHIBI.Status.render(s);

  // 🎯 Targets (Phase 3)
  SHIBI.Targets.init(s);

  // 🗓 90-Day Mission (Phase 4)
  SHIBI.Missions.init(s);

  // Topic guides (Phase 5)
  SHIBI.Guides.init();

  // Quiz (Phase 7 engine, section stub renders now)
  SHIBI.Quiz.init(s);

  // Analytics charts (build on first visit, rebuild when entering analytics)
  setTimeout(function () { SHIBI.Analytics.build(s); }, 250);

  // Resources — YouTube gallery render
  renderYouTubeResources();
});

function renderYouTubeResources() {
  var gallery = document.getElementById('ytGallery');
  if (!gallery || !window.SHIBI_YOUTUBE) return;

  var subjects = [
    { key: 'java',       label: 'Java' },
    { key: 'dsa',        label: 'DSA' },
    { key: 'cyber',      label: 'Cyber' },
    { key: 'networking', label: 'Networking' },
    { key: 'aptitude',   label: 'Aptitude' },
    { key: 'webdev',     label: 'Web Dev' }
  ];

  // Build tab buttons
  var tabBar = document.getElementById('ytTabBar');
  var firstKey = subjects[0].key;

  if (tabBar) {
    tabBar.innerHTML = subjects.map(function (s, i) {
      return '<button class="yt-tab-btn ' + (i === 0 ? 'active' : '') + '" data-yt-tab="' + s.key + '">' + s.label + '</button>';
    }).join('');
    tabBar.querySelectorAll('.yt-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBar.querySelectorAll('.yt-tab-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderYTCards(gallery, btn.dataset.ytTab);
      });
    });
  }

  renderYTCards(gallery, firstKey);
}

function renderYTCards(gallery, key) {
  var channels = SHIBI_YOUTUBE[key] || [];
  gallery.innerHTML = channels.map(function (ch) {
    return '<div class="youtube-channel-card">' +
      '<div class="yt-icon"><i class="bi bi-youtube"></i></div>' +
      '<div class="yt-info">' +
        '<div class="yt-name">' + SHIBI.Utils.escapeHtml(ch.channel) + '</div>' +
        '<div class="yt-note">' + SHIBI.Utils.escapeHtml(ch.note) + '</div>' +
      '</div>' +
      '<a href="' + SHIBI.Utils.escapeAttr(ch.url) + '" target="_blank" rel="noopener" class="mini-btn">Visit →</a>' +
    '</div>';
  }).join('') || '<p class="text-muted-soft p-3">No channels listed yet.</p>';
}
