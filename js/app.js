const NAV_ITEMS = [
  { href: 'index.html', label: 'الرئيسية', icon: '🏠', key: 'dashboard' },
  { href: 'subjects.html', label: 'المركز الأكاديمي', icon: '📚', key: 'subjects' },
  { href: 'tasks.html', label: 'مركز الإنجاز', icon: '🎯', key: 'tasks' },
  { href: 'resources.html', label: 'مكتبة الـ PDF والملخصات', icon: '💡', key: 'resources' },
  { href: 'prayer.html', label: 'الرفيق الإيماني والرتب', icon: '🕌', key: 'prayer' }
];

const App = {
  init() {
    Store.load();
    if (L && L.applyAll) L.applyAll();
    this.applyPageTitle();
    this.renderHeader();
    this.renderBottomNav();
    this.applyTheme(Store.state.user.theme || 'dark');
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
      'subjects.html': { school: 'المركز الأكاديمي - المواد والمحاضرات', uni: 'المركز الأكاديمي - المواد والمحاضرات' },
      'tasks.html': { school: 'مركز الإنجاز - المهام والامتحانات والتركيز', uni: 'مركز الإنجاز - المهام والامتحانات والتركيز' },
      'resources.html': { school: 'مكتبة الـ PDF والبطاقات والملخصات', uni: 'مكتبة الـ PDF والبطاقات والملخصات' },
      'prayer.html': { school: 'الرفيق الإيماني ورتب الشرف', uni: 'الرفيق الإيماني ورتب الشرف' }
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
      '<img src="logo/student_hub_logo.png" alt="Logo" class="h-full w-full object-contain filter drop-shadow" width="32" height="32" style="max-width: 32px; max-height: 32px;" onerror="this.outerHTML=\'<span class=\\\'text-lg\\\'>🎓</span>\'">' +
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
    const u = Store.state.user || {};
    const isTeacher = u.role === 'teacher';
    const isSchool = u.role === 'school';
    const isUni = u.role === 'uni';
    const P = Store.state.pomodoroSettings || {};
    const pv = function (k, fb) { return Number(P[k]) > 0 ? P[k] : fb; };

    const roleBadgeText = isTeacher ? '👨‍🏫 حساب معلم معتمد' : (isUni ? '🎓 حساب طالب جامعي' : '🎒 حساب طالب مدرسي');

    let profileFieldsHtml = '';
    if (isTeacher) {
      profileFieldsHtml = `
        <!-- Teacher Profile & Avatar -->
        <div class="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 space-y-3 mb-4">
          <div class="flex items-center gap-4">
            <div class="relative group shrink-0">
              <div class="w-16 h-16 rounded-full bg-indigo-600 border-2 border-indigo-400 overflow-hidden flex items-center justify-center text-2xl text-white shadow-md" id="profile-avatar-preview">
                ${u.avatar ? `<img src="${u.avatar}" class="w-full h-full object-cover" />` : '👨‍🏫'}
              </div>
              <label for="teacher-avatar-file" class="absolute bottom-0 right-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs cursor-pointer shadow hover:bg-indigo-600 transition" title="رفع صورة شخصية">
                📷
              </label>
              <input type="file" id="teacher-avatar-file" accept="image/*" class="hidden">
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-slate-400">صورة المعلم الشخصية</div>
              <p class="text-[11px] text-slate-500">تظهر في كوكبك التعليمي وجدول المجموعات مع طلابك.</p>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المعلم / اللقب:</label>
              <input id="set-name" class="sh-input font-bold" placeholder="اسم المعلم" value="${escapeHtml(u.name || '')}">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المادة التي تدرسها:</label>
              <input id="set-teacher-subject" class="sh-input font-bold" placeholder="المادة الدراسية" value="${escapeHtml(u.teacherSubject || '')}">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الكوكب التعليمي:</label>
              <input id="set-planet-name" class="sh-input font-bold" placeholder="اسم الكوكب" value="${escapeHtml(u.planetName || '')}">
            </div>
          </div>
        </div>
      `;
    } else {
      let gradeLabel = 'غير محدد';
      if (isUni) {
        gradeLabel = (u.faculty || 'الجامعة') + ' - ' + (u.year || 'السنة الدراسية');
      } else {
        const gradeMap = { prep1: 'الأول الإعدادي', prep2: 'الثاني الإعدادي', prep3: 'الثالث الإعدادي', g1: 'الأول الثانوي', g2: 'الثاني الثانوي', g3: 'الثالث الثانوي' };
        gradeLabel = gradeMap[u.grade] || u.grade || 'طالب مدرسي';
        if (u.specialty) {
          const specMap = { sci: 'علمي', lit: 'أدبي', 'sci-s': 'علمي علوم', 'sci-m': 'علمي رياضة' };
          gradeLabel += ' (' + (specMap[u.specialty] || u.specialty) + ')';
        }
      }

      profileFieldsHtml = `
        <!-- Student Profile -->
        <div class="space-y-3 mb-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الطالب:</label>
            <input id="set-name" class="sh-input font-bold" placeholder="اكتب اسمك" value="${escapeHtml(u.name || '')}">
          </div>

          <!-- Academic Year & Upgrade Card -->
          <div class="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="text-[11px] font-bold text-slate-400">الصف الدراسي والمقررات:</div>
                <div class="font-black text-sm text-indigo-600 dark:text-indigo-300">${escapeHtml(gradeLabel)}</div>
              </div>
              <button onclick="App.openUpgradeModal()" class="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow transition active:scale-95 flex items-center gap-1.5 shrink-0">
                <span>🎓</span>
                <span>ترقية الصف والمواد</span>
              </button>
            </div>
            <p class="text-[10px] text-slate-500">انتقلت لسنة دراسية جديدة؟ حدّث صفك وموادك بضغطة زر مع الحفاظ الكامل على نقاط الـ XP وإنجازاتك وسجلاتك.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الهدف الأسبوعي (ساعات دراسة ومذاكرة):</label>
            <div class="flex flex-wrap gap-2 mb-2">
              ${[4, 6, 8, 12, 16].map(function(h) {
                return '<button class="sh-pomo-preset ' + (u.weeklyGoal === h ? 'active' : '') + '" data-goal="' + h + '">' + h + ' س</button>';
              }).join('')}
            </div>
            <input id="set-goal" type="number" min="1" max="80" class="sh-input text-center font-bold" placeholder="أو عدد ساعات مخصص (1-80)" value="${u.weeklyGoal || 4}">
          </div>
        </div>
      `;
    }

    const modal = this.showModal(
      '<div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">' +
      '<div class="flex items-center gap-2">' +
      '<h3 class="text-base md:text-lg font-black text-slate-900 dark:text-white">الملف الشخصي والإعدادات ⚙️</h3>' +
      '</div>' +
      '<button class="sh-btn ghost !p-1.5" id="sh-modal-close">✕</button></div>' +

      '<!-- Role Badge (Locked) -->' +
      '<div class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between mb-4">' +
      '<div class="flex items-center gap-2">' +
      '<span class="font-black text-xs md:text-sm text-indigo-600 dark:text-indigo-400">' + roleBadgeText + '</span>' +
      '<span class="text-[10px] font-bold text-slate-400">🔒 (نوع الحساب مقفل)</span>' +
      '</div>' +
      '<span class="text-xs text-slate-400 font-mono">' + (Store.state.streak.count || 0) + ' يوم 🔥</span>' +
      '</div>' +

      profileFieldsHtml +

      '<!-- Pomodoro Settings -->' +
      '<div class="sh-card p-4 mb-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">' +
      '<div class="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">🍅 مؤقت التركيز وبومودورو:</div>' +
      '<div class="grid grid-cols-3 gap-2">' +
      '<div><label class="block text-[10px] font-bold mb-1 text-slate-400">جلسة (د)</label><input id="set-pomo-dur" type="number" min="1" max="120" class="sh-input text-center text-xs" value="' + pv('duration', 25) + '"></div>' +
      '<div><label class="block text-[10px] font-bold mb-1 text-slate-400">راحة (د)</label><input id="set-pomo-break" type="number" min="1" max="60" class="sh-input text-center text-xs" value="' + pv('breakDuration', 5) + '"></div>' +
      '<div><label class="block text-[10px] font-bold mb-1 text-slate-400">راحة طويلة</label><input id="set-pomo-long" type="number" min="5" max="90" class="sh-input text-center text-xs" value="' + pv('longBreak', 15) + '"></div>' +
      '</div>' +
      '<div class="flex items-center justify-between gap-2 text-xs">' +
      '<label class="text-[11px] font-bold text-slate-500">🔔 صوت نهاية الجلسة</label>' +
      '<select id="set-pomo-sound" class="sh-input !py-1 text-xs w-32">' +
      '<option value="silent"' + (P.ambientSound === 'silent' ? ' selected' : '') + '>صامت</option>' +
      '<option value="beep"' + (P.ambientSound === 'beep' ? ' selected' : '') + '>نغمة تنبيه</option>' +
      '</select></div>' +
      '<label class="flex items-center gap-2 text-[11px] font-bold text-slate-500 cursor-pointer"><input type="checkbox" id="set-pomo-wake" class="accent-indigo-500"' + (P.wakeLock !== false ? ' checked' : '') + '> إبقاء الشاشة مفتوحة أثناء التركيز</label>' +
      '</div>' +

      '<!-- Backup & Data Controls -->' +
      '<div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">' +
      '<div class="grid grid-cols-2 gap-2">' +
      '<button class="sh-btn outline text-xs font-bold" id="set-export">⬇️ تصدير نسخة احتياطية</button>' +
      '<button class="sh-btn outline text-xs font-bold" id="set-import">⬆️ استيراد بيانات</button>' +
      '</div>' +
      '<button class="sh-btn danger w-full text-xs font-black py-2.5 mt-2" id="set-wipe">🗑️ حذف الحساب وإعادة التهيئة من الصفر</button>' +
      '</div>' +
      '<input type="file" id="set-file" accept="application/json" class="hidden">' +
      '<div id="set-restore-section"></div>'
    );

    modal.querySelector('#sh-modal-close').addEventListener('click', function () { App.closeModal(); });

    // Name update
    const nameEl = modal.querySelector('#set-name');
    if (nameEl) {
      nameEl.addEventListener('change', function (e) {
        Store.update('user', '', { name: e.target.value.trim() });
        App.toast('تم حفظ الاسم بنجاح ✅');
      });
    }

    // Teacher specific updates
    if (isTeacher) {
      const tSubEl = modal.querySelector('#set-teacher-subject');
      if (tSubEl) {
        tSubEl.addEventListener('change', function(e) {
          Store.update('user', '', { teacherSubject: e.target.value.trim() });
          App.toast('تم تحديث مادة المعلم ✅');
        });
      }

      const tPlanetEl = modal.querySelector('#set-planet-name');
      if (tPlanetEl) {
        tPlanetEl.addEventListener('change', function(e) {
          Store.update('user', '', { planetName: e.target.value.trim() });
          App.toast('تم تحديث اسم الكوكب ✅');
        });
      }

      const avatarInput = modal.querySelector('#teacher-avatar-file');
      if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (!file) return;
          if (file.size > 2 * 1024 * 1024) {
            App.toast('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت ⚠️', 'warning');
            return;
          }
          const reader = new FileReader();
          reader.onload = function(evt) {
            const dataUrl = evt.target.result;
            Store.update('user', '', { avatar: dataUrl });
            const preview = modal.querySelector('#profile-avatar-preview');
            if (preview) {
              preview.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover" />`;
            }
            App.toast('تم حفظ وتعيين صورة المعلم بنجاح! 📸', 'success');
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      // Student specific goal updates
      const goalEl = modal.querySelector('#set-goal');
      if (goalEl) {
        goalEl.addEventListener('change', function (e) {
          const v = Math.min(80, Math.max(1, Number(e.target.value) || 4));
          e.target.value = v;
          Store.update('user', '', { weeklyGoal: v });
          App.toast('تم تحديث الهدف الأسبوعي ✅');
        });
      }

      modal.querySelectorAll('[data-goal]').forEach(function(b) {
        b.addEventListener('click', function() {
          const v = parseInt(b.dataset.goal);
          if (goalEl) goalEl.value = v;
          Store.update('user', '', { weeklyGoal: v });
          modal.querySelectorAll('[data-goal]').forEach(function(x) { x.classList.remove('active'); });
          b.classList.add('active');
          App.toast('الهدف الأسبوعي: ' + v + ' ساعات ✅');
        });
      });
    }

    function savePomo(patch) {
      Store.updateSettings(patch);
      App.toast('تم حفظ إعدادات التركيز ✅');
    }
    modal.querySelector('#set-pomo-dur').addEventListener('change', function (e) { savePomo({ duration: Math.max(1, Number(e.target.value) || 25) }); });
    modal.querySelector('#set-pomo-break').addEventListener('change', function (e) { savePomo({ breakDuration: Math.max(1, Number(e.target.value) || 5) }); });
    modal.querySelector('#set-pomo-long').addEventListener('change', function (e) { savePomo({ longBreak: Math.max(5, Number(e.target.value) || 15) }); });
    modal.querySelector('#set-pomo-sound').addEventListener('change', function (e) { savePomo({ ambientSound: e.target.value }); });
    modal.querySelector('#set-pomo-wake').addEventListener('change', function (e) { savePomo({ wakeLock: e.target.checked }); });

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
      App.confirm('هل أنت متأكد من حذف الحساب نهائياً؟', 'سيتم مسح كافة بياناتك وجدولك ومهامك بشكل كامل والعودة لمعالج التسجيل للبدء من جديد كحساب جديد.', function () {
        localStorage.removeItem('studentHub_v2');
        App.toast('تم حذف الحساب بالكامل');
        setTimeout(function () { location.href = 'index.html'; }, 500);
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

  openUpgradeModal() {
    App.closeModal();
    const u = Store.state.user || {};
    const isUni = u.role === 'uni';

    if (isUni) {
      const yearChoice = prompt(
        '🎓 ترقية السنة الجامعية:\n\nاختر السنة الدراسية الجديدة:\n1. الفرقة الأولى\n2. الفرقة الثانية\n3. الفرقة الثالثة\n4. الفرقة الرابعة\n5. الفرقة الخامسة',
        '2'
      );
      if (!yearChoice) return;
      const yearMap = { '1': 'الفرقة الأولى', '2': 'الفرقة الثانية', '3': 'الفرقة الثالثة', '4': 'الفرقة الرابعة', '5': 'الفرقة الخامسة' };
      const newYear = yearMap[yearChoice] || 'الفرقة الثانية';

      const termChoice = prompt('اختر الفصل الدراسي:\n\n1. الترم الأول\n2. الترم الثاني', '1');
      const newTerm = termChoice === '2' ? 'الترم الثاني' : 'الترم الأول';

      const rawSubjs = prompt('اكتب أسماء مقررات/مواد هذه السنة مفصولة بفاصلة (,):\n(مثال: مادة 1, مادة 2, مادة 3):', '');
      let newSubjects = [];
      if (rawSubjs && rawSubjs.trim()) {
        newSubjects = rawSubjs.split(',').map(s => s.trim()).filter(Boolean);
      }

      Store.upgradeStudentGrade({
        year: newYear,
        term: newTerm,
        subjects: newSubjects
      });

      App.toast('ألف مبروك الترقية للسنة الجامعية الجديدة! 🎉 (+50 XP)', 'success');
      setTimeout(() => location.reload(), 800);
      return;
    }

    // School Upgrade
    const gradeChoice = prompt(
      '🎒 ترقية الصف الدراسي:\n\nاختر صفك الدراسي الجديد:\n1. الأول الإعدادي\n2. الثاني الإعدادي\n3. الثالث الإعدادي\n4. الأول الثانوي\n5. الثاني الثانوي\n6. الثالث الثانوي',
      '5'
    );
    if (!gradeChoice) return;

    const gradeMap = { '1': 'prep1', '2': 'prep2', '3': 'prep3', '4': 'g1', '5': 'g2', '6': 'g3' };
    const gradeId = gradeMap[gradeChoice] || 'g2';

    let specialty = '';
    let newSubjects = [];

    if (gradeId === 'g2') {
      const specChoice = prompt('اختر الشعبة:\n\n1. علمي\n2. أدبي', '1');
      specialty = specChoice === '2' ? 'lit' : 'sci';
      if (specialty === 'sci') {
        newSubjects = ['الفيزياء', 'الكيمياء', 'الأحياء', 'الرياضيات', 'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية'];
      } else {
        newSubjects = ['التاريخ', 'الجغرافيا', 'علم النفس والاجتماع', 'الفلسفة والمنطق', 'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية'];
      }
    } else if (gradeId === 'g3') {
      const specChoice = prompt('اختر الشعبة للثانوية العامة:\n\n1. علمي علوم\n2. علمي رياضة\n3. أدبي', '1');
      if (specChoice === '2') {
        specialty = 'sci-m';
        newSubjects = ['الرياضيات البحتة', 'الرياضيات التطبيقية', 'الفيزياء', 'الكيمياء', 'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'الجيولوجيا'];
      } else if (specChoice === '3') {
        specialty = 'lit';
        newSubjects = ['التاريخ', 'الجغرافيا', 'علم النفس والاجتماع', 'الفلسفة والمنطق', 'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية'];
      } else {
        specialty = 'sci-s';
        newSubjects = ['الأحياء', 'الجيولوجيا', 'الكيمياء', 'الفيزياء', 'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية'];
      }
    } else if (gradeId === 'g1') {
      newSubjects = ['اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'الرياضيات', 'العلوم المتكاملة', 'التاريخ', 'الفلسفة'];
    } else {
      newSubjects = ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية'];
    }

    Store.upgradeStudentGrade({
      grade: gradeId,
      specialty,
      subjects: newSubjects
    });

    App.toast('ألف مبروك الترقية للسنة الدراسية الجديدة! وتم تحديث المقررات 🎉 (+50 XP)', 'success');
    setTimeout(() => location.reload(), 800);
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
