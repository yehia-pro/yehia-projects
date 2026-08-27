const MOTIVATION_QUOTES = [
  { text: "«مَن سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ له به طَرِيقًا إلى الجَنَّةِ»", author: "رسول الله ﷺ" },
  { text: "«وَقُل رَّبِّ زِدْنِي عِلْمًا» — النجاح رحلة خطوات صغيرة مستمرة كل يوم.", author: "القرآن الكريم" },
  { text: "«طَلَبُ العِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ» — دقيقة تركيز الآن تصنع فارق مستقبلك.", author: "حديث شريف" },
  { text: "«إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ» — ابدأ يومك بإتقان وهمة.", author: "حديث شريف" },
  { text: "«وَأَن لَّيْسَ لِلإِنسَانِ إِلَّا مَا سَعَى» — كل دقيقة مذاكرة مقدرة ومكتوبة عند الله.", author: "القرآن الكريم" },
  { text: "المتفوقون لا ينتظرون المزاج المثالي، بل يبدأون الآن ويصنعون نجاحهم خطوة بخطوة.", author: "حكمة اليوم" },
  { text: "قليل دائم خير من كثير منقطع — 25 دقيقة تركيز تام كافية لصنع فارق حقيقي.", author: "حكمة اليوم" }
];

const Dash = {
  init() {
    this.renderGreeting();
    this.renderDailyMotivation();
    this.renderStats();
    this.renderPrayerWidget();
    this.renderCountdown();
    this.renderAlerts();
    this.renderTodaySchedule();
    this.renderTasks();
    this.renderResources();
    this.initPomodoro();
  },

  renderGreeting() {
    const h = new Date().getHours();
    let g = 'أهلاً';
    if (h < 5) g = 'تصبح على خير 🌙';
    else if (h < 12) g = 'صباح الهمة والتفوق ☀️';
    else if (h < 17) g = 'طاب يومك يا بطل ⚡';
    else if (h < 22) g = 'مساء الإنجاز والتركيز 🌟';
    else g = 'تصبح على خير 🌙';
    const name = Store.state.user.name;
    document.getElementById('dash-greeting').textContent = g + (name ? '، ' + name : '');
    const now = new Date();
    const gregStr = 'اليوم ' + DAYS_AR[now.getDay()] + '، ' + now.getDate() + ' ' + MONTHS_AR[now.getMonth()] + ' ' + now.getFullYear();
    const hijriStr = typeof PrayerCalc !== 'undefined' ? ' — ' + PrayerCalc.getHijriDate(now) : '';
    document.getElementById('dash-date').textContent = gregStr + hijriStr;
  },

  renderDailyMotivation() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quote = MOTIVATION_QUOTES[dayOfYear % MOTIVATION_QUOTES.length];

    const quoteTextEl = document.getElementById('dash-motivation-text');
    if (quoteTextEl) quoteTextEl.textContent = quote.text;
    const authorEl = document.getElementById('dash-motivation-author');
    if (authorEl) authorEl.textContent = quote.author;

    // Daily Login Streak reward
    const st = Store.state;
    const today = localDateStr();
    if (!st.streak) st.streak = { count: 0, lastDate: '' };
    if (st.streak.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (st.streak.lastDate === yesterday) {
        st.streak.count += 1;
      } else {
        st.streak.count = 1;
      }
      st.streak.lastDate = today;
      Store.addXP(15, 'تسجيل الحضور اليومي للمذاكرة');
      Store.save();
    }

    const streakLbl = document.getElementById('dash-daily-streak-lbl');
    if (streakLbl) streakLbl.textContent = `ستريك اليوم: ${st.streak.count} أيام 🔥 (+15 XP)`;

    // Briefing values
    const openTasks = (st.tasks || []).filter(t => !t.done).length;
    const tasksStat = document.getElementById('briefing-tasks-stat');
    if (tasksStat) tasksStat.textContent = openTasks > 0 ? `${openTasks} مهام نشطة` : 'لا توجد مهام متأخرة ✨';

    const quranStat = document.getElementById('briefing-quran-stat');
    if (quranStat && st.quranBookmark) {
      quranStat.textContent = `ص ${st.quranBookmark.page || 293} (${st.quranBookmark.surahName || 'الكهف'})`;
    }

    const prayerStat = document.getElementById('briefing-prayer-stat');
    if (prayerStat && typeof PrayerSystem !== 'undefined') {
      try {
        const pStatus = PrayerSystem.getSequentialStatus();
        prayerStat.textContent = `${pStatus.next.name} (${pStatus.countdownText})`;
      } catch(e) {}
    }
  },

  renderPrayerWidget() {
    if (typeof PrayerSystem === 'undefined') return;
    this.updatePrayerWidget();
    PrayerSystem.onUpdate(() => {
      this.updatePrayerWidget();
    });
  },

  updatePrayerWidget() {
    const widget = document.getElementById('dash-prayer-widget');
    if (!widget || typeof PrayerSystem === 'undefined') return;

    const status = PrayerSystem.getSequentialStatus();
    const cfg = PrayerSystem.getSettings();

    const cityEl = document.getElementById('dash-prayer-city');
    if (cityEl) cityEl.textContent = cfg.cityName || 'القاهرة';

    const nextNameEl = document.getElementById('dash-prayer-next-name');
    if (nextNameEl) nextNameEl.textContent = status.next.icon + ' صلاة ' + status.next.name;

    const nextTimeEl = document.getElementById('dash-prayer-next-time');
    if (nextTimeEl) {
      const d = status.next.date;
      nextTimeEl.textContent = formatTime(d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'));
    }

    const prevWinEl = document.getElementById('dash-prayer-win-prev');
    if (prevWinEl) prevWinEl.textContent = status.current.name;

    const nextWinEl = document.getElementById('dash-prayer-win-next');
    if (nextWinEl) nextWinEl.textContent = status.next.name;

    const progEl = document.getElementById('dash-prayer-progress');
    if (progEl) progEl.style.width = status.progressPercent + '%';

    const timerEl = document.getElementById('dash-prayer-timer');
    if (timerEl) timerEl.textContent = status.countdownText;

    // Strict 5 Prayers Checklist
    const listEl = document.getElementById('dash-prayer-checklist');
    if (listEl) {
      const log = Store.getPrayerLog();
      const prayers = [
        { key: 'fajr', name: 'الفجر' },
        { key: 'dhuhr', name: 'الظهر' },
        { key: 'asr', name: 'العصر' },
        { key: 'maghrib', name: 'المغرب' },
        { key: 'isha', name: 'العشاء' }
      ];

      listEl.innerHTML = prayers.map(p => {
        const state = PrayerSystem.getPrayerState(p.key, new Date(), status.todayTimes, log);
        let btnCls = 'bg-white/5 text-slate-300 hover:bg-white/10';
        let iconText = '○ ' + p.name;
        let onClickAction = `Dash.clickPrayer('${p.key}', '${state}')`;

        if (state === 'upcoming') {
          btnCls = 'bg-white/5 text-slate-500 opacity-60 cursor-not-allowed';
          iconText = '🔒 ' + p.name;
        } else if (state === 'current') {
          btnCls = 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-bold animate-pulse';
          iconText = '🟢 ' + p.name;
        } else if (state === 'missed') {
          btnCls = 'bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold';
          iconText = '⚠️ فاتتك';
        } else if (state === 'done_on_time') {
          btnCls = 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 font-black';
          iconText = '✓ ' + p.name;
        } else if (state === 'done_qada') {
          btnCls = 'bg-amber-500/30 text-amber-200 border border-amber-500/50 font-black';
          iconText = '⏱️ ' + p.name;
        }

        return `
          <button onclick="${onClickAction}" class="p-2 rounded-xl transition-all ${btnCls} flex flex-col items-center gap-1 active:scale-95 text-center">
            <span class="text-xs">${iconText}</span>
          </button>
        `;
      }).join('');
    }
  },

  clickPrayer(key, state) {
    if (state === 'upcoming') {
      App.toast('لا يمكن تسجيل صلاة قبل حلول موعد أذانها ⏳', 'warning');
      if (App.sound) App.sound('warn');
      return;
    }

    if (state === 'done_on_time' || state === 'done_qada') {
      Store.setPrayerStatus(key, false);
      App.toast('تم إلغاء التحديد');
    } else if (state === 'missed') {
      Store.setPrayerStatus(key, 'qada');
      App.sound('task');
      App.toast('تقبل الله قضاء صلاتكم 🤲');
    } else {
      Store.setPrayerStatus(key, 'on_time');
      App.sound('task');
      App.toast('تقبل الله طاعتكم وصالح أعمالكم 🤲');
    }

    this.updatePrayerWidget();
  },

  renderStats() {
    const st = Store.state;
    const today = localDateStr();
    const open = st.tasks.filter(function (t) { return !t.completed; }).length;
    const exams7 = st.exams.filter(function (e) {
      const d = daysBetween(e.date, today);
      return d >= 0 && d <= 7;
    }).length;
    document.getElementById('dash-tasks-open').textContent = open;
    document.getElementById('dash-exams-7').textContent = exams7;
    document.getElementById('dash-minutes').textContent = Store.studyMinutes(today);
    document.getElementById('dash-streak').textContent = st.streak.count || 0;

    // Gamification XP & Rank
    if (Store.getUserXP) {
      const uXP = Store.getUserXP();
      const badgeEl = document.getElementById('dash-rank-badge');
      const titleEl = document.getElementById('dash-rank-title');
      const subEl = document.getElementById('dash-level-sub');
      const pctEl = document.getElementById('dash-xp-pct');
      const barEl = document.getElementById('dash-xp-bar');
      const levelNumEl = document.getElementById('dash-level-num');
      const progressTextEl = document.getElementById('dash-xp-progress-text');

      if (badgeEl) badgeEl.textContent = uXP.rank.badge;
      if (titleEl) titleEl.textContent = uXP.rank.title;
      if (levelNumEl) levelNumEl.textContent = uXP.level;
      if (progressTextEl) progressTextEl.textContent = `${uXP.levelProgressXP} / ${uXP.levelTotalXPNeeded} XP`;
      if (pctEl) pctEl.textContent = `${uXP.levelPercent}%`;
      if (barEl) barEl.style.width = `${uXP.levelPercent}%`;
    }
  },

  renderCountdown() {
    const el = document.getElementById('dash-countdown');
    const today = localDateStr();
    const exams = Store.state.exams
      .filter(function (e) { return daysBetween(e.date, today) >= 0; })
      .sort(function (a, b) { return a.date.localeCompare(b.date) || a.time.localeCompare(b.time); });
    if (!exams.length) {
      el.innerHTML = '<div class="sh-empty"><div class="sh-empty-icon">🎉</div><div>مفيش امتحانات قادمة</div></div>';
      return;
    }
    const ex = exams[0];
    const diff = daysBetween(ex.date, today);
    const s = Store.subject(ex.subjectId);
    const color = s ? s.color : '#6366f1';
    el.innerHTML =
      '<div class="flex items-center gap-2 mb-3"><span class="sh-chip" style="background:' + color + ';color:#fff">' + escapeHtml(Store.subjectName(ex.subjectId)) + '</span>' +
      '<span class="font-extrabold text-slate-800 dark:text-white">' + escapeHtml(ex.title) + '</span></div>' +
      '<div class="text-center text-sm font-bold text-slate-500 mb-3">' + formatArDate(ex.date) + ' - ' + formatTime(ex.time) +
      (ex.location ? ' - 📍 ' + escapeHtml(ex.location) : '') + '</div>' +
      '<div class="sh-countdown" id="cd-units">' + this.countdownUnits(diff, ex.time) + '</div>' +
      (diff <= 1 ? '<div class="text-center mt-3 text-sm font-extrabold text-red-500">⚠️ ' + relativeDay(ex.date) + '! استعد بدري</div>' : '');
    this._exam = ex;
    this._examDiff = diff;
    const iv = setInterval(function () { Dash.tickCountdown(); }, 60000);
    this.tickCountdown();
  },

  countdownUnits(diff, time) {
    if (diff > 0) {
      return '<div class="sh-unit"><div class="num">' + diff + '</div><div class="lbl">يوم</div></div>';
    }
    let h = 12, m = 0;
    if (time) {
      const p = time.split(':');
      h = Number(p[0]); m = Number(p[1] || 0);
    }
    return '<div class="sh-unit"><div class="num">' + h + '</div><div class="lbl">ساعة</div></div>' +
      '<div class="sh-unit"><div class="num">' + m + '</div><div class="lbl">دقيقة</div></div>';
  },

  tickCountdown() {
    if (!this._exam) return;
    const el = document.getElementById('cd-units');
    if (!el) return;
    const today = localDateStr();
    const diff = daysBetween(this._exam.date, today);
    el.innerHTML = this.countdownUnits(diff, this._exam.time);
  },

  renderAlerts() {
    const el = document.getElementById('dash-alerts');
    const today = localDateStr();
    const alerts = [];
    const overdue = Store.state.tasks.filter(function (t) { return !t.completed && t.dueDate < today; });
    if (overdue.length) {
      alerts.push('<div class="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-3">' +
        '<span class="text-xl">⏰</span><div class="flex-1"><div class="font-extrabold text-sm text-red-600 dark:text-red-300">' + overdue.length + ' مهمة متأخرة!</div>' +
        '<div class="text-xs text-red-500">' + escapeHtml(overdue[0].title) + (overdue.length > 1 ? ' والمزيد...' : '') + '</div></div>' +
        '<a href="tasks.html" class="sh-btn ghost !py-1 !px-2 text-xs">شوفها</a></div>');
    }
    const todayTasks = Store.state.tasks.filter(function (t) { return !t.completed && t.dueDate === today; });
    if (todayTasks.length) {
      alerts.push('<div class="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-3">' +
        '<span class="text-xl">📌</span><div class="flex-1"><div class="font-extrabold text-sm text-amber-600 dark:text-amber-300">' + todayTasks.length + ' مهمة مستنية النهارده</div></div>' +
        '<a href="tasks.html" class="sh-btn ghost !py-1 !px-2 text-xs">ابدأ</a></div>');
    }
    const examTomorrow = Store.state.exams.find(function (e) { return daysBetween(e.date, today) === 1; });
    if (examTomorrow) {
      alerts.push('<div class="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-3">' +
        '<span class="text-xl">🚨</span><div class="flex-1"><div class="font-extrabold text-sm text-red-600 dark:text-red-300">امتحان بكرة!</div>' +
        '<div class="text-xs text-red-500">' + escapeHtml(examTomorrow.title) + ' - ' + Store.subjectName(examTomorrow.subjectId) + '</div></div>' +
        '<a href="exams.html" class="sh-btn ghost !py-1 !px-2 text-xs">تفاصيل</a></div>');
    }
    if (!alerts.length) {
      alerts.push('<div class="sh-empty !p-6"><div class="sh-empty-icon">😌</div><div>مفيش تنبيهات — كله تمام!</div></div>');
    }
    el.innerHTML = alerts.join('');
  },

  renderTodaySchedule() {
    const listEl = document.getElementById('dash-today-schedule-list');
    const titleEl = document.getElementById('dash-today-schedule-title');
    const subtitleEl = document.getElementById('dash-today-schedule-subtitle');
    if (!listEl) return;

    const todayDay = DAYS_AR[new Date().getDay()];
    const isTeacher = Store.isTeacher();
    const isUni = Store.state.user && Store.state.user.role === 'uni';

    if (titleEl) {
      titleEl.textContent = isTeacher ? `🪐 مجموعاتك ومواعيدك اليوم (${todayDay})` : `📅 حصصك ومحاضراتك اليوم (${todayDay})`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = isTeacher ? 'جدول المجموعات والسناتر المجدولة لليوم' : 'مواعيدك المنظمة لليوم بالساعة ومكان الحضور';
    }

    const items = isTeacher ?
      Store.getTeacherSchedule().filter(x => x.day === todayDay) :
      Store.getStudentSchedule().filter(x => x.day === todayDay);

    if (!items.length) {
      listEl.innerHTML = `
        <div class="col-span-full sh-card p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-center space-y-2 border border-slate-200/60 dark:border-slate-800">
          <span class="text-3xl block">✨</span>
          <h4 class="font-black text-xs text-slate-800 dark:text-white">لا توجد مواعيد مسجلة ليوم (${todayDay})</h4>
          <p class="text-[11px] text-slate-400">استغل وقتك في المذاكرة الذاتية أو مراجعة مهامك!</p>
          <a href="subjects.html" class="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:underline pt-1">
            <span>+ تنظيم موعد في جدول الـ 7 أيام</span>
            <span>←</span>
          </a>
        </div>
      `;
      return;
    }

    listEl.innerHTML = items.map(item => {
      let badgeCls = 'bg-indigo-600 text-white';
      let badgeLabel = isUni ? '🏛️ محاضرة' : '🏫 حضور سنتر';

      if (item.type === 'break') {
        badgeCls = 'bg-amber-500 text-white';
        badgeLabel = '☕ استراحة';
      } else if (item.type === 'study') {
        badgeCls = 'bg-blue-600 text-white';
        badgeLabel = '📚 مذاكرة';
      } else if (item.sessionCategory === 'section') {
        badgeCls = 'bg-cyan-600 text-white';
        badgeLabel = '🔬 سكشن';
      } else if (item.sessionCategory === 'course' || item.sessionCategory === 'online') {
        badgeCls = 'bg-purple-600 text-white';
        badgeLabel = '💻 أونلاين';
      } else if (item.sessionCategory === 'private') {
        badgeCls = 'bg-emerald-600 text-white';
        badgeLabel = '📖 درس خاص';
      }

      return `
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 space-y-2 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-1.5">
              <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-black ${badgeCls}">
                ${badgeLabel}
              </span>
              <span class="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                ⏰ ${formatTime(item.startTime)} - ${formatTime(item.endTime)}
              </span>
            </div>
            <h4 class="font-black text-xs text-slate-900 dark:text-white truncate">${escapeHtml(item.title || item.subjectName || 'موعد دراسي')}</h4>
            <div class="text-[11px] text-slate-400 flex items-center justify-between">
              <span>📍 ${escapeHtml(item.location || 'السنتر')}</span>
              ${item.teacherName ? `<span>👨‍🏫 ${escapeHtml(item.teacherName)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderTasks() {
    const el = document.getElementById('dash-tasks');
    const today = localDateStr();
    const tasks = Store.state.tasks
      .filter(function (t) { return !t.completed && t.dueDate <= addDaysStr(3); })
      .sort(function (a, b) { return a.dueDate.localeCompare(b.dueDate); })
      .slice(0, 5);
    if (!tasks.length) {
      el.innerHTML = '<div class="sh-empty !p-5"><div class="sh-empty-icon">✅</div><div>لا مهام حالياً</div></div>';
      return;
    }
    el.innerHTML = tasks.map(function (t) {
      const diff = daysBetween(t.dueDate, today);
      let dueCls = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      let dueTxt = relativeDay(t.dueDate);
      if (diff < 0) { dueCls = 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300'; dueTxt = 'متأخرة ' + (-diff) + ' يوم'; }
      else if (diff === 0) { dueCls = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'; }
      const pm = PRIORITY_META[t.priority];
      return '<div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">' +
        '<span class="sh-priority ' + pm.cls + '">' + pm.label + '</span>' +
        '<div class="flex-1 min-w-0"><div class="font-bold text-sm truncate text-slate-800 dark:text-white">' + escapeHtml(t.title) + '</div>' +
        subjectChip(t.subjectId) + '</div>' +
        '<span class="sh-badge ' + dueCls + '">' + dueTxt + '</span></div>';
    }).join('');
  },

  renderResources() {
    const el = document.getElementById('dash-resources');
    const rs = Store.state.resources.slice(0, 3);
    if (!rs.length) {
      el.innerHTML = '<div class="sh-empty !p-5"><div class="sh-empty-icon">🔗</div><div>أضف روابط مفيدة من صفحة الروابط</div></div>';
      return;
    }
    const ICONS = { drive: '📁', youtube: '▶️', pdf: '📄', other: '🔗' };
    el.innerHTML = rs.map(function (r) {
      return '<div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">' +
        '<span class="text-xl">' + (ICONS[r.type] || '🔗') + '</span>' +
        '<div class="flex-1 min-w-0"><div class="font-bold text-sm truncate text-slate-800 dark:text-white">' + escapeHtml(r.title) + '</div>' +
        subjectChip(r.subjectId) + '</div>' +
        '<a href="' + escapeHtml(r.url) + '" target="_blank" class="sh-btn outline !py-1 !px-2 text-xs">فتح</a></div>';
    }).join('');
  },

  // ============== Pomodoro مع presets + controls ==============
  initPomodoro() {
    const ring = document.getElementById('pomo-ring');
    const timer = document.getElementById('pomo-timer');
    const mode = document.getElementById('pomo-mode');
    const subject = document.getElementById('pomo-subject');
    const btn = document.getElementById('pomo-btn');
    const reset = document.getElementById('pomo-reset');
    const total = document.getElementById('pomo-today');
    const currentMinEl = document.getElementById('pomo-current-min');
    const presetsEl = document.getElementById('pomo-presets');
    const wakeCb = document.getElementById('pomo-wake-cb');
    if (!timer) return;

    // عبّي قائمة المواد
    if (subject) {
      subject.innerHTML = '<option value="">بدون مادة</option>' +
        Store.state.subjects.map(s => '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>').join('');
    }

    let WORK = (Store.state.pomodoroSettings && Number(Store.state.pomodoroSettings.duration)) || 25;
    let BREAK = (Store.state.pomodoroSettings && Number(Store.state.pomodoroSettings.breakDuration)) || 5;
    let SKIP_BREAK = false;
    let SOUND = 'beep';
    let ALLOW_WAKE = true;
    let endTime = 0, timerId = null, wakeLock = null, isBreak = false, isLong = false;
    let cycleCount = (Store.state.pomodoroSessions || []).filter(p => p.date === localDateStr()).length % 4;

    const fmt = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    };

    const setMode = (br, lg) => {
      isBreak = br;
      isLong = !!lg;
      mode.textContent = isLong ? 'استراحة طويلة 🧘' : isBreak ? 'استراحة ☕' : 'تركيز 🎯';
      if (ring) {
        ring.classList.toggle('break', isBreak || isLong);
      }
    };
    setMode(false);
    updateMinLabel();
    paint();

    function updateMinLabel() {
      if (currentMinEl) currentMinEl.textContent = WORK + ' د';
    }

    function paint() {
      const d = (isLong ? 0 : isBreak ? BREAK : WORK) * 60;
      const remain = timerId ? Math.max(0, Math.round((endTime - Date.now()) / 1000)) : d;
      const pct = d > 0 ? Math.round((d - remain) / d * 100) : 0;
      if (ring) ring.style.background = 'conic-gradient(' + ((isBreak || isLong) ? '#10b981' : 'var(--sh-primary)') + ' ' + pct + '%, #e2e8f0 ' + pct + '%)';
      timer.textContent = fmt(remain);
      if (total) total.textContent = 'درست النهارده: ' + Store.studyMinutes(localDateStr()) + ' دقيقة';
    }

    function beep() {
      if (SOUND === 'silent') return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = (isBreak || isLong) ? 880 : 660;
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
        o.start(); o.stop(ctx.currentTime + 1);
        setTimeout(function () { ctx.close(); }, 1200);
      } catch (e) {}
    }

    function requestWake() {
      if (ALLOW_WAKE && navigator.wakeLock) {
        navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; }).catch(function () {});
      }
    }
    function releaseWake() {
      if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
    }
    function notify(text) {
      if ('Notification' in window && Notification.permission === 'granted') {
        try { new Notification('Student Hub', { body: text }); } catch (e) {}
      }
      App.toast(text, (isBreak || isLong) ? 'info' : 'success');
      beep();
    }
    function finish() {
      releaseWake();
      if (isBreak || isLong) {
        isBreak = false; isLong = false;
        setMode(false);
        App.sound('warn');
        notify('الاستراحة خلصت، نرجع نذاكر 💪');
      } else {
        const mins = WORK;
        Store.add('pomodoroSessions', { id: uid(), date: localDateStr(), subjectId: subject ? (subject.value || '') : '', minutes: mins, ts: Date.now() });
        Store.updateStreak(true);
        App.sound('timer');
        cycleCount = (cycleCount + 1) % 4;
        // لو مفيش استراحة، ابدأ جلسة جديدة فوراً
        if (SKIP_BREAK || BREAK === 0) {
          notify('أحسنت! خلصت ' + mins + ' دقيقة، يلا نجولة تانية 💪');
        } else {
          isLong = cycleCount === 0;
          isBreak = !isLong;
          setMode(isBreak, isLong);
          notify(isLong ? 'أحسنت! خلصت ' + mins + ' دقيقة 🎉 خد استراحة طويلة 🧘' : 'أحسنت! خلصت ' + mins + ' دقيقة 🎉 خد استراحة');
        }
      }
    }

    function startInterval(totalSec) {
      endTime = Date.now() + totalSec * 1000;
      btn.textContent = 'إيقاف ⏸';
      requestWake();
      timerId = setInterval(function () {
        const remain = Math.max(0, Math.round((endTime - Date.now()) / 1000));
        if (remain <= 0) {
          clearInterval(timerId); timerId = null;
          finish();
          paint();
          // لو SKIP_BREAK، ابدأ جلسة جديدة فوراً (التايمر لسه شغال في الـ UI)
          if (!isBreak && !isLong && SKIP_BREAK) {
            btn.textContent = 'إيقاف ⏸';
            startInterval(WORK * 60);
          }
          return;
        }
        paint();
      }, 250);
    }

    // ===== Presets =====
    if (presetsEl) {
      presetsEl.addEventListener('click', (e) => {
        const t = e.target.closest('.sh-pomo-preset');
        if (!t) return;
        if (timerId) { App.toast('وقّف التايمر الأول', 'warning'); return; }
        const v = t.dataset.min;
        if (v === 'custom') {
          const modal = App.showModal(
            '<h3 class="text-lg font-extrabold mb-4">⏱️ مدة مخصصة</h3>' +
            '<label class="block text-sm font-bold mb-1">المدة (بالدقايق)</label>' +
            '<input id="custom-min" type="number" min="1" max="240" class="sh-input mb-4" value="' + WORK + '">' +
            '<div class="flex gap-2 justify-end">' +
            '<button class="sh-btn ghost" id="custom-cancel">إلغاء</button>' +
            '<button class="sh-btn primary" id="custom-save">حفظ</button></div>'
          );
          modal.querySelector('#custom-cancel').onclick = () => App.closeModal();
          modal.querySelector('#custom-save').onclick = () => {
            const v2 = parseInt(modal.querySelector('#custom-min').value);
            if (!v2 || v2 < 1 || v2 > 240) { App.toast('ادخل رقم من 1 لـ 240', 'warning'); return; }
            WORK = v2;
            presetsEl.querySelectorAll('.sh-pomo-preset').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            updateMinLabel();
            isBreak = false; isLong = false;
            setMode(false);
            paint();
            App.closeModal();
            App.toast('تم التعيين على ' + WORK + ' دقيقة ✅');
          };
          return;
        }
        WORK = parseInt(v) || 25;
        presetsEl.querySelectorAll('.sh-pomo-preset').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        updateMinLabel();
        isBreak = false; isLong = false;
        setMode(false);
        paint();
      });
    }

    // ===== + / - Adjusters =====
    document.querySelectorAll('.sh-pomo-adj').forEach(b => {
      b.addEventListener('click', () => {
        const delta = parseInt(b.dataset.adj);
        const newW = WORK + delta;
        if (newW < 1) { App.toast('الحد الأدنى دقيقة', 'warning'); return; }
        if (newW > 240) { App.toast('الحد الأقصى 4 ساعات', 'warning'); return; }
        WORK = newW;
        // لو التايمر شغال ومش استراحة: مدّد أو قلّل الوقت المتبقي
        if (timerId && !isBreak && !isLong) {
          endTime += delta * 60 * 1000;
          if (endTime <= Date.now()) { endTime = Date.now() + 1000; }
        }
        if (presetsEl) presetsEl.querySelectorAll('.sh-pomo-preset').forEach(x => x.classList.remove('active'));
        updateMinLabel();
        paint();
        // حفظ المدة المختارة
        Store.updateSettings({ duration: WORK });

      });
    });

    // ===== Break options =====
    document.querySelectorAll('.sh-pomo-break-opt').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.sh-pomo-break-opt').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const v = parseInt(b.dataset.break);
        if (v === 0) { SKIP_BREAK = true; BREAK = 0; }
        else { SKIP_BREAK = false; BREAK = v; }
      });
    });

    // ===== Sound options =====
    document.querySelectorAll('.sh-pomo-snd-opt').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.sh-pomo-snd-opt').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        SOUND = b.dataset.snd;
      });
    });

    if (wakeCb) {
      ALLOW_WAKE = wakeCb.checked;
      wakeCb.addEventListener('change', () => { ALLOW_WAKE = wakeCb.checked; });
    }

    btn.addEventListener('click', function () {
      if (timerId) {
        clearInterval(timerId); timerId = null;
        releaseWake();
        btn.textContent = 'ابدأ ▶';
        paint();
        return;
      }
      if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
      // ابدأ
      const dur = (isLong ? 0 : isBreak ? BREAK : WORK) * 60;
      if (dur <= 0) {
        // لو مفيش مدة (مثلاً بدون استراحة والاستراحة هي اللي شغالة)، تجاهل
        App.toast('مفيش مدة محددة', 'warning');
        return;
      }
      startInterval(dur);
    });

    document.getElementById('pomo-reset').addEventListener('click', function () {
      if (timerId) { clearInterval(timerId); timerId = null; releaseWake(); }
      isBreak = false; isLong = false;
      setMode(false);
      btn.textContent = 'ابدأ ▶';
      paint();
    });
    document.addEventListener('visibilitychange', function () {
      if (timerId && document.visibilityState === 'visible') requestWake();
    });
  }
};

document.addEventListener('DOMContentLoaded', function () { Dash.init(); });
