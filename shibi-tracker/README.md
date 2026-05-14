# SHIBI.OS — Learning & Career Tracker

> A futuristic, cybersecurity-inspired productivity dashboard for tracking placement preparation, Java, DSA, Cybersecurity, Aptitude, and ReactJS learning. Built **only** with HTML, CSS, Bootstrap, and JavaScript — no backend, no frameworks, no build step.

![tech](https://img.shields.io/badge/HTML5-orange) ![tech](https://img.shields.io/badge/CSS3-blue) ![tech](https://img.shields.io/badge/Bootstrap%205-purple) ![tech](https://img.shields.io/badge/JavaScript-yellow) ![tech](https://img.shields.io/badge/Chart.js-pink)

---

## ✨ Features

### Dashboard
- **Welcome panel** with personalized greeting and daily rotating motivational quote
- **KPI cards**: daily streak, overall progress %, hours studied today, tasks done
- **Weekly goals** (add/check/delete)
- **Study hours logger** with daily target bar
- **Task snapshot** (pending / completed / total)

### Learning Trackers (5 tracks)
- **Java** — Basics, OOP, Collections, Exception Handling, JDBC, File Handling, Multithreading
- **DSA** — Arrays, Strings, Linked Lists, Stack, Queue, Trees, Graphs (with solved-counter, today counter, coding streak, difficulty tags)
- **Cybersecurity** — Linux, Networking, Nmap, Wireshark, Burp, SOC, SIEM, OWASP Top 10, TryHackMe (with lab tracker)
- **Aptitude** — Percentages, Ratio, Probability, Time & Work, Logical Reasoning, Quantitative (with weekly target of 35 Qs)
- **Web Dev** — HTML, CSS, JavaScript, Bootstrap, ReactJS (with mini-project counter)

### Productivity Tools
- **Daily Planner** — add tasks with priorities (low/medium/high), mark done, delete, plus a notes area (auto-saved)
- **Pomodoro Timer** — 25 / 5 / 15 minute modes with animated ring
- **GitHub Project Tracker** — add and manage your repos
- **Resources** — curated YouTube channels and websites
- **Achievement badges** — 9 unlockable badges plus weekly challenges

### Analytics
Built with **Chart.js**:
- Skill completion doughnut chart
- Task distribution pie chart
- Weekly productivity bar chart (Mon → Sun)

### UI / UX
- 🌑 **Cybersecurity-inspired dark theme** with neon-cyan accent
- 🎨 **6 swappable accent colors** — Cyan, Purple, Green, Orange, Pink, Yellow
- ✨ **Glassmorphism cards** with corner ticks
- 🌧️ **Matrix rain background** (toggleable)
- ⭐ **Floating particles** (toggleable)
- ☀️ **Light mode** toggle
- 📱 **Fully responsive** — laptop, tablet, mobile
- ⌨️ **Mini command bar** in topbar — type `java`, `dsa`, `planner`, or even `add task buy groceries` and press Enter
- 🔔 **Toast notifications** for actions
- 💾 **All data persists** via `localStorage`

---

## 📁 Folder Structure

```
shibi-tracker/
├── index.html              ← Landing page (entry)
├── dashboard.html          ← Main dashboard (single-page with all sections)
├── README.md
└── assets/
    ├── css/
    │   └── style.css       ← All styles (theme, layout, components, responsive)
    ├── js/
    │   ├── effects.js      ← Matrix rain + floating particles (shared)
    │   └── script.js       ← Dashboard logic (state, trackers, charts, etc.)
    └── img/                ← (reserved for future images/screenshots)
```

---

## 🚀 How to Run Locally

You only need a browser. Three easy options:

### Option 1 — Just open the file
1. Download or clone this repo.
2. Double-click `index.html`.
3. Done. Everything runs from CDN (Bootstrap, Chart.js, Bootstrap Icons, Google Fonts).

### Option 2 — VS Code Live Server (recommended)
1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

### Option 3 — Python's built-in server
```bash
cd shibi-tracker
python -m http.server 5500
```
Then open <http://localhost:5500> in your browser.

---

## 🌐 Deployment

### Deploy on GitHub Pages (free)
1. Push the folder to a new GitHub repo named, for example, `shibi-tracker`.
2. Go to **Settings → Pages**.
3. Under **Branch**, select `main` and `/ (root)`. Save.
4. Wait ~30 seconds. Your site is live at `https://<your-username>.github.io/shibi-tracker/`.

### Deploy on Netlify (drag-and-drop, even easier)
1. Visit <https://app.netlify.com/drop>.
2. Drag the entire `shibi-tracker` folder into the page.
3. You get a live URL instantly. Click "Change site name" to customize.

### Deploy on Vercel
1. Push to GitHub.
2. Import the repo at <https://vercel.com/new>.
3. Click **Deploy**. No configuration needed.

---

## 🧠 How It Works (for beginners)

### HTML
- `index.html` is the landing page with hero + 9-track grid.
- `dashboard.html` is a **single-page application** — all sections live in one file, only one is shown at a time via the `.active` CSS class.
- We use **Bootstrap 5** for the grid (`row` / `col-md-*`) and **Bootstrap Icons** for all icons.

### CSS
- All theme colors are **CSS variables** defined under `:root` in `style.css`. To re-skin, change `--accent`.
- **Glassmorphism**: `backdrop-filter: blur()` + semi-transparent background + 1px border + decorative corner ticks via `::before` / `::after`.
- **Light mode** is just a class on `<body>` that overrides the same variables.
- **Responsive**: 2 breakpoints — `992px` (sidebar collapses) and `576px` (extra mobile tweaks).

### JavaScript
- **One source of truth** — a `state` object that mirrors everything the user does.
- **Persistence**: `JSON.stringify(state)` → `localStorage` after every change. Reload? Everything's back.
- **Daily reset**: on every page load, dates are compared and counters that should reset (hours-today, dsa-today, pomodoro-today, weekly hours, weekly aptitude) are cleared automatically.
- **Streak logic**: if you log study activity today and your `lastActiveDate` was yesterday, streak +1. If you skipped a day, streak resets to 1 next time you study.
- **Charts** are built with Chart.js — destroyed and re-built each time you visit the analytics page so they stay fresh.
- **Matrix rain** is a canvas that draws random katakana / binary / symbols falling down. It reads `--accent` from CSS so it matches your theme.
- **Toasts** are tiny popups in the bottom-right. They auto-dismiss in 2.5s.

### Where data is stored
Everything is in your browser under `localStorage` key:
```
shibi.dashboard.v1
```
You can inspect it with DevTools → Application → Local Storage.
To wipe everything, use **Settings → Reset everything**.

---

## ⌨️ Keyboard tips
- Press **Enter** in the topbar search to jump to a section.
- Type `add task <something>` and press Enter to add a task without opening the planner.
- Press **Enter** in the planner input to add a task quickly.

---

## 🎯 Pre-loaded Quick-Win Checklist for SHIBI

When you open the dashboard for the first time, try this 5-minute walkthrough:
1. **Settings** → pick your favorite accent color.
2. **Planner** → add 3 tasks for today (one high-priority, two medium).
3. **Java** → check off topics you've already learned.
4. **DSA** → hit "+1" for each problem you've already solved.
5. **Overview** → log your study hours for the day.
6. **Pomodoro** → start a 25-min focus session.

You should already have at least one badge unlocked. 🏆

---

## 📝 License
Built by SHIBI for SHIBI. Free to use, modify, and learn from.

---

## 💡 Future ideas
- Export/import state as JSON (for backup)
- Confetti animation on badge unlock
- Calendar heatmap for daily activity
- Custom topics per tracker
- Sync via GitHub Gist (still no backend!)
