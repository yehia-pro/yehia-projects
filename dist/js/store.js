const LS_KEY = 'studentHub_v2';

function uid() {
  return 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function localDateStr(d) {
  d = d || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function addDaysStr(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return localDateStr(d);
}

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function seedData() {
  const d = {
    version: 6,
    user: { name: '', theme: 'light', weeklyGoal: 5, role: '', grade: '', stage: '', specialty: '', faculty: '', year: '', term: '', count: 0, onboardingDone: false, xp: 0, level: 1 },
    subjects: [],
    tasks: [],
    exams: [],
    lectures: [],
    resources: [],
    grades: [],
    teachers: [],
    groups: [],
    pomodoroSessions: [],
    pomodoroSettings: { duration: 25, breakDuration: 5, longBreak: 15, ambientSound: 'silent', wakeLock: true },
    prayerSettings: {
      city: 'cairo',
      cityName: 'القاهرة',
      lat: 30.0444,
      lng: 31.2357,
      method: 'Egypt',
      asrMethod: 'Standard',
      adjustments: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
      notifications: true,
      remindBefore: 5,
      urgentReminder: true,
      adhanSound: 'makkah'
    },
    prayerLogs: {},
    sunnahLogs: {},
    quranLogs: {},
    quranBookmark: { surahNum: 18, surahName: 'الكهف', ayah: 1, page: 293, updatedAt: '' },
    khatmah: { count: 0, planDays: 30, startDate: '', completedJuz: [], readPages: 0, history: [] },
    athkarLogs: {},
    prayerStreak: { count: 0, lastDate: '' },
    quranStreak: { count: 0, lastDate: '' },
    streak: { count: 0, lastDate: '' },
    flashcardDecks: [],
    sharedClassrooms: [],
    sharedNotes: [],
    sharedStreams: [],
    customPlatforms: []
  };
  return d;
}

function migrate(db) {
  if (!db.version) db.version = 1;
  // v1 → v2: add new keys
  if (db.version < 2) {
    if (!db.teachers) db.teachers = [];
    if (!db.groups) db.groups = [];
    if (!db.pomodoroSettings) db.pomodoroSettings = { duration: 25, breakDuration: 5, longBreak: 15, ambientSound: 'silent', wakeLock: true };
    if (db.user) {
      if (!db.user.stage) db.user.stage = '';
      if (!db.user.specialty) db.user.specialty = '';
      if (!db.user.faculty) db.user.faculty = '';
      if (!db.user.year) db.user.year = '';
      if (!db.user.term) db.user.term = '';
      if (!db.user.count) db.user.count = 0;
    }
    if (Array.isArray(db.lectures)) {
      db.lectures.forEach(function (l) {
        if (!l.sessionType) l.sessionType = 'lecture';
        if (!l.location) l.location = '';
        if (!l.slides) l.slides = '';
      });
    }
    db.version = 2;
  }
  // v2 → v3: onboarding fields
  if (db.version < 3) {
    if (db.user) {
      if (!db.user.grade) db.user.grade = '';
      if (!db.user.role) db.user.role = '';
      if (db.user.weeklyGoal === undefined) db.user.weeklyGoal = 4;
      if (!db.user.facultyName) db.user.facultyName = '';
      if (db.user.onboardingDone === undefined) db.user.onboardingDone = !!db.user.role;
    }
    db.version = 3;
  }
  // v3 → v4: prayer system base
  if (db.version < 4) {
    if (!db.prayerSettings) {
      db.prayerSettings = {
        city: 'cairo',
        cityName: 'القاهرة',
        lat: 30.0444,
        lng: 31.2357,
        method: 'Egypt',
        asrMethod: 'Standard',
        adjustments: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
        notifications: true,
        remindBefore: 5,
        urgentReminder: true,
        adhanSound: 'makkah'
      };
    }
    if (!db.prayerLogs) db.prayerLogs = {};
    if (!db.prayerStreak) db.prayerStreak = { count: 0, lastDate: '' };
    db.version = 4;
  }
  // v4 → v5: sunnah, quran ward, urgent reminder, athkar logs
  if (db.version < 5) {
    if (!db.sunnahLogs) db.sunnahLogs = {};
    if (!db.quranLogs) db.quranLogs = {};
    if (!db.athkarLogs) db.athkarLogs = {};
    if (!db.quranStreak) db.quranStreak = { count: 0, lastDate: '' };
    if (db.prayerSettings) {
      if (db.prayerSettings.urgentReminder === undefined) db.prayerSettings.urgentReminder = true;
      if (!db.prayerSettings.adhanSound) db.prayerSettings.adhanSound = 'makkah';
    }
    db.version = 5;
  }
  // v5 → v6: Gamification XP & Flashcards & Classroom Bundles
  if (db.version < 6) {
    if (!db.user.xp) db.user.xp = 0;
    if (!db.user.level) db.user.level = 1;
    if (!db.flashcardDecks) db.flashcardDecks = [];
    if (!db.sharedClassrooms) db.sharedClassrooms = [];
    db.version = 6;
  }
  // v6 → v7: Two-tier Share Codes & Dynamic Streams & Custom Platforms
  if (db.version < 7) {
    if (!db.sharedNotes) db.sharedNotes = [];
    if (!db.sharedStreams) db.sharedStreams = [];
    if (!db.customPlatforms) db.customPlatforms = [];
    db.version = 7;
  }
  return db;
}

const Store = {
  state: null,

  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        this.state = JSON.parse(raw);
        if (!this.state.version) throw new Error('bad');
        this.state = migrate(this.state);
      } else {
        this.state = seedData();
        this.save();
      }
    } catch (e) {
      this.state = seedData();
      this.save();
    }
    return this.state;
  },

  save() {
    localStorage.setItem(LS_KEY, JSON.stringify(this.state));
  },

  add(key, item) {
    this.state[key].push(item);
    this.save();
    return item;
  },

  update(key, id, patch) {
    if (key === 'user') {
      this.state.user = Object.assign({}, this.state.user, patch);
      this.save();
      return;
    }
    const i = this.state[key].findIndex(function (x) { return x.id === id; });
    if (i > -1) {
      this.state[key][i] = Object.assign({}, this.state[key][i], patch);
      this.save();
    }
  },

  updateSettings(patch) {
    this.state.pomodoroSettings = Object.assign({}, this.state.pomodoroSettings || {}, patch);
    this.save();
  },

  remove(key, id) {
    this.state[key] = this.state[key].filter(function (x) { return x.id !== id; });
    this.save();
  },

  subject(id) {
    return this.state.subjects.find(function (s) { return s.id === id; });
  },

  subjectName(id) {
    const s = this.subject(id);
    return s ? s.name : 'بدون مادة';
  },

  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  },

  importJSON(text) {
    const d = JSON.parse(text);
    if (!d || !d.version) throw new Error('ملف غير صالح');
    const base = seedData();
    this.state = Object.assign(base, d);
    this.save();
  },

  wipe() {
    localStorage.removeItem(LS_KEY);
    this.state = seedData();
    this.save();
  },

  // ===== Auto-Backup System =====
  // بيحفظ نسخة احتياطية يومية تلقائياً في Downloads الجهاز
  async autoBackup() {
    try {
      const today = localDateStr();
      const lastBackup = localStorage.getItem('studentHub_lastBackup');
      if (lastBackup === today) return; // عمل backup النهارده بالفعل

      const json = this.exportJSON();
      const filename = 'StudentHub_backup_' + today + '.json';

      // لو Capacitor Filesystem متاح (Android)
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        const { Filesystem, Directory } = await import('./capacitor-plugins.js').catch(() => ({}));
        if (Filesystem && Directory) {
          await Filesystem.writeFile({
            path: filename,
            data: json,
            directory: Directory.Documents,
            encoding: 'utf8',
            recursive: true
          });
          localStorage.setItem('studentHub_lastBackup', today);
          console.log('[Backup] Auto-backup saved:', filename);
          return;
        }
      }

      // Fallback: حفظ في localStorage كنسخة احتياطية
      localStorage.setItem('studentHub_backup_' + today, json);
      // احذف backups القديمة (احتفظ بآخر 7 أيام)
      for (let i = 8; i <= 30; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const old = localDateStr(d);
        localStorage.removeItem('studentHub_backup_' + old);
      }
      localStorage.setItem('studentHub_lastBackup', today);
      console.log('[Backup] LocalStorage backup saved for:', today);
    } catch (e) {
      console.warn('[Backup] Auto-backup failed:', e);
    }
  },

  // استعادة آخر نسخة احتياطية من localStorage
  getLocalBackups() {
    const backups = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = localDateStr(d);
      const key = 'studentHub_backup_' + dateStr;
      if (localStorage.getItem(key)) {
        backups.push({ date: dateStr, key });
      }
    }
    return backups;
  },

  restoreFromLocalBackup(key) {
    const json = localStorage.getItem(key);
    if (!json) throw new Error('النسخة الاحتياطية غير موجودة');
    this.importJSON(json);
  },

  updateStreak(hasActivity) {
    if (!hasActivity) return;
    const today = localDateStr();
    if (this.state.streak.lastDate === today) return;
    const yesterday = addDaysStr(-1);
    this.state.streak.count = this.state.streak.lastDate === yesterday ? this.state.streak.count + 1 : 1;
    this.state.streak.lastDate = today;
    this.save();
  },

  todayCompletedTasks() {
    const today = localDateStr();
    return this.state.tasks.filter(function (t) { return t.completed && t.completedAt === today; }).length;
  },

  studyMinutes(dateStr) {
    return this.state.pomodoroSessions
      .filter(function (p) { return p.date === dateStr; })
      .reduce(function (sum, p) { return sum + p.minutes; }, 0);
  },

  // ===== نظام تتبع وسجل الصلوات والسنن والورد القرآني =====
  getPrayerLog(dateStr) {
    if (!this.state.prayerLogs) this.state.prayerLogs = {};
    const d = dateStr || localDateStr();
    if (!this.state.prayerLogs[d]) {
      this.state.prayerLogs[d] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    }
    return this.state.prayerLogs[d];
  },

  setPrayerStatus(prayerKey, status, dateStr) {
    const d = dateStr || localDateStr();
    const log = this.getPrayerLog(d);
    log[prayerKey] = status; // 'on_time', 'qada', 'jamaah', or false
    this.updatePrayerStreak(d);
    this.save();
    return log[prayerKey];
  },

  togglePrayerLog(prayerKey, dateStr) {
    const d = dateStr || localDateStr();
    const log = this.getPrayerLog(d);
    const cur = log[prayerKey];
    const next = !cur ? 'on_time' : false;
    log[prayerKey] = next;
    this.updatePrayerStreak(d);
    this.save();
    return next;
  },

  getSunnahLog(dateStr) {
    if (!this.state.sunnahLogs) this.state.sunnahLogs = {};
    const d = dateStr || localDateStr();
    if (!this.state.sunnahLogs[d]) {
      this.state.sunnahLogs[d] = {
        fajr: false,
        dhuhr_before: false,
        dhuhr_after: false,
        maghrib: false,
        isha: false,
        duha: false,
        qiyam: false,
        witr: false
      };
    }
    return this.state.sunnahLogs[d];
  },

  toggleSunnahLog(sunnahKey, dateStr) {
    const d = dateStr || localDateStr();
    const log = this.getSunnahLog(d);
    log[sunnahKey] = !log[sunnahKey];
    this.save();
    return log[sunnahKey];
  },

  getQuranLog(dateStr) {
    if (!this.state.quranLogs) this.state.quranLogs = {};
    const d = dateStr || localDateStr();
    if (!this.state.quranLogs[d]) {
      this.state.quranLogs[d] = { pages: 0, goalPages: 4, surahRead: false, notes: '' };
    }
    return this.state.quranLogs[d];
  },

  setQuranLog(patch, dateStr) {
    const d = dateStr || localDateStr();
    const log = this.getQuranLog(d);
    Object.assign(log, patch);
    if (log.pages >= (log.goalPages || 4) || log.surahRead) {
      this.updateQuranStreak(d);
    }
    this.save();
    return log;
  },

  getAthkarLog(dateStr) {
    if (!this.state.athkarLogs) this.state.athkarLogs = {};
    const d = dateStr || localDateStr();
    if (!this.state.athkarLogs[d]) {
      this.state.athkarLogs[d] = { morning: false, evening: false, morningProgress: 0, eveningProgress: 0 };
    }
    return this.state.athkarLogs[d];
  },

  setAthkarLog(patch, dateStr) {
    const d = dateStr || localDateStr();
    const log = this.getAthkarLog(d);
    Object.assign(log, patch);
    this.save();
    return log;
  },

  getPrayerStreak() {
    if (!this.state.prayerStreak) this.state.prayerStreak = { count: 0, lastDate: '' };
    return this.state.prayerStreak;
  },

  updatePrayerStreak(dateStr) {
    const d = dateStr || localDateStr();
    const log = this.getPrayerLog(d);
    const allDone = !!(log.fajr && log.dhuhr && log.asr && log.maghrib && log.isha);
    if (!this.state.prayerStreak) this.state.prayerStreak = { count: 0, lastDate: '' };
    
    if (allDone) {
      if (this.state.prayerStreak.lastDate !== d) {
        const yesterday = addDaysStr(-1);
        if (this.state.prayerStreak.lastDate === yesterday) {
          this.state.prayerStreak.count += 1;
        } else {
          this.state.prayerStreak.count = 1;
        }
        this.state.prayerStreak.lastDate = d;
      }
    }
  },

  getQuranStreak() {
    if (!this.state.quranStreak) this.state.quranStreak = { count: 0, lastDate: '' };
    return this.state.quranStreak;
  },

  updateQuranStreak(dateStr) {
    const d = dateStr || localDateStr();
    if (!this.state.quranStreak) this.state.quranStreak = { count: 0, lastDate: '' };
    if (this.state.quranStreak.lastDate !== d) {
      const yesterday = addDaysStr(-1);
      if (this.state.quranStreak.lastDate === yesterday) {
        this.state.quranStreak.count += 1;
      } else {
        this.state.quranStreak.count = 1;
      }
      this.state.quranStreak.lastDate = d;
    }
  },

  getQuranBookmark() {
    if (!this.state.quranBookmark) {
      this.state.quranBookmark = { surahNum: 18, surahName: 'الكهف', ayah: 1, page: 293, updatedAt: '' };
    }
    return this.state.quranBookmark;
  },

  setQuranBookmark(bookmark) {
    if (!this.state.quranBookmark) this.state.quranBookmark = {};
    Object.assign(this.state.quranBookmark, bookmark, { updatedAt: new Date().toISOString() });
    this.save();
    return this.state.quranBookmark;
  },

  getKhatmah() {
    if (!this.state.khatmah) {
      this.state.khatmah = { count: 0, planDays: 30, startDate: localDateStr(), completedJuz: [], readPages: 0, history: [] };
    }
    if (!Array.isArray(this.state.khatmah.completedJuz)) this.state.khatmah.completedJuz = [];
    if (!Array.isArray(this.state.khatmah.history)) this.state.khatmah.history = [];
    if (!this.state.khatmah.planDays) this.state.khatmah.planDays = 30;
    if (!this.state.khatmah.startDate) this.state.khatmah.startDate = localDateStr();
    return this.state.khatmah;
  },

  setKhatmahPlan(days) {
    const k = this.getKhatmah();
    k.planDays = Number(days) || 30;
    this.save();
    return k;
  },

  toggleJuzComplete(juzNum) {
    const k = this.getKhatmah();
    const num = Number(juzNum);
    const idx = k.completedJuz.indexOf(num);
    if (idx > -1) {
      k.completedJuz.splice(idx, 1);
    } else {
      k.completedJuz.push(num);
      k.completedJuz.sort((a, b) => a - b);
    }
    this.save();
    return k;
  },

  setKhatmahPages(pages) {
    const k = this.getKhatmah();
    k.readPages = Math.max(0, Math.min(604, Number(pages) || 0));
    this.save();
    return k;
  },

  completeKhatmah(note) {
    const k = this.getKhatmah();
    const completedAt = localDateStr();
    const daysTaken = k.startDate ? Math.max(1, daysBetween(completedAt, k.startDate)) : k.planDays;

    k.history.push({
      completedAt,
      startDate: k.startDate || completedAt,
      daysTaken,
      planDays: k.planDays,
      note: note || 'ختمة مباركة لتلاوة وتدبر القرآن الكريم'
    });

    k.count = (k.count || 0) + 1;
    k.readPages = 0;
    k.completedJuz = [];
    k.startDate = localDateStr();
    this.save();
    return k;
  },

  // ===== نظام الـ XP والرتب والتحفيز (Gamification Engine) =====
  addXP(amount, reason) {
    if (!this.state.user) this.state.user = {};
    const oldXP = this.state.user.xp || 0;
    const oldLevel = this.state.user.level || 1;

    const newXP = Math.max(0, oldXP + Number(amount));
    // Level formula: Level 1 = 0-99 XP, Level 2 = 100-399 XP, Level 3 = 400-899 XP...
    const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 100)) + 1);
    const leveledUp = newLevel > oldLevel;

    this.state.user.xp = newXP;
    this.state.user.level = newLevel;
    this.save();

    const rank = this.getStudentRank(newXP);

    if (typeof App !== 'undefined') {
      if (leveledUp) {
        if (App.sound) App.sound('task');
        if (App.toast) App.toast(`🎉 مبارك! ارتقيت إلى المستوى ${newLevel} — رتبتك: ${rank.title} 🌟`, 'success');
      } else if (amount > 0 && App.toast && reason) {
        App.toast(`+${amount} XP (${reason}) ✨`);
      }
    }

    return { xp: newXP, level: newLevel, rank, leveledUp };
  },

  getUserXP() {
    const xp = (this.state && this.state.user && this.state.user.xp) || 0;
    const level = (this.state && this.state.user && this.state.user.level) || 1;
    const rank = this.getStudentRank(xp);
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
    const nextLevelBaseXP = Math.pow(level, 2) * 100;
    const levelProgressXP = xp - currentLevelBaseXP;
    const levelTotalXPNeeded = nextLevelBaseXP - currentLevelBaseXP;
    const levelPercent = Math.min(100, Math.max(0, Math.round((levelProgressXP / levelTotalXPNeeded) * 100)));

    return {
      xp,
      level,
      rank,
      levelPercent,
      levelProgressXP,
      levelTotalXPNeeded
    };
  },

  getStudentRank(xp) {
    xp = Number(xp) || 0;
    if (xp >= 6000) return { title: 'علّامة متفوق 👑', color: 'from-amber-500 to-yellow-400', badge: '👑', minXP: 6000 };
    if (xp >= 3000) return { title: 'نابغة الدفعة 🚀', color: 'from-purple-600 to-indigo-500', badge: '🚀', minXP: 3000 };
    if (xp >= 1500) return { title: 'باحث متميز 🔬', color: 'from-blue-600 to-cyan-500', badge: '🔬', minXP: 1500 };
    if (xp >= 700) return { title: 'طالب مجتهد ⭐', color: 'from-emerald-600 to-teal-400', badge: '⭐', minXP: 700 };
    if (xp >= 250) return { title: 'طالب مثابر 🌱', color: 'from-green-600 to-lime-500', badge: '🌱', minXP: 250 };
    return { title: 'طالب مبتدئ 🎓', color: 'from-slate-600 to-slate-400', badge: '🎓', minXP: 0 };
  },

  // ===== نظام البطاقات التعليمية والتكرار المتباعد (Flashcards & Spaced Repetition) =====
  getFlashcardDecks() {
    if (!Array.isArray(this.state.flashcardDecks)) {
      this.state.flashcardDecks = [
        {
          id: 'deck-quran-vocab',
          name: 'غريب القرآن ومفردات السور 📖',
          subjectId: '',
          color: '#10b981',
          cards: [
            { id: 'c1', front: 'ما معنى كلمة "الكوثر" في سورة الكوثر؟', back: 'الخير الكثير والفيض العظيم، وهو نهر أعطاه الله لنبيه ﷺ في الجنة.', box: 1, reviews: 0 },
            { id: 'c2', front: 'ما معنى "الصمد" في سورة الإخلاص؟', back: 'الذي يُقصد في الحوائج وتصمد إليه الخلائق في رغائبها، الكامل في صفاته.', box: 1, reviews: 0 },
            { id: 'c3', front: 'ما معنى "الفلق" في سورة الفلق؟', back: 'الصبح والنور الذي ينفلق منه ظلام الليل.', box: 1, reviews: 0 }
          ]
        },
        {
          id: 'deck-study-laws',
          name: 'قوانين ومصطلحات المذاكرة ⚡',
          subjectId: '',
          color: '#6366f1',
          cards: [
            { id: 'c4', front: 'ما هي تقنية فاينمان (Feynman Technique) في التعلم؟', back: 'شرح المفهوم بكلمات بسيطة جداً كأنك تشرحه لطفل، ثم سد الثغرات التي تعثرت في شرحها.', box: 1, reviews: 0 },
            { id: 'c5', front: 'ما هو التكرار المتباعد (Spaced Repetition)؟', back: 'مراجعة المعلومة على فترات متباعدة تدريجياً لترسيخها في الذاكرة طويلة المدى ومنع منحنى النسيان.', box: 1, reviews: 0 }
          ]
        }
      ];
      this.save();
    }
    return this.state.flashcardDecks;
  },

  saveFlashcardDeck(deck) {
    const decks = this.getFlashcardDecks();
    const idx = decks.findIndex(d => d.id === deck.id);
    if (idx > -1) {
      decks[idx] = Object.assign({}, decks[idx], deck);
    } else {
      if (!deck.id) deck.id = 'deck-' + Date.now();
      decks.push(deck);
    }
    this.save();
    return deck;
  },

  deleteFlashcardDeck(deckId) {
    this.state.flashcardDecks = this.getFlashcardDecks().filter(d => d.id !== deckId);
    this.save();
  },

  recordFlashcardReview(deckId, cardId, isCorrect) {
    const decks = this.getFlashcardDecks();
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    const card = deck.cards.find(c => c.id === cardId);
    if (!card) return;

    card.reviews = (card.reviews || 0) + 1;
    if (isCorrect) {
      card.box = Math.min(3, (card.box || 1) + 1);
      this.addXP(15, 'إجابة بطاقة صحيحة');
    } else {
      card.box = 1;
      this.addXP(5, 'مراجعة بطاقة');
    }
    this.save();
    return card;
  },

  // ===== نظام باقات المعلمين واستيراد كود الفصل الدراسي (Teacher Bundles) =====
  exportClassroomBundle(groupId) {
    const group = this.state.groups.find(g => g.id === groupId);
    if (!group) return null;
    const subject = this.subject(group.subjectId);
    const teacher = this.state.teachers.find(t => t.id === group.teacherId);
    const lectures = this.state.lectures.filter(l => l.groupId === groupId || (subject && l.subjectId === subject.id));
    const resources = this.state.resources.filter(r => subject && r.subjectId === subject.id);

    const bundle = {
      app: 'StudentHub',
      version: 6,
      code: 'SH-' + (subject ? subject.name.substring(0, 3).toUpperCase() : 'CLS') + '-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: localDateStr(),
      group,
      subject,
      teacher,
      lectures,
      resources
    };

    return JSON.stringify(bundle);
  },

  importClassroomBundle(jsonStringOrCode) {
    try {
      const data = typeof jsonStringOrCode === 'string' ? JSON.parse(jsonStringOrCode) : jsonStringOrCode;
      if (!data || data.app !== 'StudentHub') {
        throw new Error('كود الفصل غير صالح أو صيغة غير مدعومة');
      }

      // 1. Import or merge Subject
      let subId = '';
      if (data.subject) {
        const existingSub = this.state.subjects.find(s => s.name.trim() === data.subject.name.trim());
        if (existingSub) {
          subId = existingSub.id;
        } else {
          subId = 'sub-' + Date.now();
          this.state.subjects.push(Object.assign({}, data.subject, { id: subId }));
        }
      }

      // 2. Import Teacher
      let teacherId = '';
      if (data.teacher) {
        const existingTeacher = this.state.teachers.find(t => t.name.trim() === data.teacher.name.trim());
        if (existingTeacher) {
          teacherId = existingTeacher.id;
        } else {
          teacherId = 'tch-' + Date.now();
          this.state.teachers.push(Object.assign({}, data.teacher, { id: teacherId }));
        }
      }

      // 3. Import Group
      let groupId = 'grp-' + Date.now();
      if (data.group) {
        this.state.groups.push(Object.assign({}, data.group, {
          id: groupId,
          subjectId: subId,
          teacherId
        }));
      }

      // 4. Import Lectures
      if (Array.isArray(data.lectures)) {
        data.lectures.forEach(l => {
          this.state.lectures.push(Object.assign({}, l, {
            id: 'lec-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            subjectId: subId,
            groupId
          }));
        });
      }

      // 5. Import Resources
      if (Array.isArray(data.resources)) {
        data.resources.forEach(r => {
          this.state.resources.push(Object.assign({}, r, {
            id: 'res-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            subjectId: subId
          }));
        });
      }

      this.addXP(100, 'استيراد فصل تعليمي جديد');
      this.save();
      return { success: true, subject: data.subject?.name, teacher: data.teacher?.name };
    } catch(err) {
      return { success: false, error: err.message };
    }
  },

  // ===== نظام الملخصات بالأكواد والقنوات المتجددة (2-Tier Code System) =====
  getSharedNotes() {
    if (!Array.isArray(this.state.sharedNotes)) this.state.sharedNotes = [];
    return this.state.sharedNotes;
  },

  getSharedStreams() {
    if (!Array.isArray(this.state.sharedStreams)) this.state.sharedStreams = [];
    return this.state.sharedStreams;
  },

  createSingleNote(data) {
    if (!Array.isArray(this.state.sharedNotes)) this.state.sharedNotes = [];
    const code = 'NOTE-' + (data.subjectName ? data.subjectName.substring(0, 3).toUpperCase() : 'GEN') + '-' + Math.floor(1000 + Math.random() * 9000);
    const note = {
      id: 'sn-' + Date.now(),
      type: 'single',
      code,
      title: data.title || 'ملخص درس',
      subjectId: data.subjectId || '',
      subjectName: data.subjectName || 'مادة عامة',
      teacherName: data.teacherName || '',
      content: data.content || '',
      pdfUrl: data.pdfUrl || '',
      createdAt: localDateStr()
    };
    this.state.sharedNotes.unshift(note);
    this.addXP(40, 'نشر ملخص دراسي');
    this.save();
    return note;
  },

  createStream(data) {
    if (!Array.isArray(this.state.sharedStreams)) this.state.sharedStreams = [];
    const code = 'CHAN-' + (data.subjectName ? data.subjectName.substring(0, 3).toUpperCase() : 'STR') + '-' + Math.floor(1000 + Math.random() * 9000);
    const stream = {
      id: 'st-' + Date.now(),
      type: 'stream',
      code,
      title: data.title || 'باقة مادة متجددة',
      subjectId: data.subjectId || '',
      subjectName: data.subjectName || 'مادة عامة',
      teacherName: data.teacherName || '',
      description: data.description || '',
      lessons: [
        {
          id: 'les-1',
          num: 1,
          title: data.firstLessonTitle || 'الحصة الأولى',
          content: data.firstLessonContent || '',
          pdfUrl: data.firstLessonPdf || '',
          date: localDateStr()
        }
      ],
      updatedAt: localDateStr(),
      isOwner: true
    };
    this.state.sharedStreams.unshift(stream);
    this.addXP(60, 'إنشاء قناة تعليمية متجددة');
    this.save();
    return stream;
  },

  addLessonToStream(streamCodeOrId, lessonData) {
    const streams = this.getSharedStreams();
    const st = streams.find(s => s.code === streamCodeOrId || s.id === streamCodeOrId);
    if (!st) return null;
    const nextNum = (st.lessons || []).length + 1;
    const newLesson = {
      id: 'les-' + Date.now(),
      num: nextNum,
      title: lessonData.title || `الحصة ${nextNum}`,
      content: lessonData.content || '',
      pdfUrl: lessonData.pdfUrl || '',
      date: localDateStr()
    };
    st.lessons.push(newLesson);
    st.updatedAt = localDateStr();
    this.addXP(30, `إضافة الحصة ${nextNum} في الباقة`);
    this.save();
    return st;
  },

  importSharedCode(codeStr) {
    codeStr = String(codeStr || '').trim();
    if (!codeStr) return { success: false, error: 'الرجاء إدخال الكود' };

    // 1. Check if it is a JSON bundle
    if (codeStr.startsWith('{') && codeStr.endsWith('}')) {
      try {
        const obj = JSON.parse(codeStr);
        if (obj.type === 'single') {
          this.getSharedNotes().unshift(obj);
          this.addXP(30, 'استيراد ملخص حصة');
          this.save();
          return { success: true, type: 'single', title: obj.title };
        }
        if (obj.type === 'stream') {
          const streams = this.getSharedStreams();
          const existingIdx = streams.findIndex(s => s.code === obj.code);
          if (existingIdx > -1) {
            streams[existingIdx] = Object.assign({}, streams[existingIdx], obj, { isOwner: false });
          } else {
            streams.unshift(Object.assign({}, obj, { isOwner: false, joinedAt: localDateStr() }));
          }
          this.addXP(50, 'الانضمام لباقة متجددة');
          this.save();
          return { success: true, type: 'stream', title: obj.title, count: obj.lessons?.length || 1 };
        }
      } catch(e) {}
    }

    // 2. Mock / Built-in codes catalog
    if (codeStr.toUpperCase().startsWith('NOTE-') || codeStr.toUpperCase().startsWith('CHAN-')) {
      const isStream = codeStr.toUpperCase().startsWith('CHAN-');
      if (isStream) {
        const demoStream = {
          id: 'st-' + Date.now(),
          type: 'stream',
          code: codeStr.toUpperCase(),
          title: 'باقة المادة المتجددة (' + codeStr.toUpperCase() + ')',
          subjectName: 'مادة دراسية',
          teacherName: 'أستاذ المادة',
          description: 'قناة متجددة تشمل تجميعات الحصص والمذكرات الدورية.',
          lessons: [
            { id: 'l1', num: 1, title: 'الحصة الأولى: المفاهيم والقوانين الأساسية', content: 'ملخص شامل لأهم القوانين والنقاط الأساسية وشرح أفكار المسائل.', pdfUrl: '', date: localDateStr() },
            { id: 'l2', num: 2, title: 'الحصة الثانية: التطبيقات والتمارين المتقدمة', content: 'حل أسئلة بنك المعرفة وأفكار امتحانات الأعوام السابقة.', pdfUrl: '', date: localDateStr() }
          ],
          updatedAt: localDateStr(),
          joinedAt: localDateStr(),
          isOwner: false
        };
        this.getSharedStreams().unshift(demoStream);
        this.addXP(50, 'الانضمام لباقة متجددة');
        this.save();
        return { success: true, type: 'stream', title: demoStream.title, count: 2 };
      } else {
        const demoNote = {
          id: 'sn-' + Date.now(),
          type: 'single',
          code: codeStr.toUpperCase(),
          title: 'ملخص الحصة (' + codeStr.toUpperCase() + ')',
          subjectName: 'مادة دراسية',
          teacherName: 'أستاذ المادة',
          content: 'تلخيص مركز لأهم النقاط والقوانين الأساسية في هذا الدرس.',
          createdAt: localDateStr()
        };
        this.getSharedNotes().unshift(demoNote);
        this.addXP(30, 'استيراد ملخص حصة');
        this.save();
        return { success: true, type: 'single', title: demoNote.title };
      }
    }

    return { success: false, error: 'كود غير معروف، تأكد من صحة الكود (مثال: NOTE-123 أو CHAN-456)' };
  },

  // ===== بوابة المنصات الذكية المخصصة (Smart Custom Platforms) =====
  getCustomPlatforms() {
    if (!Array.isArray(this.state.customPlatforms) || !this.state.customPlatforms.length) {
      this.state.customPlatforms = [
        {
          id: 'plat-1',
          name: 'منصة بسطتهالك',
          teacherName: 'مستر محمد عبد العظيم',
          url: 'https://bastathalak.com',
          icon: 'https://www.google.com/s2/favicons?domain=bastathalak.com&sz=128',
          notes: 'شروحات اللغة العربية والنحو والبلاغة'
        },
        {
          id: 'plat-2',
          name: 'منصة عبد المعبود',
          teacherName: 'مستر محمد عبد المعبود',
          url: 'https://abdelmabood.com',
          icon: 'https://www.google.com/s2/favicons?domain=abdelmabood.com&sz=128',
          notes: 'فيزياء الثانوية العامة والمسائل المتقدمة'
        }
      ];
      this.save();
    }
    return this.state.customPlatforms;
  },

  addCustomPlatform(data) {
    if (!Array.isArray(this.state.customPlatforms)) this.state.customPlatforms = [];
    let url = String(data.url || '').trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    let domain = '';
    try {
      domain = new URL(url).hostname;
    } catch(e) {
      domain = url;
    }
    const icon = domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128` : '';

    const plat = {
      id: 'plat-' + Date.now(),
      name: data.name || domain || 'منصة تعليمية',
      teacherName: data.teacherName || '',
      url,
      icon,
      notes: data.notes || '',
      createdAt: localDateStr()
    };
    this.state.customPlatforms.unshift(plat);
    this.addXP(25, 'إضافة منصة تعليمية');
    this.save();
    return plat;
  },

  deleteCustomPlatform(id) {
    this.state.customPlatforms = this.getCustomPlatforms().filter(p => p.id !== id);
    this.save();
  }
};

function escapeHtml(s) {
  return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function formatArDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const y = Number(parts[0]), m = Number(parts[1]), dd = Number(parts[2]);
  if (!y || !m || !dd) return dateStr;
  return dd + ' ' + MONTHS_AR[m - 1] + ' ' + y;
}

function formatTime(t) {
  if (!t) return '';
  const parts = t.split(':');
  let h = Number(parts[0]), m = parts[1] || '00';
  const ap = h >= 12 ? 'م' : 'ص';
  h = h % 12; if (h === 0) h = 12;
  return h + ':' + m + ' ' + ap;
}

function daysBetween(a, b) {
  return Math.round((new Date(a + 'T00:00:00') - new Date(b + 'T00:00:00')) / 86400000);
}

function relativeDay(dateStr) {
  const today = localDateStr();
  const diff = daysBetween(dateStr, today);
  if (diff === 0) return 'اليوم';
  if (diff === 1) return 'بكرة';
  if (diff === -1) return 'إمبارح';
  if (diff > 1) return 'بعد ' + diff + ' أيام';
  return 'منذ ' + (-diff) + ' أيام';
}

const PRIORITY_META = {
  high: { label: 'عالي', cls: 'high' },
  medium: { label: 'متوسط', cls: 'medium' },
  low: { label: 'منخفض', cls: 'low' }
};

function subjectChip(subjectId) {
  const s = Store.subject(subjectId);
  if (!s) return '<span class="sh-chip" style="background:#cbd5e1;color:#334155">بدون مادة</span>';
  return '<span class="sh-chip" style="background:' + s.color + ';color:#fff">' + escapeHtml(s.name) + '</span>';
}
