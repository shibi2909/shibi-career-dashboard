/* features/companies.js — Feature 5: Company Preparation Tracker */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Companies = (function () {

  function getCompanyProgress(s, company) {
    var done = s.companyProgress && s.companyProgress[company.id] ? s.companyProgress[company.id].topicsDone || [] : [];
    var all  = [].concat(company.topics.aptitude, company.topics.coding, company.topics.technical);
    var pct  = all.length > 0 ? Math.round((done.length / all.length) * 100) : 0;
    return { done: done, total: all, pct: pct };
  }

  function progressRingHtml(pct, size, color) {
    var r   = size / 2 - 6;
    var circ = Math.round(2 * Math.PI * r);
    var offset = Math.round(circ * (1 - pct / 100));
    return '<svg width="' + size + '" height="' + size + '" style="transform:rotate(-90deg)">' +
      '<circle cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '" fill="none" stroke="var(--bg-elev)" stroke-width="5"></circle>' +
      '<circle cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '" style="filter:drop-shadow(0 0 6px ' + color + ')"></circle>' +
    '</svg>';
  }

  function renderGrid(s) {
    var grid = document.getElementById('companiesGrid');
    if (!grid || !window.SHIBI_COMPANIES) return;

    grid.innerHTML = SHIBI_COMPANIES.map(function (company) {
      var prog = getCompanyProgress(s, company);
      var col  = company.color || 'var(--accent)';
      return '<div class="col-md-6 col-lg-4">' +
        '<div class="company-card glass" data-company-id="' + company.id + '">' +
          '<div class="company-card-top">' +
            '<div class="company-icon" style="color:' + col + '"><i class="bi ' + company.icon + '"></i></div>' +
            '<div class="company-info">' +
              '<div class="company-name">' + company.name + '</div>' +
              '<div class="company-full">' + company.fullName + '</div>' +
            '</div>' +
            '<div class="company-ring">' +
              progressRingHtml(prog.pct, 60, col) +
              '<div class="company-ring-pct">' + prog.pct + '%</div>' +
            '</div>' +
          '</div>' +
          '<div class="progress-track mt-2"><div class="progress-fill" style="width:' + prog.pct + '%;background:' + col + ';box-shadow:0 0 8px ' + col + '"></div></div>' +
          '<div class="company-card-footer">' +
            '<span class="badge-soft" style="font-size:10px">' + prog.done.length + '/' + prog.total.length + ' topics</span>' +
            '<button class="mini-btn" style="font-size:11px" data-company-id="' + company.id + '">Details →</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    grid.querySelectorAll('[data-company-id]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(s, btn.dataset.companyId); });
    });
  }

  function openModal(s, companyId) {
    var company = window.SHIBI_COMPANIES && SHIBI_COMPANIES.find(function (c) { return c.id === companyId; });
    if (!company) return;

    var modal     = document.getElementById('companyModal');
    var modalBody = document.getElementById('companyModalBody');
    if (!modal || !modalBody) return;

    var prog = getCompanyProgress(s, company);
    var col  = company.color || 'var(--accent)';

    var allTopics = [
      { section: 'Aptitude', items: company.topics.aptitude },
      { section: 'Coding', items: company.topics.coding },
      { section: 'Technical', items: company.topics.technical }
    ];

    var checklistHtml = allTopics.map(function (group) {
      return '<h6 style="color:' + col + ';font-family:var(--font-display);font-size:13px;margin:12px 0 6px">' + group.section + '</h6>' +
        '<div class="check-list">' +
        group.items.map(function (item) {
          var done = prog.done.includes(item);
          return '<li class="' + (done ? 'checked' : '') + '" data-company="' + company.id + '" data-topic="' + item + '" style="cursor:pointer">' +
            '<span class="check-box">' + (done ? '✓' : '') + '</span>' +
            '<span>' + SHIBI.Utils.escapeHtml(item) + '</span>' +
          '</li>';
        }).join('') +
        '</div>';
    }).join('');

    var roundsHtml = company.pattern.rounds.map(function (r, i) {
      return '<div class="company-round-badge"><span class="round-num">' + (i+1) + '</span><span>' + r + '</span></div>';
    }).join('<div class="round-arrow"><i class="bi bi-arrow-right"></i></div>');

    var sectionsHtml = company.pattern.sections.map(function (sec) {
      return '<div class="company-section-row">' +
        '<span>' + sec.name + '</span>' +
        (sec.qs ? '<span class="badge-soft">' + sec.qs + ' Qs</span>' : '') +
        (sec.time ? '<span class="badge-soft">' + sec.time + ' min</span>' : '') +
      '</div>';
    }).join('');

    modalBody.innerHTML =
      '<div class="company-modal-header" style="border-color:' + col + '">' +
        '<div style="display:flex;align-items:center;gap:14px">' +
          '<i class="bi ' + company.icon + '" style="font-size:36px;color:' + col + '"></i>' +
          '<div><h4 style="font-family:var(--font-display);color:' + col + ';margin:0">' + company.name + '</h4><p style="margin:0;color:var(--text-mute);font-family:var(--font-mono);font-size:12px">' + company.fullName + '</p></div>' +
        '</div>' +
        '<div>' + progressRingHtml(prog.pct, 80, col) + '</div>' +
      '</div>' +

      '<div class="row g-3 mt-1">' +
        '<div class="col-md-6">' +
          '<div class="panel glass"><div class="panel-head"><h3>Eligibility</h3></div>' +
            '<ul class="resource-list">' +
              '<li>CGPA: ' + company.eligibility.cgpa + '</li>' +
              '<li>Backlogs: ' + company.eligibility.backlogs + '</li>' +
              '<li>Gap: ' + company.eligibility.gap + '</li>' +
            '</ul>' +
            '<div class="iq-tip mt-2"><i class="bi bi-info-circle"></i> ' + company.noteOnEligibility + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
          '<div class="panel glass"><div class="panel-head"><h3>Selection Process</h3></div>' +
            '<div class="company-rounds">' + roundsHtml + '</div>' +
            '<div class="company-sections mt-2">' + sectionsHtml + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="row g-3 mt-1">' +
        '<div class="col-md-6">' +
          '<div class="panel glass"><div class="panel-head"><h3>Topic Checklist</h3><span class="badge-soft">' + prog.done.length + '/' + prog.total.length + '</span></div>' +
            checklistHtml +
          '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
          '<div class="panel glass"><div class="panel-head"><h3><i class="bi bi-lightbulb-fill"></i> Tips</h3></div>' +
            '<ul class="resource-list">' + company.tips.map(function (t) { return '<li>' + SHIBI.Utils.escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
          '</div>' +
        '</div>' +
      '</div>';

    // checklist listeners
    modalBody.querySelectorAll('[data-company][data-topic]').forEach(function (li) {
      li.addEventListener('click', function () {
        var cId   = li.dataset.company;
        var topic = li.dataset.topic;
        if (!s.companyProgress) s.companyProgress = {};
        if (!s.companyProgress[cId]) s.companyProgress[cId] = { topicsDone: [] };
        var arr = s.companyProgress[cId].topicsDone;
        var idx = arr.indexOf(topic);
        if (idx > -1) { arr.splice(idx, 1); }
        else { arr.push(topic); SHIBI.Gamify.addXP(s, 5, 'Company topic done'); }
        SHIBI.State.save(s);
        renderGrid(s);
        openModal(s, cId);
      });
    });

    var bsModal = bootstrap.Modal.getOrCreateInstance(modal);
    bsModal.show();
  }

  function init(s) {
    renderGrid(s);
  }

  return { init, renderGrid };
})();
