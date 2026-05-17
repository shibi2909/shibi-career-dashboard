/* modules/gamify.js — XP, levels, badges */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Gamify = (function () {

  var BADGES = [
    { id: 'first_step',   icon: 'bi-rocket-takeoff-fill', name: 'FIRST STEP',      desc: 'Complete your first topic',           check: function (s) { return SHIBI.Trackers.totalCompleted(s) >= 1; } },
    { id: 'streak_3',     icon: 'bi-fire',                name: 'STREAK · 3',      desc: 'Study 3 days in a row',               check: function (s) { return s.streak >= 3; } },
    { id: 'streak_7',     icon: 'bi-fire',                name: 'STREAK · 7',      desc: 'Study 7 days in a row',               check: function (s) { return s.streak >= 7; } },
    { id: 'streak_14',    icon: 'bi-fire',                name: 'STREAK · 14',     desc: 'Study 14 days in a row',              check: function (s) { return s.streak >= 14; } },
    { id: 'streak_30',    icon: 'bi-fire',                name: 'STREAK · 30',     desc: 'Study 30 days in a row',              check: function (s) { return s.streak >= 30; } },
    { id: 'java_master',  icon: 'bi-cup-hot-fill',        name: 'JAVA MASTER',     desc: 'Finish all Java topics',              check: function (s) { return SHIBI.Trackers.pct(s, 'java') >= 100; } },
    { id: 'dsa_50',       icon: 'bi-diagram-3-fill',      name: 'DSA · 50',        desc: 'Solve 50 DSA problems',               check: function (s) { return s.dsaSolved >= 50; } },
    { id: 'dsa_100',      icon: 'bi-code-square',         name: 'DSA · 100',       desc: 'Solve 100 DSA problems',              check: function (s) { return s.dsaSolved >= 100; } },
    { id: 'cyber_warr',   icon: 'bi-shield-lock-fill',    name: 'CYBER WARRIOR',   desc: 'Finish all cybersec topics',          check: function (s) { return SHIBI.Trackers.pct(s, 'cyber') >= 100; } },
    { id: 'net_ninja',    icon: 'bi-router-fill',         name: 'NETWORK NINJA',   desc: 'Finish all Networking topics',        check: function (s) { return SHIBI.Trackers.pct(s, 'networking') >= 100; } },
    { id: 'bug_hunter',   icon: 'bi-bug-fill',            name: 'BUG HUNTER',      desc: 'Complete OWASP Top 10',               check: function (s) { return s.trackers.cyber && s.trackers.cyber.completed.includes('OWASP Top 10'); } },
    { id: 'task_10',      icon: 'bi-check2-all',          name: 'TASKMASTER',      desc: 'Complete 10 planner tasks',           check: function (s) { return s.tasks.filter(function (t) { return t.done; }).length >= 10; } },
    { id: 'pomo_5',       icon: 'bi-stopwatch-fill',      name: 'FOCUSED · 5',     desc: 'Complete 5 Pomodoro sessions',        check: function (s) { return s.pomoTotal >= 5; } },
    { id: 'pomo_marathon', icon: 'bi-lightning-charge-fill', name: 'MARATHON',     desc: 'Complete 4 Pomodoros in one day',     check: function (s) { return s.pomoToday >= 4; } },
    { id: 'all_rounder',  icon: 'bi-stars',               name: 'ALL-ROUNDER',     desc: '50%+ in every tracker',               check: function (s) { return SHIBI.Trackers.allKeys().every(function (k) { return SHIBI.Trackers.pct(s, k) >= 50; }); } },
    { id: 'xp_500',       icon: 'bi-gem',                 name: 'XP · 500',        desc: 'Earn 500 XP',                         check: function (s) { return (s.xp || 0) >= 500; } },
    { id: 'xp_1000',      icon: 'bi-gem',                 name: 'XP · 1000',       desc: 'Earn 1000 XP',                        check: function (s) { return (s.xp || 0) >= 1000; } },
    { id: 'xp_2500',      icon: 'bi-diamond-fill',        name: 'XP · 2500',       desc: 'Earn 2500 XP',                        check: function (s) { return (s.xp || 0) >= 2500; } },
    { id: 'quiz_ace',     icon: 'bi-trophy-fill',         name: 'QUIZ ACE',        desc: 'Score 100% on any quiz',              check: function (s) { return s.quizHistory && s.quizHistory.some(function (q) { return q.score === q.total; }); } },
    { id: 'thm_10',       icon: 'bi-shield-check',        name: 'THM HERO',        desc: 'Complete 10 TryHackMe labs',          check: function (s) { return s.thmLabs >= 10; } },
    { id: 'mock_master',  icon: 'bi-person-badge-fill',   name: 'MOCK MASTER',     desc: 'Log 3 mock interviews',               check: function (s) { return s.mockInterviews && s.mockInterviews.length >= 3; } },
    { id: 'day90_grad',   icon: 'bi-mortarboard-fill',    name: 'DAY-90 GRAD',     desc: 'Study consistently for 90 days',      check: function (s) { return s.dailyActivity && Object.keys(s.dailyActivity).length >= 90; } },
    { id: 'code_sprint',  icon: 'bi-speedometer',         name: 'CODE SPRINT',     desc: 'Solve 10 problems in one day',        check: function (s) { return s.dailyActivity && Object.values(s.dailyActivity).some(function (d) { return (d.problemsSolved || 0) >= 10; }); } },
    { id: 'resume_ready', icon: 'bi-file-earmark-check-fill', name: 'RESUME READY', desc: 'Resume completeness ≥ 80%',          check: function (s) { return window.SHIBI && SHIBI.Resume && SHIBI.Resume.completeness && SHIBI.Resume.completeness(s) >= 80; } },
    { id: 'company_champ',icon: 'bi-buildings-fill',      name: 'COMPANY CHAMP',  desc: 'Complete all topics for any company', check: function (s) { if (!window.SHIBI_COMPANIES || !s.companyProgress) return false; return SHIBI_COMPANIES.some(function (co) { var p = s.companyProgress[co.id]; return p && p.topicsDone && p.topicsDone.length >= co.topics.length; }); } }
  ];

  var WEEKLY_CHALLENGES = [
    "Solve 15 LeetCode problems across Easy / Medium / Hard.",
    "Complete one TryHackMe room and write a short writeup.",
    "Build a mini Java project: a CLI to-do list with file persistence.",
    "Finish the React fundamentals playlist and build a single-page app.",
    "Read OWASP Top 10 — write a 1-page summary in your own words.",
    "Practice 50 aptitude questions with timed mock sessions.",
    "Set up Linux on a VM and learn 30 shell commands."
  ];

  function xpForLevel(n) { return n * 200; }

  function addXP(s, amount, reason) {
    if (!s.xp) s.xp = 0;
    s.xp += amount;
    var prevLevel = s.level || 1;
    var newLevel = 1;
    while (s.xp >= xpForLevel(newLevel + 1)) newLevel++;
    s.level = newLevel;
    if (newLevel > prevLevel) {
      SHIBI.Utils.toast('🆙 LEVEL UP! Now Level ' + newLevel);
    }
    updateXPPill(s);
    // floating XP toast
    showXPFloat('+' + amount + ' XP');
    SHIBI.State.save(s);
  }

  function showXPFloat(msg) {
    var el = document.createElement('div');
    el.className = 'xp-float';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translateY(-40px)'; }, 1200);
    setTimeout(function () { el.remove(); }, 1600);
  }

  function updateXPPill(s) {
    var pill = document.getElementById('xpPill');
    if (!pill) return;
    var lvl = s.level || 1;
    var xp  = s.xp || 0;
    var needed = xpForLevel(lvl + 1);
    var pct = Math.min(100, Math.round((xp / needed) * 100));
    pill.innerHTML =
      'LVL <strong>' + lvl + '</strong> · ' + xp + '/<span style="color:var(--text-mute)">' + needed + '</span> XP' +
      '<div class="xp-mini-bar"><div class="xp-mini-fill" style="width:' + pct + '%"></div></div>';
  }

  var STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 90];
  var celebratedStreaks = {};

  function checkStreakMilestones(s) {
    if (!window.SHIBI_MENTOR_MESSAGES) return;
    var msgs = SHIBI_MENTOR_MESSAGES.streak_celebrate || [];
    STREAK_MILESTONES.forEach(function (m) {
      var key = 'streak_' + m;
      if (s.streak >= m && !celebratedStreaks[key]) {
        celebratedStreaks[key] = true;
        var msg = msgs.find(function (x) { return x.includes(m + '-day') || x.includes(m + ' day'); });
        if (!msg && msgs.length > 0) msg = msgs[Math.min(STREAK_MILESTONES.indexOf(m), msgs.length - 1)];
        if (msg) SHIBI.Utils.toast(msg);
      }
    });
  }

  function checkBadges(s) {
    if (!s.earnedBadges) s.earnedBadges = [];
    var newOnes = [];
    BADGES.forEach(function (b) {
      if (!s.earnedBadges.includes(b.id) && b.check(s)) {
        s.earnedBadges.push(b.id);
        newOnes.push(b.name);
      }
    });
    checkStreakMilestones(s);
    if (newOnes.length) {
      SHIBI.State.save(s);
      newOnes.forEach(function (n) { SHIBI.Utils.toast('🏆 Unlocked: ' + n); });
      renderBadges(s);
    }
  }

  function renderBadges(s) {
    var grid = document.getElementById('badgeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!s.earnedBadges) s.earnedBadges = [];

    // recently unlocked panel — last 3 earned badges
    var recentPanel = document.getElementById('recentlyUnlockedPanel');
    if (recentPanel) {
      var recentIds   = s.earnedBadges.slice(-3).reverse();
      var recentBadges = recentIds.map(function (id) { return BADGES.find(function (b) { return b.id === id; }); }).filter(Boolean);
      if (recentBadges.length > 0) {
        recentPanel.style.display = 'block';
        recentPanel.innerHTML =
          '<div class="panel-head"><h3><i class="bi bi-stars"></i> Recently Unlocked</h3></div>' +
          '<div class="recent-badges-row">' +
          recentBadges.map(function (b) {
            return '<div class="recent-badge-item">' +
              '<div class="recent-badge-icon"><i class="bi ' + b.icon + '"></i></div>' +
              '<div class="recent-badge-name">' + b.name + '</div>' +
            '</div>';
          }).join('') +
          '</div>';
      } else {
        recentPanel.style.display = 'none';
      }
    }

    // earned first, locked last
    var earned  = BADGES.filter(function (b) { return s.earnedBadges.includes(b.id); });
    var locked  = BADGES.filter(function (b) { return !s.earnedBadges.includes(b.id); });
    var ordered = earned.concat(locked);

    ordered.forEach(function (b) {
      var isEarned = s.earnedBadges.includes(b.id);
      var col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3';
      col.innerHTML =
        '<div class="badge-card glass ' + (isEarned ? 'earned' : 'locked') + '">' +
          (isEarned ? '<div class="badge-earned-mark">✓</div>' : '') +
          '<div class="badge-icon"><i class="bi ' + b.icon + '"></i></div>' +
          '<div class="badge-name">' + b.name + '</div>' +
          '<div class="badge-desc">' + b.desc + '</div>' +
        '</div>';
      grid.appendChild(col);
    });

    var wIdx = Math.floor(new Date().getDate() / 7) % WEEKLY_CHALLENGES.length;
    var wc = document.getElementById('weeklyChal');
    if (wc) wc.textContent = '> ' + WEEKLY_CHALLENGES[wIdx];
  }

  return { addXP, checkBadges, renderBadges, updateXPPill, BADGES };
})();
