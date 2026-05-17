/* modules/guides.js — topic guide modal (v4: Phase 2 bilingual + Phase 3 six-card overview) */
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

  function currentLang() {
    return (window.SHIBI && SHIBI.I18n) ? SHIBI.I18n.lang() : 'en';
  }

  /* ── Bilingual helpers ────────────────────────────────── */

  // Wrap English + Malayalam text in a bilingual-block div
  function biBlock(en, ml, extraClass) {
    var lang = currentLang();
    var enSafe = SHIBI.Utils.escapeHtml(en || '');
    var mlSafe = SHIBI.Utils.escapeHtml(ml || en || '');
    return '<div class="bilingual-block ' + (extraClass || '') + '" data-block-lang="' + lang + '">' +
      '<span class="lang-en">' + enSafe + '</span>' +
      '<span class="lang-ml">' + mlSafe + '</span>' +
      '<button class="lang-toggle mini-btn outline" title="Toggle language">' +
        (lang === 'ml' ? '🌐 English' : '🌐 മലയാളം') +
      '</button>' +
    '</div>';
  }

  // List version of bilingual block
  function biList(enArr, mlArr, extraClass) {
    var lang = currentLang();
    var enItems = (enArr || []).map(function (x) { return '<li>' + SHIBI.Utils.escapeHtml(x) + '</li>'; }).join('');
    var mlItems = (mlArr && mlArr.length ? mlArr : enArr || []).map(function (x) { return '<li>' + SHIBI.Utils.escapeHtml(x) + '</li>'; }).join('');
    return '<div class="bilingual-block ' + (extraClass || '') + '" data-block-lang="' + lang + '">' +
      '<ul class="lang-en">' + enItems + '</ul>' +
      '<ul class="lang-ml">' + mlItems + '</ul>' +
      '<button class="lang-toggle mini-btn outline">' + (lang === 'ml' ? '🌐 English' : '🌐 മലയാളം') + '</button>' +
    '</div>';
  }

  /* ── Six-card sub-card builders ──────────────────────── */

  // Single-text card (explanation, summary)
  function sixCard(icon, title, content) {
    if (!content) return '';
    var en, ml;
    if (typeof content === 'object' && content.en !== undefined) {
      en = content.en; ml = content.ml;
    } else {
      en = content; ml = '';
    }
    if (!en) return '';
    return '<div class="six-card glass">' +
      '<div class="six-card-head">' + icon + ' <strong>' + title + '</strong></div>' +
      biBlock(en, ml) +
    '</div>';
  }

  // List card (howToStudy, commonMistakes, etc.)
  function sixCardList(icon, title, content) {
    if (!content) return '';
    var en, ml;
    if (!Array.isArray(content) && typeof content === 'object') {
      en = content.en; ml = content.ml;
    } else {
      en = Array.isArray(content) ? content : [];
      ml = [];
    }
    if (!en || !en.length) return '';
    return '<div class="six-card glass">' +
      '<div class="six-card-head">' + icon + ' <strong>' + title + '</strong></div>' +
      biList(en, ml) +
    '</div>';
  }

  /* ── Overview tab with 6 sub-cards per subtopic ──────── */

  function buildOverviewTab(guide) {
    var html = '<div class="guide-overview">';

    // Topic-level overview — bilingual if new format
    if (guide.overview) {
      if (typeof guide.overview === 'object') {
        html += biBlock(guide.overview.en, guide.overview.ml, 'guide-overview-intro');
      } else {
        html += '<p class="guide-overview-intro">' + SHIBI.Utils.escapeHtml(guide.overview) + '</p>';
        if (guide.overviewMl) {
          // Wrap both into a bilingual block
          html = '<div class="guide-overview">' + biBlock(guide.overview, guide.overviewMl, 'guide-overview-intro');
        }
      }
    }

    if (!guide.subtopics) { html += '</div>'; return html; }

    guide.subtopics.forEach(function (sub) {
      html += '<div class="guide-subtopic-v4">' +
        '<h6 class="subtopic-name"><i class="bi bi-chevron-right"></i> ' + SHIBI.Utils.escapeHtml(sub.name) + '</h6>';

      // Check if new 6-card format is present
      var hasNewFormat = sub.beginnerSummary || sub.howToStudy || sub.commonMistakes;
      if (hasNewFormat) {
        // Phase 3: 6-card grid
        var expEn = sub.explanation;
        var expMl = sub.explanationMl || '';
        if (typeof expEn === 'object') { expMl = expEn.ml || ''; expEn = expEn.en || ''; }

        html += '<div class="subtopic-six-grid">' +
          sixCard('💡', 'Simple Explanation', { en: expEn, ml: expMl }) +
          sixCard('📖', 'Beginner Summary', sub.beginnerSummary) +
          sixCardList('📝', 'How to Study', sub.howToStudy) +
          sixCardList('🎯', 'Interview Concepts', sub.interviewConcepts) +
          sixCardList('⚠️', 'Common Mistakes', sub.commonMistakes) +
          sixCardList('💪', 'Practice Tips', sub.practiceTips) +
        '</div>';
      } else {
        // Legacy: plain text explanation + beginner tasks
        html += '<p class="subtopic-explanation">' + SHIBI.Utils.escapeHtml(sub.explanation || '') + '</p>';
        if (sub.beginnerTasks) {
          html += '<div class="subtopic-tasks"><strong>Beginner Tasks:</strong><ul>' +
            sub.beginnerTasks.map(function (t) { return '<li>' + SHIBI.Utils.escapeHtml(t) + '</li>'; }).join('') +
            '</ul></div>';
        }
      }

      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  /* ── Practice tab ────────────────────────────────────── */

  function buildPracticeTab(guide) {
    var html = '<div class="guide-practice">';
    if (guide.subtopics) {
      guide.subtopics.forEach(function (sub) {
        html += '<h6>' + SHIBI.Utils.escapeHtml(sub.name) + '</h6><ul>' +
          (sub.practice || []).map(function (p) { return '<li>' + SHIBI.Utils.escapeHtml(p) + '</li>'; }).join('') +
          '</ul>';
        if (sub.miniChallenge) {
          html += '<div class="mini-challenge"><strong>Mini Challenge:</strong> ' + SHIBI.Utils.escapeHtml(sub.miniChallenge) + '</div>';
        }
      });
    }
    return html + '</div>';
  }

  /* ── Interview tab ───────────────────────────────────── */

  function buildInterviewTab(guide) {
    var html = '<div class="guide-interview"><ul class="interview-qs">';
    if (guide.subtopics) {
      guide.subtopics.forEach(function (sub) {
        html += '<li class="iq-group"><span class="iq-topic">' + SHIBI.Utils.escapeHtml(sub.name) + '</span><ul>';
        // Use new bilingual format if available
        if (sub.interviewConcepts && sub.interviewConcepts.en) {
          html += sub.interviewConcepts.en.map(function (q) { return '<li>' + SHIBI.Utils.escapeHtml(q) + '</li>'; }).join('');
        } else if (sub.interviewQs) {
          html += sub.interviewQs.map(function (q) { return '<li>' + SHIBI.Utils.escapeHtml(q) + '</li>'; }).join('');
        }
        html += '</ul></li>';
      });
    }
    return html + '</ul></div>';
  }

  /* ── Videos tab ──────────────────────────────────────── */

  function buildVideosTab(trackerKey) {
    var youtubeKey = TRACKER_KEY_MAP[trackerKey] || trackerKey;
    var channels = window.SHIBI_YOUTUBE ? (SHIBI_YOUTUBE[youtubeKey] || []) : [];
    var html = '<div class="guide-videos"><div class="youtube-channel-grid">';
    if (!channels.length) {
      html += '<p class="text-muted-soft">No channel recommendations for this topic yet.</p>';
    } else {
      channels.forEach(function (ch) {
        html += '<div class="youtube-channel-card">' +
          '<div class="yt-icon"><i class="bi bi-youtube"></i></div>' +
          '<div class="yt-info">' +
            '<div class="yt-name">' + SHIBI.Utils.escapeHtml(ch.channel) + '</div>' +
            '<div class="yt-note">' + SHIBI.Utils.escapeHtml(ch.note) + '</div>' +
          '</div>' +
          '<a href="' + SHIBI.Utils.escapeAttr(ch.url) + '" target="_blank" rel="noopener" class="mini-btn">Visit →</a>' +
        '</div>';
      });
    }
    return html + '</div></div>';
  }

  /* ── Main modal builder ──────────────────────────────── */

  function buildModalContent(guide, trackerKey, tabs, bodies) {
    tabs.innerHTML =
      '<button class="topic-tab active" data-tab="overview">Overview</button>' +
      '<button class="topic-tab" data-tab="practice">Practice</button>' +
      '<button class="topic-tab" data-tab="interview">Interview Q</button>' +
      '<button class="topic-tab" data-tab="videos">Videos</button>';

    var overviewHtml  = buildOverviewTab(guide);
    var practiceHtml  = buildPracticeTab(guide);
    var interviewHtml = buildInterviewTab(guide);
    var videosHtml    = buildVideosTab(trackerKey);

    var tabContent = {
      overview:  overviewHtml,
      practice:  practiceHtml,
      interview: interviewHtml,
      videos:    videosHtml
    };
    bodies.innerHTML = overviewHtml;

    tabs.querySelectorAll('.topic-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabs.querySelectorAll('.topic-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        bodies.innerHTML = tabContent[btn.dataset.tab] || '';
      });
    });
  }

  /* ── Public openModal ────────────────────────────────── */

  function topicToGuideKey(trackerKey, topicLabel) {
    if (!window.SHIBI_TOPIC_GUIDES) return null;
    var subjectGuides = SHIBI_TOPIC_GUIDES[trackerKey];
    if (!subjectGuides) return null;
    if (subjectGuides[topicLabel]) return topicLabel;
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
    var guide    = guideKey && SHIBI_TOPIC_GUIDES[trackerKey] ? SHIBI_TOPIC_GUIDES[trackerKey][guideKey] : null;
    var titleEl  = document.getElementById('topicModalTitle');
    if (titleEl) titleEl.textContent = topicLabel + ' — Guide';
    var tabs   = document.getElementById('topicModalTabs');
    var bodies = document.getElementById('topicModalBodies');
    if (!guide) {
      if (tabs)   tabs.innerHTML = '';
      if (bodies) bodies.innerHTML = '<div class="p-4 text-muted-soft">No guide available for this topic yet.</div>';
    } else {
      buildModalContent(guide, trackerKey, tabs, bodies);
    }
    var bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  function init() {}

  return { init, openModal };
})();
