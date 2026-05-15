/* features/notes.js — Feature 13: Notes Vault */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Notes = (function () {

  var SEED_NOTES = [
    {
      id: 'seed_java_oop',
      title: 'Java OOP Cheat Sheet',
      tags: 'java,oop',
      content: [
        '# Java OOP Cheat Sheet',
        '',
        '## The 4 Pillars',
        '',
        '**Encapsulation** — wrap data + methods in a class; use private fields with public getters/setters.',
        '**Inheritance** — `extends` keyword; child inherits parent fields and methods. Single inheritance only.',
        '**Polymorphism** — same method name, different behavior. Overloading = compile-time. Overriding = run-time.',
        '**Abstraction** — hide implementation details via `abstract` classes or `interface`.',
        '',
        '## Key Keywords',
        '',
        '| Keyword     | Purpose                                          |',
        '|-------------|--------------------------------------------------|',
        '| `final`     | class cannot be extended; method cannot override |',
        '| `static`    | belongs to class, not instance                   |',
        '| `abstract`  | must be overridden; class cannot be instantiated |',
        '| `super`     | calls parent constructor or method               |',
        '| `this`      | refers to the current object instance            |',
        '',
        '## Interface vs Abstract Class',
        '',
        '- **Interface**: all methods are public abstract (pre-Java 8); supports multiple inheritance',
        '- **Abstract class**: can have constructors, concrete methods, protected fields; single inheritance only',
        '',
        '## Common Interview Questions',
        '',
        '- Can we override static methods? **No** — they are hidden, not overridden.',
        '- Can a constructor be private? **Yes** — used in Singleton pattern.',
        '- `==` vs `.equals()`? `==` checks reference; `.equals()` checks value.',
        '- Can an abstract class have a constructor? **Yes** — called via `super()` from subclass.'
      ].join('\n')
    },
    {
      id: 'seed_linux_cmds',
      title: 'Linux Commands Reference',
      tags: 'linux,cyber',
      content: [
        '# Linux Commands Reference',
        '',
        '## File System',
        '',
        '```',
        'ls -la          # list files with hidden + details',
        'pwd             # print working directory',
        'cd /path        # change directory',
        'mkdir -p a/b/c  # make nested directories',
        'cp -r src dst   # copy recursively',
        'mv old new      # move or rename',
        'rm -rf dir      # remove recursively (be careful!)',
        'find / -name "*.log" 2>/dev/null',
        '```',
        '',
        '## Permissions',
        '',
        '```',
        'chmod 755 file  # rwxr-xr-x',
        'chmod +x script.sh',
        'chown user:group file',
        'umask 022       # default creation mask',
        '```',
        '',
        '## Networking',
        '',
        '```',
        'ip a            # show network interfaces',
        'ping host',
        'netstat -tuln   # open ports (older systems)',
        'ss -tuln        # modern replacement for netstat',
        'curl -I url     # fetch HTTP headers only',
        'wget url        # download file',
        'nmap -sV host   # scan services and versions',
        '```',
        '',
        '## Process Management',
        '',
        '```',
        'ps aux          # list all running processes',
        'kill -9 PID     # force kill process by PID',
        'top             # real-time process monitor',
        'htop            # improved top (if installed)',
        'systemctl status nginx',
        'journalctl -u nginx -f',
        '```',
        '',
        '## Text Processing',
        '',
        '```',
        'grep -rn "pattern" /dir',
        'awk \'{print $1}\' file',
        'sed \'s/old/new/g\' file',
        'sort | uniq -c | sort -rn',
        'cut -d: -f1 /etc/passwd',
        '```'
      ].join('\n')
    },
    {
      id: 'seed_osi',
      title: 'OSI Model & Network Protocols',
      tags: 'networking,osi',
      content: [
        '# OSI Model — 7 Layers',
        '',
        '| Layer | Name         | Examples                      | Device        |',
        '|-------|--------------|-------------------------------|---------------|',
        '| 7     | Application  | HTTP, HTTPS, FTP, DNS, SMTP   | —             |',
        '| 6     | Presentation | SSL/TLS, JPEG, MPEG           | —             |',
        '| 5     | Session      | NetBIOS, RPC                  | —             |',
        '| 4     | Transport    | TCP, UDP                      | —             |',
        '| 3     | Network      | IP, ICMP, ARP                 | Router        |',
        '| 2     | Data Link    | Ethernet, MAC, PPP            | Switch, Bridge|',
        '| 1     | Physical     | Cables, Fiber, Wi-Fi signals  | Hub, Repeater |',
        '',
        '## TCP vs UDP',
        '',
        '| Feature     | TCP               | UDP                |',
        '|-------------|-------------------|--------------------|',
        '| Connection  | Connection-based  | Connectionless     |',
        '| Reliability | Guaranteed order  | No guarantee       |',
        '| Speed       | Slower            | Faster             |',
        '| Use Cases   | HTTP, SSH, FTP    | DNS, VoIP, Gaming  |',
        '',
        '## TCP 3-Way Handshake',
        '',
        '1. **SYN** — client → server (I want to connect)',
        '2. **SYN-ACK** — server → client (OK, acknowledged)',
        '3. **ACK** — client → server (Connection established)',
        '',
        '## Common Port Numbers',
        '',
        '| Port | Protocol | Notes              |',
        '|------|----------|--------------------|',
        '| 22   | SSH      | Encrypted remote   |',
        '| 23   | Telnet   | Unencrypted remote |',
        '| 25   | SMTP     | Email sending      |',
        '| 53   | DNS      | Name resolution    |',
        '| 80   | HTTP     | Web traffic        |',
        '| 443  | HTTPS    | Secure web         |',
        '| 3306 | MySQL    | Database           |',
        '| 3389 | RDP      | Windows remote     |'
      ].join('\n')
    },
    {
      id: 'seed_owasp',
      title: 'OWASP Top 10 (2021)',
      tags: 'security,owasp,web',
      content: [
        '# OWASP Top 10 — 2021',
        '',
        '## A01 — Broken Access Control',
        'Users access data/functions they should not. Fix: deny by default, enforce least privilege.',
        '',
        '## A02 — Cryptographic Failures',
        'Sensitive data exposed due to weak or missing encryption. Fix: TLS everywhere, bcrypt for passwords, AES-256 for data at rest.',
        '',
        '## A03 — Injection',
        'SQL, OS, LDAP injection via unvalidated input. Fix: parameterized queries, input validation.',
        '',
        '```',
        '-- VULNERABLE',
        'SELECT * FROM users WHERE name=\'" + userInput + "\'',
        '',
        '-- SAFE (parameterized)',
        'SELECT * FROM users WHERE name = ?',
        '```',
        '',
        '## A04 — Insecure Design',
        'Security not considered in design phase. Fix: threat modeling during architecture, secure design patterns.',
        '',
        '## A05 — Security Misconfiguration',
        'Default passwords, verbose error messages, open ports, missing hardening. Fix: security checklists, disable defaults.',
        '',
        '## A06 — Vulnerable Components',
        'Outdated libraries with known CVEs. Fix: OWASP Dependency-Check, update libraries regularly.',
        '',
        '## A07 — Auth & Identification Failures',
        'Weak passwords, no MFA, session fixation. Fix: strong password policies, MFA, secure session management.',
        '',
        '## A08 — Software & Data Integrity Failures',
        'Untrusted plugins, CI/CD pipeline attacks, deserialization issues. Fix: verify signatures, use trusted sources.',
        '',
        '## A09 — Security Logging Failures',
        'Attacks not detected due to poor logging. Fix: log all auth events and anomalies, set up alerts.',
        '',
        '## A10 — Server-Side Request Forgery (SSRF)',
        'Server makes requests to internal systems. Fix: allowlist valid URL destinations, disable unnecessary redirects.'
      ].join('\n')
    },
    {
      id: 'seed_sql_joins',
      title: 'SQL JOINs & Query Reference',
      tags: 'sql,database',
      content: [
        '# SQL JOINs & Query Reference',
        '',
        '## Types of JOINs',
        '',
        '```',
        '-- INNER JOIN: only matching rows from both tables',
        'SELECT e.name, d.dept_name',
        'FROM employees e',
        'INNER JOIN departments d ON e.dept_id = d.id;',
        '',
        '-- LEFT JOIN: all rows from left + matching from right (NULLs for no match)',
        'SELECT e.name, d.dept_name',
        'FROM employees e',
        'LEFT JOIN departments d ON e.dept_id = d.id;',
        '',
        '-- RIGHT JOIN: all rows from right + matching from left',
        'SELECT e.name, d.dept_name',
        'FROM employees e',
        'RIGHT JOIN departments d ON e.dept_id = d.id;',
        '',
        '-- FULL OUTER JOIN: all rows from both tables',
        'SELECT e.name, d.dept_name',
        'FROM employees e',
        'FULL OUTER JOIN departments d ON e.dept_id = d.id;',
        '```',
        '',
        '## Aggregation & GROUP BY',
        '',
        '```',
        'SELECT dept_id, COUNT(*), AVG(salary), MAX(salary)',
        'FROM employees',
        'GROUP BY dept_id',
        'HAVING AVG(salary) > 50000',
        'ORDER BY AVG(salary) DESC;',
        '```',
        '',
        '## Subqueries',
        '',
        '```',
        '-- Scalar: single value comparison',
        'SELECT name, salary FROM employees',
        'WHERE salary > (SELECT AVG(salary) FROM employees);',
        '',
        '-- EXISTS check',
        'SELECT name FROM employees e',
        'WHERE EXISTS (',
        '  SELECT 1 FROM departments d WHERE d.id = e.dept_id',
        ');',
        '```',
        '',
        '## Normalization',
        '',
        '- **1NF**: atomic values, no repeating groups',
        '- **2NF**: 1NF + no partial dependency on composite key',
        '- **3NF**: 2NF + no transitive dependency (non-key depends only on key)',
        '- **BCNF**: 3NF + every determinant is a candidate key'
      ].join('\n')
    }
  ];

  var activeId = null;

  function ensureSeeded(s) {
    if (!s.notesVault || s.notesVault.length === 0) {
      s.notesVault = SEED_NOTES.map(function (n) {
        return { id: n.id, title: n.title, tags: n.tags, content: n.content, updated: Date.now() };
      });
      SHIBI.State.save(s);
    }
  }

  function renderMd(raw) {
    // 1. Extract code blocks to protect them
    var codeBlocks = [];
    var text = raw.replace(/```([\s\S]*?)```/g, function (match, inner) {
      codeBlocks.push(inner.replace(/^\n/, ''));
      return '\x00CODE' + (codeBlocks.length - 1) + '\x00';
    });

    // 2. Escape HTML in non-code portions
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // 3. Markdown transformations
    text = text.replace(/^######\s(.+)$/gm, '<h6>$1</h6>');
    text = text.replace(/^#####\s(.+)$/gm,  '<h5>$1</h5>');
    text = text.replace(/^####\s(.+)$/gm,   '<h4>$1</h4>');
    text = text.replace(/^###\s(.+)$/gm,    '<h3 class="nv-h3">$1</h3>');
    text = text.replace(/^##\s(.+)$/gm,     '<h2 class="nv-h2">$1</h2>');
    text = text.replace(/^#\s(.+)$/gm,      '<h1 class="nv-h1">$1</h1>');
    text = text.replace(/\*\*(.+?)\*\*/g,   '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g,       '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code class="nv-inline-code">$1</code>');
    text = text.replace(/^---+$/gm,         '<hr class="nv-hr" />');

    // Tables: detect | rows
    text = text.replace(/^\|(.+)\|\s*$/gm, function (match, inner) {
      if (/^[\s\-:|]+$/.test(inner)) return '';
      var cells = inner.split('|').map(function (c) { return '<td>' + c.trim() + '</td>'; }).join('');
      return '<tr>' + cells + '</tr>';
    });
    // Wrap consecutive <tr> in a table
    text = text.replace(/(<tr>[\s\S]*?<\/tr>(\s*<tr>[\s\S]*?<\/tr>)*)/g, function (block) {
      // First <tr> becomes thead, rest are tbody
      var rows = block.match(/<tr>[\s\S]*?<\/tr>/g) || [];
      if (rows.length === 0) return block;
      var head = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      var body = rows.slice(1).join('');
      return '<table class="nv-table"><thead>' + head + '</thead>' +
             (body ? '<tbody>' + body + '</tbody>' : '') + '</table>';
    });

    // Line breaks
    text = text.replace(/\n/g, '<br />');

    // 4. Restore code blocks
    text = text.replace(/\x00CODE(\d+)\x00/g, function (match, idx) {
      var code = codeBlocks[parseInt(idx, 10)];
      var escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return '<pre class="nv-code"><code>' + escaped + '</code></pre>';
    });

    return text;
  }

  function render(s) {
    ensureSeeded(s);
    var container = document.getElementById('notesContent');
    if (!container) return;

    var notes = s.notesVault || [];
    if (!activeId && notes.length > 0) activeId = notes[0].id;
    var activeNote = notes.find(function (n) { return n.id === activeId; }) || notes[0] || null;

    container.innerHTML =
      '<div class="nv-layout">' +

      // List panel
      '<div class="nv-list">' +
        '<div class="nv-list-head">' +
          '<span>Notes (' + notes.length + ')</span>' +
          '<button class="mini-btn" id="nvNewBtn"><i class="bi bi-plus"></i> New</button>' +
        '</div>' +
        notes.map(function (n) {
          var cls = 'nv-list-item' + (n.id === activeId ? ' active' : '');
          var tags = (n.tags || '').split(',').filter(Boolean).map(function (t) {
            return '<span class="nv-tag">' + SHIBI.Utils.escapeHtml(t.trim()) + '</span>';
          }).join('');
          return '<div class="' + cls + '" data-note-id="' + n.id + '">' +
            '<div class="nv-item-title">' + SHIBI.Utils.escapeHtml(n.title || 'Untitled') + '</div>' +
            '<div class="nv-item-tags">' + tags + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      // Editor panel
      '<div class="nv-editor">' +
        (activeNote
          ? '<div class="nv-editor-toolbar">' +
              '<input class="nv-title-input" id="nvTitleInput" value="' +
                SHIBI.Utils.escapeAttr(activeNote.title || '') + '" placeholder="Note title..." />' +
              '<input class="nv-tags-input" id="nvTagsInput" value="' +
                SHIBI.Utils.escapeAttr(activeNote.tags || '') + '" placeholder="Tags (comma-separated)..." />' +
              '<button class="mini-btn outline danger-btn" id="nvDeleteBtn" title="Delete note"><i class="bi bi-trash3"></i></button>' +
            '</div>' +
            '<textarea class="nv-textarea" id="nvTextarea" placeholder="Write in Markdown...">' +
              SHIBI.Utils.escapeHtml(activeNote.content || '') + '</textarea>'
          : '<div class="nv-empty-editor">Select a note or create a new one.</div>') +
      '</div>' +

      // Preview panel
      '<div class="nv-preview">' +
        '<div class="nv-preview-head"><i class="bi bi-eye"></i> Preview</div>' +
        '<div class="nv-preview-body" id="nvPreview">' +
          (activeNote ? renderMd(activeNote.content || '') : '<p class="text-muted-soft">Nothing to preview.</p>') +
        '</div>' +
      '</div>' +

    '</div>';

    // Note list clicks
    container.querySelectorAll('.nv-list-item').forEach(function (item) {
      item.addEventListener('click', function () {
        activeId = item.dataset.noteId;
        render(s);
      });
    });

    // New note
    var newBtn = document.getElementById('nvNewBtn');
    if (newBtn) {
      newBtn.addEventListener('click', function () {
        var note = { id: 'note_' + Date.now(), title: 'New Note', tags: '', content: '', updated: Date.now() };
        s.notesVault.push(note);
        activeId = note.id;
        SHIBI.State.save(s);
        render(s);
      });
    }

    // Delete note
    var delBtn = document.getElementById('nvDeleteBtn');
    if (delBtn && activeNote) {
      delBtn.addEventListener('click', function () {
        if (!confirm('Delete "' + activeNote.title + '"?')) return;
        s.notesVault = s.notesVault.filter(function (n) { return n.id !== activeId; });
        activeId = s.notesVault.length > 0 ? s.notesVault[0].id : null;
        SHIBI.State.save(s);
        render(s);
        SHIBI.Utils.toast('Note deleted.');
      });
    }

    // Auto-save with debounce + live preview
    var textarea   = document.getElementById('nvTextarea');
    var titleInput = document.getElementById('nvTitleInput');
    var tagsInput  = document.getElementById('nvTagsInput');
    var saveTimer  = null;

    function persist() {
      if (!activeNote) return;
      if (titleInput) activeNote.title   = titleInput.value;
      if (tagsInput)  activeNote.tags    = tagsInput.value;
      if (textarea)   activeNote.content = textarea.value;
      activeNote.updated = Date.now();
      SHIBI.State.save(s);
      // Refresh note list title (without full re-render)
      var li = container.querySelector('.nv-list-item.active .nv-item-title');
      if (li && titleInput) li.textContent = titleInput.value || 'Untitled';
    }

    function updatePreview() {
      var preview = document.getElementById('nvPreview');
      if (preview && textarea) preview.innerHTML = renderMd(textarea.value);
    }

    if (textarea) {
      textarea.addEventListener('input', function () {
        updatePreview();
        clearTimeout(saveTimer);
        saveTimer = setTimeout(persist, 700);
      });
    }
    if (titleInput) titleInput.addEventListener('input', function () { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 700); });
    if (tagsInput)  tagsInput.addEventListener('input', function () { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 700); });
  }

  function init(s) {
    ensureSeeded(s);
    render(s);
  }

  return { init, render };
})();
