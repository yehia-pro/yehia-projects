const Tasks = {
  currentTab: 'tasks', // 'tasks' | 'pomodoro' | 'exams'
  filters: { status: 'all', subject: 'all' },

  init() {
    this.renderRoleTabs();
    this.switchTab('tasks');
    App.maybeFlash();
  },

  renderRoleTabs() {
    const tabsContainer = document.getElementById('focus-tabs');
    if (!tabsContainer) return;

    const isTeacher = Store.isTeacher();
    if (isTeacher) {
      tabsContainer.innerHTML = `
        <button onclick="Tasks.switchTab('tasks')" id="tab-btn-tasks" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-indigo-600 text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span>📋</span>
          <span>مهام المعلم والتحضير</span>
        </button>
        <button onclick="Tasks.switchTab('pomodoro')" id="tab-btn-pomodoro" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>⏱️</span>
          <span>مؤقت التركيز وبومودورو</span>
        </button>
      `;
    } else {
      tabsContainer.innerHTML = `
        <button onclick="Tasks.switchTab('tasks')" id="tab-btn-tasks" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-indigo-600 text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span>📋</span>
          <span>المهام اليومية</span>
        </button>
        <button onclick="Tasks.switchTab('pomodoro')" id="tab-btn-pomodoro" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>⏱️</span>
          <span>ستوديو بومودورو</span>
        </button>
        <button onclick="Tasks.switchTab('exams')" id="tab-btn-exams" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>🏆</span>
          <span>الامتحانات والدرجات</span>
        </button>
      `;
    }
  },

  switchTab(tabKey) {
    this.currentTab = tabKey;
    ['tasks', 'pomodoro', 'exams'].forEach(t => {
      const btn = document.getElementById(`tab-btn-${t}`);
      if (btn) {
        if (t === tabKey) {
          btn.className = 'px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-indigo-600 text-white shadow-md flex items-center gap-1.5 whitespace-nowrap';
        } else {
          btn.className = 'px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap';
        }
      }
    });

    this.renderActiveTab();
  },

  renderActiveTab() {
    const container = document.getElementById('focus-content');
    const actions = document.getElementById('focus-actions');
    if (!container) return;

    if (this.currentTab === 'tasks') {
      if (actions) {
        actions.innerHTML = `
          <button class="sh-btn primary text-xs !py-2.5 !px-4 shadow-lg" onclick="Tasks.openForm()">+ مهمة جديدة</button>
        `;
      }
      this.renderTasksTab(container);
    } else if (this.currentTab === 'pomodoro') {
      if (actions) actions.innerHTML = '';
      this.renderPomodoroTab(container);
    } else {
      if (actions) {
        actions.innerHTML = `
          <button class="sh-btn primary text-xs !py-2.5 !px-4 shadow-lg" onclick="Tasks.openExamForm()">+ امتحان جديد</button>
          <button class="sh-btn secondary text-xs !py-2.5 !px-3" onclick="Tasks.openGradeForm()">+ درجة جديدة</button>
        `;
      }
      this.renderExamsTab(container);
    }
  },

  // ===== 1. تبويب المهام اليومية =====
  renderTasksTab(container) {
    const list = this.filteredTasks();

    let html = `
      <div class="space-y-4 animate-in fade-in duration-200">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">📝</span>
          <div>
            <strong>دليل المهام والواجبات اليومية:</strong>
            <span class="text-slate-500 dark:text-slate-400">سجل واجباتك ومذكرتك اليومية مع تحديد تاريخ التسليم، واستخدم الفلاتر السريعة (اليوم، مفتوحة، مكتملة) لكسب +20 XP عند إنجاز كل مهمة!</span>
          </div>
        </div>

        <!-- Filters Strip -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
            ${['all', 'open', 'today', 'done'].map(st => {
              const names = { all: 'الكل', open: 'مفتوحة ⏳', today: 'اليوم ☀️', done: 'مكتملة ✅' };
              const isSel = this.filters.status === st;
              return `
                <button onclick="Tasks.setFilterStatus('${st}')" class="px-3 py-1.5 rounded-xl font-bold transition ${isSel ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}">
                  ${names[st]}
                </button>
              `;
            }).join('')}
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-400 font-bold">المادة / التصنيف:</span>
            <select id="tasks-filter-sub" onchange="Tasks.setFilterSub(this.value)" class="sh-input !py-1 !px-2.5 text-xs font-bold">
              <option value="all">كل المهام</option>
              <option value="general" ${this.filters.subject === 'general' ? 'selected' : ''}>🌟 مهام عامة وشخصية</option>
              ${(Store.state.subjects || []).map(s => `<option value="${s.id}" ${this.filters.subject === s.id ? 'selected' : ''}>📚 ${s.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="tasks-list-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!list.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📋</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد مهام مطابقة في هذا الفلتر</h4>
          <button class="sh-btn primary text-xs mt-2" onclick="Tasks.openForm()">+ أضف مهمة جديدة (+15 XP)</button>
        </div>
      `;
    } else {
      list.forEach(t => {
        const isGeneral = t.subjectId === 'general' || t.isGeneral;
        const sub = isGeneral ? { name: '🌟 مهمة عامة / شخصية', color: '#f59e0b' } : (Store.subject(t.subjectId) || { name: 'دراسي عام', color: '#6366f1' });
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border ${t.completed ? 'border-emerald-500/30 opacity-75' : (isGeneral ? 'border-amber-500/30' : 'border-slate-200/80 dark:border-slate-800')} shadow-sm flex flex-col justify-between gap-3">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white" style="background:${sub.color}">
                  ${sub.name}
                </span>
                <span class="text-[10px] font-mono text-slate-400 font-bold">${t.dueDate || 'بدون تاريخ'}</span>
              </div>
              <h4 class="font-black text-sm text-slate-900 dark:text-white ${t.completed ? 'line-through text-slate-400' : ''}">${escapeHtml(t.title)}</h4>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="Tasks.toggleTask('${t.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${t.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'}">
                <span>${t.completed ? '✓ مكتملة' : '⭕ إتمام'}</span>
              </button>
              <button onclick="Tasks.deleteTask('${t.id}')" class="p-1.5 text-rose-400 hover:text-rose-600 text-xs">
                🗑️
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  },

  filteredTasks() {
    let list = (Store.state.tasks || []).slice();
    if (this.filters.subject === 'general') {
      list = list.filter(t => t.subjectId === 'general' || t.isGeneral);
    } else if (this.filters.subject !== 'all') {
      list = list.filter(t => t.subjectId === this.filters.subject);
    }
    if (this.filters.status === 'open') list = list.filter(t => !t.completed);
    if (this.filters.status === 'done') list = list.filter(t => t.completed);
    if (this.filters.status === 'today') list = list.filter(t => !t.completed && t.dueDate === localDateStr());
    return list.sort((a, b) => (a.completed ? 1 : -1));
  },

  setFilterStatus(st) {
    this.filters.status = st;
    this.renderTasksTab(document.getElementById('focus-content'));
  },

  setFilterSub(subId) {
    this.filters.subject = subId;
    this.renderTasksTab(document.getElementById('focus-content'));
  },

  toggleTask(id) {
    const t = (Store.state.tasks || []).find(x => x.id === id);
    if (t) {
      t.completed = !t.completed;
      if (t.completed) Store.addXP(20, 'إتمام مهمة');
      Store.save();
      App.toast(t.completed ? 'أحسنت! تم إنجاز المهمة (+20 XP) 🎉' : 'تم إعادة فتح المهمة', 'success');
      this.renderTasksTab(document.getElementById('focus-content'));
    }
  },

  deleteTask(id) {
    Store.remove('tasks', id);
    Store.save();
    App.toast('تم حذف المهمة');
    this.renderTasksTab(document.getElementById('focus-content'));
  },

  openForm() {
    const title = prompt('اكتب عنوان المهمة:');
    if (!title) return;

    let subjectId = '';
    let isGeneral = false;
    const subjects = Store.state.subjects || [];

    const isTeacher = Store.isTeacher();
    if (!isTeacher) {
      const typeChoice = prompt('نوع المهمة:\n\n1. 📚 مهمة دراسية لمادة محددة\n2. 🌟 مهمة عامة / شخصية (خارج نطاق الدراسة)\n\n(اختر 1 أو 2):', '1');
      if (typeChoice === '2') {
        subjectId = 'general';
        isGeneral = true;
      } else {
        if (subjects.length > 0) {
          let choices = subjects.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
          let sel = prompt(`اختر المادة:\n\n${choices}\n\n(أو اضغط Enter للأولى):`, '1');
          let idx = parseInt(sel) - 1;
          subjectId = (idx >= 0 && idx < subjects.length) ? subjects[idx].id : subjects[0].id;
        }
      }
    } else {
      subjectId = 'teacher_work';
    }

    const dueDate = prompt('تاريخ التسليم (YYYY-MM-DD) أو اتركه فارغاً لليوم:', localDateStr()) || localDateStr();

    if (!Store.state.tasks) Store.state.tasks = [];
    Store.state.tasks.unshift({
      id: 'task_' + Date.now(),
      title,
      dueDate,
      completed: false,
      subjectId,
      isGeneral
    });
    Store.addXP(10, 'إضافة مهمة جديدة');
    Store.save();
    App.toast('تمت إضافة المهمة بنجاح! (+10 XP)', 'success');
    this.renderTasksTab(document.getElementById('focus-content'));
  },

  // ===== 2. ستوديو بومودورو الصارم + سجل أعذار التشتت =====
  renderPomodoroTab(container) {
    const excuses = Store.getFocusExcuses();

    container.innerHTML = `
      <div class="space-y-6 animate-in fade-in duration-200 max-w-2xl mx-auto">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">🔒</span>
          <div>
            <strong>وضع التركيز الصارم (Strict Focus Mode):</strong>
            <span class="text-slate-500 dark:text-slate-400">عند بدء المؤقت يُمنع الخروج أو الاستسلام، ولا يمكنك إلغاء الجلسة إلا بكتابة عذر مقنع (أكثر من 4 كلمات) يُحفظ في سجل تشتتك لتتغلب عليه! (+40 XP عند إتمام الجلسة كاملة).</span>
          </div>
        </div>

        <!-- Pomodoro Interactive Hero Box -->
        <div class="sh-card p-8 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border-2 border-indigo-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div class="space-y-1">
            <span class="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300">مؤقت التركيز الصارم ⏱️</span>
            <h3 class="text-2xl font-black text-white">25 دقيقة مذاكرة نقية بدون تشتت</h3>
          </div>

          <div class="w-52 h-52 mx-auto rounded-full bg-slate-950 border-4 border-indigo-500/50 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
            <div class="text-4xl md:text-5xl font-black text-amber-400 font-mono tracking-wider" id="pomo-timer-display">25:00</div>
            <span class="text-[10px] text-slate-400 font-bold mt-1" id="pomo-status-label">مغلق للتركيز</span>
          </div>

          <div class="flex items-center justify-center gap-3">
            <button id="pomo-toggle-btn" onclick="Tasks.startStrictFocus()" class="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl active:scale-95 transition flex items-center gap-2">
              <span>▶️ ابدأ جلسة التركيز</span>
            </button>
            <button onclick="Tasks.attemptExitFocus()" class="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition">
              🛑 استسلام وإنهاء مبكر
            </button>
          </div>

          <p class="text-[11px] text-slate-400">حافظ على تركيزك وتجنب تسجيل عذر استسلام في سجلك 🧠</p>
        </div>

        <!-- Excuses Log Section (سجل أعذاري ونقاط تشتتي) -->
        <div class="sh-card p-6 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">🧠</span>
              <div>
                <h4 class="font-black text-sm text-slate-900 dark:text-white">سجل أعذاري ومشتتاتي (${excuses.length})</h4>
                <p class="text-[11px] text-slate-400">الأعذار التي كتبتها عند قطع جلسات المذاكرة لمساعدتك في علاجها.</p>
              </div>
            </div>
          </div>

          <div class="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            ${!excuses.length ? `
              <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400">
                🎉 رائع! سجلك نظيف ولم تسجل أي أعذار تشتت بعد. استمر في التركيز!
              </div>
            ` : excuses.map(e => `
              <div class="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] text-slate-400">${e.date} • ${e.time}</span>
                  <span class="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 font-mono font-black text-[10px]">بعد ${e.minutesSpent} دقيقة مذاكرة</span>
                </div>
                <p class="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">"${e.reason}"</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Excuse Barrier Modal (جدار الالتزام الصارم) -->
      <div id="focus-excuse-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 border-2 border-rose-500/40 text-center">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-3xl">
            🛑
          </div>
          
          <div class="space-y-1">
            <h3 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">لحظة يا بطل! عقلك يحاول التشتت!</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              لا يمكنك إنهاء جلسة التركيز إلا بكتابة عذر صريح ومقنع من <strong>أكثر من 4 كلمات</strong> يشرح سبب تركك للمذاكرة الآن:
            </p>
          </div>

          <div class="space-y-2 text-right">
            <textarea id="focus-excuse-input" oninput="Tasks.checkExcuseWords(this.value)" rows="3" placeholder="اكتب عذرك بصدق هنا (مثال: شعرت بالنعاس وتشتت بسبب إشعار على هاتفي)..." class="sh-input text-xs font-bold w-full leading-relaxed"></textarea>
            <div class="flex justify-between text-[11px] font-bold">
              <span id="excuse-word-count" class="text-rose-500 font-mono">0 / 5 كلمات مطلوبة</span>
              <span class="text-slate-400">سيُحفظ في سجل تشتتك</span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <button onclick="Tasks.cancelExcuseModal()" class="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md active:scale-95 transition">
              💪 تراجعت وسأواصل المذاكرة
            </button>
            <button id="confirm-excuse-btn" disabled onclick="Tasks.confirmExcuseAndExit()" class="px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-xs transition cursor-not-allowed">
              تسجيل العذر واستسلام ⚠️
            </button>
          </div>
        </div>
      </div>
    `;
  },

  _pomoSeconds: 1500,
  _pomoInterval: null,
  _pomoRunning: false,
  _pomoElapsedMinutes: 0,

  startStrictFocus() {
    if (this._pomoRunning) return;
    this._pomoRunning = true;
    this._pomoSeconds = 1500;
    this._pomoElapsedMinutes = 0;

    const btn = document.getElementById('pomo-toggle-btn');
    if (btn) btn.innerHTML = '<span>🔒 جاري التركيز الصارم...</span>';

    const lbl = document.getElementById('pomo-status-label');
    if (lbl) lbl.textContent = 'ممنوع الخروج بدون عذر';

    // Request Fullscreen if available
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch(e) {}

    this._pomoInterval = setInterval(() => {
      if (this._pomoSeconds > 0) {
        this._pomoSeconds--;
        if (this._pomoSeconds % 60 === 0) {
          this._pomoElapsedMinutes++;
        }
        const m = String(Math.floor(this._pomoSeconds / 60)).padStart(2, '0');
        const s = String(this._pomoSeconds % 60).padStart(2, '0');
        const disp = document.getElementById('pomo-timer-display');
        if (disp) disp.textContent = `${m}:${s}`;
      } else {
        clearInterval(this._pomoInterval);
        this._pomoRunning = false;
        Store.addXP(40, 'إتمام جلسة تركيز كاملة');
        App.toast('🏆 بطل حقيقي! أنهيت جلسة التركيز بنجاح دون أي استسلام (+40 XP)!', 'success');
        this.resetPomodoro();
      }
    }, 1000);
  },

  attemptExitFocus() {
    if (!this._pomoRunning) {
      this.resetPomodoro();
      return;
    }
    const m = document.getElementById('focus-excuse-modal');
    if (m) m.classList.remove('hidden');
  },

  cancelExcuseModal() {
    const m = document.getElementById('focus-excuse-modal');
    if (m) m.classList.add('hidden');
    App.toast('أحسنت الاختيار! العزيمة تصنع الأبطال 💪', 'success');
  },

  checkExcuseWords(text) {
    const words = (text || '').trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    const lbl = document.getElementById('excuse-word-count');
    const btn = document.getElementById('confirm-excuse-btn');

    if (lbl) {
      lbl.textContent = `${count} / 5 كلمات مطلوبة`;
      lbl.className = count >= 5 ? 'text-emerald-500 font-mono' : 'text-rose-500 font-mono';
    }

    if (btn) {
      if (count >= 5) {
        btn.disabled = false;
        btn.className = 'px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow transition active:scale-95 cursor-pointer';
      } else {
        btn.disabled = true;
        btn.className = 'px-4 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-xs transition cursor-not-allowed';
      }
    }
  },

  confirmExcuseAndExit() {
    const input = document.getElementById('focus-excuse-input');
    const reason = (input ? input.value : '').trim();
    if (!reason) return;

    Store.addFocusExcuse(reason, this._pomoElapsedMinutes || 1);
    clearInterval(this._pomoInterval);
    this._pomoRunning = false;

    const modal = document.getElementById('focus-excuse-modal');
    if (modal) modal.classList.add('hidden');

    try {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    } catch(e) {}

    App.toast('تم تسجيل عذرك في سجل تشتتك. راجع أسبابك وتغلب عليها في الجلسة القادمة! 🧠', 'warning');
    this.renderPomodoroTab(document.getElementById('focus-content'));
  },

  resetPomodoro() {
    clearInterval(this._pomoInterval);
    this._pomoRunning = false;
    this._pomoSeconds = 1500;
    const disp = document.getElementById('pomo-timer-display');
    if (disp) disp.textContent = '25:00';
    const btn = document.getElementById('pomo-toggle-btn');
    if (btn) btn.innerHTML = '<span>▶️ ابدأ جلسة التركيز</span>';
    const lbl = document.getElementById('pomo-status-label');
    if (lbl) lbl.textContent = 'مغلق للتركيز';
  },

  // ===== 3. الامتحانات والدرجات =====
  renderExamsTab(container) {
    const exams = Store.state.exams || [];
    const grades = Store.state.grades || [];

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">🏆</span>
          <div>
            <strong>دليل سجل الامتحانات والدرجات:</strong>
            <span class="text-slate-500 dark:text-slate-400">سجل مواعيد امتحاناتك القادمة لترى العد التنازلي المباشر، ودون درجات اختبارات الشهور لقياس نسبة تحصيلك الأكاديمي أولاً بأول.</span>
          </div>
        </div>

        <!-- Exams Grid -->
        <div class="space-y-3">
          <h4 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>📅</span>
            <span>الامتحانات القادمة (${exams.length})</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!exams.length) {
      html += `<div class="col-span-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">لا توجد امتحانات مسجلة حالياً</div>`;
    } else {
      exams.forEach(e => {
        const sub = Store.subject(e.subjectId) || { name: 'عام', color: '#6366f1' };
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white" style="background:${sub.color}">${sub.name}</span>
              <span class="text-xs font-mono font-bold text-amber-400">${e.date}</span>
            </div>
            <h4 class="font-black text-sm text-slate-900 dark:text-white">${e.title || 'امتحان شهري'}</h4>
          </div>
        `;
      });
    }

    html += `
          </div>
        </div>

        <!-- Grades Log -->
        <div class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏆</span>
            <span>سجل الدرجات والتقييمات (${grades.length})</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!grades.length) {
      html += `<div class="col-span-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">لم تسجل أي درجات بعد</div>`;
    } else {
      grades.forEach(g => {
        const sub = Store.subject(g.subjectId) || { name: 'عام', color: '#6366f1' };
        const pct = Math.round((g.score / g.total) * 100);
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span class="px-2 py-0.5 rounded-lg text-[10px] font-black text-white block w-fit mb-1" style="background:${sub.color}">${sub.name}</span>
              <h5 class="font-black text-xs text-slate-900 dark:text-white">${g.title || 'اختبار'}</h5>
            </div>
            <div class="text-right">
              <span class="text-lg font-black text-emerald-400 font-mono">${g.score}/${g.total}</span>
              <span class="text-[10px] text-slate-400 font-bold block">${pct}%</span>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div></div>`;
    container.innerHTML = html;
  },

  openExamForm() {
    const title = prompt('عنوان الامتحان:');
    if (!title) return;
    const date = prompt('تاريخ الامتحان (YYYY-MM-DD):', localDateStr()) || localDateStr();
    if (!Store.state.exams) Store.state.exams = [];
    Store.state.exams.push({ id: 'ex_' + Date.now(), title, date });
    Store.addXP(15, 'إضافة موعد امتحان');
    Store.save();
    App.toast('تمت إضافة الامتحان! (+15 XP)', 'success');
    this.renderExamsTab(document.getElementById('focus-content'));
  },

  openGradeForm() {
    const title = prompt('عنوان الاختبار / الشيت:');
    if (!title) return;
    const score = parseFloat(prompt('درجتك:') || '0');
    const total = parseFloat(prompt('الدرجة النهائية:') || '100');
    if (!Store.state.grades) Store.state.grades = [];
    Store.state.grades.push({ id: 'gr_' + Date.now(), title, score, total });
    Store.addXP(25, 'تسجيل درجة امتحان');
    Store.save();
    App.toast('تم حفظ الدرجة بنجاح! (+25 XP) 🌟', 'success');
    this.renderExamsTab(document.getElementById('focus-content'));
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Tasks.init();
});
