/* modules/guides.js — topic guide modal (Phase 5) */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Guides = (function () {

  var TRACKER_KEY_MAP = {
    'java':       'java',
    'dsa':        'dsa',
    'cyber':      'cyber',
    'aptitude':   'aptitude',
    'networking': 'networking',
    'web':        'webdev'
  };

  function topicToGuideKey(trackerKey, topicLabel) {
    if (!window.SHIBI_TOPIC_GUIDES) return null;
    var subjectGuides = SHIBI_TOPIC_GUIDES[trackerKey];
    if (!subjectGuides) return null;
    // exact match
    if (subjectGuides[topicLabel]) return topicLabel;
    // partial match
    var keys = Object.keys(subjectGuides);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase().includes(topicLabel.toLowerCase()) ||
          topicLabel.toLowerCase().includes(keys[i].toLowerCase())) {
        return keys[i];
      }
    }
    return null;
  }

  function openModal(trackerKey, topicLabel) {
    var modal = document.getElementById('topicGuideModal');
    if (!modal) return;

    var guideKey = topicToGuideKey(trackerKey, topicLabel);
    var guide = guideKey && SHIBI_TOPIC_GUIDES[trackerKey] ? SHIBI_TOPIC_GUIDES[trackerKey][guideKey] : null;

    var titleEl = document.getElementById('topicModalTitle');
    if (titleEl) titleEl.textContent = topicLabel + ' — Guide';

    var tabs   = document.getElementById('topicModalTabs');
    var bodies = document.getElementById('topicModalBodies');

    if (!guide) {
      if (tabs)   tabs.innerHTML = '';
      if (bodies) bodies.innerHTML = '<div class="p-4 text-muted-soft">No guide available for this topic yet. Study notes coming soon.</div>';
    } else {
      buildModalContent(guide, trackerKey, tabs, bodies);
    }

    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  function buildModalContent(guide, trackerKey, tabs, bodies) {
    tabs.innerHTML =
      '<button class="topic-tab active" data-tab="overview">Overview</button>' +
      '<button class="topic-tab" data-tab="practice">Practice</button>' +
      '<button class="topic-tab" data-tab="interview">Interview Q</button>' +
      '<button class="topic-tab" data-tab="videos">Videos</button>';

    // overview tab
    var overviewHtml = '<div class="guide-overview"><p>' + SHIBI.Utils.escapeHtml(guide.overview) + '</p>';
    if (guide.subtopics) {
      guide.subtopics.forEach(function (sub) {
        overviewHtml += '<div class="guide-subtopic">' +
          '<h6 class="subtopic-name"><i class="bi bi-chevron-right"></i> ' + SHIBI.Utils.escapeHtml(sub.name) + '</h6>' +
          '<p class="subtopic-explanation">' + SHIBI.Utils.escapeHtml(sub.explanation) + '</p>' +
          '<div class="subtopic-tasks"><strong>Beginner Tasks:</strong><ul>' +
          sub.beginnerTasks.map(function (t) { return '<li>' + SHIBI.Utils.escapeHtml(t) + '</li>'; }).join('') +
          '</ul></div></div>';
      });
    }
    overviewHtml += '</div>';

    // practice tab
    var practiceHtml = '<div class="guide-practice">';
    if (guide.subtopics) {
      guide.subtopics.forEach(function (sub) {
        practiceHtml += '<h6>' + SHIBI.Utils.escapeHtml(sub.name) + '</h6><ul>' +
          sub.practice.map(function (p) { return '<li>' + SHIBI.Utils.escapeHtml(p) + '</li>'; }).join('') + '</ul>' +
          '<div class="mini-challenge"><strong>Mini Challenge:</strong> ' + SHIBI.Utils.escapeHtml(sub.miniChallenge) + '</div>';
      });
    }
    practiceHtml += '</div>';

    // interview tab
    var interviewHtml = '<div class="guide-interview"><ul class="interview-qs">';
    if (guide.subtopics) {
      guide.subtopics.forEach(function (sub) {
        interviewHtml += '<li class="iq-group"><span class="iq-topic">' + SHIBI.Utils.escapeHtml(sub.name) + '</span><ul>' +
          sub.interviewQs.map(function (q) { return '<li>' + SHIBI.Utils.escapeHtml(q) + '</li>'; }).join('') +
          '</ul></li>';
      });
    }
    interviewHtml += '</ul></div>';

    // videos tab
    var youtubeKey = TRACKER_KEY_MAP[trackerKey] || trackerKey;
    var channels = window.SHIBI_YOUTUBE ? (SHIBI_YOUTUBE[youtubeKey] || []) : [];
    var videosHtml = '<div class="guide-videos"><div class="youtube-channel-grid">';
    if (channels.length === 0) {
      videosHtml += '<p class="text-muted-soft">No channel recommendations for this topic yet.</p>';
    } else {
      channels.forEach(function (ch) {
        videosHtml += '<div class="youtube-channel-card">' +
          '<div class="yt-icon"><i class="bi bi-youtube"></i></div>' +
          '<div class="yt-info">' +
            '<div class="yt-name">' + SHIBI.Utils.escapeHtml(ch.channel) + '</div>' +
            '<div class="yt-note">' + SHIBI.Utils.escapeHtml(ch.note) + '</div>' +
          '</div>' +
          '<a href="' + SHIBI.Utils.escapeAttr(ch.url) + '" target="_blank" rel="noopener" class="mini-btn">Visit →</a>' +
        '</div>';
      });
    }
    videosHtml += '</div></div>';

    // render with tab switching
    var tabContent = { overview: overviewHtml, practice: practiceHtml, interview: interviewHtml, videos: videosHtml };
    bodies.innerHTML = overviewHtml;

    tabs.querySelectorAll('.topic-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.topic-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        bodies.innerHTML = tabContent[btn.dataset.tab] || '';
      });
    });
  }

  function init() {
    // nothing to init — modal is triggered from trackers
  }

  return { init, openModal };
})();
