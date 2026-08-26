const Lectures = {
  filters: { day: 'all', subject: 'all' },

  init() {
    const sel = document.getElementById('lectures-subject');
    Store.state.subjects.forEach(function (s) {
      sel.innerHTML += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    });
    sel.addEventListener('change', function () { Lectures.filters.subject = sel.value; Lectures.render(); });
    document.querySelectorAll('.sh-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        const all = document.querySelectorAll('.sh-filter');
        all.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        Lectures.filters.day = b.dataset.day;
        Lectures.render();
      });
    });
    Lectures.render();
    App.maybeFlash();
  },

  filtered() {
    let list = Store.state.lectures.slice();
    if (this.filters.subject !== 'all') list = list.filter(function (l) { return l.subjectId === Lectures.filters.subject; });
    if (this.filters.day !== 'all') list = list.filter(function (l) { return l.day === +Lectures.filters.day; });
    return list.sort(function (a, b) { return a.day - b.day || a.time.localeCompare(b.time); });
  },

  render() {
    const el = document.getElementById('lectures-list');
    if (!el) return;
    const list = this.filtered();
    if (!list.length) {
      el.innerHTML = '<div class="col-span-full bg-surface-container-low rounded-[16px] border border-dashed border-outline-variant p-8 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">' +
        '<div class="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant mb-2">' +
        '<span class="material-symbols-outlined text-[24px]">movie</span></div>' +
        '<h3 class="font-bold text-lg text-on-surface dark:text-white">لا توجد محاضرات</h3>' +
        '<p class="text-sm text-on-surface-variant max-w-[250px] mb-2">قم بإضافة محاضرة جديدة للبدء في تنظيم جدولك الدراسي.</p>' +
        '<button onclick="Lectures.openForm()" class="text-primary font-bold text-sm hover:underline">إضافة الآن</button></div>';
      return;
    }
    const typeIcon = { lecture: '🎥', section: '🔬', lab: '💻' };
    const typeLabel = { lecture: 'محاضرة', section: 'سكشن', lab: 'معمل' };
    let html = '';
    list.forEach(function (l) {
      const sub = Store.subject(l.subjectId);
      const color = sub ? sub.color : '#6366f1';
      const ic = typeIcon[l.type] || '🎥';
      const tl = typeLabel[l.type] || 'محاضرة';
      html += '<div class="bg-surface-container-lowest dark:bg-slate-800 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 border border-outline-variant/30 flex flex-col gap-3 relative overflow-hidden group" data-id="' + l.id + '">' +
        '<div class="absolute top-0 right-0 w-1/2 h-full -z-10 transition-all duration-300" style="background: linear-gradient(to left, ' + color + '15, transparent)"></div>' +
        '<div class="flex justify-between items-start gap-2">' +
        '<div class="flex flex-wrap gap-1.5">' +
        '<span class="font-bold text-[10px] px-2 py-0.5 rounded-md border" style="background:' + color + '15;color:' + color + ';border-color:' + color + '30">' + escapeHtml(Store.subjectName(l.subjectId)) + '</span>' +
        '<span class="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold text-[10px] px-2 py-0.5 rounded-md">' + ic + ' ' + tl + '</span>' +
        '</div>' +
        '<div class="flex gap-1 shrink-0">' +
        '<button class="sh-btn ghost !p-1.5 !min-h-[30px] hover:!bg-primary/10" title="تعديل" onclick="Lectures.openForm(\'' + l.id + '\')"><span class="material-symbols-outlined text-[16px]">edit</span></button>' +
        '<button class="sh-btn danger !p-1.5 !min-h-[30px] hover:!bg-red-600/20" title="حذف" onclick="Lectures.del(\'' + l.id + '\')"><span class="material-symbols-outlined text-[16px]">delete</span></button>' +
        '</div></div>' +
        '<div>' +
        '<h3 class="font-bold text-base text-on-surface dark:text-white mb-1">' + escapeHtml(l.title) + '</h3>' +
        (l.notes ? '<p class="text-xs text-on-surface-variant dark:text-slate-400">' + escapeHtml(l.notes) + '</p>' : '') +
        '</div>' +
        '<div class="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400 mt-1">' +
        (l.location ? '<span class="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">📍 ' + escapeHtml(l.location) + '</span>' : '') +
        (l.link ? '<a class="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 px-2 py-0.5 rounded hover:opacity-80" href="' + l.link + '" target="_blank" rel="noopener">🔗 رابط البث</a>' : '') +
        (l.slides ? '<a class="bg-amber-50 dark:bg-amber-950/50 text-amber-600 px-2 py-0.5 rounded hover:opacity-80" href="' + l.slides + '" target="_blank" rel="noopener">📑 السلايدات</a>' : '') +
        '</div>' +
        '<div class="mt-auto pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">' +
        '<div class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">schedule</span><span>' + formatTime(l.time) + '</span></div>' +
        '<div class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">calendar_today</span><span>' + DAYS_AR[l.day] + '</span></div>' +
        '</div></div>';
    });
    el.innerHTML = html;
  },

  del(id) {
    App.confirm('حذف المحاضرة؟', 'مش هتقدر ترجعها بعد الحذف.', function () {
      Store.remove('lectures', id);
      App.toast('تم الحذف');
      Lectures.render();
    }, true);
  },

  openForm(id) {
    const l = id ? Store.state.lectures.find(function (x) { return x.id === id; }) : null;
    const subjectsOpts = Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '"' + (l && l.subjectId === s.id ? ' selected' : '') + '>' + escapeHtml(s.name) + '</option>';
    }).join('');
    const daysOpts = DAYS_AR.map(function (d, i) {
      return '<option value="' + i + '"' + (l && l.day === i ? ' selected' : '') + '>' + d + '</option>';
    }).join('');
    const lt = (L && L.lectureType) || { lecture: 'محاضرة', section: 'سكشن', lab: 'معمل' };
    const isUni = L.isUni();
    const typeOpts = (function () {
      const types = [
        { v: 'lecture', l: '🎥 ' + (isUni ? lt.lecture : 'محاضرة') },
        { v: 'section', l: '🔬 ' + (isUni ? lt.section : 'سكشن') },
        { v: 'lab', l: '💻 ' + (isUni ? lt.lab : 'معمل') }
      ];
      return types.map(function (t) {
        return '<option value="' + t.v + '"' + (l && l.type === t.v ? ' selected' : '') + '>' + t.l + '</option>';
      }).join('');
    })();
    const locationPh = isUni ? 'مثال: مدرج أ، مبنى ب، معمل 3' : 'مثال: قاعة 5، فصل 2';
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (l ? 'تعديل محاضرة' : 'محاضرة جديدة') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">اسم المحاضرة</label>' +
      '<input id="lf-title" class="sh-input mb-3" placeholder="مثال: محاضرة ٥ - المتجهات" value="' + (l ? escapeHtml(l.title) : '') + '">' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">' +
      '<div><label class="block text-sm font-bold mb-1">المادة</label><select id="lf-subject" class="sh-input">' + subjectsOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">النوع</label><select id="lf-type" class="sh-input">' + typeOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">اليوم</label><select id="lf-day" class="sh-input">' + daysOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">الوقت</label><input id="lf-time" type="time" class="sh-input" value="' + (l ? l.time : '09:00') + '"></div>' +
      '</div>' +
      '<label class="block text-sm font-bold mb-1">المكان ' + (isUni ? '(مدرج/معمل/مبنى)' : '(قاعة/فصل)') + '</label>' +
      '<input id="lf-location" class="sh-input mb-3" placeholder="' + locationPh + '" value="' + (l ? escapeHtml(l.location || '') : '') + '">' +
      '<label class="block text-sm font-bold mb-1">رابط المحاضرة (زووم/يوتيوب)</label>' +
      '<input id="lf-link" class="sh-input mb-3" type="url" placeholder="https://..." value="' + (l ? escapeHtml(l.link || '') : '') + '">' +
      '<label class="block text-sm font-bold mb-1">رابط السلايدات/الملفات (Drive/Telegram)</label>' +
      '<input id="lf-slides" class="sh-input mb-3" type="url" placeholder="https://drive.google.com/..." value="' + (l ? escapeHtml(l.slides || '') : '') + '">' +
      '<label class="block text-sm font-bold mb-1">ملاحظات</label>' +
      '<textarea id="lf-notes" class="sh-input mb-4" rows="2">' + (l ? escapeHtml(l.notes || '') : '') + '</textarea>' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="lf-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="lf-save">حفظ</button></div>'
    );
    modal.querySelector('#lf-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#lf-save').addEventListener('click', function () {
      const title = modal.querySelector('#lf-title').value.trim();
      const time = modal.querySelector('#lf-time').value;
      if (!title || !time) { App.toast('اكتب اسم المحاضرة والوقت', 'warning'); return; }
      const data = {
        title: title,
        subjectId: modal.querySelector('#lf-subject').value,
        type: modal.querySelector('#lf-type').value,
        day: +modal.querySelector('#lf-day').value,
        time: time,
        location: modal.querySelector('#lf-location').value.trim(),
        link: modal.querySelector('#lf-link').value.trim(),
        slides: modal.querySelector('#lf-slides').value.trim(),
        notes: modal.querySelector('#lf-notes').value.trim()
      };
      if (l) {
        Store.update('lectures', l.id, data);
        App.toast('تم التعديل ✅');
      } else {
        Store.add('lectures', Object.assign({ id: uid() }, data));
        App.toast('تمت إضافة المحاضرة 🎉');
      }
      App.closeModal();
      Lectures.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Lectures.init(); });