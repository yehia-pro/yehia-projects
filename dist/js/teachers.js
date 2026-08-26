const Teachers = {
  filter: 'all',

  init() {
    const sel = document.getElementById('teachers-subject');
    if (!sel) return;
    sel.innerHTML = '<option value="all">كل المواد</option>' + Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    }).join('');
    sel.addEventListener('change', function () { Teachers.filter = sel.value; Teachers.render(); });
    Teachers.render();
    App.maybeFlash();
  },

  visible() {
    return Store.state.teachers.filter(function (t) {
      return Teachers.filter === 'all' || t.subjectId === Teachers.filter;
    });
  },

  render() {
    const el = document.getElementById('teachers-list');
    if (!el) return;
    const list = Teachers.visible();
    if (!list.length) {
      el.innerHTML = '<div class="col-span-full bg-surface-container-lowest dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center border border-dashed border-outline-variant justify-center min-h-[300px]">' +
        '<div class="w-16 h-16 rounded-full bg-surface-container dark:bg-slate-700 flex items-center justify-center mb-4 text-outline dark:text-slate-300">' +
        '<span class="material-symbols-outlined text-[32px]">person_add</span></div>' +
        '<p class="text-sm font-bold text-on-surface-variant dark:text-slate-300 text-center">أضف مدرسين جدد لتسهيل التواصل والوصول لبياناتهم</p>' +
        '<button onclick="Teachers.openForm()" class="mt-4 text-primary font-bold text-sm hover:underline">إضافة الآن</button></div>';
      return;
    }
    el.innerHTML = list.map(function (t) {
      const s = Store.subject(t.subjectId);
      const color = s ? s.color : '#cbd5e1';
      const initial = (t.name || '؟').charAt(0);
      const waNumber = String(t.whatsapp || t.phone || '').replace(/\D/g, '');

      const phoneBtn = t.phone
        ? '<a href="tel:' + encodeURIComponent(t.phone) + '" class="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg py-2 flex items-center justify-center gap-2 transition-colors text-xs font-bold">' +
          '<span class="material-symbols-outlined text-[16px]">call</span><span>اتصال</span></a>'
        : '';

      const waBtn = waNumber
        ? '<a href="https://wa.me/' + waNumber + '" target="_blank" rel="noopener" class="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-lg py-2 flex items-center justify-center gap-2 transition-colors text-xs font-bold">' +
          '<span class="material-symbols-outlined text-[16px]">chat</span><span>واتساب</span></a>'
        : '';

      return '<div class="bg-surface-container-lowest dark:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-5 flex flex-col items-center border border-outline-variant/30 hover:shadow-lg transition-all relative" data-id="' + t.id + '">' +
        '<div class="absolute top-3 left-3 flex gap-1">' +
        '<button class="sh-btn ghost !p-1.5 !min-h-[30px] hover:!bg-primary/10" title="تعديل" onclick="Teachers.openForm(\'' + t.id + '\')"><span class="material-symbols-outlined text-[16px]">edit</span></button>' +
        '<button class="sh-btn danger !p-1.5 !min-h-[30px] hover:!bg-red-600/20" title="حذف" onclick="Teachers.del(\'' + t.id + '\')"><span class="material-symbols-outlined text-[16px]">delete</span></button>' +
        '</div>' +
        '<div class="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl mb-3 border-4 border-slate-50 dark:border-slate-700 mt-2" style="background:' + color + '15;color:' + color + '">' +
        initial +
        '</div>' +
        '<h3 class="font-bold text-base text-on-surface dark:text-white mb-1">' + escapeHtml(t.name || 'بدون اسم') + '</h3>' +
        (s ? '<span class="font-bold text-[10px] px-3 py-0.5 rounded-full mb-4" style="background:' + color + '15;color:' + color + '">' + escapeHtml(s.name) + '</span>' : '<div class="h-4"></div>') +
        (t.notes ? '<p class="text-xs text-slate-400 dark:text-slate-400 mb-4 text-center max-w-[200px] truncate" title="' + escapeHtml(t.notes) + '">' + escapeHtml(t.notes) + '</p>' : '<div class="h-4"></div>') +
        '<div class="flex w-full gap-2 mt-auto">' +
        phoneBtn +
        waBtn +
        '</div></div>';
    }).join('');
  },

  del(id) {
    App.confirm('حذف المدرس؟', 'مش هيترجع تاني.', function () {
      Store.remove('teachers', id);
      App.toast('تم الحذف');
      Teachers.render();
    }, true);
  },

  openForm(id) {
    const t = id ? Store.state.teachers.find(function (x) { return x.id === id; }) : null;
    const subjectOptions = '<option value="">بدون مادة</option>' + Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '"' + (t && t.subjectId === s.id ? ' selected' : '') + '>' + escapeHtml(s.name) + '</option>';
    }).join('');
    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (t ? 'تعديل' : (L.get('teacher') + ' جديد')) + '</h3>' +
      '<label class="block text-sm font-bold mb-1">الاسم</label>' +
      '<input id="tf-name" class="sh-input mb-4" placeholder="مثال: ' + (L.isUni() ? 'د. أحمد' : 'أ. أحمد') + '" value="' + (t ? escapeHtml(t.name) : '') + '">' +
      '<label class="block text-sm font-bold mb-1">المادة</label>' +
      '<select id="tf-subject" class="sh-input mb-4">' + subjectOptions + '</select>' +
      '<div class="grid grid-cols-2 gap-2 mb-4">' +
      '<div><label class="block text-sm font-bold mb-1">رقم الهاتف</label><input id="tf-phone" class="sh-input" placeholder="01xxxxxxxxx" dir="ltr" value="' + (t ? escapeHtml(t.phone) : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">واتساب</label><input id="tf-wa" class="sh-input" placeholder="نفس الرقم أو رقم آخر" dir="ltr" value="' + (t ? escapeHtml(t.whatsapp) : '') + '"></div></div>' +
      '<label class="block text-sm font-bold mb-1">ملاحظات</label>' +
      '<textarea id="tf-notes" class="sh-input mb-4" rows="2" placeholder="مثال: ' + (L.isUni() ? 'محاضرة الجمعة 4م' : 'الحصة الجمعة 4م') + '">' + (t ? escapeHtml(t.notes) : '') + '</textarea>' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="tf-cancel">إلغاء</button>' +
      '<button class="sh-btn primary" id="tf-save">حفظ</button></div>'
    );
    modal.querySelector('#tf-cancel').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#tf-save').addEventListener('click', function () {
      const name = modal.querySelector('#tf-name').value.trim();
      if (!name) { App.toast('اكتب الاسم', 'warning'); return; }
      const data = {
        name: name,
        subjectId: modal.querySelector('#tf-subject').value,
        phone: modal.querySelector('#tf-phone').value.trim(),
        whatsapp: modal.querySelector('#tf-wa').value.trim(),
        notes: modal.querySelector('#tf-notes').value.trim()
      };
      if (t) {
        Store.update('teachers', t.id, data);
        App.toast('تم التعديل ✅');
      } else {
        data.id = uid();
        Store.add('teachers', data);
        App.toast('تمت الإضافة 🎉');
      }
      App.closeModal();
      Teachers.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Teachers.init(); });
