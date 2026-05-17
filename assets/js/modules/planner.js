/* modules/planner.js — daily planner CRUD */
window.SHIBI = window.SHIBI || {};
window.SHIBI.Planner = (function () {

  function taskNode(s, t) {
    var li = document.createElement('li');
    if (t.done) li.classList.add('done');
    li.innerHTML =
      '<button class="task-action toggle" title="Toggle">' +
        '<i class="bi ' + (t.done ? 'bi-check-square-fill' : 'bi-square') + '"></i>' +
      '</button>' +
      '<span class="task-text">' + SHIBI.Utils.escapeHtml(t.text) + '</span>' +
      '<span class="task-prio ' + t.prio + '">' + t.prio.toUpperCase() + '</span>' +
      '<button class="task-action del" title="Delete"><i class="bi bi-x-lg"></i></button>';

    li.querySelector('.toggle').addEventListener('click', function () {
      t.done = !t.done;
      if (t.done) {
        SHIBI.State.markStudy(s);
        SHIBI.Gamify.addXP(s, 5, 'Task completed');
      }
      SHIBI.State.save(s);
      renderTasks(s);
      SHIBI.Home.render(s);
      SHIBI.Gamify.checkBadges(s);
    });
    li.querySelector('.del').addEventListener('click', function () {
      s.tasks = s.tasks.filter(function (x) { return x.id !== t.id; });
      SHIBI.State.save(s);
      renderTasks(s);
      SHIBI.Home.render(s);
    });
    return li;
  }

  function renderTasks(s) {
    var pending = document.getElementById('pendingList');
    var done    = document.getElementById('doneList');
    if (!pending || !done) return;
    pending.innerHTML = '';
    done.innerHTML    = '';

    var pendingArr = s.tasks.filter(function (t) { return !t.done; });
    var doneArr    = s.tasks.filter(function (t) { return t.done; });

    pendingArr.forEach(function (t) { pending.appendChild(taskNode(s, t)); });
    doneArr.forEach(function (t)    { done.appendChild(taskNode(s, t)); });

    var pc = document.getElementById('pendingCount');
    var dc = document.getElementById('doneCount');
    var pe = document.getElementById('pendingEmpty');
    var de = document.getElementById('doneEmpty');
    if (pc) pc.textContent = pendingArr.length;
    if (dc) dc.textContent = doneArr.length;
    if (pe) pe.style.display = pendingArr.length ? 'none' : 'block';
    if (de) de.style.display = doneArr.length    ? 'none' : 'block';
  }

  function renderGoals(s) {
    var ul    = document.getElementById('goalsList');
    var empty = document.getElementById('goalsEmpty');
    if (!ul) return;
    ul.innerHTML = '';
    if (s.goals.length === 0) {
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    s.goals.forEach(function (g) {
      var li = document.createElement('li');
      if (g.done) li.classList.add('done');
      li.innerHTML =
        '<span class="goal-check ' + (g.done ? 'checked' : '') + '">' + (g.done ? '✓' : '') + '</span>' +
        '<span class="goal-text">' + SHIBI.Utils.escapeHtml(g.text) + '</span>' +
        '<button class="goal-del" title="Delete">×</button>';
      li.querySelector('.goal-check').addEventListener('click', function () {
        g.done = !g.done; SHIBI.State.save(s); renderGoals(s); SHIBI.Home.render(s);
      });
      li.querySelector('.goal-del').addEventListener('click', function () {
        s.goals = s.goals.filter(function (x) { return x.id !== g.id; });
        SHIBI.State.save(s); renderGoals(s);
      });
      ul.appendChild(li);
    });
  }

  function init(s) {
    var addBtn   = document.getElementById('addTaskBtn');
    var taskInp  = document.getElementById('taskInput');
    var taskPrio = document.getElementById('taskPriority');
    var notesEl  = document.getElementById('notesArea');
    var addGoal  = document.getElementById('addGoalBtn');

    if (addBtn) addBtn.addEventListener('click', function () {
      var text = taskInp ? taskInp.value.trim() : '';
      if (!text) return;
      var prio = taskPrio ? taskPrio.value : 'medium';
      s.tasks.push({ id: Date.now(), text: text, prio: prio, done: false });
      if (taskInp) taskInp.value = '';
      SHIBI.State.save(s);
      renderTasks(s);
      SHIBI.Home.render(s);
      SHIBI.Utils.toast('Task added');
    });

    if (taskInp) taskInp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && addBtn) addBtn.click();
    });

    if (notesEl) {
      notesEl.value = s.notes || '';
      notesEl.addEventListener('input', function () {
        s.notes = notesEl.value; SHIBI.State.save(s);
      });
    }

    if (addGoal) addGoal.addEventListener('click', function () {
      var text = prompt('New weekly goal:');
      if (!text || !text.trim()) return;
      s.goals.push({ id: Date.now(), text: text.trim(), done: false });
      SHIBI.State.save(s);
      renderGoals(s);
      SHIBI.Utils.toast('Goal added');
    });

    renderTasks(s);
    renderGoals(s);
  }

  return { init, renderTasks, renderGoals };
})();
