const NAV_ITEMS = [
  { href: 'index.html', label: 'الرئيسية', icon: '🏠', key: 'dashboard' },
  { href: 'prayer.html', label: 'الصلاة والقرآن', icon: '🕌', key: 'prayer' },
  { href: 'tasks.html', label: 'المهام', icon: '✅', key: 'tasks' },
  { href: 'flashcards.html', label: 'البطاقات الذكية', icon: '🎴', key: 'flashcards' },
  { href: 'groups.html', label: 'المجموعات والمنصات', icon: '👥', key: 'groups' },
  { href: 'exams.html', label: 'الامتحانات', icon: '📝', key: 'exams' },
  { href: 'lectures.html', label: 'المحاضرات', icon: '📚', key: 'lectures' },
  { href: 'subjects.html', label: 'المواد', icon: '🗂️', key: 'subjects' },
  { href: 'grades.html', label: 'الدرجات', icon: '🎯', key: 'grades' },
  { href: 'teachers.html', label: 'المدرسين', icon: '👨‍🏫', key: 'teachers', labelKey: 'navTeachers' },
  { href: 'resources.html', label: 'الملخصات والمنصات', icon: '📚', key: 'resources' },
  { href: 'stats.html', label: 'إحصائياتي ورتبتي', icon: '📊', key: 'stats' }
];

const App = {
  init() {
    Store.load();
    if (L && L.applyAll) L.applyAll();
    this.applyPageTitle();
    this.renderHeader();
    this.renderBottomNav();
    this.applyTheme(Store.state.user.theme || 'light');
    this.initSearch();
    this.initSettings();
    this.setActiveNav();
    this.registerSW();
    // Auto-backup يومي صامت
    Store.autoBackup();
  },

  applyPageTitle() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const pageTitles = {
      'index.html': { school: 'الرئيسية', uni: 'الرئيسية' },
      'prayer.html': { school: 'مواقيت الصلاة والورد القرآني', uni: 'مواقيت الصلاة والورد القرآني' },
      'flashcards.html': { school: 'البطاقات الذكية والتكرار المتباعد', uni: 'البطاقات الذكية والتكرار المتباعد' },
      'tasks.html': { school: 'المهام', uni: 'المهام' },
      'exams.html': { school: 'الامتحانات', uni: 'الامتحانات' },
      'lectures.html': { school: 'المحاضرات', uni: 'محاضرات وسكاشن' },
      'subjects.html': { school: 'المواد', uni: 'المواد' },
      'grades.html': { school: 'الدرجات والتقييمات', uni: 'الدرجات والتقييمات' },
      'teachers.html': { school: 'المدرسين والسناتر', uni: 'الدكاترة والكورسات' },
      'groups.html': { school: 'المجموعات والمنصات', uni: 'الكورسات والمجموعات' },
      'resources.html': { school: 'روابط سريعة', uni: 'روابط سريعة' },
      'stats.html': { school: 'إحصائياتي ورتبتي', uni: 'إحصائياتي ورتبتي' }
    };
    const t = (pageTitles[page] && pageTitles[page][L.role]) || '';
    if (t) document.title = t + ' - Student Hub';
  },

  // إدارة Service Worker وحذف الكاش القديم في تطبيق الموبايل
  registerSW() {
    if ('serviceWorker' in navigator) {
      const isNativeApp = window.Capacitor || location.protocol === 'capacitor:' || location.protocol === 'file:' || location.hostname === 'localhost';
      
      // في تطبيق الموبايل الأصلي (Capacitor): احذف أي Service Worker وكاش قديم تماماً
      if (isNativeApp) {
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          regs.forEach(function (r) { r.unregister(); });
        });
        if ('caches' in window) {
          caches.keys().then(function (keys) {
            keys.forEach(function (k) { caches.delete(k); });
          });
        }
        return;
      }

      // في متصفح الويب العادي (PWA): سجّل Service Worker المحدث
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
          reg.update();
        }).catch(function (err) {});
      });
    }
  },

  renderBottomNav() {
    document.querySelectorAll('#sh-bottom-nav, .sh-bottom-nav, nav[class*="bottom-nav"]').forEach(function(el) {
      el.remove();
    });
  },

  renderHeader() {
    const el = document.getElementById('sh-header');
    if (!el) return;
    const links = NAV_ITEMS.map(function (n) {
      return '<a href="' + n.href + '" data-nav="' + n.key + '" class="sh-nav-item px-3.5 py-2 rounded-2xl font-bold text-xs md:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">' + n.icon + ' ' + n.label + '</a>';
    }).join('');

    let prayerHeaderBadge = '';
    if (typeof PrayerSystem !== 'undefined') {
      try {
        const pStatus = PrayerSystem.getSequentialStatus();
        prayerHeaderBadge = '<a href="prayer.html" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:scale-105 transition" title="الصلاة القادمة">' +
          '<span>🕌 ' + pStatus.next.name + ':</span><span class="font-mono text-amber-600 dark:text-amber-400">' + pStatus.countdownText + '</span></a>';
      } catch(e) {}
    }

    let xpBadge = '';
    if (typeof Store !== 'undefined' && Store.getUserXP) {
      const uXP = Store.getUserXP();
      xpBadge = `<a href="stats.html" class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-600 dark:text-amber-400 hover:scale-105 transition shadow-sm" title="نقاط الخبرة والرتبة"><span>⭐</span><span>${uXP.xp} XP</span><span class="text-[10px] text-slate-500 font-bold">(${uXP.rank.badge})</span></a>`;
    }

    el.innerHTML =
      '<div class="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">' +
      '<div class="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">' +
      '<a href="index.html" class="flex items-center gap-2.5 font-black text-lg text-indigo-600 dark:text-indigo-400 shrink-0 hover:opacity-90 transition">' +
      '<div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-900 p-1.5 shadow-md flex items-center justify-center">' +
      '<img src="logo/student_hub_logo.png" alt="Logo" class="h-full w-full object-contain filter drop-shadow" onerror="this.outerHTML=\'<span class=\\\'text-lg\\\'>🎓</span>\'">' +
      '</div>' +
      '<span class="tracking-tight text-slate-900 dark:text-white">Student Hub</span></a>' +
      prayerHeaderBadge +
      xpBadge +
      '<div class="flex items-center gap-2 ms-auto">' +
      '<button id="sh-theme-btn" title="الوضع الليلي" class="sh-btn ghost !p-2.5 rounded-2xl">🌙</button>' +
      '<button id="sh-settings-btn" title="الإعدادات" class="sh-btn ghost !p-2.5 rounded-2xl">⚙️</button>' +
      '</div></div>' +
      '<div class="max-w-6xl mx-auto px-4 pb-2.5 overflow-x-auto flex gap-1.5 scrollbar-hide" id="sh-nav-links">' + links + '</div>' +
      '</div>';
  },

  renderBottomNav() {
    const el = document.getElementById('sh-bottom-nav');
    if (el) el.remove();
  },

  setActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      const item = NAV_ITEMS.find(function (n) { return n.href === page; });
      if (item && a.dataset.nav === item.key) a.classList.add('active');
    });
  },

  applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
    const btn = document.getElementById('sh-theme-btn');
    if (btn) btn.textContent = dark ? '☀️' : '🌙';
  },

  toggleTheme() {
    const next = Store.state.user.theme === 'dark' ? 'light' : 'dark';
    Store.update('user', '', { theme: next });
    this.applyTheme(next);
    this.toast(next === 'dark' ? 'تفعيل الوضع الليلي 🌙' : 'تفعيل الوضع النهاري ☀️');
  },

  toast(msg, type) {
    let c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      document.body.appendChild(c);
    }
    const t = document.createElement('div');
    t.className = 'sh-toast ' + (type || 'success');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 2600);
    setTimeout(function () { t.remove(); }, 3000);
  },

  showModal(html) {
    this.closeModal();
    const back = document.createElement('div');
    back.className = 'sh-modal-backdrop';
    back.id = 'sh-modal-backdrop';
    back.innerHTML = '<div class="sh-modal">' + html + '</div>';
    back.addEventListener('click', function (e) { if (e.target === back) App.closeModal(); });
    document.body.appendChild(back);
    document.addEventListener('keydown', this._escHandler = function (e) { if (e.key === 'Escape') App.closeModal(); });
    return back.querySelector('.sh-modal');
  },

  closeModal() {
    const b = document.getElementById('sh-modal-backdrop');
    if (b) b.remove();
    if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
  },

  confirm(title, message, onYes, danger) {
    const modal = this.showModal(
      '<h3 class="text-lg font-extrabold mb-1">' + title + '</h3>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400 mb-4">' + message + '</p>' +
      '<div class="flex gap-2 justify-end">' +
      '<button class="sh-btn ghost" id="sh-cancel-btn">إلغاء</button>' +
      '<button class="sh-btn ' + (danger ? 'danger' : 'primary') + '" id="sh-yes-btn">تأكيد</button>' +
      '</div>'
    );
    modal.querySelector('#sh-cancel-btn').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#sh-yes-btn').addEventListener('click', function () { App.closeModal(); onYes(); });
  },

  // ===== Achievement Sound System =====
  sound(type) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const sounds = {
        // صوت مهمة مكتملة: ثلاث نغمات تصاعدية
        task: [[523,0,0.12],[659,0.12,0.12],[784,0.25,0.2]],
        // صوت تايمر منتهي: نغمتين قويتين
        timer: [[880,0,0.15],[660,0.18,0.4]],
        // صوت تنبيه / خطأ
        warn: [[440,0,0.1],[330,0.15,0.15]]
      };
      const notes = sounds[type] || sounds.task;
      notes.forEach(function(n) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = n[0];
        g.gain.setValueAtTime(0, ctx.currentTime + n[1]);
        g.gain.linearRampToValueAtTime(0.25, ctx.currentTime + n[1] + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n[1] + n[2]);
        o.start(ctx.currentTime + n[1]);
        o.stop(ctx.currentTime + n[1] + n[2] + 0.05);
      });
      setTimeout(function() { try { ctx.close(); } catch(e){} }, 1000);
    } catch(e) {}
  },

  initSearch() {
    const input = document.getElementById('sh-search');
    const box = document.getElementById('sh-search-results');
    if (!input || !box) return;
    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.classList.add('hidden'); box.innerHTML = ''; return; }
      const results = [];
      Store.state.tasks.filter(function (t) { return t.title.toLowerCase().indexOf(q) > -1; })
        .slice(0, 4).forEach(function (t) {
          results.push({ href: 'tasks.html?focus=' + t.id, label: '✅ ' + t.title, sub: Store.subjectName(t.subjectId) });
        });
      Store.state.exams.filter(function (e) { return (e.title || '').toLowerCase().indexOf(q) > -1; })
        .slice(0, 4).forEach(function (e) {
          results.push({ href: 'exams.html?focus=' + e.id, label: '📝 ' + e.title, sub: Store.subjectName(e.subjectId) });
        });
      Store.state.lectures.filter(function (l) { return (l.title || '').toLowerCase().indexOf(q) > -1; })
        .slice(0, 4).forEach(function (l) {
          results.push({ href: 'lectures.html?focus=' + l.id, label: '📚 ' + l.title, sub: Store.subjectName(l.subjectId) });
        });
      Store.state.resources.filter(function (r) { return (r.title || '').toLowerCase().indexOf(q) > -1; })
        .slice(0, 4).forEach(function (r) {
          results.push({ href: 'resources.html?focus=' + r.id, label: '🔗 ' + r.title, sub: Store.subjectName(r.subjectId) });
        });
      Store.state.subjects.filter(function (s) { return s.name.toLowerCase().indexOf(q) > -1; })
        .slice(0, 3).forEach(function (s) {
          results.push({ href: 'subjects.html', label: '🗂️ ' + s.name, sub: 'مادة' });
        });
      Store.state.teachers.filter(function (t) { return (t.name || '').toLowerCase().indexOf(q) > -1; })
        .slice(0, 3).forEach(function (t) {
          results.push({ href: 'teachers.html?focus=' + t.id, label: '👨‍🏫 ' + t.name, sub: Store.subjectName(t.subjectId) });
        });
      Store.state.groups.filter(function (g) {
        const tr = Store.state.teachers.find(function (x) { return x.id === g.teacherId; });
        return (g.name || '').toLowerCase().indexOf(q) > -1 || (tr && (tr.name || '').toLowerCase().indexOf(q) > -1);
      }).slice(0, 3).forEach(function (g) {
        const tr = Store.state.teachers.find(function (x) { return x.id === g.teacherId; });
        results.push({ href: 'groups.html?focus=' + g.id, label: '👥 ' + g.name, sub: tr ? tr.name : 'مجموعة' });
      });
      if (!results.length) {
        box.innerHTML = '<div class="p-3 text-sm text-slate-400">مفيش نتائج 😕</div>';
      } else {
        box.innerHTML = results.map(function (r) {
          return '<a class="sh-search-result" href="' + r.href + '"><div class="flex-1"><div class="font-bold">' + r.label + '</div><div class="text-xs text-slate-400">' + r.sub + '</div></div></a>';
        }).join('');
      }
      box.classList.remove('hidden');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#sh-search')) box.classList.add('hidden');
    });
  },

  initSettings() {
    const btn = document.getElementById('sh-settings-btn');
    if (!btn) return;
    btn.addEventListener('click', function () { App.openSettings(); });
  },

  openSettings() {
    const u = Store.state.user;
    const P = Store.state.pomodoroSettings || {};
    const pv = function (k, fb) { return Number(P[k]) > 0 ? P[k] : fb; };
    const modal = this.showModal(
      '<div class="flex items-center justify-between mb-4">' +
      '<h3 class="text-lg font-extrabold">الإعدادات ⚙️</h3>' +
      '<button class="sh-btn ghost !p-1.5" id="sh-modal-close">✕</button></div>' +
      '<label class="block text-sm font-bold mb-1">اسمي</label>' +
      '<input id="set-name" class="sh-input mb-4" placeholder="اكتب اسمك" value="' + escapeHtml(u.name) + '">' +
      '<label class="block text-sm font-bold mb-1">هدفي الأسبوعي (ساعات دراسة)</label>' +
      '<div class="flex flex-wrap gap-2 mb-2">' +
      [5,10,15,20,30].map(function(h) {
        return '<button class="sh-pomo-preset" data-goal="' + h + '" style="' + (u.weeklyGoal === h ? 'background:var(--sh-primary);color:#fff' : '') + '">' + h + ' س</button>';
      }).join('') +
      '</div>' +
      '<input id="set-goal" type="number" min="1" max="80" class="sh-input mb-4" placeholder="أو اكتب عدد ساعات مخصص (1-80)" value="' + (u.weeklyGoal || 10) + '">' +
      '<div class="sh-card p-3 mb-4 flex items-center justify-between">' +
      '<span class="text-sm font-bold">🔥 يوم متواصل: <span id="set-streak">' + (Store.state.streak.count || 0) + '</span></span>' +
      '</div>' +
      '<div class="sh-card p-3 mb-4">' +
      '<div class="font-extrabold text-sm mb-2">🍅 مؤقت التركيز</div>' +
      '<div class="grid grid-cols-3 gap-2 mb-2">' +
      '<div><label class="block text-[11px] font-bold mb-1">تركيز (دقيقة)</label><input id="set-pomo-dur" type="number" min="1" max="120" class="sh-input" value="' + pv('duration', 25) + '"></div>' +
      '<div><label class="block text-[11px] font-bold mb-1">استراحة (دقيقة)</label><input id="set-pomo-break" type="number" min="1" max="60" class="sh-input" value="' + pv('breakDuration', 5) + '"></div>' +
      '<div><label class="block text-[11px] font-bold mb-1">استراحة طويلة</label><input id="set-pomo-long" type="number" min="5" max="90" class="sh-input" value="' + pv('longBreak', 15) + '"></div>' +
      '</div>' +
      '<div class="flex items-center justify-between gap-2 mb-2">' +
      '<label class="text-[11px] font-bold">🔔 صوت نهاية الجلسة</label>' +
      '<select id="set-pomo-sound" class="sh-input !py-1.5">' +
      '<option value="silent"' + (P.ambientSound === 'silent' ? ' selected' : '') + '>صامت</option>' +
      '<option value="beep"' + (P.ambientSound === 'beep' ? ' selected' : '') + '>نغمة</option>' +
      '</select></div>' +
      '<label class="flex items-center gap-2 text-[11px] font-bold cursor-pointer"><input type="checkbox" id="set-pomo-wake" class="accent-indigo-500"' + (P.wakeLock !== false ? ' checked' : '') + '> إبقاء الشاشة مفتوحة أثناء التركيز</label>' +
      '</div>' +
      '<button class="sh-btn outline w-full mb-3" id="set-onboarding">🎓 إعادة إعداد الملف الشخصي</button>' +
      '<div class="flex flex-wrap gap-2 mb-2">' +
      '<button class="sh-btn outline" id="set-export">⬇️ تصدير البيانات</button>' +
      '<button class="sh-btn outline" id="set-import">⬆️ استيراد بيانات</button>' +
      '<button class="sh-btn danger" id="set-wipe">🗑️ مسح كل شيء</button>' +
      '</div>' +
      '<input type="file" id="set-file" accept="application/json" class="hidden">' +
      '<div id="set-restore-section"></div>' +
      '<p class="text-[11px] text-slate-400 mt-2">البيانات محفوظة محليًا 🔒 — نسخة احتياطية تلقائية كل يوم</p>'
    );
    modal.querySelector('#sh-modal-close').addEventListener('click', function () { App.closeModal(); });
    modal.querySelector('#set-name').addEventListener('change', function (e) {
      Store.update('user', '', { name: e.target.value.trim() });
      App.toast('تم حفظ الاسم ✅');
    });
    modal.querySelector('#set-goal').addEventListener('change', function (e) {
      const v = Math.min(80, Math.max(1, Number(e.target.value) || 10));
      e.target.value = v;
      Store.update('user', '', { weeklyGoal: v });
      App.toast('تم تحديث الهدف ✅');
    });
    // Quick goal buttons
    modal.querySelectorAll('[data-goal]').forEach(function(b) {
      b.addEventListener('click', function() {
        const v = parseInt(b.dataset.goal);
        modal.querySelector('#set-goal').value = v;
        Store.update('user', '', { weeklyGoal: v });
        modal.querySelectorAll('[data-goal]').forEach(function(x) { x.style.background = ''; x.style.color = ''; });
        b.style.background = 'var(--sh-primary)'; b.style.color = '#fff';
        App.toast('الهدف الأسبوعي: ' + v + ' ساعات ✅');
      });
    });
    function savePomo(patch) {
      Store.updateSettings(patch);
      App.toast('تم حفظ إعدادات التركيز ✅');
    }
    modal.querySelector('#set-pomo-dur').addEventListener('change', function (e) { savePomo({ duration: Math.max(1, Number(e.target.value) || 25) }); });
    modal.querySelector('#set-pomo-break').addEventListener('change', function (e) { savePomo({ breakDuration: Math.max(1, Number(e.target.value) || 5) }); });
    modal.querySelector('#set-pomo-long').addEventListener('change', function (e) { savePomo({ longBreak: Math.max(5, Number(e.target.value) || 15) }); });
    modal.querySelector('#set-pomo-sound').addEventListener('change', function (e) { savePomo({ ambientSound: e.target.value }); });
    modal.querySelector('#set-pomo-wake').addEventListener('change', function (e) { savePomo({ wakeLock: e.target.checked }); });
    modal.querySelector('#set-onboarding').addEventListener('click', function () {
      App.closeModal();
      Onboarding.start(true);
    });
    modal.querySelector('#set-export').addEventListener('click', function () {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'student-hub-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      App.toast('تم تصدير نسخة احتياطية ⬇️');
    });
    modal.querySelector('#set-import').addEventListener('click', function () {
      modal.querySelector('#set-file').click();
    });
    modal.querySelector('#set-file').addEventListener('change', function (e) {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          Store.importJSON(reader.result);
          App.toast('تم استيراد البيانات بنجاح ✅');
          setTimeout(function () { location.reload(); }, 700);
        } catch (err) {
          App.toast('الملف غير صالح ❌', 'error');
        }
      };
      reader.readAsText(f);
    });
    modal.querySelector('#set-wipe').addEventListener('click', function () {
      App.confirm('مسح كل البيانات؟', 'هيحذف كل مهامك وامتحاناتك للأبد. أنصحك بتصدير نسخة احتياطية الأول.', function () {
        Store.wipe();
        App.toast('تم المسح');
        setTimeout(function () { location.reload(); }, 600);
      }, true);
    });
    // ===== Restore من نسخ احتياطية محلية =====
    const restoreSec = modal.querySelector('#set-restore-section');
    const backups = Store.getLocalBackups();
    if (backups.length) {
      restoreSec.innerHTML =
        '<div class="sh-card p-3 mb-3">' +
        '<div class="font-extrabold text-sm mb-2">🕐 النسخ الاحتياطية الأخيرة</div>' +
        backups.map(function (b) {
          return '<div class="flex items-center justify-between mb-1">' +
            '<span class="text-xs text-slate-400">' + b.date + '</span>' +
            '<button class="sh-btn outline !py-1 !px-2 text-xs" onclick="App._restoreBackup(\'' + b.key + '\')">' +
            '↩ استعادة</button></div>';
        }).join('') +
        '</div>';
    }
  },

  _restoreBackup(key) {
    App.confirm(
      'استعادة نسخة احتياطية؟',
      'هيرجّع بياناتك للنسخة دي ويحذف أي تغييرات بعدها.',
      function () {
        try {
          Store.restoreFromLocalBackup(key);
          App.toast('تم استعادة البيانات ✅', 'success');
          setTimeout(function () { location.reload(); }, 700);
        } catch (e) {
          App.toast('فشل الاستعادة ❌', 'error');
        }
      },
      false
    );
    App.closeModal();
  },

  maybeFlash() {
    const q = new URLSearchParams(location.search);
    const id = q.get('focus');
    if (!id) return;
    setTimeout(function () {
      const el = document.querySelector('[data-id="' + id + '"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-indigo-400');
        setTimeout(function () { el.classList.remove('ring-2', 'ring-indigo-400'); }, 2500);
      }
    }, 300);
  },

  openSubjectLink(subjectId) {
    const s = Store.subject(subjectId);
    if (s) location.href = 'tasks.html?subject=' + s.id;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  App.init();
  const tb = document.getElementById('sh-theme-btn');
  if (tb) tb.addEventListener('click', function () { App.toggleTheme(); });
});
