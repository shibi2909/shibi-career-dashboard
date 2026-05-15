/* features/readiness.js — Feature 15: Placement Readiness Engine */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Readiness = (function () {

  // Weights must sum to 100
  var WEIGHTS = [
    { key: 'dsa',         label: 'DSA',         w: 20, color: 'var(--accent)' },
    { key: 'aptitude',    label: 'Aptitude',     w: 15, color: 'var(--accent-yellow)' },
    { key: 'projects',    label: 'Projects',     w: 15, color: 'var(--accent-pink)' },
    { key: 'interview',   label: 'Interview',    w: 15, color: 'var(--accent-green)' },
    { key: 'cybernet',    label: 'Cyber / Net',  w: 10, color: 'var(--accent-red)' },
    { key: 'consistency', label: 'Consistency',  w: 10, color: '#a855f7' },
    { key: 'java',        label: 'Java',         w: 10, color: '#f97316' },
    { key: 'resume',      label: 'Resume',       w: 5,  color: '#22c55e' }
  ];

  function rawScores(s) {
    var dsa = Math.min(100, Math.round((s.dsaSolved || 0)));
    dsa = Math.min(100, Math.round(dsa));                   // cap at 100

    var apt = SHIBI.Trackers.pct(s, 'aptitude') || 0;

    var projCount = (s.resume && s.resume.projects)
      ? s.resume.projects.filter(function (p) { return p && p.name; }).length : 0;
    var projects = projCount >= 3 ? 100 : projCount === 2 ? 75 : projCount === 1 ? 40 : 0;

    var practiced  = s.interviewPracticed ? Object.keys(s.interviewPracticed).length : 0;
    var mocks      = s.mockInterviews ? s.mockInterviews.length : 0;
    var interview  = Math.min(100, Math.round((practiced / 20) * 60 + (mocks / 5) * 40));

    var cyber  = SHIBI.Trackers.pct(s, 'cyber')      || 0;
    var net    = SHIBI.Trackers.pct(s, 'networking') || 0;
    var cybernet = Math.round((cyber + net) / 2);

    var consistency = Math.min(100, Math.round((s.streak || 0) / 30 * 100));

    var java = SHIBI.Trackers.pct(s, 'java') || 0;

    var resume = 0;
    if (window.SHIBI && SHIBI.Resume && SHIBI.Resume.completeness) {
      resume = SHIBI.Resume.completeness(s);
    } else if (s.resume && s.resume.name) {
      resume = 50;
    }

    return {
      dsa:         Math.min(100, dsa),
      aptitude:    Math.round(apt),
      projects:    projects,
      interview:   interview,
      cybernet:    cybernet,
      consistency: consistency,
      java:        Math.round(java),
      resume:      Math.round(resume)
    };
  }

  function computeScore(s) {
    var sc = rawScores(s);
    var total = 0;
    WEIGHTS.forEach(function (w) { total += (sc[w.key] / 100) * w.w; });
    return Math.round(total);
  }

  function topHint(sc) {
    var best = null, bestGain = -1;
    WEIGHTS.forEach(function (w) {
      var gain = ((100 - sc[w.key]) / 100) * w.w;
      if (gain > bestGain) { bestGain = gain; best = w; }
    });
    if (!best) return 'Excellent — maintain your momentum and you are placement-ready!';
    var hints = {
      dsa:         'Solve more DSA problems daily — even 5 problems/day moves this the most.',
      aptitude:    'Work through the Aptitude tracker — ' + (100 - sc.aptitude) + '% of topics remain.',
      projects:    'Add a project to your Resume Builder — each project adds significant readiness.',
      interview:   'Practice HR questions and log mock interviews in Interview Prep.',
      cybernet:    'Push forward in both Cybersec and Networking trackers.',
      consistency: 'Build your daily streak — consistent study is the highest-leverage habit.',
      java:        'Complete more Java topics — ' + (100 - sc.java) + '% of the module remaining.',
      resume:      'Fill out your Resume Builder — completeness directly boosts this score.'
    };
    return hints[best.key] || 'Focus on ' + best.label + ' to gain the most ground.';
  }

  function ringColor(score) {
    if (score >= 70) return 'var(--accent-green)';
    if (score >= 40) return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  }

  function ring(score, size) {
    size = size || 170;
    var r = size / 2 - 15;
    var circ = 2 * Math.PI * r;
    var fill = Math.round((score / 100) * circ);
    var col  = ringColor(score);
    var half = size / 2;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" class="readiness-ring-svg">' +
      '<circle cx="' + half + '" cy="' + half + '" r="' + r + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="13"/>' +
      '<circle cx="' + half + '" cy="' + half + '" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="13"' +
        ' stroke-dasharray="' + fill + ' ' + (circ - fill) + '"' +
        ' stroke-dashoffset="' + (circ * 0.25) + '"' +
        ' stroke-linecap="round"' +
        ' style="transition:stroke-dasharray .6s ease;filter:drop-shadow(0 0 7px ' + col + ')"/>' +
      '<text x="' + half + '" y="' + (half - 6) + '" text-anchor="middle" fill="' + col +
        '" font-size="' + Math.round(size * 0.18) + '" font-weight="700" font-family="Orbitron">' + score + '</text>' +
      '<text x="' + half + '" y="' + (half + 14) + '" text-anchor="middle" fill="var(--text-mute)"' +
        ' font-size="' + Math.round(size * 0.065) + '" font-family="JetBrains Mono">READINESS</text>' +
    '</svg>';
  }

  function renderHomeWidget(s) {
    var el = document.getElementById('readinessHomeWidget');
    if (!el) return;
    var score = computeScore(s);
    var sc    = rawScores(s);
    var hint  = topHint(sc);
    el.innerHTML =
      '<div class="panel-head"><h3><i class="bi bi-speedometer2"></i> Placement Readiness</h3></div>' +
      '<div class="readiness-home-body">' +
        ring(score, 130) +
        '<div class="readiness-home-right">' +
          '<p class="readiness-hint-text">' +
            '<i class="bi bi-lightbulb-fill" style="color:var(--accent-yellow)"></i> ' +
            SHIBI.Utils.escapeHtml(hint) +
          '</p>' +
          '<a href="#" class="mini-btn w-100 mt-2" data-section="section-readiness">Full Breakdown →</a>' +
        '</div>' +
      '</div>';
  }

  function render(s) {
    var el = document.getElementById('readinessContent');
    if (!el) return;
    var score = computeScore(s);
    var sc    = rawScores(s);
    var hint  = topHint(sc);

    var bars = WEIGHTS.map(function (w) {
      var v = sc[w.key];
      var contrib = ((v / 100) * w.w).toFixed(1);
      return '<div class="readiness-bar-row">' +
        '<div class="readiness-bar-meta">' +
          '<span class="readiness-bar-lbl">' + w.label + '</span>' +
          '<span class="readiness-bar-wt">weight: ' + w.w + '%</span>' +
        '</div>' +
        '<div class="readiness-bar-track">' +
          '<div class="readiness-bar-fill" style="width:' + v + '%;background:' + w.color + '"></div>' +
        '</div>' +
        '<span class="readiness-bar-val">' + v + '%&nbsp;<span class="text-muted-soft">+' + contrib + 'pts</span></span>' +
      '</div>';
    }).join('');

    el.innerHTML =
      '<div class="row g-4 align-items-start">' +

      '<div class="col-lg-4">' +
        '<div class="panel glass text-center" style="padding:32px 16px">' +
          ring(score) +
          '<p style="margin:12px 0 0;font-size:12px;color:var(--text-mute)">Score out of 100 — 8 weighted signals</p>' +
        '</div>' +
      '</div>' +

      '<div class="col-lg-8">' +
        '<div class="panel glass">' +
          '<div class="panel-head"><h3><i class="bi bi-bar-chart-line-fill"></i> Score Breakdown</h3></div>' +
          '<div style="padding:4px 12px 12px">' + bars + '</div>' +
          '<div class="readiness-hint-box">' +
            '<i class="bi bi-arrow-up-circle-fill" style="color:var(--accent-yellow);font-size:20px;flex-shrink:0"></i>' +
            '<div>' +
              '<strong style="font-size:13px">What would move your score the most?</strong>' +
              '<p style="margin:4px 0 0;font-size:12px;color:var(--text-mute)">' + SHIBI.Utils.escapeHtml(hint) + '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

    '</div>';
  }

  function init(s) {
    renderHomeWidget(s);
    render(s);
  }

  return { init, render, computeScore, renderHomeWidget };
})();
