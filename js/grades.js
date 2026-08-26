// js/grades.js — Dedicated grades manager UI for Student Hub
const GradesPage = {
  filters: { subject: 'all' },

  init() {
    const sel = document.getElementById('grades-subject');
    if (sel) {
      Store.state.subjects.forEach(function (s) {
        sel.innerHTML += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
      });
      sel.addEventListener('change', function () {
        GradesPage.filters.subject = sel.value;
        GradesPage.render();
      });
    }
    GradesPage.render();
    App.maybeFlash();
  },

  filtered() {
    let list = Store.state.grades.slice();
    if (this.filters.subject !== 'all') {
      list = list.filter(function (g) { return g.subjectId === GradesPage.filters.subject; });
    }
    // Sort by date descending
    return list.sort(function (a, b) { return b.date.localeCompare(a.date); });
  },

  render() {
    const el = document.getElementById('grades-list');
    if (!el) return;

    const list = this.filtered();
    this.renderSummary();

    if (!list.length) {
      el.innerHTML = '<div class="sh-empty !p-8"><div class="sh-empty-icon">🎯</div><div>مفيش درجات مسجلة — أضف أول درجة!</div></div>';
      return;
    }

    el.innerHTML = list.map(function (g) {
      const pct = Math.round((g.score / g.max) * 100);
      let color = 'var(--sh-primary)';
      if (pct >= 85) color = '#10b981'; // Green
      else if (pct >= 60) color = '#3b82f6'; // Blue
      else color = '#ef4444'; // Red

      const sub = Store.subject(g.subjectId);
      const subColor = sub ? sub.color : '#6366f1';
      const initial = sub ? sub.name.charAt(0) : '📊';

      return '<div class="bg-surface-container-lowest dark:bg-slate-800 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-outline-variant/20 flex items-center justify-between hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all" data-id="' + g.id + '">' +
        '<div class="flex items-center gap-3 min-w-0 flex-1">' +
        '<div class="w-12 h-12 rounded-lg flex items-center justify-center font-extrabold text-lg shrink-0" style="background:' + subColor + '15;color:' + subColor + '">' +
        initial +
        '</div>' +
        '<div class="min-w-0 flex-1">' +
        '<h4 class="font-bold text-sm truncate text-on-surface dark:text-white">' + escapeHtml(g.name) + '</h4>' +
        '<p class="text-[10px] font-bold text-slate-400 mt-1">' +
        '<span class="sh-badge !py-0.5 !px-1.5 ml-1" style="background:' + subColor + ';color:#fff">' + escapeHtml(Store.subjectName(g.subjectId)) + '</span>' +
        '<span>' + formatArDate(g.date) + '</span>' +
        '</p>' +
        '</div></div>' +
        '<div class="flex items-center gap-3 shrink-0">' +
        '<div class="flex gap-1">' +
        '<button class="sh-btn ghost !p-1.5 !min-h-[30px] hover:!bg-primary/10" title="تعديل" onclick="GradesPage.openForm(\'' + g.id + '\')"><span class="material-symbols-outlined text-[16px]">edit</span></button>' +
        '<button class="sh-btn danger !p-1.5 !min-h-[30px] hover:!bg-red-600/20" title="حذف" onclick="GradesPage.del(\'' + g.id + '\')"><span class="material-symbols-outlined text-[16px]">delete</span></button>' +
        '</div>' +
        '<div class="flex flex-col items-end shrink-0 min-w-[50px]">' +
        '<div class="px-2.5 py-0.5 rounded-full font-black text-xs" style="background:' + color + '15;color:' + color + '">' + pct + '%</div>' +
        '<span class="text-[10px] font-bold text-slate-400 mt-1">' + g.score + '/' + g.max + '</span>' +
        '</div></div></div>';
    }).join('');
  },

  renderSummary() {
    const list = Store.state.grades;
    const avgText = document.getElementById('grades-avg-text');
    const svgCircle = document.getElementById('grades-svg-circle');
    const statusText = document.getElementById('grades-status-text');
    const countText = document.getElementById('grades-count-text');
    const ratioText = document.getElementById('grades-ratio-text');
    const linearBar = document.getElementById('grades-linear-bar');

    if (!list.length) {
      if (avgText) avgText.textContent = '0%';
      if (svgCircle) svgCircle.setAttribute('stroke-dasharray', '0, 100');
      if (statusText) statusText.textContent = 'سجل درجاتك للبدء 🎯';
      if (countText) countText.textContent = '0';
      if (ratioText) ratioText.textContent = '0/10';
      if (linearBar) linearBar.style.width = '0%';
      return;
    }

    let totalPct = 0;
    list.forEach(function (g) {
      totalPct += (g.score / g.max) * 100;
    });
    const avg = Math.round(totalPct / list.length);

    let status = 'تحتاج للمزيد من التركيز والمذاكرة 📚';
    if (avg >= 85) status = 'ممتاز - في تقدم مستمر 🌟';
    else if (avg >= 75) status = 'جيد جداً - استمر في التقدم 👍';
    else if (avg >= 60) status = 'جيد - يمكنك تحسين معدلك 💪';

    if (avgText) avgText.textContent = avg + '%';
    if (svgCircle) svgCircle.setAttribute('stroke-dasharray', avg + ', 100');
    if (statusText) statusText.textContent = status;
    if (countText) countText.textContent = list.length;

    const target = Math.max(10, Math.ceil(list.length / 5) * 5);
    const progressPct = Math.min(100, Math.round((list.length / target) * 100));

    if (ratioText) ratioText.textContent = list.length + '/' + target;
    if (linearBar) linearBar.style.width = progressPct + '%';
  },

  del(id) {
    App.confirm('حذف الدرجة؟', '', function () {
      Store.remove('grades', id);
      App.toast('تم الحذف ✅');
      GradesPage.render();
    }, true);
  },

  openForm(id) {
    const g = id ? Store.state.grades.find(function (x) { return x.id === id; }) : null;
    const subjectsOpts = Store.state.subjects.map(function (s) {
      return '<option value="' + s.id + '"' + (g && g.subjectId === s.id ? ' selected' : '') + '>' + escapeHtml(s.name) + '</option>';
    }).join('');

    const modal = App.showModal(
      '<h3 class="text-lg font-extrabold mb-4">' + (g ? 'تعديل درجة' : 'درجة جديدة') + '</h3>' +
      '<label class="block text-sm font-bold mb-1">اسم الاختبار / التقييم</label>' +
      '<input id="gf-name" class="sh-input mb-3" placeholder="مثال: شيت ١، امتحان نصف العام" value="' + (g ? escapeHtml(g.name) : '') + '">' +
      '<div class="grid grid-cols-3 gap-3 mb-3">' +
      '<div class="col-span-1"><label class="block text-sm font-bold mb-1">المادة</label><select id="gf-subject" class="sh-input">' + subjectsOpts + '</select></div>' +
      '<div><label class="block text-sm font-bold mb-1">الدرجة</label><input id="gf-score" type="number" min="0" step="any" class="sh-input" value="' + (g ? g.score : '') + '"></div>' +
      '<div><label class="block text-sm font-bold mb-1">الدرجة النهائية</label><input id="gf-max" type="number" min="1" step="any" class="sh-input" value="' + (g ? g.max : '100') + '"></div>' +
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
      if (!name || isNaN(score) || isNaN(max) || max <= 0) {
        App.toast('اكمل البيانات صح ⚠️', 'warning');
        return;
      }

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
      GradesPage.render();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { GradesPage.init(); });
