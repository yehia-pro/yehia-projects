const Exams = {
  filters: { status: 'upcoming', subject: 'all' },

  init() {
    const sel = document.getElementById('exams-subject');
    Store.state.subjects.forEach(function (s) {
      sel.innerHTML += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    });
    sel.addEventListener('change', function () { Exams.filters.subject = sel.value; Exams.render(); });
    document.querySelectorAll('.sh-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.sh-filter').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        Exams.filters.status = b.dataset.filter;
        Exams.render();
      });
    });
    Exams.render();
    App.maybeFlash();
  },

  filtered() {
    const today = localDateStr();
    let list = Store.state.exams.slice();
    if (this.filters.subject !== 'all') list = list.filter(function (e) { return e.subjectId === Exams.filters.subject; });
    if (this.filters.status === 'upcoming') {
      list = list.filter(function (e) { return daysBetween(e.date, today) >= 0; });
    } else if (this.filters.status === 'previous') {
      list = list.filter(function (e) { return daysBetween(e.date, today) < 0; });
    }
    return list.sort(function (a, b) { return a.date.localeCompare(b.date) || a.time.localeCompare(b.time); });
  },

  render() {
    const el = document.getElementById('exams-list');
    if (!el) return;
    const list = this.filtered();
    if (!list.length) {
      el.innerHTML = '<div class="col-span-full bg-surface-container-low rounded-[16px] border border-dashed border-outline-variant p-8 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">' +
        '<div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant mb-2">' +
        '<span class="material-symbols-outlined text-[24px]">event_note</span></div>' +
        '<h3 class="font-bold text-lg text-on-surface dark:text-white">لا توجد امتحانات</h3>' +
        '<p class="text-sm text-on-surface-variant max-w-[250px] mb-2">سجل امتحاناتك القادمة لمتابعة عدها التنازلي والاستعداد لها.</p>' +
        '<button onclick="Exams.openForm()" class="text-primary font-bold text-sm hover:underline">إضافة الآن</button></div>';
      return;
    }
    el.innerHTML = list.map(function (e) {
      const today = localDateStr();
      const diff = daysBetween(e.date, today);
      const soon = diff >= 0 && diff <= 2;
      const sub = Store.subject(e.subjectId);
      const color = sub ? sub.color : '#6366f1';

      // Countdown display
      let countdownHtml = '';
      if (diff === 0) {
        countdownHtml = '<div class="flex flex-col items-end text-error"><span class="font-black text-lg">اليوم</span><span class="text-[9px] font-bold">🔥 عاجل</span></div>';
      } else if (diff > 0) {
        countdownHtml = '<div class="flex flex-col items-end ' + (soon ? 'text-error' : 'text-primary dark:text-primary-fixed') + '">' +
          '<span class="font-black text-lg leading-none">' + diff + '</span>' +
          '<span class="text-[9px] font-bold mt-0.5">' + (diff === 1 ? 'يوم' : 'أيام') + '</span></div>';
      } else {
        countdownHtml = '<div class="flex flex-col items-end text-slate-400"><span class="font-bold text-xs">منتهي</span></div>';
      }

      return '<div class="bg-surface-container-lowest dark:bg-slate-800 rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-2 ' + (soon ? 'border-error' : 'border-outline-variant/30') + ' relative overflow-hidden flex flex-col group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all" data-id="' + e.id + '">' +
        (soon ? '<div class="absolute top-0 left-0 w-full h-1 bg-error"></div>' : '') +
        '<div class="flex justify-between items-start mb-3 gap-2">' +
        '<div class="flex flex-wrap gap-1.5">' +
        '<span class="font-bold text-[10px] px-2 py-0.5 rounded-md border" style="background:' + color + '15;color:' + color + ';border-color:' + color + '30">' + escapeHtml(Store.subjectName(e.subjectId)) + '</span>' +
        '</div>' +
        countdownHtml +
        '</div>' +
        '<div class="flex-1">' +
        '<h3 class="font-bold text-base text-on-surface dark:text-white mb-1">' + escapeHtml(e.title) + '</h3>' +
        (e.notes ? '<p class="text-xs text-on-surface-variant dark:text-slate-400 mb-3">' + escapeHtml(e.notes) + '</p>' : '<div class="h-2"></div>') +
        '</div>' +
        '<div class="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/30">' +
        '<div class="flex items-center text-slate-500 dark:text-slate-400 gap-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">' +
        '<span class="material-symbols-outlined text-[16px]">calendar_today</span>' +
        '<span>' + formatArDate(e.date) + (e.time ? ' • ' + formatTime(e.time) : '') + (e.location ? ' • 📍 ' + escapeHtml(e.location) : '') + '</span>' +
        '</div>' +
        '<div class="flex gap-1 shrink-0">' +
        '<button class="sh-btn ghost !p-1.5 !min-h-[30px] hover:!bg-primary/10" title="تعديل" onclick="Exams.openForm(\'' + e.id + '\')"><span class="material-symbols-outlined text-[16px]">edit</span></button>' +
        '<button class="sh-btn danger !p-1.5 !min-h-[30px] hover:!bg-red-600/20" title="حذف" onclick="Exams.del(\'' + e.id + '\')"><span class="material-symbols-outlined text-[16px]">delete</span></button>' +
        '</div></div></div>';
    }).join('');
  },

  del(id) {
    App.confirm('حذف الامتحان؟', 'مش هتقدر ترجعه بعد الحذف.', function () {
      Store.remove('exams', id);
      App.toast('تم الحذف');
      Exams.render();
    }, true);
  },

  openForm(id) {
    const e = id ? Store.state.exams.find(function (x) { return x.id === id; }) : null;
    const subjectsOpts = Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '"' + (e && e.subjectId === s.id ? ' selected' : '') + '>' + escapeHtml(s.name) + '</option>';
    }).join('');
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (e ? 'تعديل امتحان' : 'امتحان جديد') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">اسم الامتحان</label>' +
      '<input id="ef-title" class="sh-input mb-3" placeholder="مثال: ميدتيرم تفاضل وتكامل" value="' + (e ? escapeHtml(e.title) : '') + '">' +
      '<div class="grid grid-cols-2 gap-3 mb-3">' +
      '<div><label class="block text-sm font-bold mb-1">المادة</label><select id="ef-subject" class="sh-input">' + subjectsOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">التاريخ</label><input id="ef-date" type="date" class="sh-input" value="' + (e ? e.date : addDaysStr(7)) + '"></div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-3 mb-3">' +
      '<div><label class="block text-sm font-bold mb-1">الوقت</label><input id="ef-time" type="time" class="sh-input" value="' + (e ? e.time || '' : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">المكان</label><input id="ef-location" class="sh-input" placeholder="قاعة 3" value="' + (e ? escapeHtml(e.location || '') : '') + '"></div>' +
      '</div>' +
      '<label class="block text-sm font-bold mb-1">ملاحظات</label>' +
      '<textarea id="ef-notes" class="sh-input mb-4" rows="2">' + (e ? escapeHtml(e.notes || '') : '') + '</textarea>' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="ef-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="ef-save">حفظ</button></div>'
    );
    modal.querySelector('#ef-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#ef-save').addEventListener('click', function () {
      const title = modal.querySelector('#ef-title').value.trim();
      const date = modal.querySelector('#ef-date').value;
      if (!title || !date) { App.toast('اكتب اسم الامتحان والتاريخ', 'warning'); return; }
      const data = {
        title: title,
        subjectId: modal.querySelector('#ef-subject').value,
        date: date,
        time: modal.querySelector('#ef-time').value || '',
        location: modal.querySelector('#ef-location').value.trim(),
        notes: modal.querySelector('#ef-notes').value.trim()
      };
      if (e) {
        Store.update('exams', e.id, data);
        App.toast('تم التعديل ✅');
      } else {
        Store.add('exams', Object.assign({ id: uid() }, data));
        App.toast('تمت إضافة الامتحان 🎉');
      }
      App.closeModal();
      Exams.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Exams.init(); });
