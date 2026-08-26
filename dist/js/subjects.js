const SUBJECT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16'];

const Subjects = {
  init() {
    Subjects.render();
    App.maybeFlash();
  },

  render() {
    const el = document.getElementById('subjects-grid');
    const list = Store.state.subjects;
    if (!list.length) {
      el.innerHTML = '<div class="sm:col-span-2 lg:col-span-3"><div class="sh-empty"><div class="sh-empty-icon">📚</div><div>مفيش مواد — أضف أول مادة!</div></div></div>';
      return;
    }
    el.innerHTML = list.map(function (s) {
      const openTasks = Store.state.tasks.filter(function (t) { return t.subjectId === s.id && !t.completed; }).length;
      const examsCount = Store.state.exams.filter(function (e) { return e.subjectId === s.id; }).length;
      const lecturesCount = Store.state.lectures.filter(function (l) { return l.subjectId === s.id; }).length;
      const minutes = Store.state.pomodoroSessions.filter(function (p) { return p.subjectId === s.id; }).reduce(function (sum, p) { return sum + (p.minutes || 0); }, 0);
      return '<div class="sh-card p-4 flex flex-col gap-3 relative" data-id="' + s.id + '">' +
        '<div class="flex items-center gap-3">' +
        '<div class="sh-swatch w-10 h-10 text-lg" style="background:' + s.color + ';color:#fff">' + escapeHtml(s.name.charAt(0)) + '</div>' +
        '<div class="flex-1 min-w-0"><div class="font-extrabold truncate text-slate-800 dark:text-white">' + escapeHtml(s.name) + '</div>' +
        '<div class="text-[11px] font-bold text-slate-400">' + minutes + ' دقيقة دراسة</div></div>' +
        '<div class="flex gap-1 shrink-0">' +
        '<button class="sh-btn ghost !p-2" title="تعديل" onclick="Subjects.openForm(\'' + s.id + '\')">✏️</button>' +
        '<button class="sh-btn danger !p-2" title="حذف" onclick="Subjects.del(\'' + s.id + '\')">🗑️</button></div></div>' +
        '<div class="flex flex-wrap gap-2 text-[11px] font-bold">' +
        '<a class="sh-chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:opacity-80" href="tasks.html?subject=' + s.id + '">📝 ' + openTasks + ' مهمة</a>' +
        '<a class="sh-chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:opacity-80" href="exams.html">📅 ' + examsCount + ' امتحان</a>' +
        '<a class="sh-chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:opacity-80" href="lectures.html">🎬 ' + lecturesCount + ' محاضرة</a>' +
        '</div></div>';
    }).join('');
  },

  del(id) {
    const hasRelated = Store.state.tasks.some(function (t) { return t.subjectId === id; }) ||
      Store.state.exams.some(function (e) { return e.subjectId === id; }) ||
      Store.state.lectures.some(function (l) { return l.subjectId === id; });
    const msg = hasRelated
      ? 'هتتحذف معاها كل المهام والامتحانات والمحاضرات الخاصة بيها.'
      : 'هتتحذف المادة نهائياً.';
    App.confirm('حذف المادة؟', msg, function () {
      ['tasks', 'exams', 'lectures', 'resources', 'pomodoroSessions'].forEach(function (k) {
        Store.state[k] = Store.state[k].filter(function (x) { return x.subjectId !== id; });
      });
      Store.remove('subjects', id);
      Store.save();
      App.toast('تم الحذف');
      Subjects.render();
    }, true);
  },

  openForm(id) {
    const s = id ? Store.state.subjects.find(function (x) { return x.id === id; }) : null;
    const usedColors = Store.state.subjects.map(function (x) { return x.color; });
    const swatches = SUBJECT_COLORS.map(function (c) {
      return '<button type="button" class="sh-swatch w-9 h-9' + ((s && s.color === c) || (!s && !usedColors.includes(c)) ? ' selected' : '') + '" data-color="' + c + '" style="background:' + c + '"></button>';
    }).join('');
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (s ? 'تعديل مادة' : 'مادة جديدة') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">اسم المادة</label>' +
      '<input id="sf-name" class="sh-input mb-4" placeholder="مثال: تفاضل وتكامل" value="' + (s ? escapeHtml(s.name) : '') + '">' +
      '<label class="block text-sm font-bold mb-2">اللون</label>' +
      '<div class="flex flex-wrap gap-2 mb-4" id="sf-colors">' + swatches + '</div>' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="sf-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="sf-save">حفظ</button></div>'
    );
    modal.querySelectorAll('#sf-colors .sh-swatch').forEach(function (b) {
      b.addEventListener('click', function () {
        modal.querySelectorAll('#sf-colors .sh-swatch').forEach(function (x) { x.classList.remove('selected'); });
        b.classList.add('selected');
      });
    });
    modal.querySelector('#sf-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#sf-save').addEventListener('click', function () {
      const name = modal.querySelector('#sf-name').value.trim();
      if (!name) { App.toast('اكتب اسم المادة', 'warning'); return; }
      const picked = modal.querySelector('#sf-colors .sh-swatch.selected');
      const color = picked ? picked.dataset.color : SUBJECT_COLORS[Store.state.subjects.length % SUBJECT_COLORS.length];
      if (s) {
        Store.update('subjects', s.id, { name: name, color: color });
        App.toast('تم التعديل ✅');
      } else {
        Store.add('subjects', { id: uid(), name: name, color: color });
        App.toast('تمت إضافة المادة 🎉');
      }
      App.closeModal();
      Subjects.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Subjects.init(); });