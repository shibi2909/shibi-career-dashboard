/* features/weakness.js — Smart Weakness Detection
   Reads existing state keys — no new state required.
   Exposes SHIBI.Weakness = { init, getScores, getRanked, getRecommendations, render }
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Weakness = (function () {

  /* ── Tracker % helper ─────────────────────────────────── */
  function trackerPct(s, key) {
    if (window.SHIBI && SHIBI.Trackers && SHIBI.Trackers.pct) return SHIBI.Trackers.pct(s, key) || 0;
    // Fallback: count completed vs total from TRACKER_DEFS if available
    var t = s.trackers && s.trackers[key];
    if (!t) return 0;
    return t.completed ? Math.min(100, Math.round(t.completed.length / 1)) : 0;
  }

  /* ── Days since last activity ─────────────────────────── */
  function daysSince(s, activityKey) {
    var today = new Date(); today.setHours(0,0,0,0);
    var da = s.dailyActivity || {};
    // Walk back up to 14 days looking for the activityKey
    for (var i = 0; i < 14; i++) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var ds = d.toISOString().slice(0,10);
      if (da[ds] && (da[ds][activityKey] || 0) > 0) return i;
    }
    return 14; // treated as max inactivity
  }

  /* ── Challenges solved this week ─────────────────────── */
  function challengesThisWeek(s) {
    var dc = s.dailyChallenges || {};
    var today = new Date(); today.setHours(0,0,0,0);
    var count = 0;
    for (var i = 0; i < 7; i++) {
      var d = new Date(today); d.setDate(d.getDate() - i);
      var ds = d.toISOString().slice(0,10);
      if (dc[ds]) {
        if (dc[ds].easy)   count++;
        if (dc[ds].medium) count++;
        if (dc[ds].hard)   count++;
      }
    }
    return count;
  }

  /* ── Days since last lab done ─────────────────────────── */
  function daysSinceLastLab(s) {
    var labs = s.labsCustom || [];
    if (!labs.length) return 14;
    var today = new Date(); today.setHours(0,0,0,0);
    var latest = 0;
    labs.forEach(function (l) {
      if (l.done && l.completedAt) {
        var dt = new Date(l.completedAt + 'T00:00:00');
        var diff = Math.floor((today - dt) / 86400000);
        if (diff > latest) latest = diff; // actually we want the min (most recent)
      }
    });
    // Fix: find minimum days since completed
    var minDays = 14;
    labs.forEach(function (l) {
      if (l.done && l.completedAt) {
        var dt = new Date(l.completedAt + 'T00:00:00');
        var diff = Math.floor((today - dt) / 86400000);
        if (diff < minDays) minDays = diff;
      }
    });
    return minDays;
  }

  function labsDone(s) {
    return ((s.labsCustom || []).filter(function (l) { return l.done; }).length) + (s.thmLabs || 0);
  }

  /* ── Core scoring ─────────────────────────────────────── */
  function getScores(s) {
    var scores = {};

    // JAVA — progress + inactivity + hours
    var jPct     = trackerPct(s, 'java');
    var jInact   = Math.min(14, daysSince(s, 'hours')) / 14;
    var jHoursGap= Math.max(0, 1 - (s.hoursToday / 3));
    scores.java  = Math.round((100 - jPct) * 0.40 + jInact * 100 * 0.30 + jHoursGap * 100 * 0.30);

    // DSA — progress + solve rate + streak + challenges
    var dPct      = trackerPct(s, 'dsa');
    var solveRate = Math.max(0, 1 - ((s.dsaToday || 0) / 3));
    var streakGap = Math.max(0, 1 - ((s.dsaStreak || 0) / 7));
    var chalGap   = challengesThisWeek(s) < 5 ? 40 : 0;
    scores.dsa    = Math.round(
      (100 - dPct)    * 0.35 +
      solveRate * 100 * 0.30 +
      streakGap * 100 * 0.20 +
      chalGap         * 0.15
    );

    // APTITUDE — progress + weekly questions
    var aPct      = trackerPct(s, 'aptitude');
    var aptWkGap  = Math.max(0, 1 - ((s.aptWeek || 0) / 35));
    scores.aptitude = Math.round((100 - aPct) * 0.40 + aptWkGap * 100 * 0.60);

    // CYBER — progress + labs + lab inactivity
    var cPct    = trackerPct(s, 'cyber');
    var lDone   = labsDone(s);
    var labsGap = Math.max(0, 1 - (lDone / 10));
    var labInact= Math.min(14, daysSinceLastLab(s)) / 14;
    scores.cyber = Math.round(
      (100 - cPct)    * 0.40 +
      labsGap * 100   * 0.30 +
      labInact * 100  * 0.30
    );

    // WEB — progress + projects
    var wPct     = trackerPct(s, 'web');
    var projGap  = Math.max(0, 1 - ((s.miniProjects || 0) / 3));
    scores.web   = Math.round((100 - wPct) * 0.60 + projGap * 100 * 0.40);

    // NETWORKING — tracker if exists, else 60
    var nPct     = trackerPct(s, 'networking');
    scores.networking = nPct > 0 ? Math.round(100 - nPct) : 60;

    // Clamp all 0-100
    Object.keys(scores).forEach(function (k) {
      scores[k] = Math.max(0, Math.min(100, scores[k]));
    });
    return scores;
  }

  function getRanked(s) {
    var scores = getScores(s);
    var labels = {
      java:'Java', dsa:'DSA', aptitude:'Aptitude',
      cyber:'Cybersec', web:'Web Dev', networking:'Networking'
    };
    return Object.keys(scores)
      .map(function (k) { return { subject: k, label: labels[k] || k, score: scores[k] }; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  /* ── Recommendation builder ───────────────────────────── */
  function getRecommendations(s) {
    var ranked = getRanked(s);
    var rec    = [];
    var scores = getScores(s);
    var top    = ranked[0] && ranked[0].subject;
    var second = ranked[1] && ranked[1].subject;

    // Rule 1: Java is weakest
    if (top === 'java' || second === 'java') {
      var pct = 100 - scores.java;
      rec.push('Your Java progress is at ' + Math.round(pct) + '% — spend 45 min on the next unchecked Java topic today.');
    }

    // Rule 2: DSA weak + no solving today
    if ((top === 'dsa' || second === 'dsa') && (s.dsaToday || 0) === 0) {
      if ((s.dsaStreak || 0) === 0) {
        rec.push('Your coding streak is broken. Solve 1 DSA problem right now to restart it.');
      } else {
        rec.push('No DSA practice yet today. Solve today\'s Easy challenge to maintain your streak.');
      }
    }

    // Rule 3: Aptitude weak
    if ((top === 'aptitude' || second === 'aptitude') && (s.aptWeek || 0) < 15) {
      rec.push('Only ' + (s.aptWeek || 0) + ' aptitude questions this week. You need 35/week for placement readiness — do 5 now.');
    }

    // Rule 4: Cyber weak
    if (top === 'cyber' || second === 'cyber') {
      if (labsDone(s) === 0) {
        rec.push('You haven\'t completed any cyber labs yet. Start with Linux Fundamentals Part 1 — it\'s easy and foundational.');
      } else if (daysSinceLastLab(s) > 5) {
        rec.push('Last cyber lab was ' + daysSinceLastLab(s) + ' days ago. Keep momentum — open a TryHackMe room today.');
      }
    }

    // Rule 5: Web weak
    if (top === 'web') {
      var wPct = 100 - scores.web;
      rec.push('Web Dev at ' + Math.round(wPct) + '% — complete the next unchecked Web topic before focusing elsewhere.');
    }

    // Rule 6: All strong
    if (rec.length === 0 || ranked[0].score < 30) {
      rec.push('Looking strong overall! Stay consistent — maintain your streak and daily hours to stay on track.');
    }

    return rec.slice(0, 4);
  }

  /* ── DOM render ────────────────────────────────────────── */
  function render(s) {
    renderWeaknessPanel(s);
    renderMentorBlock(s);
  }

  function renderWeaknessPanel(s) {
    var el = document.getElementById('weaknessBars');
    var rec = document.getElementById('weaknessRec');
    var updated = document.getElementById('weaknessUpdated');
    if (!el) return;

    var ranked = getRanked(s);
    var recs   = getRecommendations(s);

    if (updated) {
      updated.textContent = 'Updated ' + new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
    }

    el.innerHTML = ranked.map(function (item) {
      var score = item.score;
      var color = score > 65 ? 'var(--accent-red)' : score >= 40 ? 'var(--accent-yellow)' : 'var(--accent-green)';
      var level = score > 65 ? 'critical' : score >= 40 ? 'moderate' : 'strong';
      var levelText = { critical:'CRITICAL', moderate:'MODERATE', strong:'STRONG' }[level];
      return '<div class="weakness-row">' +
        '<div class="weakness-label">' +
          '<span class="subject-name">' + item.label + '</span>' +
          '<span class="weakness-level ' + level + '">' + levelText + '</span>' +
        '</div>' +
        '<div class="progress-track" style="flex:1;height:7px">' +
          '<div class="progress-fill weakness-fill" style="width:' + score + '%;background:' + color + '"></div>' +
        '</div>' +
        '<span class="weakness-score-text">' + score + '%</span>' +
      '</div>';
    }).join('');

    if (rec) {
      rec.innerHTML = recs.map(function (r) {
        return '<div class="weakness-rec-card"><i class="bi bi-arrow-right-circle-fill"></i><span>' + SHIBI.Utils.escapeHtml(r) + '</span></div>';
      }).join('');
    }
  }

  function renderMentorBlock(s) {
    var el = document.getElementById('mentorWeaknessBlock');
    if (!el) return;
    var ranked = getRanked(s);
    var recs   = getRecommendations(s);
    el.innerHTML =
      '<div class="panel-head" style="margin-top:14px;border-top:1px solid var(--border-soft);padding-top:12px">' +
        '<h3><i class="bi bi-exclamation-triangle-fill" style="color:var(--accent-yellow)"></i> Weak Areas Analysis</h3>' +
      '</div>' +
      ranked.map(function (item) {
        var score = item.score;
        var color = score > 65 ? 'var(--accent-red)' : score >= 40 ? 'var(--accent-yellow)' : 'var(--accent-green)';
        var level = score > 65 ? 'critical' : score >= 40 ? 'moderate' : 'strong';
        return '<div class="weakness-row">' +
          '<div class="weakness-label">' +
            '<span class="subject-name">' + item.label + '</span>' +
            '<span class="weakness-level ' + level + '">' + level.toUpperCase() + '</span>' +
          '</div>' +
          '<div class="progress-track" style="flex:1;height:6px">' +
            '<div class="progress-fill weakness-fill" style="width:' + score + '%;background:' + color + '"></div>' +
          '</div>' +
          '<span class="weakness-score-text">' + score + '%</span>' +
        '</div>';
      }).join('') +
      recs.map(function (r) {
        return '<div class="weakness-rec-card"><i class="bi bi-arrow-right-circle-fill"></i><span>' + SHIBI.Utils.escapeHtml(r) + '</span></div>';
      }).join('');
  }

  function init(s) {
    render(s);
    // Re-render every 5 minutes to pick up state changes
    setInterval(function () { render(window._SHIBI_STATE); }, 5 * 60 * 1000);
  }

  return { init, getScores, getRanked, getRecommendations, render };
})();
