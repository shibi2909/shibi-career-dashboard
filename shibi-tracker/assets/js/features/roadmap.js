/* features/roadmap.js — Feature 11: Career Roadmap Visualization */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Roadmap = (function () {

  var DEV_TRACK = [
    { label: 'Java Basics',      sub: 'Variables · OOP · Collections',     key: 'java' },
    { label: 'OOP Deep Dive',    sub: 'Inheritance · Polymorphism',         key: 'java' },
    { label: 'DSA',              sub: 'Arrays · Trees · Graphs',            key: 'dsa' },
    { label: 'SQL & DBMS',       sub: 'Joins · Normalization · Queries',    key: null },
    { label: 'Web Dev',          sub: 'HTML · CSS · JavaScript',            key: 'web' },
    { label: 'Projects',         sub: 'Portfolio + GitHub',                 key: null },
    { label: 'Placement Ready',  sub: 'Aptitude · HR · Mock Interviews',    key: null }
  ];

  var SEC_TRACK = [
    { label: 'Linux',            sub: 'Commands · File System · Shell',     key: 'cyber' },
    { label: 'Networking',       sub: 'OSI · TCP/IP · Protocols',           key: 'networking' },
    { label: 'Security Basics',  sub: 'CIA Triad · Threats · Vulns',        key: 'cyber' },
    { label: 'SOC Tools',        sub: 'Wireshark · Splunk · SIEM',          key: 'cyber' },
    { label: 'SIEM & Logs',      sub: 'Elastic · Splunk queries',           key: 'cyber' },
    { label: 'Threat Hunting',   sub: 'IOCs · TTPs · MITRE ATT&CK',         key: 'cyber' },
    { label: 'SOC Analyst',      sub: 'Incident Response · Triage',         key: 'cyber' }
  ];

  function pct(s, key) {
    if (!key) return 0;
    return Math.round(SHIBI.Trackers.pct(s, key) || 0);
  }

  function nodeColor(p) {
    if (p >= 100) return 'var(--accent-green)';
    if (p >= 50)  return 'var(--accent)';
    if (p > 0)    return 'var(--accent-yellow)';
    return 'rgba(255,255,255,0.2)';
  }

  function buildSVGTrack(nodes, s, idPrefix) {
    var W = 900, H = 130, cy = 65, PAD = 56;
    var step = (W - PAD * 2) / (nodes.length - 1);
    var lines = '', circles = '', labels = '';

    nodes.forEach(function (n, i) {
      var x = Math.round(PAD + i * step);
      var p = pct(s, n.key);
      var col = nodeColor(p);
      var done = p >= 100;

      if (i < nodes.length - 1) {
        var nx = Math.round(PAD + (i + 1) * step);
        var lCol = nodeColor(pct(s, nodes[i + 1].key));
        lines += '<line x1="' + x + '" y1="' + cy + '" x2="' + nx + '" y2="' + cy +
          '" stroke="' + col + '" stroke-width="2" stroke-dasharray="4 3" opacity="0.6" />';
      }

      circles +=
        '<circle cx="' + x + '" cy="' + cy + '" r="20" fill="var(--bg-glass)" stroke="' + col +
          '" stroke-width="2.5" style="filter:drop-shadow(0 0 5px ' + col + ')" />';
      if (done) {
        circles += '<text x="' + x + '" y="' + (cy + 5) + '" text-anchor="middle" fill="' + col +
          '" font-size="13" font-family=\'JetBrains Mono\'>✓</text>';
      } else if (p > 0) {
        circles += '<text x="' + x + '" y="' + (cy + 4) + '" text-anchor="middle" fill="' + col +
          '" font-size="10" font-family=\'JetBrains Mono\'>' + p + '%</text>';
      } else {
        circles += '<circle cx="' + x + '" cy="' + cy + '" r="5" fill="' + col + '" />';
      }

      var alt = i % 2 === 0;
      var lY  = alt ? cy - 32 : cy + 52;
      var sY  = alt ? cy - 18 : cy + 64;
      labels +=
        '<text x="' + x + '" y="' + lY + '" text-anchor="middle" fill="var(--text)" font-size="11" font-family=\'JetBrains Mono\'>' +
          SHIBI.Utils.escapeHtml(n.label) + '</text>' +
        '<text x="' + x + '" y="' + sY + '" text-anchor="middle" fill="var(--text-mute)" font-size="9" font-family=\'JetBrains Mono\'>' +
          SHIBI.Utils.escapeHtml(n.sub) + '</text>';
    });

    return '<svg id="' + idPrefix + 'Svg" viewBox="0 0 ' + W + ' ' + H +
      '" style="width:100%;overflow:visible;display:block">' +
      lines + circles + labels + '</svg>';
  }

  function legend() {
    return '<div class="rm-legend">' +
      '<span><span class="rm-dot" style="background:var(--accent-green)"></span>Complete (100%)</span>' +
      '<span><span class="rm-dot" style="background:var(--accent)"></span>In Progress (50%+)</span>' +
      '<span><span class="rm-dot" style="background:var(--accent-yellow)"></span>Started (&lt;50%)</span>' +
      '<span><span class="rm-dot" style="background:rgba(255,255,255,0.2)"></span>Not Started</span>' +
    '</div>';
  }

  function detailRows(nodes, s, trackName) {
    return nodes.map(function (n) {
      var p   = pct(s, n.key);
      var col = nodeColor(p);
      var bar = '<div class="rm-progress-wrap"><div class="rm-progress-bar" style="width:' + p +
        '%;background:' + col + '"></div></div>';
      return '<tr>' +
        '<td><strong>' + SHIBI.Utils.escapeHtml(n.label) + '</strong></td>' +
        '<td><span class="badge-soft">' + trackName + '</span></td>' +
        '<td class="text-muted-soft" style="font-size:12px">' + SHIBI.Utils.escapeHtml(n.sub) + '</td>' +
        '<td style="min-width:160px">' + bar + '</td>' +
        '<td style="font-size:12px;color:' + col + '">' + p + '%</td>' +
      '</tr>';
    }).join('');
  }

  function render(s) {
    var container = document.getElementById('roadmapContent');
    if (!container) return;

    container.innerHTML =
      '<div class="row g-4">' +

      '<div class="col-12"><div class="panel glass">' +
        '<div class="panel-head">' +
          '<h3><i class="bi bi-code-square"></i> Developer Track</h3>' +
          '<span class="badge-soft">Java → DSA → SQL → Web → Projects → Placement</span>' +
        '</div>' +
        '<div style="padding:28px 12px 12px">' + buildSVGTrack(DEV_TRACK, s, 'dev') + '</div>' +
        legend() +
      '</div></div>' +

      '<div class="col-12"><div class="panel glass">' +
        '<div class="panel-head">' +
          '<h3><i class="bi bi-shield-lock-fill"></i> Cybersecurity Track</h3>' +
          '<span class="badge-soft">Linux → Networking → Security → SOC → SIEM → Threat Hunting → SOC Analyst</span>' +
        '</div>' +
        '<div style="padding:28px 12px 12px">' + buildSVGTrack(SEC_TRACK, s, 'sec') + '</div>' +
        legend() +
      '</div></div>' +

      '<div class="col-12"><div class="panel glass">' +
        '<div class="panel-head"><h3><i class="bi bi-table"></i> Progress Breakdown</h3></div>' +
        '<div class="table-responsive"><table class="rm-table">' +
          '<thead><tr><th>Node</th><th>Track</th><th>Covers</th><th>Progress</th><th>%</th></tr></thead>' +
          '<tbody>' +
            detailRows(DEV_TRACK, s, 'Developer') +
            detailRows(SEC_TRACK, s, 'Cybersec') +
          '</tbody>' +
        '</table></div>' +
      '</div></div>' +

    '</div>';
  }

  function init(s) { render(s); }

  return { init, render };
})();
