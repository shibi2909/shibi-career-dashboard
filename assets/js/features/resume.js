/* features/resume.js — Feature 9: Resume Builder with live preview */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Resume = (function () {

  function completeness(s) {
    var r = s.resume || {};
    var filled = 0, total = 8;
    if (r.name) filled++;
    if (r.email) filled++;
    if (r.summary && r.summary.length > 20) filled++;
    if (r.education && r.education.length > 0) filled++;
    if (r.skills && r.skills.length > 2) filled++;
    if (r.projects && r.projects.length > 0) filled++;
    if (r.certifications && r.certifications.length > 0) filled++;
    if (r.github || r.linkedin) filled++;
    return Math.round((filled / total) * 100);
  }

  function autoFillFromState(s) {
    // Suggest skills from completed trackers
    if (!s.resume) return;
    var suggested = [];
    if (s.trackers && s.trackers.java && s.trackers.java.completed.length > 3) suggested.push('Java');
    if (s.trackers && s.trackers.dsa  && s.trackers.dsa.completed.length > 3)  suggested.push('Data Structures & Algorithms');
    if (s.trackers && s.trackers.web  && s.trackers.web.completed.length > 2)  suggested.push('HTML', 'CSS', 'JavaScript');
    if (s.trackers && s.trackers.cyber && s.trackers.cyber.completed.length > 3) suggested.push('Cybersecurity Fundamentals', 'Linux');
    if (s.trackers && s.trackers.networking && s.trackers.networking.completed.length > 2) suggested.push('Networking (TCP/IP, OSI)');
    if (s.miniProjects > 0) suggested.push('Bootstrap', 'Web Development');
    // only add suggestions not already in skills
    var existing = s.resume.skills || [];
    var toAdd = suggested.filter(function (sk) { return !existing.includes(sk); });
    if (toAdd.length > 0) {
      s.resume.skills = existing.concat(toAdd);
      SHIBI.State.save(s);
      SHIBI.Utils.toast('Skills auto-filled from your tracker progress!');
    }
  }

  function render(s) {
    var container = document.getElementById('resumeBuilder');
    if (!container) return;
    if (!s.resume) s.resume = SHIBI.State.defaultState().resume;
    var r = s.resume;
    // Guard: skills must be an array (old saves may have stored it as an object)
    if (!Array.isArray(r.skills)) r.skills = [];
    var pct = completeness(s);

    container.innerHTML =
      '<div class="resume-builder-layout">' +
        // left form panel
        '<div class="resume-form-panel">' +
          '<div class="panel glass mb-3">' +
            '<div class="panel-head"><h3>Resume Completeness</h3><span class="badge-soft">' + pct + '%</span></div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
            '<div class="d-flex gap-2 mt-2 flex-wrap">' +
              '<button class="mini-btn" id="resumeAutoFillBtn"><i class="bi bi-magic"></i> Auto-fill Skills</button>' +
              '<button class="mini-btn" id="resumeExportBtn"><i class="bi bi-download"></i> Export JSON</button>' +
              '<button class="mini-btn" id="resumeImportBtn"><i class="bi bi-upload"></i> Import JSON</button>' +
              '<input type="file" id="resumeImportFile" accept=".json" style="display:none" />' +
              '<button class="mini-btn primary" onclick="window.print()"><i class="bi bi-printer"></i> Print / Save PDF</button>' +
            '</div>' +
          '</div>' +

          // personal info
          formSection('Personal Info', [
            formRow('Full Name', 'resume-name', r.name || '', 'text', 'e.g. SHIBI Dilshana'),
            formRow('Email', 'resume-email', r.email || '', 'email', 'e.g. shibi@email.com'),
            formRow('Phone', 'resume-phone', r.phone || '', 'tel', 'e.g. +91 9876543210'),
            formRow('GitHub', 'resume-github', r.github || '', 'url', 'https://github.com/yourhandle'),
            formRow('LinkedIn', 'resume-linkedin', r.linkedin || '', 'url', 'https://linkedin.com/in/yourhandle'),
            formTextarea('Professional Summary', 'resume-summary', r.summary || '', 'Brief overview of your skills and goals...')
          ]) +

          // education
          '<div class="panel glass mb-3">' +
            '<div class="panel-head"><h3>Education</h3><button class="mini-btn" id="addEduBtn"><i class="bi bi-plus"></i> Add</button></div>' +
            '<div id="eduList">' + (r.education || []).map(function (e, i) { return eduRow(e, i); }).join('') + '</div>' +
          '</div>' +

          // skills (tag-input chip UI)
          '<div class="panel glass mb-3">' +
            '<div class="panel-head"><h3>Technical Skills</h3></div>' +
            '<div class="tag-input-wrap" id="skillChipsWrap">' +
              (r.skills || []).map(function (sk) {
                return '<span class="skill-chip">' + SHIBI.Utils.escapeHtml(sk) +
                  '<span class="remove" data-skill="' + SHIBI.Utils.escapeAttr(sk) + '" title="Remove">×</span></span>';
              }).join('') +
              '<input id="skillTagInput" class="skill-tag-input" type="text" placeholder="Type skill + Enter..." />' +
            '</div>' +
            '<small class="text-muted-soft">Press Enter or comma to add a skill. Click × to remove.</small>' +
          '</div>' +

          // projects
          '<div class="panel glass mb-3">' +
            '<div class="panel-head"><h3>Projects</h3><button class="mini-btn" id="addProjectBtn"><i class="bi bi-plus"></i> Add</button></div>' +
            '<div id="projectList">' + (r.projects || []).map(function (p, i) { return projectRow(p, i); }).join('') + '</div>' +
          '</div>' +

          // certifications
          '<div class="panel glass mb-3">' +
            '<div class="panel-head"><h3>Certifications</h3><button class="mini-btn" id="addCertBtn"><i class="bi bi-plus"></i> Add</button></div>' +
            '<div id="certList">' + (r.certifications || []).map(function (c, i) { return certRow(c, i); }).join('') + '</div>' +
          '</div>' +
        '</div>' +

        // right preview panel
        '<div class="resume-preview-panel">' +
          '<div class="panel-head" style="margin-bottom:10px"><h3><i class="bi bi-file-earmark-person"></i> Live Preview</h3><span class="badge-soft">A4 format</span></div>' +
          '<div id="resume-preview">' + buildPreview(r) + '</div>' +
        '</div>' +
      '</div>';

    attachFormListeners(s);
  }

  function formSection(title, fields) {
    return '<div class="panel glass mb-3"><div class="panel-head"><h3>' + title + '</h3></div>' + fields.join('') + '</div>';
  }

  function formRow(label, id, value, type, placeholder) {
    return '<div class="mb-2">' +
      '<label style="font-family:var(--font-mono);font-size:11px;color:var(--text-mute)">' + label + '</label>' +
      '<input type="' + type + '" id="' + id + '" value="' + SHIBI.Utils.escapeHtml(value) + '" placeholder="' + placeholder + '" class="resume-input w-100" style="background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:8px 12px;border-radius:6px;font-family:var(--font-mono);font-size:12px;outline:none;width:100%;box-sizing:border-box" />' +
    '</div>';
  }

  function formTextarea(label, id, value, placeholder) {
    return '<div class="mb-2">' +
      '<label style="font-family:var(--font-mono);font-size:11px;color:var(--text-mute)">' + label + '</label>' +
      '<textarea id="' + id + '" rows="3" placeholder="' + placeholder + '" style="width:100%;background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:8px 12px;border-radius:6px;font-family:var(--font-mono);font-size:12px;resize:vertical;outline:none">' + SHIBI.Utils.escapeHtml(value) + '</textarea>' +
    '</div>';
  }

  function eduRow(e, i) {
    return '<div class="resume-row-item" data-idx="' + i + '">' +
      '<div class="resume-row-fields">' +
        '<input placeholder="Degree/Course" value="' + SHIBI.Utils.escapeHtml(e.degree||'') + '" class="edu-degree resume-mini-input" data-idx="' + i + '" />' +
        '<input placeholder="Institution" value="' + SHIBI.Utils.escapeHtml(e.institution||'') + '" class="edu-inst resume-mini-input" data-idx="' + i + '" />' +
        '<input placeholder="Year" value="' + SHIBI.Utils.escapeHtml(e.year||'') + '" class="edu-year resume-mini-input" style="width:80px" data-idx="' + i + '" />' +
        '<input placeholder="CGPA/%" value="' + SHIBI.Utils.escapeHtml(e.cgpa||'') + '" class="edu-cgpa resume-mini-input" style="width:80px" data-idx="' + i + '" />' +
      '</div>' +
      '<button class="mini-btn outline resume-remove-btn" data-type="edu" data-idx="' + i + '">×</button>' +
    '</div>';
  }

  function projectRow(p, i) {
    return '<div class="resume-row-item" data-idx="' + i + '">' +
      '<div class="resume-row-fields">' +
        '<input placeholder="Project Name" value="' + SHIBI.Utils.escapeHtml(p.name||'') + '" class="proj-name resume-mini-input" data-idx="' + i + '" />' +
        '<input placeholder="Tech Stack" value="' + SHIBI.Utils.escapeHtml(p.tech||'') + '" class="proj-tech resume-mini-input" data-idx="' + i + '" />' +
        '<input placeholder="Link (optional)" value="' + SHIBI.Utils.escapeHtml(p.link||'') + '" class="proj-link resume-mini-input" data-idx="' + i + '" />' +
      '</div>' +
      '<textarea placeholder="Description (1-2 lines)" class="proj-desc resume-mini-input" style="width:100%;min-height:44px;resize:vertical" data-idx="' + i + '">' + SHIBI.Utils.escapeHtml(p.description||'') + '</textarea>' +
      '<button class="mini-btn outline resume-remove-btn" data-type="proj" data-idx="' + i + '">×</button>' +
    '</div>';
  }

  function certRow(c, i) {
    return '<div class="resume-row-item" data-idx="' + i + '">' +
      '<div class="resume-row-fields">' +
        '<input placeholder="Certification Name" value="' + SHIBI.Utils.escapeHtml(c.name||'') + '" class="cert-name resume-mini-input" data-idx="' + i + '" />' +
        '<input placeholder="Issuer" value="' + SHIBI.Utils.escapeHtml(c.issuer||'') + '" class="cert-issuer resume-mini-input" data-idx="' + i + '" />' +
        '<input placeholder="Year" value="' + SHIBI.Utils.escapeHtml(c.year||'') + '" class="cert-year resume-mini-input" style="width:80px" data-idx="' + i + '" />' +
      '</div>' +
      '<button class="mini-btn outline resume-remove-btn" data-type="cert" data-idx="' + i + '">×</button>' +
    '</div>';
  }

  function buildPreview(r) {
    var skillsStr = r.skills && r.skills.length > 0 ? r.skills.join(' · ') : '';
    return '<div id="resume-preview-inner">' +
      '<div class="rp-header">' +
        '<h1 class="rp-name">' + (r.name || 'Your Name') + '</h1>' +
        '<div class="rp-contact">' +
          (r.email ? '<span>' + r.email + '</span>' : '') +
          (r.phone ? '<span>' + r.phone + '</span>' : '') +
          (r.github ? '<span>' + r.github + '</span>' : '') +
          (r.linkedin ? '<span>' + r.linkedin + '</span>' : '') +
        '</div>' +
      '</div>' +
      (r.summary ? '<div class="rp-section"><div class="rp-section-title">PROFESSIONAL SUMMARY</div><p class="rp-summary">' + SHIBI.Utils.escapeHtml(r.summary) + '</p></div>' : '') +
      (r.skills && r.skills.length > 0 ? '<div class="rp-section"><div class="rp-section-title">TECHNICAL SKILLS</div><p class="rp-skills">' + SHIBI.Utils.escapeHtml(skillsStr) + '</p></div>' : '') +
      (r.education && r.education.length > 0 ? '<div class="rp-section"><div class="rp-section-title">EDUCATION</div>' +
        r.education.map(function (e) {
          return '<div class="rp-item"><div class="rp-item-head"><strong>' + (e.degree||'') + '</strong><span class="rp-item-date">' + (e.year||'') + '</span></div><div class="rp-item-sub">' + (e.institution||'') + (e.cgpa ? ' · ' + e.cgpa : '') + '</div></div>';
        }).join('') + '</div>' : '') +
      (r.projects && r.projects.length > 0 ? '<div class="rp-section"><div class="rp-section-title">PROJECTS</div>' +
        r.projects.map(function (p) {
          return '<div class="rp-item"><div class="rp-item-head"><strong>' + (p.name||'') + '</strong>' + (p.tech ? '<span class="rp-item-tech">' + p.tech + '</span>' : '') + '</div>' + (p.description ? '<p class="rp-item-desc">' + SHIBI.Utils.escapeHtml(p.description) + '</p>' : '') + '</div>';
        }).join('') + '</div>' : '') +
      (r.certifications && r.certifications.length > 0 ? '<div class="rp-section"><div class="rp-section-title">CERTIFICATIONS</div>' +
        r.certifications.map(function (c) {
          return '<div class="rp-item"><div class="rp-item-head"><strong>' + (c.name||'') + '</strong><span class="rp-item-date">' + (c.year||'') + '</span></div><div class="rp-item-sub">' + (c.issuer||'') + '</div></div>';
        }).join('') + '</div>' : '') +
    '</div>';
  }

  function updatePreview(s) {
    var el = document.getElementById('resume-preview');
    if (el) el.innerHTML = buildPreview(s.resume || {});
  }

  function attachFormListeners(s) {
    var r = s.resume;

    // simple text inputs
    var simpleFields = {
      'resume-name': 'name', 'resume-email': 'email', 'resume-phone': 'phone',
      'resume-github': 'github', 'resume-linkedin': 'linkedin', 'resume-summary': 'summary'
    };
    Object.keys(simpleFields).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () {
        r[simpleFields[id]] = el.value;
        SHIBI.State.save(s);
        updatePreview(s);
      });
    });

    // skills — tag-input chip handling
    var skillWrap  = document.getElementById('skillChipsWrap');
    var skillInput = document.getElementById('skillTagInput');

    function addSkillChip(val) {
      var sk = val.trim().replace(/,$/, '');
      if (!sk || (r.skills || []).includes(sk)) return;
      if (!r.skills) r.skills = [];
      r.skills.push(sk);
      SHIBI.State.save(s);
      render(s);
    }

    if (skillInput) {
      skillInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          addSkillChip(skillInput.value);
        }
      });
      skillInput.addEventListener('blur', function () {
        if (skillInput.value.trim()) addSkillChip(skillInput.value);
      });
    }

    if (skillWrap) {
      skillWrap.addEventListener('click', function (e) {
        var rem = e.target.closest('.remove');
        if (!rem) return;
        var sk = rem.dataset.skill;
        r.skills = (r.skills || []).filter(function (x) { return x !== sk; });
        SHIBI.State.save(s);
        render(s);
      });
    }

    // add education
    var addEdu = document.getElementById('addEduBtn');
    if (addEdu) addEdu.addEventListener('click', function () {
      if (!r.education) r.education = [];
      r.education.push({ degree: '', institution: '', year: '', cgpa: '' });
      SHIBI.State.save(s);
      render(s);
    });

    // add project
    var addProj = document.getElementById('addProjectBtn');
    if (addProj) addProj.addEventListener('click', function () {
      if (!r.projects) r.projects = [];
      r.projects.push({ name: '', tech: '', description: '', link: '' });
      SHIBI.State.save(s);
      render(s);
    });

    // add cert
    var addCert = document.getElementById('addCertBtn');
    if (addCert) addCert.addEventListener('click', function () {
      if (!r.certifications) r.certifications = [];
      r.certifications.push({ name: '', issuer: '', year: '' });
      SHIBI.State.save(s);
      render(s);
    });

    // inline field changes
    function wireInlineFields(selector, arrKey, fieldClass, fieldProp) {
      document.querySelectorAll(selector).forEach(function (inp) {
        inp.style.cssText = 'background:var(--bg-elev);border:1px solid var(--border-soft);color:var(--text);padding:6px 10px;border-radius:6px;font-family:var(--font-mono);font-size:12px;outline:none;flex:1;min-width:80px';
        inp.addEventListener('input', function () {
          var idx = parseInt(inp.dataset.idx);
          if (r[arrKey] && r[arrKey][idx] !== undefined) {
            r[arrKey][idx][fieldProp] = inp.value;
            SHIBI.State.save(s);
            updatePreview(s);
          }
        });
      });
    }
    wireInlineFields('.edu-degree', 'education', null, 'degree');
    wireInlineFields('.edu-inst',   'education', null, 'institution');
    wireInlineFields('.edu-year',   'education', null, 'year');
    wireInlineFields('.edu-cgpa',   'education', null, 'cgpa');
    wireInlineFields('.proj-name',  'projects',  null, 'name');
    wireInlineFields('.proj-tech',  'projects',  null, 'tech');
    wireInlineFields('.proj-link',  'projects',  null, 'link');
    wireInlineFields('.proj-desc',  'projects',  null, 'description');
    wireInlineFields('.cert-name',  'certifications', null, 'name');
    wireInlineFields('.cert-issuer','certifications', null, 'issuer');
    wireInlineFields('.cert-year',  'certifications', null, 'year');

    // remove buttons
    document.querySelectorAll('.resume-remove-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.dataset.type;
        var idx  = parseInt(btn.dataset.idx);
        var keyMap = { edu: 'education', proj: 'projects', cert: 'certifications' };
        var key = keyMap[type];
        if (key && r[key]) { r[key].splice(idx, 1); SHIBI.State.save(s); render(s); }
      });
    });

    // auto-fill skills
    var afBtn = document.getElementById('resumeAutoFillBtn');
    if (afBtn) afBtn.addEventListener('click', function () { autoFillFromState(s); render(s); });

    // export
    var expBtn = document.getElementById('resumeExportBtn');
    if (expBtn) expBtn.addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'shibi-resume.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });

    // import
    var impBtn = document.getElementById('resumeImportBtn');
    var impFile = document.getElementById('resumeImportFile');
    if (impBtn && impFile) {
      impBtn.addEventListener('click', function () { impFile.click(); });
      impFile.addEventListener('change', function () {
        var file = impFile.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          try {
            var parsed = JSON.parse(e.target.result);
            s.resume = Object.assign(SHIBI.State.defaultState().resume, parsed);
            SHIBI.State.save(s);
            render(s);
            SHIBI.Utils.toast('Resume imported successfully!');
          } catch (ex) {
            SHIBI.Utils.toast('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      });
    }
  }

  function init(s) {
    render(s);
  }

  return { init, render, completeness };
})();
