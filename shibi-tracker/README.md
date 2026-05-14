# SHIBI.OS v2 — Learning & Career Tracker

> A futuristic, cybersecurity-inspired personal learning operating system for placement preparation. Tracks Java, DSA, Cybersecurity, Networking, Aptitude, and Web Dev — with a 90-day roadmap, quiz engine, gamification, and smart status analysis. Built **only** with HTML, CSS, Bootstrap, and JavaScript — no backend, no build step, no npm.

![version](https://img.shields.io/badge/version-2.0-brightgreen)
![tech](https://img.shields.io/badge/HTML5-orange)
![tech](https://img.shields.io/badge/CSS3-blue)
![tech](https://img.shields.io/badge/Bootstrap%205-purple)
![tech](https://img.shields.io/badge/JavaScript-vanilla-yellow)
![tech](https://img.shields.io/badge/Chart.js-pink)

---

## What is SHIBI.OS?

SHIBI.OS is a personal placement preparation command-center. It runs entirely in your browser. Everything is saved to `localStorage` — no account, no server, no internet required after the first load (CDN assets cache after first visit).

---

## Features

### Overview / Home
- KPI cards: day streak, overall progress %, hours today, tasks done
- **Mentor Banner** — computes placement readiness % and shows a status pill (Excellent / On Track / Behind / Critical), a rotating mentor message, and a "Next best action" suggestion
- Weekly goals (add / check / delete)
- Study hours logger with daily target bar (6 h/day)
- Task snapshot (pending / done / total)

### 🎯 Targets (NEW)
- **Daily** — today's roadmap tasks, pulled from the 90-day plan
- **Weekly** — 12-week checklist with typed items (study / practice / test / revision) and per-week progress bar
- **Monthly** — 3-month checklist with progress bar
- Status pill updates in real time based on completion %

### 🗓 90-Day Mission (NEW)
- Exactly 90 days of day-by-day content: Java, DSA, Cyber, Aptitude, Coding tasks, Revision
- Days 1–30: Foundation · Days 31–60: Building · Days 61–90: Placement Prep
- Every 7th day is a lighter revision day
- Interactive task checklist per day — each tick earns +5 XP
- "Mark Day Complete" button — earns +40 XP
- Next-7-days horizontal scroller
- Full 90-day accordion grouped by month

### Learning Trackers (6 tracks)
Each tracker has a topic checklist, progress bar, and a **Study Guide button** (book icon) per topic that opens a full modal.

| Track | Topics |
|-------|--------|
| Java | Basics, OOP, Collections, Exception Handling, JDBC, File Handling, Multithreading, Streams API |
| DSA | Arrays, Strings, Linked Lists, Stack, Queue, Trees, Graphs, Recursion, Sorting, Searching |
| Cybersec | Linux, Nmap, Wireshark, Burp Suite, SOC concepts, SIEM basics, OWASP Top 10, TryHackMe, Threat hunting, Incident response |
| Networking *(NEW)* | OSI Model, TCP/IP, DNS, HTTP/HTTPS, Ports & Protocols, Firewalls, VPN, Routing, Switching |
| Aptitude | Percentages, Ratio, Probability, Time & Work, Profit & Loss, Logical reasoning, Quantitative aptitude |
| Web Dev | HTML, CSS, JavaScript, Bootstrap, ReactJS basics |

### Topic Study Guides (NEW)
Clicking the book icon on any tracker topic opens a **4-tab modal**:
- **Overview** — concept explanation + subtopics with beginner tasks
- **Practice** — practice problems + mini coding challenge
- **Interview Q** — real interview questions per subtopic
- **Videos** — curated YouTube channel recommendations for that subject

### Daily Planner
- Add tasks with priority (low / medium / high)
- Mark done / delete
- Notes area (auto-saved as you type)
- "add task …" command in topbar search bar

### 🧪 Tests (NEW)
Four tabs:
- **Daily Test** — 5 random questions per subject, 5-minute countdown timer
- **Weekly Mock** — 25 mixed questions from all subjects, 25-minute timer; score ≥70% earns +100 XP
- **Topic Tests** — 10 questions for any of 10 subjects (Java, DSA, Aptitude, Cyber, Networking, OOP, DBMS/SQL, Linux, JavaScript, ReactJS)
- **History** — table of all past attempts with date, subject, score, %

Quiz features: multi-page navigation, auto-submit on timeout, answer explanations for every question, weak-topic analysis after each quiz.

**Quiz bank**: 215 total questions across 10 subjects (34 Java · 30 DSA · 31 Aptitude · 30 Cyber · 20 Networking · 15 OOP · 15 DBMS/SQL · 15 Linux · 15 JS · 10 ReactJS)

### Pomodoro Timer
- 25 / 5 / 15 minute modes with animated SVG ring
- Completing a 25-min session earns +20 XP and increments today's count

### Analytics (5 charts)
All built with Chart.js:
1. **Skill completion** — doughnut chart, all 6 trackers
2. **Task distribution** — completed vs pending pie
3. **Weekly productivity** — hours bar chart (Mon → Sun)
4. **Quiz performance** — line chart, last 10 quiz attempts
5. **Subject strengths** — radar chart, per-subject quiz average (appears after 3+ subjects attempted)

Plus: **12-week timeline indicator** — a horizontal bar for each week, color-coded green (≥80% done) / yellow (partial) / red (missed) / current week (accent glow).

### Achievements (20 badges)
All badges sorted earned-first, locked last. A **Recently Unlocked** pinned panel shows the last 3 badges earned.

Badges include: First Step, Streak ×3/7/14/30, Java Master, DSA 50/100, Cyber Warrior, Network Ninja, Bug Hunter, Taskmaster, Focused ×5, Pomodoro Marathon, All-Rounder, XP 500/1000/2500, Quiz Ace, THM Hero.

Streak milestones (3/7/14/21/30/60/90 days) trigger celebration toasts from the mentor message bank.

### Gamification — XP + Levels
XP pill in topbar shows: `LVL 4 · 320/800 XP` with a mini progress bar.

| Action | XP |
|--------|----|
| Complete a tracker topic | +10 |
| Solve a DSA problem | +15 |
| Complete a TryHackMe lab | +30 |
| Complete a mini project | +50 |
| Finish a Pomodoro session | +20 |
| Pass daily test (≥80%) | +25 |
| Perfect quiz score | +15 bonus |
| Pass weekly mock (≥70%) | +100 |
| Mark roadmap day complete | +40 |
| Complete a planner task | +5 |
| Complete weekly target | +8 |
| Complete monthly target | +10 |

Level curve: Level N requires N × 200 XP cumulative. A floating toast appears on every XP gain.

### GitHub Project Tracker
Add repos by name + URL. View as a list with one-click external links.

### Resources
Tabbed YouTube channel gallery (Java · DSA · Cyber · Networking · Aptitude · Web Dev) with channel name, description note, and "Visit →" button. Plus a curated websites list (LeetCode, TryHackMe, GeeksforGeeks, MDN, IndiaBIX, OverTheWire, PortSwigger, HackTheBox).

### Customization (Phase 11)
All settings persist in `localStorage`:

| Setting | Options |
|---------|---------|
| Accent color | 8 swatches: Cyan, Purple, Green, Orange, Pink, Yellow, Red, Blue |
| Card style | Glass (default) · Solid · Neon Outline |
| Font scale | 90% (Small) · 100% (Default) · 110% (Large) |
| Reduced motion | Toggle — disables all animations + hides matrix/particles |
| Background dim | Slider 3%–40% (controls matrix rain opacity) |
| Compact sidebar | Icon-only mode with hover tooltips |
| Light mode | Full light theme override |

---

## Folder Structure

```
shibi-tracker/
├── index.html                    ← Landing page
├── dashboard.html                ← Main SPA dashboard (all sections)
├── README.md
└── assets/
    ├── css/
    │   └── style.css             ← All styles — theme, layout, v2 components
    └── js/
        ├── effects.js            ← Matrix rain + floating particles (unchanged)
        ├── script.js             ← Thin orchestrator — only init() calls
        ├── data/
        │   ├── roadmap90.js      ← 90-day day-by-day roadmap (array of 90)
        │   ├── monthlyTargets.js ← 3 months × 8 targets
        │   ├── weeklyTargets.js  ← 12 weeks × 7 items
        │   ├── topicGuides.js    ← Per-topic deep guides (explanation, tasks, Q&A)
        │   ├── youtubeMap.js     ← YouTube channel recommendations per subject
        │   ├── quizBank.js       ← 215 MCQs across 10 subjects
        │   └── motivational.js   ← Mentor messages keyed by status
        └── modules/
            ├── utils.js          ← escapeHtml, toast
            ├── time.js           ← 12-hour AM/PM time helpers
            ├── state.js          ← localStorage load/save/migrate
            ├── nav.js            ← Sidebar navigation
            ├── gamify.js         ← XP, levels, 20 badges, streak celebrations
            ├── trackers.js       ← All 6 tracker renderers
            ├── planner.js        ← Daily planner CRUD
            ├── pomodoro.js       ← SVG ring timer
            ├── targets.js        ← Daily/Weekly/Monthly target engine
            ├── missions.js       ← 90-day roadmap card renderer
            ├── quiz.js           ← Full quiz engine (daily/mock/topic/history)
            ├── status.js         ← Placement readiness calculator
            ├── analytics.js      ← 5 Chart.js charts + timeline
            ├── settings.js       ← All customization controls
            ├── guides.js         ← Topic guide modal (4 tabs)
            └── home.js           ← Overview KPIs, clock, repos, search
```

---

## How to Run Locally

Three options — no install needed:

### Option 1 — Double-click
Download or clone the repo, then double-click `index.html`. Everything loads from CDN.

### Option 2 — VS Code Live Server (recommended)
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

### Option 3 — Python server
```bash
cd shibi-tracker
python -m http.server 5500
# or on some systems:
python3 -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

---

## Deployment

### GitHub Pages (free)
1. Push the folder to a GitHub repo (e.g. `shibi-tracker`).
2. Go to **Settings → Pages → Branch: main / root**. Save.
3. Live at `https://<username>.github.io/shibi-tracker/` in ~30s.

### Netlify Drop (fastest)
1. Visit <https://app.netlify.com/drop>
2. Drag the `shibi-tracker/` folder onto the page.
3. Instant live URL.

### Vercel
1. Push to GitHub → import at <https://vercel.com/new> → Deploy.

---

## localStorage — How Data Persists

Everything is stored under one key:
```
shibi.dashboard.v2
```

You can inspect it in DevTools → Application → Local Storage → `http://localhost:5500`.

If you had data from v1 (`shibi.dashboard.v1`), the dashboard automatically migrates it to v2 on first load — your progress is preserved.

To wipe everything: **Settings → Reset everything**.

---

## How to Add a New Quiz Question

Open `assets/js/data/quizBank.js`. Find the subject array (e.g. `java:`). Add a new object:

```js
{
  q: "Your question text here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correct: 0,  // zero-based index of correct option
  explanation: "Why this answer is correct."
}
```

No other changes needed — the quiz engine picks questions randomly.

---

## How to Extend the 90-Day Roadmap

Open `assets/js/data/roadmap90.js`. Each entry follows this shape:

```js
{
  day: 1,
  phase: "Foundation",     // "Foundation" | "Building" | "Placement Prep"
  estimatedHours: 4,
  java:     ["Topic 1", "Topic 2"],
  dsa:      ["Topic"],
  cyber:    ["Topic"],
  aptitude: ["Topic"],
  tasks:    ["Do this", "Do that"],   // these are the checkable items
  coding:   ["Write a program"],
  revision: ["Review yesterday's topic"]
}
```

---

## How to Change the Join Date

The 90-day roadmap calculates "Day N" from the join date stored in state:

```js
// In browser DevTools console:
var s = JSON.parse(localStorage.getItem('shibi.dashboard.v2'));
s.joinDate = '2026-01-01';  // YYYY-MM-DD
localStorage.setItem('shibi.dashboard.v2', JSON.stringify(s));
location.reload();
```

---

## Keyboard Tips

| Command (press Enter in topbar search) | Action |
|----------------------------------------|--------|
| `java` / `dsa` / `cyber` / etc. | Jump to that section |
| `targets` / `mission` / `tests` | Jump to new v2 sections |
| `add task <your task text>` | Add a task directly |
| `planner` / `pomodoro` / `settings` | Navigate by keyword |

---

## 5-Minute First-Time Walkthrough

1. **Settings** → pick your favorite accent color. Try "Neon Outline" card style.
2. **90-Day Mission** → read today's plan. Check off the tasks you can do right now.
3. **Targets** → review this week's checklist. Check off what you've already covered.
4. **Java / DSA / Cyber** → tick the topics you've already learned. Watch your XP grow.
5. **Overview** → the Mentor Banner now shows your placement readiness %. Aim for On Track.
6. **Tests** → take the Java daily test (5 questions, 5 minutes). See your first quiz history entry.
7. **Pomodoro** → start a 25-minute focus session for today's roadmap tasks.
8. **Achievements** → see how many badges you've already unlocked. 🏆

---

## Architecture Notes

- **No ES modules** — all JS files use classic `<script>` tags with `window.SHIBI.*` namespacing. This ensures the project runs by double-clicking `index.html` without a server or bundler.
- **Load order matters** — `utils.js` and `time.js` load first (no dependencies), then `state.js` (needs `time.js`), then feature modules, then `analytics.js` (needs `targets.js`), then the orchestrator `script.js` last.
- **Single state object** — all data lives in one `window._SHIBI_STATE` object, serialized to `localStorage` on every mutation. No separate data stores.
- **v1 → v2 migration** — `state.js` checks for the old `shibi.dashboard.v1` key and copies compatible fields to v2 automatically.

---

## License

Built by SHIBI for SHIBI. Free to use, modify, and learn from. No attribution required.
