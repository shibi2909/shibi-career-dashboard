/* modules/state.js — single source of truth + localStorage I/O */
window.SHIBI = window.SHIBI || {};
window.SHIBI.State = (function () {

  var V1_KEY = 'shibi.dashboard.v1';
  var V2_KEY = 'shibi.dashboard.v2';

  function defaultState() {
    return {
      streak: 0,
      lastActiveDate: null,
      joinDate: SHIBI.Time.todayStr(),
      hoursToday: 0,
      hoursDate: SHIBI.Time.todayStr(),
      weeklyHours: [0, 0, 0, 0, 0, 0, 0],
      weeklyHoursDate: SHIBI.Time.weekStartStr(),

      trackers: {
        java:       { completed: [] },
        dsa:        { completed: [] },
        cyber:      { completed: [] },
        aptitude:   { completed: [] },
        web:        { completed: [] },
        networking: { completed: [] }
      },

      dsaSolved: 0,
      dsaToday: 0,
      dsaTodayDate: SHIBI.Time.todayStr(),
      dsaStreak: 0,

      thmLabs: 0,
      miniProjects: 0,

      aptWeek: 0,
      aptWeekDate: SHIBI.Time.weekStartStr(),

      tasks:  [],
      goals:  [],
      notes:  '',
      repos:  [],

      pomoToday: 0,
      pomoTodayDate: SHIBI.Time.todayStr(),
      pomoTotal: 0,

      earnedBadges: [],
      xp: 0,
      level: 1,

      monthlyTargetsDone: {},
      weeklyTargetsDone: {},
      roadmapDaysDone: {},
      roadmapTasksDone: {},

      quizHistory: [],

      settings: {
        accent:        '#00ffd0',
        matrix:        true,
        particles:     true,
        light:         false,
        cardStyle:     'glass',    // 'glass' | 'solid' | 'neon'
        fontScale:     'default',  // 'sm' | 'default' | 'lg'
        reducedMotion: false,
        bgDim:         0.18,       // opacity of matrix bg (0.05–0.40)
        compactMode:   false
      }
    };
  }

  function migrateV1() {
    try {
      var raw = localStorage.getItem(V1_KEY);
      if (!raw) return null;
      var old = JSON.parse(raw);
      var fresh = defaultState();
      // copy compatible fields
      var copy = ['streak', 'lastActiveDate', 'hoursToday', 'hoursDate',
        'weeklyHours', 'weeklyHoursDate', 'dsaSolved', 'dsaToday',
        'dsaTodayDate', 'dsaStreak', 'thmLabs', 'miniProjects',
        'aptWeek', 'aptWeekDate', 'tasks', 'goals', 'notes',
        'repos', 'pomoToday', 'pomoTodayDate', 'pomoTotal', 'earnedBadges'];
      copy.forEach(function (k) { if (old[k] !== undefined) fresh[k] = old[k]; });
      if (old.settings) Object.assign(fresh.settings, old.settings);
      if (old.trackers) {
        ['java', 'dsa', 'cyber', 'aptitude', 'web'].forEach(function (k) {
          if (old.trackers[k]) fresh.trackers[k] = old.trackers[k];
        });
      }
      return fresh;
    } catch (e) {
      return null;
    }
  }

  function load() {
    // check v2
    try {
      var raw = localStorage.getItem(V2_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return Object.assign(defaultState(), parsed);
      }
    } catch (e) {}

    // migrate from v1 if present
    var migrated = migrateV1();
    if (migrated) {
      localStorage.setItem(V2_KEY, JSON.stringify(migrated));
      return migrated;
    }

    return defaultState();
  }

  function save(s) {
    localStorage.setItem(V2_KEY, JSON.stringify(s));
  }

  function reset() {
    localStorage.removeItem(V2_KEY);
    localStorage.removeItem(V1_KEY);
    location.reload();
  }

  function dailyReset(s) {
    var today = SHIBI.Time.todayStr();
    var week  = SHIBI.Time.weekStartStr();

    if (s.hoursDate !== today) {
      if (s.lastActiveDate) {
        var diff = Math.round((new Date(today) - new Date(s.lastActiveDate)) / 86400000);
        if (diff > 1) s.streak = 0;
      }
      s.hoursToday = 0;
      s.hoursDate  = today;
    }
    if (s.dsaTodayDate !== today) {
      s.dsaToday    = 0;
      s.dsaTodayDate = today;
    }
    if (s.pomoTodayDate !== today) {
      s.pomoToday    = 0;
      s.pomoTodayDate = today;
    }
    if (s.weeklyHoursDate !== week) {
      s.weeklyHours    = [0, 0, 0, 0, 0, 0, 0];
      s.weeklyHoursDate = week;
    }
    if (s.aptWeekDate !== week) {
      s.aptWeek    = 0;
      s.aptWeekDate = week;
    }
    save(s);
    return s;
  }

  function markStudy(s) {
    var today = SHIBI.Time.todayStr();
    if (s.lastActiveDate !== today) {
      if (s.lastActiveDate) {
        var diff = Math.round((new Date(today) - new Date(s.lastActiveDate)) / 86400000);
        s.streak = (diff === 1) ? s.streak + 1 : 1;
      } else {
        s.streak = 1;
      }
      s.lastActiveDate = today;
    }
    return s;
  }

  return { load, save, reset, dailyReset, markStudy, defaultState };
})();
