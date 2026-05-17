/* modules/quiz.js — full quiz engine with daily/mock/topic/history tabs */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Quiz = (function () {

  var _s, _timer = null;

  var ALL_SUBJECTS = ['java','dsa','aptitude','cyber','networking'];
  var TOPIC_SUBJECTS = ['java','dsa','aptitude','cyber','networking','oops','dbms_sql','linux','javascript','reactjs'];

  function getRandom(arr, n) {
    var copy = arr.slice();
    var result = [];
    while (result.length < n && copy.length > 0) {
      var i = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(i, 1)[0]);
    }
    return result;
  }

  /* ── PUBLIC STARTERS ── */
  function startDaily(subject) {
    if (!window.SHIBI_QUIZBANK || !SHIBI_QUIZBANK[subject] || SHIBI_QUIZBANK[subject].length === 0) {
      SHIBI.Utils.toast('No questions found for ' + subject); return;
    }
    launchQuiz(getRandom(SHIBI_QUIZBANK[subject], 5), subject, 300);
  }

  function startWeeklyMock() {
    if (!window.SHIBI_QUIZBANK) { SHIBI.Utils.toast('Quiz bank not loaded.'); return; }
    var pool = [];
    ALL_SUBJECTS.forEach(function (k) {
      if (SHIBI_QUIZBANK[k]) pool = pool.concat(getRandom(SHIBI_QUIZBANK[k], 5));
    });
    launchQuiz(getRandom(pool, 25), 'Weekly Mock', 1500);
  }

  function startTopic(topic) {
    if (!window.SHIBI_QUIZBANK || !SHIBI_QUIZBANK[topic] || SHIBI_QUIZBANK[topic].length === 0) {
      SHIBI.Utils.toast('No questions found for ' + topic); return;
    }
    launchQuiz(getRandom(SHIBI_QUIZBANK[topic], 10), topic, 600);
  }

  /* ── QUIZ ENGINE ── */
  function launchQuiz(questions, subject, timeSec) {
    var modal = document.getElementById('quizModal');
    var body  = document.getElementById('quizModalBody');
    if (!modal || !body) { SHIBI.Utils.toast('Quiz modal not found'); return; }

    var remaining  = timeSec;
    var userAnswers = new Array(questions.length).fill(null);
    var submitted  = false;
    var idx        = 0;

    function fmtSec(s) {
      return String(Math.floor(s / 60)).padStart(2,'0') + ':' + String(s % 60).padStart(2,'0');
    }

    function renderQ(qIdx) {
      idx = qIdx;
      var q = questions[qIdx];
      body.innerHTML =
        '<div class="quiz-header">' +
          '<span class="quiz-subject">' + subject.toUpperCase() + '</span>' +
          '<span class="quiz-progress">Q ' + (qIdx + 1) + ' / ' + questions.length + '</span>' +
          '<span class="quiz-timer" id="quizTimerDisplay">' + fmtSec(remaining) + '</span>' +
        '</div>' +
        '<p class="quiz-question">' + SHIBI.Utils.escapeHtml(q.q) + '</p>' +
        '<div class="quiz-options" id="quizOptions"></div>' +
        '<div class="quiz-nav">' +
          (qIdx > 0 ? '<button class="mini-btn" id="quizPrev">← Prev</button>' : '<span></span>') +
          (qIdx < questions.length - 1
            ? '<button class="mini-btn primary" id="quizNext">Next →</button>'
            : '<button class="mini-btn primary" id="quizSubmit"><i class="bi bi-check-lg"></i> Submit</button>') +
        '</div>';

      var opts = body.querySelector('#quizOptions');
      q.options.forEach(function (opt, oi) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option' + (userAnswers[qIdx] === oi ? ' selected' : '');
        btn.textContent = opt;
        btn.addEventListener('click', function () {
          userAnswers[qIdx] = oi;
          opts.querySelectorAll('.quiz-option').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
        });
        opts.appendChild(btn);
      });

      var p = body.querySelector('#quizPrev');
      var n = body.querySelector('#quizNext');
      var s = body.querySelector('#quizSubmit');
      if (p) p.addEventListener('click', function () { renderQ(qIdx - 1); });
      if (n) n.addEventListener('click', function () { renderQ(qIdx + 1); });
      if (s) s.addEventListener('click', submitQuiz);
    }

    function submitQuiz() {
      if (submitted) return;
      submitted = true;
      if (_timer) { clearInterval(_timer); _timer = null; }

      var score = 0;
      var wrongQs = [];
      questions.forEach(function (q, i) {
        if (userAnswers[i] === q.correct) { score++; }
        else { wrongQs.push({ q: q, answered: userAnswers[i] }); }
      });

      var pct = Math.round((score / questions.length) * 100);
      var record = {
        date:      new Date().toISOString(),
        subject:   subject,
        score:     score,
        total:     questions.length,
        pct:       pct,
        wrongIds:  wrongQs.map(function (w) { return w.q.q; }),
        timeMs:    (timeSec - remaining) * 1000
      };
      if (!_s.quizHistory) _s.quizHistory = [];
      _s.quizHistory.push(record);

      if (pct >= 80) SHIBI.Gamify.addXP(_s, 25, 'Daily quiz ≥80%');
      if (pct === 100) SHIBI.Gamify.addXP(_s, 15, 'Perfect score bonus');
      if (subject === 'Weekly Mock' && pct >= 70) SHIBI.Gamify.addXP(_s, 100, 'Weekly mock ≥70%');
      SHIBI.Gamify.checkBadges(_s);
      SHIBI.State.save(_s);

      // results screen
      var colorClass = pct >= 80 ? 'text-accent' : pct >= 60 ? 'text-yellow' : 'text-red';
      var reviewHtml = '<div class="quiz-review">';
      questions.forEach(function (q, i) {
        var correct = (userAnswers[i] === q.correct);
        reviewHtml +=
          '<div class="review-item ' + (correct ? 'correct' : 'wrong') + '">' +
            '<p class="review-q">' + SHIBI.Utils.escapeHtml(q.q) + '</p>' +
            '<p class="review-ans">Your answer: <strong>' + (q.options[userAnswers[i]] || 'Not answered') + '</strong></p>' +
            (!correct ? '<p class="review-correct">Correct: <strong>' + q.options[q.correct] + '</strong></p>' : '') +
            (q.explanation ? '<p class="review-expl">' + SHIBI.Utils.escapeHtml(q.explanation) + '</p>' : '') +
          '</div>';
      });
      reviewHtml += '</div>';

      // weak topics from wrong answers
      var weakHtml = '';
      if (wrongQs.length > 0) {
        weakHtml = '<div class="weak-topics-box"><strong>Review suggested for:</strong> ' +
          wrongQs.slice(0, 3).map(function (w) {
            return '<span class="weak-tag">' + SHIBI.Utils.escapeHtml(w.q.q.slice(0, 40)) + '...</span>';
          }).join('') + '</div>';
      }

      body.innerHTML =
        '<div class="quiz-result">' +
          '<div class="quiz-score">' + score + '/' + questions.length + '</div>' +
          '<div class="quiz-pct ' + colorClass + '">' + pct + '%</div>' +
          (pct === 100 ? '<div class="quiz-perfect">🏆 PERFECT SCORE!</div>' : '') +
        '</div>' +
        weakHtml + reviewHtml +
        '<button class="mini-btn primary w-100 mt-3" id="quizCloseBtn">Close</button>';

      body.querySelector('#quizCloseBtn').addEventListener('click', function () {
        bootstrap.Modal.getInstance(modal).hide();
        renderSection(_s);
      });
    }

    // start timer
    if (_timer) clearInterval(_timer);
    _timer = setInterval(function () {
      remaining--;
      var td = document.getElementById('quizTimerDisplay');
      if (td) td.textContent = fmtSec(remaining);
      if (remaining <= 0) submitQuiz();
    }, 1000);

    renderQ(0);

    var bsModal = bootstrap.Modal.getOrCreateInstance(modal);
    bsModal.show();
    modal.addEventListener('hidden.bs.modal', function () {
      if (_timer) { clearInterval(_timer); _timer = null; }
    }, { once: true });
  }

  /* ── SECTION RENDERER ── */
  function renderSection(s) {
    _s = s;
    var sec = document.getElementById('section-tests');
    if (!sec) return;

    renderDailyTab();
    renderHistoryTab(s);
    renderLastMockScores(s);
  }

  function renderDailyTab() {
    var grid = document.getElementById('dailyTestGrid');
    if (!grid) return;
    var subjects = [
      { key:'java',       label:'Java',        icon:'bi-cup-hot-fill' },
      { key:'dsa',        label:'DSA',          icon:'bi-diagram-3-fill' },
      { key:'aptitude',   label:'Aptitude',     icon:'bi-calculator-fill' },
      { key:'cyber',      label:'Cybersec',     icon:'bi-shield-lock-fill' },
      { key:'networking', label:'Networking',   icon:'bi-router-fill' }
    ];
    grid.innerHTML = subjects.map(function (s) {
      return '<div class="quiz-card glass">' +
        '<div class="quiz-card-icon"><i class="bi ' + s.icon + '"></i></div>' +
        '<div class="quiz-card-label">' + s.label + '</div>' +
        '<button class="mini-btn primary mt-2 quiz-start-btn" data-subj="' + s.key + '">Start 5-Q Test</button>' +
      '</div>';
    }).join('');

    grid.querySelectorAll('.quiz-start-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { startDaily(btn.dataset.subj); });
    });
  }

  function renderTopicGrid() {
    var grid = document.getElementById('topicTestGrid');
    if (!grid || !window.SHIBI_QUIZBANK) return;
    var labels = {
      java:'Java', dsa:'DSA', aptitude:'Aptitude', cyber:'Cybersec',
      networking:'Networking', oops:'OOP Concepts', dbms_sql:'DBMS & SQL',
      linux:'Linux', javascript:'JavaScript', reactjs:'ReactJS'
    };
    grid.innerHTML = TOPIC_SUBJECTS.map(function (key) {
      var count = SHIBI_QUIZBANK[key] ? SHIBI_QUIZBANK[key].length : 0;
      return '<button class="topic-test-btn mini-btn" data-topic="' + key + '">' +
        labels[key] + ' <span class="text-muted-soft">(' + count + 'Q)</span>' +
      '</button>';
    }).join('');
    grid.querySelectorAll('.topic-test-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { startTopic(btn.dataset.topic); });
    });
  }

  function renderHistoryTab(s) {
    var tb = document.getElementById('quizHistoryBody');
    if (!tb) return;
    tb.innerHTML = '';
    if (!s.quizHistory || s.quizHistory.length === 0) {
      tb.innerHTML = '<tr><td colspan="4" class="text-muted-soft text-center p-3">No quiz history yet.</td></tr>';
      return;
    }
    s.quizHistory.slice().reverse().slice(0, 30).forEach(function (q) {
      var d   = new Date(q.date);
      var tr  = document.createElement('tr');
      var pct = q.pct !== undefined ? q.pct : Math.round((q.score / q.total) * 100);
      var colorStyle = pct >= 80 ? 'color:var(--accent-green)' : pct >= 60 ? 'color:var(--accent-yellow)' : 'color:var(--accent-red)';
      tr.innerHTML =
        '<td>' + SHIBI.Time.fmtDateLong(d) + '</td>' +
        '<td>' + q.subject + '</td>' +
        '<td>' + q.score + '/' + q.total + '</td>' +
        '<td style="' + colorStyle + ';font-weight:700">' + pct + '%</td>';
      tb.appendChild(tr);
    });
  }

  function renderLastMockScores(s) {
    var el = document.getElementById('lastMockScores');
    if (!el || !s.quizHistory) return;
    var mocks = s.quizHistory.filter(function (q) { return q.subject === 'Weekly Mock'; }).slice(-4);
    if (mocks.length === 0) {
      el.innerHTML = '<p class="text-muted-soft">No mock attempts yet.</p>';
      return;
    }
    el.innerHTML = mocks.map(function (m) {
      var pct = m.pct !== undefined ? m.pct : Math.round((m.score / m.total) * 100);
      var color = pct >= 70 ? 'var(--accent-green)' : pct >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
      return '<div class="mock-score-badge" style="border-color:' + color + ';color:' + color + '">' +
        '<div class="mock-score-num">' + pct + '%</div>' +
        '<div class="mock-score-label">' + new Date(m.date).toLocaleDateString() + '</div>' +
      '</div>';
    }).join('');
  }

  /* ── TAB SWITCHING ── */
  function initTabs() {
    var tabBtns = document.querySelectorAll('.quiz-section-tab');
    var tabPanels = document.querySelectorAll('.quiz-tab-panel');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        tabPanels.forEach(function (p) { p.style.display = 'none'; });
        btn.classList.add('active');
        var target = document.getElementById('quizTab-' + btn.dataset.quiztab);
        if (target) target.style.display = 'block';
        if (btn.dataset.quiztab === 'topics') renderTopicGrid();
      });
    });
  }

  function init(s) {
    _s = s;
    initTabs();
    renderSection(s);
    var mockBtn = document.getElementById('startWeeklyMockBtn');
    if (mockBtn) mockBtn.addEventListener('click', startWeeklyMock);
  }

  return { init, startDaily, startWeeklyMock, startTopic, renderSection };
})();
