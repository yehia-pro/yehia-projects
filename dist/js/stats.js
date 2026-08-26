const BADGES = [
  { id: 'first-task', emoji: '🎯', name: 'أول مهمة', desc: 'أكمل أول مهمة' },
  { id: 'task-10', emoji: '💪', name: 'إنطلاقة', desc: 'أكمل ١٠ مهام' },
  { id: 'task-50', emoji: '🚀', name: 'ماكنة مهام', desc: 'أكمل ٥٠ مهمة' },
  { id: 'first-exam', emoji: '📝', name: 'أول امتحان', desc: 'أضف أول امتحان' },
  { id: 'first-lecture', emoji: '🎬', name: 'أول محاضرة', desc: 'أضف أول محاضرة' },
  { id: 'first-resource', emoji: '📌', name: 'أول مرجع', desc: 'أضف أول مرجع' },
  { id: 'pomo-1', emoji: '🍅', name: 'جلسة بومودورو', desc: 'أكمل أول جلسة تركيز' },
  { id: 'pomo-10', emoji: '🍅', name: 'تركيز عالي', desc: 'أكمل ١٠ جلسات تركيز' },
  { id: 'grade-3', emoji: '📊', name: 'تقييم منتظم', desc: 'سجل ٣ درجات' },
  { id: 'streak-3', emoji: '🔥', name: 'سلسلة', desc: 'سلسلة ٣ أيام' },
  { id: 'streak-7', emoji: '🔥', name: 'أسبوع نار', desc: 'سلسلة ٧ أيام' }
];

const GW = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const Stats = {
  init() {
    document.getElementById('stats-date').textContent = 'اليوم: ' + formatArDate(localDateStr());
    Stats.renderAll();
    App.maybeFlash();
  },

  renderAll() {
    Stats.renderGamification();
    Stats.renderCards();
    Stats.renderWeek();
    Stats.renderGrades();
    Stats.renderBadges();
  },

  renderGamification() {
    if (!Store.getUserXP) return;
    const uXP = Store.getUserXP();
    const badgeEl = document.getElementById('stats-hero-badge');
    const rankEl = document.getElementById('stats-hero-rank');
    const levelEl = document.getElementById('stats-hero-level');
    const totalXpEl = document.getElementById('stats-hero-total-xp');
    const pctEl = document.getElementById('stats-hero-pct');
    const barEl = document.getElementById('stats-hero-bar');
    const neededEl = document.getElementById('stats-hero-needed');

    if (badgeEl) badgeEl.textContent = uXP.rank.badge;
    if (rankEl) rankEl.textContent = uXP.rank.title;
    if (levelEl) levelEl.textContent = uXP.level;
    if (totalXpEl) totalXpEl.textContent = uXP.xp;
    if (pctEl) pctEl.textContent = `${uXP.levelPercent}%`;
    if (barEl) barEl.style.width = `${uXP.levelPercent}%`;
    if (neededEl) neededEl.textContent = `${uXP.levelTotalXPNeeded - uXP.levelProgressXP} XP متبقية للمستوى القادم`;
  },

  renderCards() {
    const el = document.getElementById('stats-cards');
    const today = localDateStr();
    const allTasks = Store.state.tasks.length;
    const done = Store.state.tasks.filter(function (t) { return t.completed; }).length;
    const taskPct = allTasks > 0 ? Math.round((done / allTasks) * 100) : 0;
    const exams = Store.state.exams.filter(function (e) { return daysBetween(e.date, today) >= 0; }).length;
    const todayMinutes = Store.studyMinutes(today);
    const studyPct = Math.min(100, Math.round((todayMinutes / 120) * 100)); // Target 120 mins
    const pomoCount = Store.state.pomodoroSessions.length;
    const pomoPct = Math.min(100, Math.round((pomoCount / 8) * 100));

    const labels = [
      { name: 'دقايق النهارده', val: todayMinutes + ' د', icon: '⏱️', pct: studyPct, sub: 'من هدف ساعتين' },
      { name: 'إنجاز المهام', val: done + ' / ' + allTasks, icon: '✅', pct: taskPct, sub: taskPct + '% نسبة الإنجاز' },
      { name: 'امتحانات قادمة', val: exams, icon: '📅', pct: Math.min(100, exams * 25), sub: 'مجدولة' },
      { name: 'جلسات تركيز', val: pomoCount, icon: '🍅', pct: pomoPct, sub: pomoCount + ' جلسات بومودورو' }
    ];

    el.innerHTML = labels.map(function (l) {
      return '<div class="sh-card p-4 flex flex-col gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800">' +
        '<div class="flex items-center justify-between"><div class="text-xl">' + l.icon + '</div><span class="text-[10px] font-bold text-slate-400 font-mono">' + l.sub + '</span></div>' +
        '<div class="font-black text-2xl text-slate-800 dark:text-white font-mono">' + l.val + '</div>' +
        '<div class="text-xs font-bold text-slate-500">' + l.name + '</div>' +
        '<div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5"><div class="h-full rounded-full transition-all duration-700 bg-indigo-600 dark:bg-indigo-500" style="width:' + l.pct + '%"></div></div>' +
        '</div>';
    }).join('');
  },

  renderWeek() {
    const el = document.getElementById('stats-week-bars');
    const days = [];
    for (let i = 6; i >= 0; i--) days.push(addDaysStr((-1) * i));
    const max = Math.max.apply(null, days.map(function (d) { return Store.studyMinutes(d); }).concat([1]));
    el.innerHTML = days.map(function (d) {
      const mins = Store.studyMinutes(d);
      const h = Math.max(4, Math.round((mins / max) * 100));
      const today = d === localDateStr();
      return '<div class="flex-1 flex flex-col items-center gap-1.5 min-w-0">' +
        '<div class="text-[10px] font-bold text-slate-400">' + (today ? 'النهارده' : GW[new Date(d + 'T00:00:00').getDay()]) + '</div>' +
        '<div class="w-full flex-1 flex items-end"><div class="w-full rounded-t-md" style="height:' + h + '%;min-height:4px;background:' + (today ? 'var(--sh-primary)' : 'var(--sh-success)') + '" title="' + mins + ' دقيقة"></div></div>' +
        '<div class="text-[10px] font-black text-slate-500">' + mins + '</div>' +
        '</div>';
    }).join('');
  },

  renderGrades() {
    const el = document.getElementById('stats-grades');
    const list = Store.state.grades;
    if (!list.length) {
      el.innerHTML = '<div class="sh-empty !p-4"><div class="sh-empty-icon">🎯</div><div class="text-sm">سجل أول درجة عشان تشوف تقدمك</div></div>';
      return;
    }
    const sorted = list.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    el.innerHTML = sorted.map(function (g) {
      const pct = Math.round((g.score / g.max) * 100);
      const color = pct >= 85 ? 'var(--sh-success)' : pct >= 60 ? 'var(--sh-primary)' : 'var(--sh-danger)';
      return '<div class="flex items-center gap-3" data-id="' + g.id + '">' +
        '<div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0" style="background:' + color + ';color:#fff">' + pct + '%</div>' +
        '<div class="flex-1 min-w-0">' +
        '<div class="font-bold text-sm text-slate-800 dark:text-white truncate">' + escapeHtml(g.name) + '</div>' +
        '<div class="text-[11px] font-bold text-slate-400">' + Store.subjectName(g.subjectId) + ' • ' + g.score + ' من ' + g.max + ' • ' + formatArDate(g.date) + '</div>' +
        '</div>' +
        '<div class="flex gap-1 shrink-0">' +
        '<button class="sh-btn ghost !p-1.5 text-xs" title="تعديل" onclick="Stats.openGradeForm(\'' + g.id + '\')">✏️</button>' +
        '<button class="sh-btn danger !p-1.5 text-xs" title="حذف" onclick="Stats.delGrade(\'' + g.id + '\')">🗑️</button></div>' +
        '</div>';
    }).join('');
  },

  renderBadges() {
    const el = document.getElementById('stats-badges');
    const status = Stats.badgeStatus();
    el.innerHTML = BADGES.map(function (b) {
      const s = status[b.id];
      return '<div class="sh-badge-card' + (s.completed ? '' : ' locked') + '" title="' + escapeHtml(b.desc) + '">' +
        '<div class="text-2xl">' + b.emoji + '</div>' +
        '<div class="text-[11px] font-extrabold mt-1">' + b.name + '</div>' +
        (s.completed ? '<div class="text-[9px] text-slate-400">' + formatArDate(b.date) + '</div>' : '<div class="text-[9px] text-slate-400">🔒 ' + s.progress + '</div>') +
        '</div>';
    }).join('');
  },

  badgeStatus() {
    const s = { completed: {}, locked: {} };
    const done = Store.state.tasks.filter(function (t) { return t.completed; }).length;
    const pomo = Store.state.pomodoroSessions.length;
    const exams = Store.state.exams.length;
    const lectures = Store.state.lectures.length;
    const resources = Store.state.resources.length;
    const grades = Store.state.grades.length;
    const streak = Store.state.streak.count;
    const today = localDateStr();
    const last = Store.state.completedDates || [];
    function complete(id) { s[id] = { completed: true, date: last[last.length - 1] || today }; }
    function locked(id, progress) { s[id] = { completed: false, progress: progress }; }
    if (done >= 1) complete('first-task'); else locked('first-task', done + '/1');
    if (done >= 10) complete('task-10'); else locked('task-10', done + '/10');
    if (done >= 50) complete('task-50'); else locked('task-50', done + '/50');
    if (exams >= 1) complete('first-exam'); else locked('first-exam', exams + '/1');
    if (lectures >= 1) complete('first-lecture'); else locked('first-lecture', lectures + '/1');
    if (resources >= 1) complete('first-resource'); else locked('first-resource', resources + '/1');
    if (pomo >= 1) complete('pomo-1'); else locked('pomo-1', pomo + '/1');
    if (pomo >= 10) complete('pomo-10'); else locked('pomo-10', pomo + '/10');
    if (grades >= 3) complete('grade-3'); else locked('grade-3', grades + '/3');
    if (streak >= 3) complete('streak-3'); else locked('streak-3', streak + '/3');
    if (streak >= 7) complete('streak-7'); else locked('streak-7', streak + '/7');
    return s;
  },

  delGrade(id) {
    App.confirm('حذف الدرجة؟', '', function () {
      Store.remove('grades', id);
      App.toast('تم الحذف');
      Stats.renderGrades();
    }, true);
  },

  openGradeForm(id) {
    const g = id ? Store.state.grades.find(function (x) { return x.id === id; }) : null;
    const subjectsOpts = Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '"' + (g && g.subjectId === s.id ? ' selected' : '') + '>' + escapeHtml(s.name) + '</option>';
    }).join('');
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (g ? 'تعديل درجة' : 'درجة جديدة') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">اسم الاختبار</label>' +
      '<input id="gf-name" class="sh-input mb-3" placeholder="مثال: شيت ٣" value="' + (g ? escapeHtml(g.name) : '') + '">' +
      '<div class="grid grid-cols-3 gap-3 mb-3">' +
      '<div><label class="block text-sm font-bold mb-1">المادة</label><select id="gf-subject" class="sh-input">' + subjectsOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">الدرجة</label><input id="gf-score" type="number" min="0" class="sh-input" value="' + (g ? g.score : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">من</label><input id="gf-max" type="number" min="1" class="sh-input" value="' + (g ? g.max : '100') + '"></div>' +
      '</div>' +
      '<label class="block text-sm font-bold mb-1">التاريخ</label>' +
      '<input id="gf-date" type="date" class="sh-input mb-4" value="' + (g ? g.date : localDateStr()) + '">' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="gf-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="gf-save">حفظ</button></div>'
    );
    modal.querySelector('#gf-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#gf-save').addEventListener('click', function () {
      const name = modal.querySelector('#gf-name').value.trim();
      const score = +modal.querySelector('#gf-score').value;
      const max = +modal.querySelector('#gf-max').value;
      if (!name || isNaN(score) || isNaN(max) || max <= 0) { App.toast('اكمل البيانات صح', 'warning'); return; }
      const data = {
        name: name,
        subjectId: modal.querySelector('#gf-subject').value,
        score: score,
        max: max,
        date: modal.querySelector('#gf-date').value
      };
      if (g) {
        Store.update('grades', g.id, data);
        App.toast('تم التعديل ✅');
      } else {
        Store.add('grades', Object.assign({ id: uid() }, data));
        App.toast('تمت إضافة الدرجة 🎉');
      }
      App.closeModal();
      Stats.renderAll();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Stats.init(); });