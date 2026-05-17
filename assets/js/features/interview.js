/* features/interview.js — Feature 4: Interview Prep Mode */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Interview = (function () {

  var _s;
  var activeTab = 'hr';
  var activeTechSubject = 'java';

  function renderHRTab(s) {
    if (!window.SHIBI_INTERVIEW) return '<p class="text-muted-soft">Loading...</p>';
    var questions = SHIBI_INTERVIEW.hr;
    var practicedCount = 0;
    return '<div class="interview-question-list">' +
      questions.map(function (q) {
        var practiced = !!(s.interviewPracticed && s.interviewPracticed[q.id]);
        if (practiced) practicedCount++;
        return '<div class="interview-q-card glass ' + (practiced ? 'practiced' : '') + '" data-id="' + q.id + '">' +
          '<div class="iq-header">' +
            '<span class="iq-num">' + q.id.toUpperCase() + '</span>' +
            '<span class="iq-text">' + SHIBI.Utils.escapeHtml(q.q) + '</span>' +
            '<div class="iq-actions">' +
              '<button class="mini-btn iq-toggle-btn" data-id="' + q.id + '" style="font-size:11px">Show Answer</button>' +
              '<button class="mini-btn ' + (practiced ? 'primary' : 'outline') + ' iq-practice-btn" data-id="' + q.id + '" style="font-size:11px">' + (practiced ? '✓ Practiced' : 'Mark Practiced') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="iq-answer" style="display:none">' +
            '<p class="iq-answer-text">' + SHIBI.Utils.escapeHtml(q.answer) + '</p>' +
            '<div class="iq-key-points"><strong>Key Points:</strong><ul>' +
              q.keyPoints.map(function (kp) { return '<li>' + SHIBI.Utils.escapeHtml(kp) + '</li>'; }).join('') +
            '</ul></div>' +
            (q.tip ? '<div class="iq-tip"><i class="bi bi-lightbulb-fill"></i> ' + SHIBI.Utils.escapeHtml(q.tip) + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function renderTechTab(s, subject) {
    if (!window.SHIBI_INTERVIEW || !SHIBI_INTERVIEW.technical[subject]) return '<p class="text-muted-soft">No questions for this subject yet.</p>';
    var questions = SHIBI_INTERVIEW.technical[subject];
    return '<div class="interview-tech-subjects">' +
        Object.keys(SHIBI_INTERVIEW.technical).map(function (sub) {
          return '<button class="mini-btn ' + (sub === subject ? 'primary' : '') + ' tech-subj-btn" data-subj="' + sub + '">' + sub.toUpperCase() + '</button>';
        }).join('') +
      '</div>' +
      '<div class="interview-question-list mt-3">' +
      questions.map(function (q) {
        var practiced = !!(s.interviewPracticed && s.interviewPracticed[q.id]);
        return '<div class="interview-q-card glass ' + (practiced ? 'practiced' : '') + '">' +
          '<div class="iq-header">' +
            '<span class="iq-text"><strong>' + SHIBI.Utils.escapeHtml(q.q) + '</strong></span>' +
            '<div class="iq-actions">' +
              '<button class="mini-btn iq-toggle-btn" data-id="' + q.id + '" style="font-size:11px">Answer</button>' +
              '<button class="mini-btn ' + (practiced ? 'primary' : 'outline') + ' iq-practice-btn" data-id="' + q.id + '" style="font-size:11px">' + (practiced ? '✓ Done' : 'Mark Done') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="iq-answer" style="display:none">' +
            '<p class="iq-answer-text">' + SHIBI.Utils.escapeHtml(q.answer) + '</p>' +
            '<div class="iq-key-points"><strong>Key Points:</strong><ul>' +
              q.keyPoints.map(function (kp) { return '<li>' + SHIBI.Utils.escapeHtml(kp) + '</li>'; }).join('') +
            '</ul></div>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';
  }

  function renderSelfIntroTab() {
    if (!window.SHIBI_INTERVIEW) return '';
    return '<div class="interview-question-list">' +
      SHIBI_INTERVIEW.selfIntro.map(function (si) {
        return '<div class="interview-q-card glass">' +
          '<div class="iq-header"><span class="iq-text"><strong>' + SHIBI.Utils.escapeHtml(si.scenario) + '</strong></span>' +
            '<button class="mini-btn iq-toggle-btn" data-id="' + si.id + '" style="font-size:11px">View Template</button>' +
          '</div>' +
          '<div class="iq-answer" style="display:none">' +
            '<p class="iq-answer-text" style="white-space:pre-line">' + SHIBI.Utils.escapeHtml(si.template) + '</p>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';
  }

  function renderMockTracker(s) {
    var mocks = s.mockInterviews || [];
    return '<div class="panel glass mb-3">' +
        '<div class="panel-head"><h3>Log a Mock Interview</h3></div>' +
        '<div class="task-form">' +
          '<select id="mockType" style="background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:10px;border-radius:8px;font-family:var(--font-mono)">' +
            '<option value="hr">HR Interview</option>' +
            '<option value="technical">Technical Interview</option>' +
            '<option value="full">Full Round (HR + Tech)</option>' +
          '</select>' +
          '<input type="number" id="mockScore" min="1" max="10" placeholder="Score /10" style="width:100px;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:10px;border-radius:8px;font-family:var(--font-mono)" />' +
          '<input type="text" id="mockFeedback" placeholder="Key feedback / what to improve" style="flex:1;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:10px;border-radius:8px;font-family:var(--font-mono)" />' +
          '<button class="mini-btn primary" id="addMockBtn">+ Log</button>' +
        '</div>' +
      '</div>' +
      '<div class="panel glass">' +
        '<div class="panel-head"><h3>Mock Interview History</h3><span class="badge-soft">' + mocks.length + ' attempts</span></div>' +
        (mocks.length === 0 ? '<p class="empty-hint">No mock interviews logged yet.</p>' :
        '<div class="table-responsive"><table class="quiz-history-table"><thead><tr><th>Date</th><th>Type</th><th>Score</th><th>Feedback</th></tr></thead><tbody>' +
        mocks.slice().reverse().map(function (m) {
          var scoreColor = m.score >= 8 ? 'var(--accent-green)' : m.score >= 6 ? 'var(--accent-yellow)' : 'var(--accent-red)';
          return '<tr><td>' + new Date(m.date).toLocaleDateString() + '</td><td>' + m.type + '</td><td style="color:' + scoreColor + ';font-weight:700">' + m.score + '/10</td><td>' + SHIBI.Utils.escapeHtml(m.feedback || '—') + '</td></tr>';
        }).join('') +
        '</tbody></table></div>') +
      '</div>';
  }

  /* daily HR question for home dashboard */
  function getDailyHRQuestion() {
    if (!window.SHIBI_INTERVIEW) return null;
    var d = new Date();
    var idx = ((d.getDate() * 7 + d.getMonth()) % SHIBI_INTERVIEW.hr.length);
    return SHIBI_INTERVIEW.hr[idx];
  }

  function renderHomeDailyHR(s) {
    var el = document.getElementById('dailyHRCard');
    if (!el) return;
    var q = getDailyHRQuestion();
    if (!q) return;
    var practiced = !!(s.interviewPracticed && s.interviewPracticed[q.id]);
    el.innerHTML =
      '<div class="panel-head" style="margin-bottom:8px"><h3 style="font-size:13px"><i class="bi bi-mic-fill"></i> Today\'s HR Question</h3></div>' +
      '<p style="font-family:var(--font-mono);font-size:13px;color:var(--text);margin:0 0 10px">' + SHIBI.Utils.escapeHtml(q.q) + '</p>' +
      '<button class="mini-btn ' + (practiced ? 'primary' : '') + ' w-100 iq-home-btn" data-id="' + q.id + '">' +
        (practiced ? '✓ Practiced Today' : 'Open Interview Prep →') +
      '</button>';
    el.querySelector('.iq-home-btn').addEventListener('click', function () {
      SHIBI.Nav.show('section-interview');
    });
  }

  function render(s) {
    _s = s;
    var container = document.getElementById('interviewContent');
    if (!container) return;

    var tabHtml = {
      hr:          renderHRTab(s),
      technical:   renderTechTab(s, activeTechSubject),
      selfintro:   renderSelfIntroTab(),
      mock:        renderMockTracker(s)
    };

    // count stats
    var totalPracticed = Object.keys(s.interviewPracticed || {}).length;
    var totalQs = window.SHIBI_INTERVIEW ? (SHIBI_INTERVIEW.hr.length + Object.values(SHIBI_INTERVIEW.technical).reduce(function (a, arr) { return a + arr.length; }, 0)) : 0;

    container.innerHTML =
      '<div class="interview-stats-row">' +
        '<span class="badge-soft"><i class="bi bi-check2-all"></i> ' + totalPracticed + ' / ' + totalQs + ' practiced</span>' +
        (s.mockInterviews && s.mockInterviews.length > 0 ? '<span class="badge-soft"><i class="bi bi-camera-video"></i> ' + s.mockInterviews.length + ' mocks logged</span>' : '') +
      '</div>' +
      '<div class="interview-tabs">' +
        ['hr', 'technical', 'selfintro', 'mock'].map(function (tab) {
          var labels = { hr: 'HR', technical: 'Technical', selfintro: 'Self-Intro', mock: 'Mock Tracker' };
          return '<button class="mini-btn interview-tab-btn ' + (tab === activeTab ? 'primary' : '') + '" data-tab="' + tab + '">' + labels[tab] + '</button>';
        }).join('') +
      '</div>' +
      '<div id="interviewTabBody" class="mt-3">' + (tabHtml[activeTab] || '') + '</div>';

    attachListeners(container, s);
  }

  function attachListeners(container, s) {
    // tab switching
    container.querySelectorAll('.interview-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTab = btn.dataset.tab;
        render(s);
      });
    });

    // tech subject switching
    container.querySelectorAll('.tech-subj-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTechSubject = btn.dataset.subj;
        render(s);
      });
    });

    // toggle answer
    container.querySelectorAll('.iq-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.interview-q-card');
        var ansDiv = card ? card.querySelector('.iq-answer') : null;
        if (ansDiv) {
          var isHidden = ansDiv.style.display === 'none';
          ansDiv.style.display = isHidden ? 'block' : 'none';
          btn.textContent = isHidden ? 'Hide Answer' : 'Show Answer';
        }
      });
    });

    // mark practiced
    container.querySelectorAll('.iq-practice-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        if (!s.interviewPracticed) s.interviewPracticed = {};
        if (s.interviewPracticed[id]) {
          delete s.interviewPracticed[id];
        } else {
          s.interviewPracticed[id] = true;
          SHIBI.Gamify.addXP(s, 5, 'Interview Q practiced');
          SHIBI.Utils.toast('+5 XP — Interview question practiced');
        }
        SHIBI.State.save(s);
        render(s);
      });
    });

    // add mock interview
    var addMockBtn = container.querySelector('#addMockBtn');
    if (addMockBtn) addMockBtn.addEventListener('click', function () {
      var type     = (container.querySelector('#mockType') || {}).value || 'hr';
      var score    = parseInt((container.querySelector('#mockScore') || {}).value || 5);
      var feedback = (container.querySelector('#mockFeedback') || {}).value || '';
      if (!s.mockInterviews) s.mockInterviews = [];
      s.mockInterviews.push({ date: new Date().toISOString(), type: type, score: score, feedback: feedback });
      SHIBI.Gamify.addXP(s, 20, 'Mock interview logged');
      SHIBI.State.save(s);
      SHIBI.Utils.toast('Mock interview logged! +20 XP');
      render(s);
    });
  }

  function init(s) {
    _s = s;
    render(s);
    renderHomeDailyHR(s);
  }

  return { init, render, getDailyHRQuestion, renderHomeDailyHR };
})();
