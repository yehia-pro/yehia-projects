const GROUPS_STATUS = {
  available: { label: 'متاح', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  paused: { label: 'متوقف', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  finished: { label: 'خلص', cls: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }
};

// الـ type يختلف حسب role (school/uni) — نحدّث القاموس في init
const GROUPS_TYPE = { course: 'كورس', private: 'خصوصي', section: 'سكشن', office_hours: 'ساعات مكتبية', other: 'أخرى' };

const Groups = {
  filters: { status: 'all', teacher: 'all' },

  init() {
    const sel = document.getElementById('groups-teacher');
    if (!sel) return;
    Store.state.teachers.forEach(function (t) {
      sel.innerHTML += '<option value="' + t.id + '">' + escapeHtml(t.name) + '</option>';
    });
    sel.addEventListener('change', function () { Groups.filters.teacher = sel.value; Groups.render(); });
    document.querySelectorAll('.sh-filter').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.sh-filter').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        Groups.filters.status = b.dataset.filter;
        Groups.render();
      });
    });
    Groups.render();
    App.maybeFlash();
  },

  filtered() {
    let list = Store.state.groups.slice();
    if (this.filters.teacher !== 'all') list = list.filter(function (g) { return g.teacherId === Groups.filters.teacher; });
    if (this.filters.status !== 'all') list = list.filter(function (g) { return g.status === Groups.filters.status; });
    return list;
  },

  teacherOf(g) {
    return Store.state.teachers.find(function (x) { return x.id === g.teacherId; }) || null;
  },

  render() {
    const el = document.getElementById('groups-list');
    const list = this.filtered();
    if (!list.length) {
      el.innerHTML = '<div class="md:col-span-2"><div class="sh-empty"><div class="sh-empty-icon">👥</div><div>مفيش مجموعات — أضف أول مجموعة!</div></div></div>';
      return;
    }
    el.innerHTML = list.map(function (g) {
      const tr = Groups.teacherOf(g);
      const st = GROUPS_STATUS[g.status] || GROUPS_STATUS.available;
      const typeLabel = GROUPS_TYPE[g.type] || g.type || '';
      const chips = [];
      if (tr) {
        chips.push('<span class="sh-chip bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">👨‍🏫 ' + escapeHtml(tr.name) + '</span>');
        if (tr.subjectId) chips.push(subjectChip(tr.subjectId));
      }
      if (typeLabel) chips.push('<span class="sh-chip bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">' + escapeHtml(typeLabel) + '</span>');
      const loc = g.location ? '<div class="text-xs font-bold text-slate-600 dark:text-slate-300">📍 ' + escapeHtml(g.location) +
        (g.mapUrl ? ' <a class="text-indigo-500 hover:underline" target="_blank" rel="noopener" href="' + escapeHtml(g.mapUrl) + '">الخريطة</a>' : '') + '</div>' : '';
      const sched = (g.schedule || []).map(function (s) {
        return '<span class="sh-chip bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">📅 ' + DAYS_AR[s.day] + ' ' + formatTime(s.time) + '</span>';
      }).join('');
      const fee = Number(g.monthlyFee) || 0;
      const paid = Number(g.paidThisMonth) || 0;
      const pct = fee > 0 ? Math.min(100, Math.round(paid / fee * 100)) : 0;
      let feeBlock = '';
      if (fee > 0) {
        feeBlock = '<div class="flex flex-col gap-1"><div class="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">' +
          '<span>💵 ' + fee + ' ج / شهري</span><span>مدفوع: ' + paid + ' ج</span></div>' +
          '<div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div class="h-2 rounded-full bg-emerald-500" style="width:' + pct + '%"></div></div></div>';
      } else if (paid > 0) {
        feeBlock = '<div class="text-xs font-bold text-slate-600 dark:text-slate-300">💵 مدفوع: ' + paid + ' ج</div>';
      }
      const remaining = Number(g.remainingSessions) > 0 ? '<span class="sh-chip bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">⏳ متبقي ' + g.remainingSessions + ' حصص</span>' : '';
      const waNumber = String(g.whatsapp || g.phone || '').replace(/\D/g, '');
      const phoneBtn = g.phone ? '<a class="sh-btn outline !p-2" title="اتصال" href="tel:' + encodeURIComponent(g.phone) + '">📞</a>' : '';
      const waBtn = waNumber ? '<a class="sh-btn outline !p-2" title="واتساب" href="https://wa.me/' + waNumber + '" target="_blank" rel="noopener">💬</a>' : '';
      const shareBtn = '<button class="sh-btn outline !p-2" title="تصدير ومشاركة كود الفصل" onclick="Groups.exportBundle(\'' + g.id + '\')">📤</button>';
      return '<div class="sh-card p-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800" data-id="' + g.id + '">' +
        '<div class="flex items-start justify-between gap-2">' +
        '<div class="font-extrabold truncate text-slate-800 dark:text-white">' + escapeHtml(g.name || 'بدون اسم') + '</div>' +
        '<span class="sh-chip ' + st.cls + ' shrink-0">' + st.label + '</span></div>' +
        (chips.length ? '<div class="flex flex-wrap gap-2">' + chips.join('') + '</div>' : '') +
        (loc || sched ? '<div class="flex flex-col gap-2">' + loc + (sched ? '<div class="flex flex-wrap gap-2">' + sched + '</div>' : '') + '</div>' : '') +
        (feeBlock || remaining ? '<div class="flex flex-col gap-2">' + feeBlock + (remaining ? '<div class="flex flex-wrap gap-2">' + remaining + '</div>' : '') + '</div>' : '') +
        '<div class="flex gap-1 justify-end items-center pt-2 border-t border-slate-100 dark:border-slate-800">' + phoneBtn + waBtn + shareBtn +
        '<button class="sh-btn ghost !p-2" title="تعديل" onclick="Groups.openForm(\'' + g.id + '\')">✏️</button>' +
        '<button class="sh-btn danger !p-2" title="حذف" onclick="Groups.del(\'' + g.id + '\')">🗑️</button></div></div>';
    }).join('');
  },

  exportBundle(groupId) {
    const jsonStr = Store.exportClassroomBundle(groupId);
    if (!jsonStr) return App.toast('تعذر تصدير المجموعة', 'warning');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
      App.toast('تم نسخ كود الفصل الدراسي إلى الحافظة بنجاح 📋 شاركه مع زملائك!');
    } else {
      App.showModal('<h3 class="font-black text-sm mb-2">كود الفصل الدراسي للمشاركة</h3><textarea class="sh-input font-mono text-xs" rows="5">' + escapeHtml(jsonStr) + '</textarea>');
    }
  },

  openImportModal() {
    const modal = document.getElementById('import-classroom-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeImportModal() {
    const modal = document.getElementById('import-classroom-modal');
    if (modal) modal.classList.add('hidden');
  },

  submitImportBundle() {
    const input = document.getElementById('classroom-bundle-input');
    if (!input || !input.value.trim()) return App.toast('يرجى لصق كود الفصل أو باقة المعلم', 'warning');

    const res = Store.importClassroomBundle(input.value.trim());
    if (res.success) {
      this.closeImportModal();
      input.value = '';
      Groups.render();
      App.toast(`تم استيراد فصل "${res.subject || ''}" بنجاح وحصلت على +100 XP! 🎉`);
    } else {
      App.toast('خطأ في الاستيراد: ' + res.error, 'danger');
    }
  },

  del(id) {
    App.confirm('حذف المجموعة؟', 'مش هيترجع تاني.', function () {
      Store.remove('groups', id);
      App.toast('تم الحذف');
      Groups.render();
    }, true);
  },

  openForm(id) {
    const g = id ? Store.state.groups.find(function (x) { return x.id === id; }) : null;
    const sessions = (g ? (g.schedule || []) : []).slice();
    const teacherOptions = '<option value="">بدون مدرس</option>' + Store.state.teachers.map(function (t) {
      return '<option value="' + t.id + '"' + (g && g.teacherId === t.id ? ' selected' : '') + '>' + escapeHtml(t.name) + '</option>';
    }).join('');
    const dayOptions = DAYS_AR.map(function (d, i) {
      return '<option value="' + i + '">' + d + '</option>';
    }).join('');
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (g ? 'تعديل مجموعة' : 'مجموعة جديدة') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">اسم المجموعة</label>' +
      '<input id="gf-name" class="sh-input mb-4" placeholder="مثال: كورس رياضيات - التفاضل" value="' + (g ? escapeHtml(g.name) : '') + '">' +
      '<div class="grid grid-cols-2 gap-2 mb-4">' +
      '<div><label class="block text-sm font-bold mb-1">المدرس / الدكتور</label><select id="gf-teacher" class="sh-input">' + teacherOptions + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">النوع</label><select id="gf-type" class="sh-input">' +
      '<option value="course"' + (!g || g.type === 'course' ? ' selected' : '') + '>' + GROUPS_TYPE.course + '</option>' +
      '<option value="private"' + (g && g.type === 'private' ? ' selected' : '') + '>' + GROUPS_TYPE.private + '</option>' +
      (L.isUni() ? '<option value="section"' + (g && g.type === 'section' ? ' selected' : '') + '>' + GROUPS_TYPE.section + '</option>' : '') +
      (L.isUni() ? '<option value="office_hours"' + (g && g.type === 'office_hours' ? ' selected' : '') + '>' + GROUPS_TYPE.office_hours + '</option>' : '') +
      '<option value="other"' + (g && g.type === 'other' ? ' selected' : '') + '>' + GROUPS_TYPE.other + '</option></select></div></div>' +
      '<div class="grid grid-cols-2 gap-2 mb-4">' +
      '<div><label class="block text-sm font-bold mb-1">المكان (' + L.get('location') + ')</label><input id="gf-location" class="sh-input" placeholder="' + (L.isUni() ? 'مثال: مدرج أ، مبنى ب' : 'مثال: سنتر النزهة - قاعة 2') + '" value="' + (g ? escapeHtml(g.location) : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">رابط الخريطة</label><input id="gf-map" class="sh-input" placeholder="https://maps..." dir="ltr" value="' + (g ? escapeHtml(g.mapUrl) : '') + '"></div></div>' +
      '<label class="block text-sm font-bold mb-1">المواعيد</label>' +
      '<div class="flex gap-2 mb-2">' +
      '<select id="gf-day" class="sh-input !w-auto">' + dayOptions + '</select>' +
      '<input id="gf-time" type="time" class="sh-input !w-auto">' +
      '<button class="sh-btn outline" id="gf-add">+ موعد</button></div>' +
      '<div id="gf-sessions" class="flex flex-wrap gap-2 mb-4"></div>' +
      '<div class="grid grid-cols-3 gap-2 mb-4">' +
      '<div><label class="block text-sm font-bold mb-1">رسوم شهرية</label><input id="gf-fee" type="number" min="0" class="sh-input" value="' + (g ? (Number(g.monthlyFee) || 0) : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">مدفوع</label><input id="gf-paid" type="number" min="0" class="sh-input" value="' + (g ? (Number(g.paidThisMonth) || 0) : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">حصص متبقية</label><input id="gf-remaining" type="number" min="0" class="sh-input" value="' + (g ? (Number(g.remainingSessions) || 0) : '') + '"></div></div>' +
      '<div class="grid grid-cols-2 gap-2 mb-4">' +
      '<div><label class="block text-sm font-bold mb-1">الحالة</label><select id="gf-status" class="sh-input">' +
      '<option value="available"' + (!g || g.status === 'available' ? ' selected' : '') + '>متاح</option>' +
      '<option value="paused"' + (g && g.status === 'paused' ? ' selected' : '') + '>متوقف</option>' +
      '<option value="finished"' + (g && g.status === 'finished' ? ' selected' : '') + '>خلص</option></select></div>' +
      '<div><label class="block text-sm font-bold mb-1">الهاتف</label><input id="gf-phone" class="sh-input" placeholder="01xxxxxxxxx" dir="ltr" value="' + (g ? escapeHtml(g.phone) : '') + '"></div></div>' +
      '<label class="block text-sm font-bold mb-1">واتساب</label>' +
      '<input id="gf-wa" class="sh-input mb-4" placeholder="نفس الرقم أو رقم آخر" dir="ltr" value="' + (g ? escapeHtml(g.whatsapp) : '') + '">' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="gf-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="gf-save">حفظ</button></div>'
    );

    const renderSessions = function () {
      const box = modal.querySelector('#gf-sessions');
      if (!sessions.length) { box.innerHTML = '<span class="text-xs font-bold text-slate-400">مفيش مواعيد</span>'; return; }
      box.innerHTML = sessions.map(function (s, i) {
        return '<span class="sh-chip bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">📅 ' + DAYS_AR[s.day] + ' ' + formatTime(s.time) +
          ' <button class="font-extrabold" data-ri="' + i + '">✕</button></span>';
      }).join('');
      box.querySelectorAll('[data-ri]').forEach(function (b) {
        b.addEventListener('click', function () {
          sessions.splice(Number(b.dataset.ri), 1);
          renderSessions();
        });
      });
    };
    renderSessions();

    modal.querySelector('#gf-add').addEventListener('click', function () {
      const t = modal.querySelector('#gf-time').value;
      if (!t) { App.toast('اختار الوقت', 'warning'); return; }
      sessions.push({ day: Number(modal.querySelector('#gf-day').value), time: t });
      renderSessions();
    });
    modal.querySelector('#gf-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#gf-save').addEventListener('click', function () {
      const name = modal.querySelector('#gf-name').value.trim();
      if (!name) { App.toast('اكتب اسم المجموعة', 'warning'); return; }
      const num = function (id) {
        const v = Number(modal.querySelector(id).value);
        return isNaN(v) || v < 0 ? 0 : v;
      };
      const data = {
        name: name,
        teacherId: modal.querySelector('#gf-teacher').value,
        type: modal.querySelector('#gf-type').value,
        location: modal.querySelector('#gf-location').value.trim(),
        mapUrl: modal.querySelector('#gf-map').value.trim(),
        schedule: sessions,
        monthlyFee: num('#gf-fee'),
        paidThisMonth: num('#gf-paid'),
        remainingSessions: num('#gf-remaining'),
        status: modal.querySelector('#gf-status').value,
        phone: modal.querySelector('#gf-phone').value.trim(),
        whatsapp: modal.querySelector('#gf-wa').value.trim()
      };
      if (g) {
        Store.update('groups', g.id, data);
        App.toast('تم التعديل ✅');
      } else {
        data.id = uid();
        Store.add('groups', data);
        App.toast('تمت إضافة المجموعة 🎉');
      }
      App.closeModal();
      Groups.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Groups.init(); });
