/* features/roadmap.js — Career Roadmap Visualization (v4 enhanced)
   Two tracks: Developer + Cybersecurity. Tab switcher. Clickable nodes with info panel.
*/
window.SHIBI = window.SHIBI || {};
window.SHIBI.Roadmap = (function () {

  var activeTab = 'dev';
  var _state    = null;

  /* ── Track data ─────────────────────────────────────────── */
  var DEV_TRACK = {
    id: 'dev', title: 'Developer Track',
    badge: 'Java → DSA → SQL → Web → Projects → Placement',
    nodes: [
      { id:'java_basics', label:'Java Basics',     sub:'Variables · OOP · Collections', key:'java',      section:'section-java',    desc:'Core Java: data types, control flow, arrays, OOP fundamentals, Collections.' },
      { id:'java_oop',    label:'OOP Deep Dive',   sub:'Inheritance · Polymorphism',    key:'java',      section:'section-java',    desc:'4 pillars: Encapsulation, Inheritance, Polymorphism, Abstraction. Interfaces vs Abstract.' },
      { id:'dsa_core',    label:'DSA Core',         sub:'Arrays · Strings · Hashing',   key:'dsa',       section:'section-dsa',     desc:'Two pointers, sliding window, prefix sum, hashing, linked lists, stacks, queues.' },
      { id:'dsa_adv',     label:'DSA Advanced',    sub:'Trees · Graphs · DP',           key:'dsa',       section:'section-dsa',     desc:'Binary trees, BST, graphs (BFS/DFS), dynamic programming, greedy algorithms.' },
      { id:'sql',         label:'SQL / DBMS',      sub:'Joins · Normalization',         key:null,        section:'section-planner', desc:'SQL JOINs, GROUP BY, subqueries, normalization (1NF-3NF), ACID properties, indexing.' },
      { id:'web_basics',  label:'Web Dev',         sub:'HTML · CSS · JS',               key:'web',       section:'section-web',     desc:'HTML semantics, CSS flexbox/grid, JavaScript ES6+, responsive design, Bootstrap.' },
      { id:'projects',    label:'Projects',        sub:'Portfolio + GitHub',             key:null,        section:'section-github',  desc:'Build 2+ portfolio projects. Host on GitHub. Link in resume. This is your proof of work.' },
      { id:'placement',   label:'Placement Ready', sub:'Aptitude · HR · Resume',        key:null,        section:'section-home',    desc:'Aptitude tests, mock interviews, resume polished. You are ready for placement drives.' }
    ],
    // [from, to] edges
    edges: [
      ['java_basics','java_oop'], ['java_oop','dsa_core'], ['dsa_core','dsa_adv'],
      ['java_oop','sql'], ['java_oop','web_basics'], ['dsa_adv','projects'],
      ['sql','projects'], ['web_basics','projects'], ['projects','placement']
    ]
  };

  var CYBER_TRACK = {
    id: 'cyber', title: 'Cybersecurity / SOC Analyst Track',
    badge: 'Linux → Networking → Security → SOC Tools → Analyst',
    nodes: [
      { id:'linux',     label:'Linux Basics',     sub:'Commands · Permissions',    key:'cyber',     section:'section-cyber',  desc:'File system hierarchy, permissions (chmod/chown), shell scripting, process management.' },
      { id:'networking',label:'Networking',        sub:'OSI · TCP/IP · Ports',      key:'networking',section:'section-networking', desc:'OSI 7 layers, TCP vs UDP, DNS, HTTP/S, common ports, packet structure.' },
      { id:'sec_basics',label:'Security Basics',  sub:'CIA Triad · Attacks',        key:'cyber',     section:'section-cyber',  desc:'CIA triad, threat landscape, attack types (phishing, MITM, SQLi, XSS, DoS).' },
      { id:'nmap_wire', label:'Nmap + Wireshark',  sub:'Recon · Traffic Analysis',  key:'cyber',     section:'section-labs',   desc:'Nmap scanning (-sV -sC), Wireshark packet capture, reading traffic, filtering by protocol.' },
      { id:'burp_owasp',label:'Burp + OWASP',     sub:'Web Vulns · OWASP Top 10',  key:'cyber',     section:'section-cyber',  desc:'Burp Suite interception proxy, OWASP Top 10 (2021): A01-A10 explained and mitigated.' },
      { id:'siem',      label:'SIEM Basics',      sub:'Splunk · Log Analysis',      key:'cyber',     section:'section-cyber',  desc:'SIEM tools (Splunk, Elastic), SPL queries, alert correlation, log ingestion, dashboards.' },
      { id:'soc',       label:'SOC Concepts',     sub:'Triage · Incident Response', key:'cyber',     section:'section-cyber',  desc:'SOC Tier 1-3 roles, alert triage, incident response lifecycle, runbooks, false positives.' },
      { id:'threat',    label:'Threat Hunting',   sub:'IOCs · MITRE ATT&CK',        key:'cyber',     section:'section-cyber',  desc:'Threat hunting hypothesis, IOCs/TTPs, MITRE ATT&CK framework navigation, pivot analysis.' },
      { id:'soc_ana',   label:'SOC Analyst',      sub:'THM + HTB Labs',             key:null,        section:'section-labs',   desc:'Complete TryHackMe SOC Level 1 path + HackTheBox Starting Point machines. You are ready.' }
    ],
    edges: [
      ['linux','networking'], ['networking','sec_basics'],
      ['sec_basics','nmap_wire'], ['sec_basics','burp_owasp'],
      ['nmap_wire','siem'], ['burp_owasp','siem'],
      ['siem','soc'], ['soc','threat'], ['threat','soc_ana']
    ]
  };

  /* ── Helpers ─────────────────────────────────────────────── */
  function trackerPct(s, key) {
    if (!key) return 0;
    if (window.SHIBI && SHIBI.Trackers && SHIBI.Trackers.pct) return SHIBI.Trackers.pct(s, key) || 0;
    var t = s && s.trackers && s.trackers[key];
    return t && t.completed ? Math.min(100, t.completed.length * 15) : 0;
  }

  function nodeStatus(node, s) {
    if (!node.key) return 'available';
    var p = trackerPct(s, node.key);
    if (p >= 100) return 'done';
    if (p > 0)    return 'in_progress';
    return 'locked';
  }

  function statusColor(status) {
    return { done:'var(--accent-green)', in_progress:'var(--accent-yellow)', available:'var(--text-mute)', locked:'rgba(255,255,255,0.15)' }[status] || 'rgba(255,255,255,0.15)';
  }

  /* ── SVG builder (linear layout) ────────────────────────── */
  function buildSVG(track, s) {
    var nodes = track.nodes;
    var W = 900, H = 140, cy = 70, PAD = 55;
    var step = (W - PAD * 2) / (nodes.length - 1);
    var lines = '', circles = '', labels = '';

    // Build adjacency for edge coloring
    var statusMap = {};
    nodes.forEach(function (n) { statusMap[n.id] = nodeStatus(n, s); });

    // Edges
    track.edges.forEach(function (e) {
      var fromNode = nodes.find(function (n) { return n.id === e[0]; });
      var toNode   = nodes.find(function (n) { return n.id === e[1]; });
      if (!fromNode || !toNode) return;
      var fi = nodes.indexOf(fromNode);
      var ti = nodes.indexOf(toNode);
      var fx = Math.round(PAD + fi * step);
      var fy = cy;
      var tx = Math.round(PAD + ti * step);
      var ty = cy;
      // For non-adjacent (shortcut) edges use a curved path
      if (Math.abs(ti - fi) <= 1) {
        lines += '<line x1="' + fx + '" y1="' + fy + '" x2="' + tx + '" y2="' + ty +
          '" stroke="' + statusColor(statusMap[e[0]]) + '" stroke-width="2" stroke-dasharray="4 3" opacity="0.6" />';
      } else {
        var mid = Math.round((fx + tx) / 2);
        var curveY = fy + 40;
        lines += '<path d="M ' + fx + ',' + fy + ' Q ' + mid + ',' + curveY + ' ' + tx + ',' + ty + '" fill="none" stroke="' + statusColor(statusMap[e[0]]) + '" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.4" />';
      }
    });

    // Nodes
    nodes.forEach(function (n, i) {
      var x      = Math.round(PAD + i * step);
      var status = statusMap[n.id];
      var col    = statusColor(status);
      var done   = status === 'done';
      var inProg = status === 'in_progress';
      var p      = trackerPct(s, n.key);

      // Pulsing ring for in_progress
      if (inProg) {
        circles += '<circle cx="' + x + '" cy="' + cy + '" r="26" fill="none" stroke="' + col +
          '" stroke-width="1" opacity="0.4" class="roadmap-pulse" />';
      }
      // Main circle — give it a data-node-id for click handling
      circles += '<circle cx="' + x + '" cy="' + cy + '" r="20" fill="var(--bg-glass)" stroke="' + col +
        '" stroke-width="2.5" class="roadmap-node-circle" data-node-id="' + n.id + '"' +
        ' style="cursor:pointer;filter:drop-shadow(0 0 4px ' + col + ')" />';
      // Inner text
      if (done) {
        circles += '<text x="' + x + '" y="' + (cy + 5) + '" text-anchor="middle" fill="' + col +
          '" font-size="14" font-family="JetBrains Mono" style="pointer-events:none">✓</text>';
      } else if (p > 0) {
        circles += '<text x="' + x + '" y="' + (cy + 4) + '" text-anchor="middle" fill="' + col +
          '" font-size="9" font-family="JetBrains Mono" style="pointer-events:none">' + Math.round(p) + '%</text>';
      } else {
        circles += '<circle cx="' + x + '" cy="' + cy + '" r="4" fill="' + col + '" style="pointer-events:none" />';
      }

      // Labels (alternating above/below)
      var alt = i % 2 === 0;
      var lY  = alt ? cy - 32 : cy + 52;
      var sY  = alt ? cy - 18 : cy + 64;
      labels += '<text x="' + x + '" y="' + lY + '" text-anchor="middle" fill="var(--text)" font-size="11"' +
        ' font-family="JetBrains Mono" style="pointer-events:none">' + SHIBI.Utils.escapeHtml(n.label) + '</text>' +
        '<text x="' + x + '" y="' + sY + '" text-anchor="middle" fill="var(--text-mute)" font-size="9"' +
        ' font-family="JetBrains Mono" style="pointer-events:none">' + SHIBI.Utils.escapeHtml(n.sub) + '</text>';
    });

    return '<svg id="' + track.id + 'Svg" viewBox="0 0 ' + W + ' ' + H +
      '" style="width:100%;min-width:460px;overflow:visible;display:block">' +
      lines + circles + labels + '</svg>';
  }

  /* ── Legend ──────────────────────────────────────────────── */
  function legendHtml() {
    return '<div class="roadmap-legend">' +
      '<span><span class="legend-dot" style="background:var(--accent-green)"></span>Done</span>' +
      '<span><span class="legend-dot" style="background:var(--accent-yellow)"></span>In Progress</span>' +
      '<span><span class="legend-dot" style="background:var(--text-mute)"></span>Available</span>' +
      '<span><span class="legend-dot" style="background:rgba(255,255,255,0.15)"></span>Locked</span>' +
    '</div>';
  }

  /* ── Info panel ──────────────────────────────────────────── */
  function showInfoPanel(nodeId, track, s) {
    var node = track.nodes.find(function (n) { return n.id === nodeId; });
    if (!node) return;
    var panel    = document.getElementById('roadmapInfoPanel');
    if (!panel) return;
    var status   = nodeStatus(node, s);
    var statusBadge = { done:'<span class="diff-tag easy">DONE</span>', in_progress:'<span class="diff-tag med">IN PROGRESS</span>', available:'<span class="badge-soft">AVAILABLE</span>', locked:'<span class="badge-soft">LOCKED</span>' }[status] || '';
    panel.innerHTML =
      '<div class="roadmap-info-panel">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
          '<strong style="font-family:var(--font-display);font-size:15px;color:var(--accent)">' + SHIBI.Utils.escapeHtml(node.label) + '</strong>' +
          statusBadge +
        '</div>' +
        '<p style="font-size:13px;color:var(--text-mute);font-family:var(--font-mono);margin:0 0 12px">' + SHIBI.Utils.escapeHtml(node.desc) + '</p>' +
        '<a href="#" class="mini-btn" data-section="' + node.section + '">Go to section →</a>' +
        '<button class="mini-btn outline" id="closeInfoPanel" style="margin-left:8px">Close</button>' +
      '</div>';
    panel.style.display = 'block';
    var closeBtn = document.getElementById('closeInfoPanel');
    if (closeBtn) closeBtn.addEventListener('click', function () { panel.style.display = 'none'; });
  }

  /* ── Wire SVG click handlers ─────────────────────────────── */
  function wireNodeClicks(svgContainerId, track, s) {
    var wrap = document.getElementById(svgContainerId);
    if (!wrap) return;
    wrap.addEventListener('click', function (e) {
      var circle = e.target.closest('.roadmap-node-circle');
      if (!circle) return;
      showInfoPanel(circle.dataset.nodeId, track, s);
    });
  }

  /* ── Main render ─────────────────────────────────────────── */
  function render(s) {
    _state = s || _state;
    if (!_state) return;
    var container = document.getElementById('roadmapContent');
    if (!container) return;

    container.innerHTML =
      // Tab switcher
      '<div class="rm-tab-strip">' +
        '<button class="rm-tab-btn' + (activeTab === 'dev' ? ' active' : '') + '" data-rm-tab="dev">' +
          '<i class="bi bi-code-square"></i> Developer Track' +
        '</button>' +
        '<button class="rm-tab-btn' + (activeTab === 'cyber' ? ' active' : '') + '" data-rm-tab="cyber">' +
          '<i class="bi bi-shield-lock-fill"></i> Cybersec Track' +
        '</button>' +
        '<button class="mini-btn outline" id="rmRefresh" style="margin-left:auto">' +
          '<i class="bi bi-arrow-clockwise"></i> Refresh' +
        '</button>' +
      '</div>' +

      // Dev track panel
      '<div id="rmPanelDev" style="display:' + (activeTab === 'dev' ? 'block' : 'none') + '">' +
        '<div class="panel glass">' +
          '<div class="panel-head"><h3>' + DEV_TRACK.title + '</h3><span class="badge-soft">' + DEV_TRACK.badge + '</span></div>' +
          legendHtml() +
          '<div class="roadmap-svg-wrap" id="roadmapDevWrap">' + buildSVG(DEV_TRACK, _state) + '</div>' +
        '</div>' +
      '</div>' +

      // Cyber track panel
      '<div id="rmPanelCyber" style="display:' + (activeTab === 'cyber' ? 'block' : 'none') + '">' +
        '<div class="panel glass">' +
          '<div class="panel-head"><h3>' + CYBER_TRACK.title + '</h3><span class="badge-soft">' + CYBER_TRACK.badge + '</span></div>' +
          legendHtml() +
          '<div class="roadmap-svg-wrap" id="roadmapCyberWrap">' + buildSVG(CYBER_TRACK, _state) + '</div>' +
        '</div>' +
      '</div>' +

      // Info panel (hidden until node click)
      '<div id="roadmapInfoPanel" style="display:none;margin-top:14px"></div>';

    // Tab switching
    container.querySelectorAll('.rm-tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTab = btn.dataset.rmTab;
        render(_state);
      });
    });

    // Refresh button
    var rfBtn = document.getElementById('rmRefresh');
    if (rfBtn) rfBtn.addEventListener('click', function () { render(_state); });

    // Node click handlers
    wireNodeClicks('roadmapDevWrap',   DEV_TRACK,   _state);
    wireNodeClicks('roadmapCyberWrap', CYBER_TRACK, _state);
  }

  function init(s) { _state = s; render(s); }

  return { init, render };
})();
