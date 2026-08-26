const Tasks = {
  filters: { status: 'all', subject: 'all' },

  init() {
    const sel = document.getElementById('tasks-subject');
    Store.state.subjects.forEach(function (s) {
      sel.innerHTML += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    });
    const qs = new URLSearchParams(location.search).get('subject');
    if (qs) { this.filters.subject = qs; sel.value = qs; }
    sel.addEventListener('change', function () { Tasks.filters.subject = sel.value; Tasks.render(); });
    document.querySelectorAll('.sh-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.sh-filter').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        Tasks.filters.status = b.dataset.filter;
        Tasks.render();
      });
    });
    Tasks.render();
    App.maybeFlash();
  },

  filtered() {
    const today = localDateStr();
    let list = Store.state.tasks.slice();
    if (this.filters.subject !== 'all') list = list.filter(function (t) { return t.subjectId === Tasks.filters.subject; });
    const st = this.filters.status;
    if (st === 'open') list = list.filter(function (t) { return !t.completed; });
    if (st === 'done') list = list.filter(function (t) { return t.completed; });
    if (st === 'today') list = list.filter(function (t) { return !t.completed && t.dueDate === today; });
    if (st === 'week') list = list.filter(function (t) { return !t.completed && daysBetween(t.dueDate, today) >= 0 && daysBetween(t.dueDate, today) <= 7; });
    if (st === 'overdue') list = list.filter(function (t) { return !t.completed && t.dueDate < today; });
    return list.sort(function (a, b) {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  },

  render() {
    const el = document.getElementById('tasks-list');
    if (!el) return;
    const list = this.filtered();
    if (!list.length) {
      el.innerHTML = '<div class="col-span-full bg-surface-container-lowest dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center border border-dashed border-outline-variant justify-center min-h-[220px]">' +
        '<div class="w-16 h-16 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center mb-4 text-outline dark:text-slate-300">' +
        '<span class="material-symbols-outlined text-[32px]">playlist_add_check</span></div>' +
        '<p class="text-sm font-bold text-on-surface-variant dark:text-slate-300 text-center">لا توجد مهام حالية في هذا الفلتر</p>' +
        '<button onclick="Tasks.openForm()" class="mt-4 text-primary font-bold text-sm hover:underline">أضف مهمة جديدة</button></div>';
      return;
    }

    el.innerHTML = list.map(function (t) {
      const today = localDateStr();
      const diff = daysBetween(t.dueDate, today);
      const overdue = !t.completed && diff < 0;

      const sub = Store.subject(t.subjectId);
      const subColor = sub ? sub.color : '#6366f1';
      const subName = Store.subjectName(t.subjectId);

      const pm = PRIORITY_META[t.priority] || PRIORITY_META.medium;
      let prioCls = '';
      if (t.priority === 'high') prioCls = 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300';
      else if (t.priority === 'medium') prioCls = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
      else prioCls = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300';

      let statusHtml = '';
      if (t.completed) {
        statusHtml = '<div class="flex items-center gap-1 text-slate-400 font-bold text-xs"><span class="material-symbols-outlined text-[16px]">check_circle</span><span>مكتملة</span></div>';
      } else if (overdue) {
        statusHtml = '<div class="flex items-center gap-1 text-red-500 font-bold text-xs"><span class="material-symbols-outlined text-[16px]">schedule</span><span>متأخرة ' + (-diff) + ' يوم</span></div>';
      } else {
        statusHtml = '<div class="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-bold text-xs"><span class="material-symbols-outlined text-[16px]">schedule</span><span>' + relativeDay(t.dueDate) + ' • ' + formatArDate(t.dueDate) + '</span></div>';
      }

      return '<div class="bg-surface-container-lowest dark:bg-slate-800 p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-l-4 ' + (t.completed ? 'opacity-60 border-slate-300 dark:border-slate-700' : overdue ? 'border-red-500' : 'border-outline-variant/30') + ' flex flex-col gap-2 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]" data-id="' + t.id + '">' +
        '<div class="flex justify-between items-start gap-2">' +
        '<div class="flex flex-wrap gap-1.5 items-center">' +
        '<span class="font-bold text-[10px] px-2 py-0.5 rounded-md" style="background:' + subColor + '15; color:' + subColor + '">' + escapeHtml(subName) + '</span>' +
        '<span class="font-bold text-[10px] px-1.5 py-0.5 rounded-md ' + prioCls + '">' + pm.label + '</span>' +
        '</div>' +
        '<div class="flex items-center gap-1.5">' +
        '<button class="sh-btn ghost !p-1.5 !min-h-[30px] hover:!bg-primary/10" title="تعديل" onclick="event.stopPropagation(); Tasks.openForm(\'' + t.id + '\')"><span class="material-symbols-outlined text-[14px]">edit</span></button>' +
        '<button class="sh-btn danger !p-1.5 !min-h-[30px] hover:!bg-red-600/20" title="حذف" onclick="event.stopPropagation(); Tasks.del(\'' + t.id + '\')"><span class="material-symbols-outlined text-[14px]">delete</span></button>' +
        '<input type="checkbox" ' + (t.completed ? 'checked' : '') + ' onclick="Tasks.toggle(\'' + t.id + '\')" class="w-4.5 h-4.5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer shrink-0">' +
        '</div></div>' +
        '<div>' +
        '<h3 class="font-bold text-sm text-on-surface dark:text-white mb-2 ' + (t.completed ? 'line-through text-slate-400 dark:text-slate-500' : '') + '">' + escapeHtml(t.title) + '</h3>' +
        statusHtml +
        '</div></div>';
    }).join('');
  },

  toggle(id) {
    const t = Store.state.tasks.find(function (x) { return x.id === id; });
    if (!t) return;
    const now = !t.completed;
    Store.update('tasks', id, { completed: now, completedAt: now ? localDateStr() : null });
    if (now) {
      Store.updateStreak(true);
      App.sound('task');
      App.toast('مهمة خلصت 🎉 أحسنت!', 'success');
    }
    Tasks.render();
  },

  del(id) {
    App.confirm('حذف المهمة؟', 'مش هتقدر ترجعها بعد الحذف.', function () {
      Store.remove('tasks', id);
      App.toast('تم الحذف');
      Tasks.render();
    }, true);
  },

  openForm(id) {
    const t = id ? Store.state.tasks.find(function (x) { return x.id === id; }) : null;
    const subjectsOpts = Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '"' + (t && t.subjectId === s.id ? ' selected' : '') + '>' + escapeHtml(s.name) + '</option>';
    }).join('');
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (t ? 'تعديل مهمة' : 'مهمة جديدة') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">المهمة</label>' +
      '<input id="tf-title" class="sh-input mb-3" placeholder="مثال: حل شيت الفيزياء" value="' + (t ? escapeHtml(t.title) : '') + '">' +
      '<div class="grid grid-cols-2 gap-3 mb-3">' +
      '<div><label class="block text-sm font-bold mb-1">المادة</label><select id="tf-subject" class="sh-input">' + subjectsOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">الموعد</label><input id="tf-date" type="date" class="sh-input" value="' + (t ? t.dueDate : addDaysStr(1)) + '"></div>' +
      '</div>' +
      '<label class="block text-sm font-bold mb-1">الأولوية</label>' +
      '<div class="grid grid-cols-3 gap-2 mb-4">' +
      '<button class="sh-filter' + ((!t || t.priority === 'low') ? ' active' : '') + '" data-prio="low" style="background:#d1fae5;color:#047857">منخفضة</button>' +
      '<button class="sh-filter' + (t && t.priority === 'medium' ? ' active' : '') + '" data-prio="medium" style="background:#fef3c7;color:#b45309">متوسطة</button>' +
      '<button class="sh-filter' + (t && t.priority === 'high' ? ' active' : '') + '" data-prio="high" style="background:#fee2e2;color:#b91c1c">عالية</button>' +
      '</div>' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="tf-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="tf-save">حفظ</button></div>'
    );
    let prio = t ? t.priority : 'low';
    modal.querySelectorAll('[data-prio]').forEach(function (b) {
      b.addEventListener('click', function () {
        modal.querySelectorAll('[data-prio]').forEach(function (x) { x.classList.remove('active'); x.style.filter = 'grayscale(0.6)'; });
        b.classList.add('active'); b.style.filter = '';
        prio = b.dataset.prio;
      });
    });
    modal.querySelector('#tf-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#tf-save').addEventListener('click', function () {
      const title = modal.querySelector('#tf-title').value.trim();
      const date = modal.querySelector('#tf-date').value;
      const subjectId = modal.querySelector('#tf-subject').value;
      if (!title || !date) { App.toast('اكتب اسم المهمة والموعد', 'warning'); return; }
      if (t) {
        Store.update('tasks', t.id, { title: title, dueDate: date, subjectId: subjectId, priority: prio });
        App.toast('تم التعديل ✅');
      } else {
        Store.add('tasks', { id: uid(), subjectId: subjectId, title: title, dueDate: date, priority: prio, completed: false, createdAt: localDateStr(), completedAt: null });
        App.toast('تمت إضافة المهمة 🎉');
      }
      App.closeModal();
      Tasks.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Tasks.init(); });
