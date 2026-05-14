/* ==========================================================
   script.js  —  SHIBI.OS Dashboard
   All logic for: trackers, planner, analytics, pomodoro,
   badges, github tracker, settings.
   Persistence: localStorage (key prefix "shibi.").
   ========================================================== */

/* ---------- 1. CONSTANTS / DATA ---------- */
const STORAGE_KEY = 'shibi.dashboard.v1';

// Default topic lists for each tracker
const TRACKER_DEFS = {
  java: {
    label: 'Java',
    topics: [
      'Basics', 'OOP', 'Collections', 'Exception Handling',
      'JDBC', 'File Handling', 'Multithreading'
    ]
  },
  dsa: {
    label: 'DSA',
    topics: [
      'Arrays', 'Strings', 'Linked Lists', 'Stack',
      'Queue', 'Trees', 'Graphs'
    ]
  },
  cyber: {
    label: 'Cybersecurity',
    topics: [
      'Linux', 'Networking', 'Nmap', 'Wireshark', 'Burp Suite',
      'SOC concepts', 'SIEM basics', 'OWASP Top 10', 'TryHackMe labs'
    ]
  },
  aptitude: {
    label: 'Aptitude',
    topics: [
      'Percentages', 'Ratio', 'Probability',
      'Time & Work', 'Logical reasoning', 'Quantitative aptitude'
    ]
  },
  web: {
    label: 'Web Dev',
    topics: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'ReactJS basics']
  }
};

const QUOTES = [
  "Code is like humor. When you have to explain it, it's bad. — Cory House",
  "First, solve the problem. Then, write the code. — John Johnson",
  "The expert in anything was once a beginner.",
  "Discipline is choosing between what you want now and what you want most.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Hackers don't break in. They log in.",
  "Stay paranoid. Stay curious. Stay coding.",
  "Hard skills get the interview. Soft skills get the offer.",
  "Every bug you fix is one you'll never write again."
];

const WEEKLY_CHALLENGES = [
  "Solve 15 LeetCode problems across Easy / Medium / Hard.",
  "Complete one TryHackMe room and write a short writeup.",
  "Build a mini Java project: a CLI to-do list with file persistence.",
  "Finish the React fundamentals playlist and build a single-page app.",
  "Read OWASP Top 10 — write a 1-page summary in your own words.",
  "Practice 50 aptitude questions with timed mock sessions.",
  "Set up Linux on a VM and learn 30 shell commands."
];

const BADGES = [
  { id:'first_step',  icon:'bi-rocket-takeoff-fill', name:'FIRST STEP',     desc:'Complete your first topic',     check: s => totalCompleted(s) >= 1 },
  { id:'streak_3',    icon:'bi-fire',                name:'STREAK · 3',     desc:'Study 3 days in a row',         check: s => s.streak >= 3 },
  { id:'streak_7',    icon:'bi-fire',                name:'STREAK · 7',     desc:'Study 7 days in a row',         check: s => s.streak >= 7 },
  { id:'java_master', icon:'bi-cup-hot-fill',        name:'JAVA MASTER',    desc:'Finish all Java topics',         check: s => trackerPct(s,'java') >= 100 },
  { id:'dsa_50',      icon:'bi-diagram-3-fill',      name:'DSA · 50',       desc:'Solve 50 DSA problems',          check: s => s.dsaSolved >= 50 },
  { id:'cyber_warr',  icon:'bi-shield-lock-fill',    name:'CYBER WARRIOR',  desc:'Finish all cybersec topics',     check: s => trackerPct(s,'cyber') >= 100 },
  { id:'task_10',     icon:'bi-check2-all',          name:'TASKMASTER',     desc:'Complete 10 tasks',              check: s => s.tasks.filter(t=>t.done).length >= 10 },
  { id:'pomo_5',      icon:'bi-stopwatch-fill',      name:'FOCUSED · 5',    desc:'Complete 5 pomodoro sessions',   check: s => s.pomoTotal >= 5 },
  { id:'all_rounder', icon:'bi-stars',               name:'ALL-ROUNDER',    desc:'50%+ in every tracker',          check: s => allTrackers().every(k => trackerPct(s,k) >= 50) }
];

/* ---------- 2. STATE & PERSISTENCE ---------- */
function defaultState() {
  return {
    streak: 0,
    lastActiveDate: null,
    hoursToday: 0,
    hoursDate: todayStr(),
    weeklyHours: [0,0,0,0,0,0,0],   // Mon..Sun
    weeklyHoursDate: weekStartStr(),

    trackers: {
      java:     { completed: [] },
      dsa:      { completed: [] },
      cyber:    { completed: [] },
      aptitude: { completed: [] },
      web:      { completed: [] }
    },

    dsaSolved: 0,
    dsaToday: 0,
    dsaTodayDate: todayStr(),
    dsaStreak: 0,

    thmLabs: 0,
    miniProjects: 0,

    aptWeek: 0,
    aptWeekDate: weekStartStr(),

    tasks: [],     // {id, text, prio, done}
    goals: [],     // {id, text, done}
    notes: '',
    repos: [],     // {id, name, url}

    pomoToday: 0,
    pomoTodayDate: todayStr(),
    pomoTotal: 0,

    earnedBadges: [],

    settings: {
      accent: '#00ffd0',
      matrix: true,
      particles: true,
      light: false
    }
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // merge with defaults (so new fields don't break old saves)
    return Object.assign(defaultState(), parsed);
  } catch (e) {
    console.warn('Bad save data, resetting.', e);
    return defaultState();
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- 3. DATE HELPERS ---------- */
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);   // YYYY-MM-DD
}
function weekStartStr() {
  const d = new Date();
  const day = (d.getDay() + 6) % 7;      // Mon = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
function dayOfWeekIdx() {
  return (new Date().getDay() + 6) % 7;  // Mon = 0 ... Sun = 6
}

/* ---------- 4. DAILY RESET LOGIC ---------- */
function dailyReset() {
  const today = todayStr();
  const week  = weekStartStr();

  // hours today reset + streak handling
  if (state.hoursDate !== today) {
    // if user studied yesterday, keep streak. else reset.
    if (state.lastActiveDate) {
      const lastDate = new Date(state.lastActiveDate);
      const diffDays = Math.round((new Date(today) - lastDate) / 86400000);
      if (diffDays > 1) state.streak = 0;
    }
    state.hoursToday = 0;
    state.hoursDate = today;
  }
  // DSA today reset
  if (state.dsaTodayDate !== today) {
    if (state.dsaToday === 0 && state.lastActiveDate) {
      const lastDate = new Date(state.dsaTodayDate);
      const diffDays = Math.round((new Date(today) - lastDate) / 86400000);
      if (diffDays > 1) state.dsaStreak = 0;
    }
    state.dsaToday = 0;
    state.dsaTodayDate = today;
  }
  // pomodoro today reset
  if (state.pomoTodayDate !== today) {
    state.pomoToday = 0;
    state.pomoTodayDate = today;
  }
  // weekly hours reset
  if (state.weeklyHoursDate !== week) {
    state.weeklyHours = [0,0,0,0,0,0,0];
    state.weeklyHoursDate = week;
  }
  // weekly aptitude reset
  if (state.aptWeekDate !== week) {
    state.aptWeek = 0;
    state.aptWeekDate = week;
  }
  saveState();
}

/* ---------- 5. CALCULATIONS ---------- */
function allTrackers() { return Object.keys(TRACKER_DEFS); }

function trackerPct(s, key) {
  const total = TRACKER_DEFS[key].topics.length;
  const done  = s.trackers[key].completed.length;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
function totalCompleted(s) {
  return allTrackers().reduce((acc, k) => acc + s.trackers[k].completed.length, 0);
}
function totalPossible() {
  return allTrackers().reduce((acc, k) => acc + TRACKER_DEFS[k].topics.length, 0);
}
function overallPct() {
  const t = totalPossible();
  return t === 0 ? 0 : Math.round((totalCompleted(state) / t) * 100);
}

/* ---------- 6. SIDEBAR NAV / SECTIONS ---------- */
function showSection(id) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  const link = document.querySelector(`.nav-link[data-section="${id}"]`);
  if (link) link.classList.add('active');

  // close mobile sidebar on selection
  document.getElementById('sidebar')?.classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // refresh charts when entering analytics (chart.js needs a redraw)
  if (id === 'section-analytics') setTimeout(buildCharts, 60);
}

function initNav() {
  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', e => {
      const id = el.dataset.section;
      if (id) {
        e.preventDefault();
        showSection(id);
      }
    });
  });

  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

/* ---------- 7. RENDER: HOME / KPI ---------- */
function renderHome() {
  // date label
  const d = new Date();
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  document.getElementById('todayDate').textContent =
    `// ${d.toLocaleDateString(undefined, opts)}`;

  // quote (rotates by day)
  const qIdx = (d.getDate() + d.getMonth()) % QUOTES.length;
  document.getElementById('dailyQuote').textContent = QUOTES[qIdx];

  // KPIs
  document.getElementById('kpiStreak').textContent   = state.streak;
  document.getElementById('kpiProgress').textContent = overallPct() + '%';
  document.getElementById('kpiHours').textContent    = state.hoursToday.toFixed(1) + 'h';

  const done    = state.tasks.filter(t => t.done).length;
  const total   = state.tasks.length;
  document.getElementById('kpiDone').textContent  = done;
  document.getElementById('kpiTotal').textContent = total;

  // hours bar
  const pct = Math.min(100, (state.hoursToday / 6) * 100);
  document.getElementById('hoursBar').style.width = pct + '%';
  document.getElementById('hoursTodayBadge').textContent = state.hoursToday.toFixed(1) + ' h today';

  // task snapshot
  document.getElementById('snapPending').textContent = state.tasks.filter(t => !t.done).length;
  document.getElementById('snapDone').textContent    = done;
  document.getElementById('snapTotal').textContent   = total;

  renderGoals();
}

function renderGoals() {
  const ul = document.getElementById('goalsList');
  const empty = document.getElementById('goalsEmpty');
  ul.innerHTML = '';
  if (state.goals.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  state.goals.forEach(g => {
    const li = document.createElement('li');
    if (g.done) li.classList.add('done');
    li.innerHTML = `
      <span class="goal-check ${g.done ? 'checked' : ''}">${g.done ? '✓' : ''}</span>
      <span class="goal-text">${escapeHtml(g.text)}</span>
      <button class="goal-del" title="Delete">×</button>
    `;
    li.querySelector('.goal-check').addEventListener('click', () => {
      g.done = !g.done;
      saveState();
      renderGoals();
      renderHome();
    });
    li.querySelector('.goal-del').addEventListener('click', () => {
      state.goals = state.goals.filter(x => x.id !== g.id);
      saveState();
      renderGoals();
    });
    ul.appendChild(li);
  });
}

/* ---------- 8. TRACKERS RENDER ---------- */
function renderTracker(key, listId, barId, pctId) {
  const def = TRACKER_DEFS[key];
  const ul  = document.getElementById(listId);
  ul.innerHTML = '';

  def.topics.forEach(topic => {
    const li = document.createElement('li');
    const checked = state.trackers[key].completed.includes(topic);
    if (checked) li.classList.add('checked');
    li.innerHTML = `
      <span class="check-box">${checked ? '✓' : ''}</span>
      <span>${topic}</span>
    `;
    li.addEventListener('click', () => {
      const arr = state.trackers[key].completed;
      const idx = arr.indexOf(topic);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(topic);
      // mark study activity (for streak)
      markStudyActivity();
      saveState();
      renderTrackers();
      renderHome();
      checkBadges();
    });
    ul.appendChild(li);
  });

  const pct = trackerPct(state, key);
  document.getElementById(barId).style.width = pct + '%';
  document.getElementById(pctId).textContent = pct + '%';
}

function renderTrackers() {
  renderTracker('java',     'javaList',  'javaBar',  'javaPct');
  renderTracker('dsa',      'dsaList',   'dsaBar',   'dsaPct');
  renderTracker('cyber',    'cyberList', 'cyberBar', 'cyberPct');
  renderTracker('aptitude', 'aptList',   'aptBar',   'aptPct');
  renderTracker('web',      'webList',   'webBar',   'webPct');

  // DSA counters
  document.getElementById('dsaSolved').textContent = state.dsaSolved;
  document.getElementById('dsaToday').textContent  = state.dsaToday;
  document.getElementById('dsaStreak').textContent = state.dsaStreak;

  // THM labs
  document.getElementById('thmCount').textContent = state.thmLabs + ' labs';

  // Mini projects
  document.getElementById('projCount').textContent = state.miniProjects + ' built';

  // Aptitude weekly
  const aptPct = Math.min(100, (state.aptWeek / 35) * 100);
  document.getElementById('aptWeekBar').style.width = aptPct + '%';
  document.getElementById('aptWeekVal').textContent = state.aptWeek;
}

function markStudyActivity() {
  const today = todayStr();
  if (state.lastActiveDate !== today) {
    // increment streak if last was yesterday, else start at 1
    if (state.lastActiveDate) {
      const diff = Math.round((new Date(today) - new Date(state.lastActiveDate)) / 86400000);
      state.streak = (diff === 1) ? state.streak + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastActiveDate = today;
  }
}

/* ---------- 9. PLANNER ---------- */
function renderTasks() {
  const pending = document.getElementById('pendingList');
  const done    = document.getElementById('doneList');
  pending.innerHTML = '';
  done.innerHTML = '';

  const pendingArr = state.tasks.filter(t => !t.done);
  const doneArr    = state.tasks.filter(t =>  t.done);

  pendingArr.forEach(t => pending.appendChild(taskNode(t)));
  doneArr.forEach(t    => done.appendChild(taskNode(t)));

  document.getElementById('pendingCount').textContent = pendingArr.length;
  document.getElementById('doneCount').textContent    = doneArr.length;
  document.getElementById('pendingEmpty').style.display = pendingArr.length ? 'none' : 'block';
  document.getElementById('doneEmpty').style.display    = doneArr.length    ? 'none' : 'block';
}

function taskNode(t) {
  const li = document.createElement('li');
  if (t.done) li.classList.add('done');
  li.innerHTML = `
    <button class="task-action toggle" title="Toggle">
      <i class="bi ${t.done ? 'bi-check-square-fill' : 'bi-square'}"></i>
    </button>
    <span class="task-text">${escapeHtml(t.text)}</span>
    <span class="task-prio ${t.prio}">${t.prio.toUpperCase()}</span>
    <button class="task-action del" title="Delete"><i class="bi bi-x-lg"></i></button>
  `;
  li.querySelector('.toggle').addEventListener('click', () => {
    t.done = !t.done;
    if (t.done) markStudyActivity();
    saveState();
    renderTasks();
    renderHome();
    checkBadges();
  });
  li.querySelector('.del').addEventListener('click', () => {
    state.tasks = state.tasks.filter(x => x.id !== t.id);
    saveState();
    renderTasks();
    renderHome();
  });
  return li;
}

function initPlanner() {
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    const input = document.getElementById('taskInput');
    const prio  = document.getElementById('taskPriority').value;
    const text  = input.value.trim();
    if (!text) return;
    state.tasks.push({ id: Date.now(), text, prio, done: false });
    input.value = '';
    saveState();
    renderTasks();
    renderHome();
    toast('Task added');
  });
  document.getElementById('taskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('addTaskBtn').click();
  });

  // Notes
  const notes = document.getElementById('notesArea');
  notes.value = state.notes || '';
  notes.addEventListener('input', () => {
    state.notes = notes.value;
    saveState();
  });

  // Add goal
  document.getElementById('addGoalBtn').addEventListener('click', () => {
    const text = prompt('New weekly goal:');
    if (!text || !text.trim()) return;
    state.goals.push({ id: Date.now(), text: text.trim(), done: false });
    saveState();
    renderGoals();
    toast('Goal added');
  });
}

/* ---------- 10. HOURS & DSA & LABS & PROJECTS BUTTONS ---------- */
function initActions() {
  // study hours
  document.querySelectorAll('[data-hours]').forEach(btn => {
    btn.addEventListener('click', () => {
      const h = parseFloat(btn.dataset.hours);
      state.hoursToday = +(state.hoursToday + h).toFixed(2);
      const idx = dayOfWeekIdx();
      state.weeklyHours[idx] = +(state.weeklyHours[idx] + h).toFixed(2);
      markStudyActivity();
      saveState();
      renderHome();
      checkBadges();
      toast(`+${h}h logged`);
    });
  });
  document.getElementById('resetHours').addEventListener('click', () => {
    state.hoursToday = 0;
    const idx = dayOfWeekIdx();
    state.weeklyHours[idx] = 0;
    saveState();
    renderHome();
  });

  // DSA solved counter
  document.getElementById('dsaPlusBtn').addEventListener('click', () => {
    state.dsaSolved++;
    state.dsaToday++;
    // streak logic
    if (state.dsaTodayDate !== todayStr()) state.dsaTodayDate = todayStr();
    if (state.dsaToday === 1) state.dsaStreak++;
    markStudyActivity();
    saveState();
    renderTrackers();
    renderHome();
    checkBadges();
    toast('Problem solved 🎉');
  });

  // THM labs
  document.getElementById('labPlus').addEventListener('click', () => {
    state.thmLabs++;
    markStudyActivity();
    saveState();
    renderTrackers();
    toast('Lab completed!');
  });
  document.getElementById('labReset').addEventListener('click', () => {
    if (confirm('Reset lab count to 0?')) {
      state.thmLabs = 0;
      saveState();
      renderTrackers();
    }
  });

  // Mini projects
  document.getElementById('projPlus').addEventListener('click', () => {
    state.miniProjects++;
    markStudyActivity();
    saveState();
    renderTrackers();
    toast('Project built 🚀');
  });
  document.getElementById('projReset').addEventListener('click', () => {
    if (confirm('Reset project count?')) {
      state.miniProjects = 0;
      saveState();
      renderTrackers();
    }
  });

  // Aptitude weekly
  document.querySelectorAll('[data-apt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = parseInt(btn.dataset.apt);
      state.aptWeek += q;
      markStudyActivity();
      saveState();
      renderTrackers();
      toast(`+${q} questions this week`);
    });
  });
  document.getElementById('aptReset').addEventListener('click', () => {
    state.aptWeek = 0;
    saveState();
    renderTrackers();
  });
}

/* ---------- 11. CHARTS ---------- */
let chartSkills, chartTasks, chartWeekly;

function buildCharts() {
  const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
  const textCol = getComputedStyle(document.body).getPropertyValue('--text-mute').trim();
  Chart.defaults.color = textCol;
  Chart.defaults.font.family = 'JetBrains Mono';
  Chart.defaults.font.size = 11;

  // Skills chart (doughnut)
  const skillData = allTrackers().map(k => trackerPct(state, k));
  const skillLabels = allTrackers().map(k => TRACKER_DEFS[k].label);
  const palette = [accent, '#ec4899', '#facc15', '#22c55e', '#a855f7'];

  if (chartSkills) chartSkills.destroy();
  chartSkills = new Chart(document.getElementById('skillsChart'), {
    type: 'doughnut',
    data: {
      labels: skillLabels,
      datasets: [{
        data: skillData,
        backgroundColor: palette,
        borderColor: 'rgba(0,0,0,0.4)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, font:{size:11} } }
      }
    }
  });

  // Task pie
  const done    = state.tasks.filter(t => t.done).length;
  const pending = state.tasks.filter(t => !t.done).length;

  if (chartTasks) chartTasks.destroy();
  chartTasks = new Chart(document.getElementById('taskChart'), {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [done || 0.001, pending || 0.001], // tiny fallback so it renders
        backgroundColor: [accent, '#ff4d6d'],
        borderColor: 'rgba(0,0,0,0.4)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });

  // Weekly hours bar
  if (chartWeekly) chartWeekly.destroy();
  chartWeekly = new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Hours studied',
        data: state.weeklyHours,
        backgroundColor: accent + '80', // 50% alpha
        borderColor: accent,
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
      }
    }
  });
}

/* ---------- 12. POMODORO ---------- */
let pomoTimer = null;
let pomoRemaining = 25 * 60;
let pomoDuration = 25 * 60;
let pomoRunning = false;

function updatePomoDisplay() {
  const m = String(Math.floor(pomoRemaining / 60)).padStart(2, '0');
  const s = String(pomoRemaining % 60).padStart(2, '0');
  document.getElementById('pomoTime').textContent = `${m}:${s}`;

  // ring progress (circumference of r=90 → 2πr ≈ 565.48)
  const circumference = 565.48;
  const progress = pomoRemaining / pomoDuration;
  const offset = circumference * (1 - progress);
  document.getElementById('pomoRing').style.strokeDashoffset = offset;
}

function setPomoMode(min) {
  pomoDuration = min * 60;
  pomoRemaining = pomoDuration;
  if (pomoTimer) { clearInterval(pomoTimer); pomoTimer = null; pomoRunning = false; }
  document.getElementById('pomoStart').innerHTML = '<i class="bi bi-play-fill"></i> Start';
  updatePomoDisplay();
}

function initPomodoro() {
  document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pomo-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setPomoMode(parseInt(btn.dataset.min));
    });
  });

  document.getElementById('pomoStart').addEventListener('click', () => {
    const btn = document.getElementById('pomoStart');
    if (pomoRunning) {
      clearInterval(pomoTimer);
      pomoTimer = null;
      pomoRunning = false;
      btn.innerHTML = '<i class="bi bi-play-fill"></i> Resume';
      return;
    }
    pomoRunning = true;
    btn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause';
    pomoTimer = setInterval(() => {
      pomoRemaining--;
      if (pomoRemaining <= 0) {
        clearInterval(pomoTimer);
        pomoTimer = null;
        pomoRunning = false;
        // session complete (only count focus mode = 25min)
        if (pomoDuration === 25 * 60) {
          state.pomoToday++;
          state.pomoTotal++;
          markStudyActivity();
          saveState();
        }
        document.getElementById('pomoCount').textContent = state.pomoToday;
        document.getElementById('pomoStart').innerHTML = '<i class="bi bi-play-fill"></i> Start';
        pomoRemaining = pomoDuration;
        updatePomoDisplay();
        toast('Session complete! Take a break.');
        checkBadges();
      } else {
        updatePomoDisplay();
      }
    }, 1000);
  });

  document.getElementById('pomoReset').addEventListener('click', () => {
    if (pomoTimer) clearInterval(pomoTimer);
    pomoTimer = null;
    pomoRunning = false;
    pomoRemaining = pomoDuration;
    document.getElementById('pomoStart').innerHTML = '<i class="bi bi-play-fill"></i> Start';
    updatePomoDisplay();
  });

  document.getElementById('pomoCount').textContent = state.pomoToday;
  updatePomoDisplay();
}

/* ---------- 13. BADGES ---------- */
function renderBadges() {
  const grid = document.getElementById('badgeGrid');
  grid.innerHTML = '';
  BADGES.forEach(b => {
    const earned = state.earnedBadges.includes(b.id);
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="badge-card glass ${earned ? '' : 'locked'}">
        <div class="badge-icon"><i class="bi ${b.icon}"></i></div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `;
    grid.appendChild(col);
  });

  // weekly challenge (rotates by week-of-year)
  const wIdx = Math.floor(new Date().getDate() / 7) % WEEKLY_CHALLENGES.length;
  document.getElementById('weeklyChal').textContent = '> ' + WEEKLY_CHALLENGES[wIdx];
}

function checkBadges() {
  let newOnes = [];
  BADGES.forEach(b => {
    if (!state.earnedBadges.includes(b.id) && b.check(state)) {
      state.earnedBadges.push(b.id);
      newOnes.push(b.name);
    }
  });
  if (newOnes.length) {
    saveState();
    newOnes.forEach(n => toast(`🏆 Unlocked: ${n}`));
    renderBadges();
  }
}

/* ---------- 14. GITHUB REPOS ---------- */
function renderRepos() {
  const ul = document.getElementById('repoList');
  ul.innerHTML = '';
  document.getElementById('repoCount').textContent = state.repos.length;
  document.getElementById('repoEmpty').style.display = state.repos.length ? 'none' : 'block';

  state.repos.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `
      <i class="bi bi-git"></i>
      <a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.name)}</a>
      <button class="task-action del" title="Delete"><i class="bi bi-x-lg"></i></button>
    `;
    li.querySelector('.del').addEventListener('click', () => {
      state.repos = state.repos.filter(x => x.id !== r.id);
      saveState();
      renderRepos();
    });
    ul.appendChild(li);
  });
}

function initRepos() {
  document.getElementById('addRepoBtn').addEventListener('click', () => {
    const name = document.getElementById('repoName').value.trim();
    const url  = document.getElementById('repoLink').value.trim();
    if (!name || !url) {
      toast('Both fields required');
      return;
    }
    state.repos.push({ id: Date.now(), name, url });
    document.getElementById('repoName').value = '';
    document.getElementById('repoLink').value = '';
    saveState();
    renderRepos();
    toast('Repository added');
  });
}

/* ---------- 15. SETTINGS ---------- */
function applySettings() {
  // accent
  document.documentElement.style.setProperty('--accent', state.settings.accent);
  // accent-glow rgba derived
  const rgb = hexToRgb(state.settings.accent);
  if (rgb) {
    document.documentElement.style.setProperty(
      '--accent-glow',
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`
    );
  }
  // light mode
  document.body.classList.toggle('light-mode', !!state.settings.light);
  // matrix bg
  const matrix = document.getElementById('matrix-bg');
  if (matrix) matrix.style.display = state.settings.matrix ? 'block' : 'none';
  // particles
  const particles = document.getElementById('particles');
  if (particles) particles.style.display = state.settings.particles ? 'block' : 'none';

  // swatches active state
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.accent === state.settings.accent);
  });
  document.getElementById('toggleMatrix').checked    = state.settings.matrix;
  document.getElementById('toggleParticles').checked = state.settings.particles;
  document.getElementById('toggleLight').checked     = state.settings.light;
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : null;
}

function initSettings() {
  document.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', () => {
      state.settings.accent = s.dataset.accent;
      saveState();
      applySettings();
    });
  });
  document.getElementById('toggleMatrix').addEventListener('change', e => {
    state.settings.matrix = e.target.checked;
    saveState(); applySettings();
  });
  document.getElementById('toggleParticles').addEventListener('change', e => {
    state.settings.particles = e.target.checked;
    saveState(); applySettings();
  });
  document.getElementById('toggleLight').addEventListener('change', e => {
    state.settings.light = e.target.checked;
    saveState(); applySettings();
  });

  // theme button in topbar
  document.getElementById('themeToggle').addEventListener('click', () => {
    state.settings.light = !state.settings.light;
    saveState();
    applySettings();
  });

  // reset all
  document.getElementById('resetAllBtn').addEventListener('click', () => {
    if (confirm('Erase ALL local data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}

/* ---------- 16. SEARCH (mini command bar) ---------- */
function initSearch() {
  const box = document.getElementById('searchBox');
  if (!box) return;

  // map keywords to sections
  const map = [
    { keys:['home','overview','dashboard'], id:'section-home' },
    { keys:['java'],                         id:'section-java' },
    { keys:['dsa','coding','algo'],          id:'section-dsa' },
    { keys:['cyber','security','soc'],       id:'section-cyber' },
    { keys:['apt','aptitude','quant'],       id:'section-aptitude' },
    { keys:['web','react','html','css','js'],id:'section-web' },
    { keys:['plan','task','todo'],           id:'section-planner' },
    { keys:['chart','analytic','stat'],      id:'section-analytics' },
    { keys:['pomo','focus','timer'],         id:'section-pomodoro' },
    { keys:['badge','award','achiev'],       id:'section-badges' },
    { keys:['github','repo','project'],      id:'section-github' },
    { keys:['resource','link','youtube'],    id:'section-resources' },
    { keys:['setting','theme','color'],      id:'section-settings' }
  ];

  box.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const q = box.value.toLowerCase().trim();
    if (!q) return;

    // special: "add task <text>"
    if (q.startsWith('add task ')) {
      const text = box.value.slice(9).trim();
      if (text) {
        state.tasks.push({ id: Date.now(), text, prio:'medium', done:false });
        saveState();
        renderTasks();
        renderHome();
        showSection('section-planner');
        box.value = '';
        toast('Task added via command');
        return;
      }
    }

    // route to section
    for (const m of map) {
      if (m.keys.some(k => q.includes(k))) {
        showSection(m.id);
        box.value = '';
        return;
      }
    }
    toast('No match — try: java, dsa, planner...');
  });
}

/* ---------- 17. UTILS ---------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function escapeAttr(str) {
  return escapeHtml(str);
}

function toast(msg) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(() => {
    t.style.transition = 'opacity .3s, transform .3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(40px)';
    setTimeout(() => t.remove(), 320);
  }, 2500);
}

function startClock() {
  const el = document.getElementById('topClock');
  if (!el) return;
  function tick() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- 18. INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  dailyReset();
  applySettings();
  initNav();
  renderHome();
  renderTrackers();
  renderTasks();
  renderBadges();
  renderRepos();
  initActions();
  initPlanner();
  initPomodoro();
  initSettings();
  initRepos();
  initSearch();
  startClock();
  checkBadges();

  // build charts so they're ready when user visits analytics
  setTimeout(buildCharts, 200);
});
