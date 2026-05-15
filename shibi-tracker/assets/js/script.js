/* script.js — SHIBI.OS v3 orchestrator */
document.addEventListener('DOMContentLoaded', function () {

  // Load state (v3, migrates from v2/v1 automatically)
  var s = SHIBI.State.load();
  s = SHIBI.State.dailyReset(s);

  // Expose state globally for event handlers in modules
  window._SHIBI_STATE = s;

  // Apply saved settings (theme, accent, font scale, etc.)
  SHIBI.Settings.init(s);

  // Navigation
  SHIBI.Nav.init();

  // Wire countdown pill in topbar
  var cpill = document.getElementById('countdownPill');
  if (cpill) cpill.addEventListener('click', function (e) { e.preventDefault(); SHIBI.Nav.show('section-countdown'); });

  // ─── Existing modules ───
  SHIBI.Home.render(s);
  SHIBI.Home.initActions(s);
  SHIBI.Home.initRepos(s);
  SHIBI.Home.startClock();
  SHIBI.Home.initSearch(s);

  SHIBI.Trackers.renderAll(s);
  SHIBI.Trackers.initActions(s);

  SHIBI.Planner.init(s);
  SHIBI.Pomodoro.init(s);

  SHIBI.Gamify.renderBadges(s);
  SHIBI.Gamify.updateXPPill(s);
  SHIBI.Gamify.checkBadges(s);

  SHIBI.Status.render(s);
  SHIBI.Targets.init(s);
  SHIBI.Missions.init(s);
  SHIBI.Guides.init();
  SHIBI.Quiz.init(s);

  // ─── v3 Features ───

  // Feature 1 + 8: AI Mentor + Weakness Detection
  SHIBI.Mentor.init(s);

  // Feature 2: Placement Countdown
  SHIBI.Countdown.init(s);

  // Feature 3: Skill Heatmap
  SHIBI.Heatmap.init(s);

  // Feature 4: Interview Prep
  SHIBI.Interview.init(s);

  // Feature 5: Company Tracker
  SHIBI.Companies.init(s);

  // Feature 6: Cyber Labs
  SHIBI.CyberLabs.init(s);

  // Feature 7: Daily Challenge
  SHIBI.DailyChallenge.init(s);

  // Feature 9: Resume Builder
  SHIBI.Resume.init(s);

  // Feature 10: Focus Mode + terminal keyboard shortcut
  SHIBI.Focus.init(s);

  // Feature 11: Career Roadmap
  SHIBI.Roadmap.init(s);

  // Feature 13: Notes Vault
  SHIBI.Notes.init(s);

  // Feature 14: Command Terminal
  SHIBI.Terminal.init(s);

  // Feature 15: Placement Readiness Engine
  SHIBI.Readiness.init(s);

  // Analytics charts (deferred — build when entering analytics section)
  setTimeout(function () { SHIBI.Analytics.build(s); }, 300);

  // Resources YouTube gallery
  renderYouTubeResources();

  // Hook section-entry re-renders
  var origShow = SHIBI.Nav.show;
  SHIBI.Nav.show = function (id) {
    origShow(id);
    if (id === 'section-analytics') setTimeout(function () { SHIBI.Analytics.build(s); }, 60);
    if (id === 'section-mentor')    SHIBI.Mentor.render(s);
    if (id === 'section-heatmap')   SHIBI.Heatmap.render(s);
    if (id === 'section-companies') SHIBI.Companies.renderGrid(s);
    if (id === 'section-resume')    SHIBI.Resume.render(s);
    if (id === 'section-roadmap')   SHIBI.Roadmap.render(s);
    if (id === 'section-notes')     SHIBI.Notes.render(s);
    if (id === 'section-readiness') SHIBI.Readiness.render(s);
  };
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

  var tabBar = document.getElementById('ytTabBar');
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
  renderYTCards(gallery, subjects[0].key);
}

function renderYTCards(gallery, key) {
  var channels = (window.SHIBI_YOUTUBE && SHIBI_YOUTUBE[key]) || [];
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
