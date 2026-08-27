const SUBJECT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16'];

const Subjects = {
  currentTab: 'subjects',
  selectedDay: 'السبت',

  DAYS: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],

  init() {
    this.selectedDay = this.getTodayArabicName();
    this.renderRoleTabs();
    if (Store.isTeacher()) {
      this.switchTab('planets');
    } else {
      this.switchTab('subjects');
    }
    App.maybeFlash();
  },

  getTodayArabicName() {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[new Date().getDay()];
  },

  renderRoleTabs() {
    const tabsContainer = document.getElementById('academic-tabs');
    if (!tabsContainer) return;

    const isTeacher = Store.isTeacher();

    if (isTeacher) {
      tabsContainer.innerHTML = `
        <button onclick="Subjects.switchTab('planets')" id="tab-btn-planets" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-indigo-600 text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span>🪐</span>
          <span>استوديو المعلم وجدول الـ 7 أيام</span>
        </button>
      `;
    } else {
      tabsContainer.innerHTML = `
        <button onclick="Subjects.switchTab('subjects')" id="tab-btn-subjects" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-indigo-600 text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span>🗂️</span>
          <span>المواد الدراسية</span>
        </button>
        <button onclick="Subjects.switchTab('schedule')" id="tab-btn-schedule" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>📅</span>
          <span>جدول الحصص والـ 7 أيام</span>
        </button>
        <button onclick="Subjects.switchTab('planets')" id="tab-btn-planets" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>🪐</span>
          <span>كواكب المعلمين المنضم إليها</span>
        </button>
        <button onclick="Subjects.switchTab('teachers')" id="tab-btn-teachers" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
          <span>👨‍🏫</span>
          <span>دليل المعلمين والسناتر</span>
        </button>
      `;
    }
  },

  switchTab(tabKey) {
    this.currentTab = tabKey;
    ['subjects', 'schedule', 'planets', 'teachers'].forEach(t => {
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
    const container = document.getElementById('academic-content');
    const actions = document.getElementById('academic-actions');
    if (!container) return;

    if (this.currentTab === 'subjects') {
      if (actions) {
        actions.innerHTML = `
          <button class="sh-btn primary text-xs !py-2.5 !px-4 shadow-lg" onclick="Subjects.openForm()">+ مادة جديدة</button>
        `;
      }
      this.renderSubjectsGrid(container);
    } else if (this.currentTab === 'schedule') {
      if (actions) actions.innerHTML = '';
      this.renderStudentScheduleTab(container);
    } else if (this.currentTab === 'planets') {
      if (actions) actions.innerHTML = '';
      container.innerHTML = `
        <div class="space-y-5">
          <div id="teacher-studio-tabs" class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"></div>
          <div id="teacher-studio-content"></div>
        </div>
      `;
      if (typeof TeacherStudio !== 'undefined') {
        TeacherStudio.init();
      }
    } else {
      if (actions) {
        actions.innerHTML = `
          <button class="sh-btn primary text-xs !py-2.5 !px-4 shadow-lg" onclick="Subjects.openTeacherForm()">+ إضافة معلم / سنتر</button>
        `;
      }
      this.renderTeachersTab(container);
    }
  },

  // ===== 1. المواد الدراسية (للطلاب) =====
  renderSubjectsGrid(container) {
    const list = Store.state.subjects || [];

    let html = `
      <div class="space-y-4 animate-in fade-in duration-200">
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">💡</span>
          <div>
            <strong>دليل المواد والمقررات:</strong>
            <span class="text-slate-500 dark:text-slate-400">سجل مقرراتك الدراسية هنا لتربط تلقائياً بالمهام اليومية والامتحانات وجدول الحصص.</span>
          </div>
        </div>
    `;

    if (!list.length) {
      html += `
        <div class="sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📚</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد مواد مسجلة بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">أضف موادك الدراسية لربط المهام والامتحانات وجدول الحصص بها!</p>
          <button class="sh-btn primary text-xs mt-2" onclick="Subjects.openForm()">+ أضف أول مادة (+20 XP)</button>
        </div>
      `;
    } else {
      html += `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">`;
      html += list.map(s => {
        const openTasks = (Store.state.tasks || []).filter(t => t.subjectId === s.id && !t.completed).length;
        const examsCount = (Store.state.exams || []).filter(e => e.subjectId === s.id).length;
        const scheduleCount = (Store.getStudentSchedule() || []).filter(sch => sch.subjectId === s.id || sch.subjectName === s.name).length;
        const minutes = (Store.state.pomodoroSessions || []).filter(p => p.subjectId === s.id).reduce((sum, p) => sum + (p.minutes || 0), 0);

        return `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 hover:border-indigo-500/40 transition">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shrink-0 shadow-sm" style="background:${s.color || '#6366f1'}">
                ${escapeHtml(s.name.charAt(0))}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-black text-sm truncate text-slate-900 dark:text-white">${escapeHtml(s.name)}</div>
                <div class="text-[11px] font-bold text-slate-400 font-mono">${minutes} دقيقة مذاكرة ⏱️</div>
              </div>
              <div class="flex gap-1 shrink-0">
                <button class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs" title="تعديل" onclick="Subjects.openForm('${s.id}')">✏️</button>
                <button class="p-2 rounded-xl text-rose-400 hover:text-rose-600 text-xs" title="حذف" onclick="Subjects.del('${s.id}')">🗑️</button>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold">
              <a class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition" href="tasks.html?subject=${s.id}">
                📝 ${openTasks} مهام
              </a>
              <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                📅 ${examsCount} امتحانات
              </span>
              <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                ⏰ ${scheduleCount} مواعيد أسبوعية
              </span>
            </div>
          </div>
        `;
      }).join('');
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  // ===== 2. جدول الـ 7 أيام الأفقي الذكي للطالب (Student 7-Day Horizontal Schedule) =====
  renderStudentScheduleTab(container) {
    const isUni = Store.state.user && Store.state.user.role === 'uni';
    const schedule = Store.getStudentSchedule();
    const currentDay = this.selectedDay;
    const dayItems = schedule.filter(x => x.day === currentDay);

    const getCategoryBadge = function(item) {
      if (item.type === 'break') return { label: '☕ استراحة وصلاة', cls: 'bg-amber-500 text-white' };
      if (item.type === 'study') return { label: '📚 مذاكرة ذاتية', cls: 'bg-blue-600 text-white' };
      
      if (isUni) {
        if (item.sessionCategory === 'section') return { label: '🔬 سكشن عملي', cls: 'bg-cyan-600 text-white' };
        if (item.sessionCategory === 'course') return { label: '💻 كورس تدريبي', cls: 'bg-purple-600 text-white' };
        if (item.sessionCategory === 'private') return { label: '📖 تدريب / خاص', cls: 'bg-emerald-600 text-white' };
        return { label: '🏛️ محاضرة جامعية', cls: 'bg-indigo-600 text-white' };
      } else {
        if (item.sessionCategory === 'online') return { label: '💻 حصة أونلاين', cls: 'bg-purple-600 text-white' };
        if (item.sessionCategory === 'private') return { label: '📖 درس خصوصي', cls: 'bg-emerald-600 text-white' };
        return { label: '🏫 حضور سنتر', cls: 'bg-indigo-600 text-white' };
      }
    };

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        
        <!-- Header Banner -->
        <div class="p-4 rounded-3xl bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-transparent border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-black">
              <span>📅</span>
              <span>جدول الـ 7 أيام الأسبوعي للدروس والمحاضرات</span>
            </div>
            <h3 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">نظم مواعيد دروسك ومحاضراتك بالساعة والسنتر</h3>
            <p class="text-xs text-slate-500 max-w-xl">
              ${isUni ? 'نظم مواعيد المحاضرات والسكاشن والكورسات الأسبوعية بالساعة ورقم المدرج.' : 'نظم مواعيد السناتر والأونلاين والدروس الخاصة بالساعة واسم الأستاذ.'}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button onclick="Subjects.openAddStudentSlotModal('lesson')" class="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5">
              <span>+ إضافة ${isUni ? 'محاضرة / سكشن' : 'درس / حصة'} في (${currentDay})</span>
            </button>
            <button onclick="Subjects.openAddStudentSlotModal('study')" class="px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5" title="حجز فترة مذاكرة ذاتية">
              <span>📚 مذاكرة ذاتية</span>
            </button>
            <button onclick="Subjects.openAddStudentSlotModal('break')" class="px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5" title="فترة راحة وصلاة">
              <span>☕ راحة</span>
            </button>
            <button onclick="Subjects.copyStudentScheduleToWhatsApp()" class="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5">
              <span>📲 نسخ للواتساب</span>
            </button>
          </div>
        </div>

        <!-- 7-Day Horizontal Bar (شريط الـ 7 أيام الأفقي مع عداد الحصص) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-black text-slate-400 px-1">
            <span>🗓️ أيام الأسبوع السبعة:</span>
            <span class="text-indigo-500">اضغط على اليوم لعرض مواعيده</span>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${this.DAYS.map(d => {
              const countLessons = schedule.filter(x => x.day === d && x.type === 'lesson').length;
              const countStudy = schedule.filter(x => x.day === d && x.type === 'study').length;
              const isSel = this.selectedDay === d;
              return `
                <button onclick="Subjects.selectScheduleDay('${d}')" class="min-w-[120px] p-3.5 rounded-2xl border text-center transition-all active:scale-95 flex-1 ${isSel ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg ring-2 ring-indigo-400/50' : 'bg-white dark:bg-[#121826] border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 text-slate-700 dark:text-slate-200'}">
                  <div class="font-black text-xs md:text-sm mb-1">${d}</div>
                  <div class="text-[10px] font-mono font-bold ${isSel ? 'text-indigo-200' : 'text-slate-400'}">
                    ${countLessons > 0 ? `📚 ${countLessons} ${isUni ? 'محاضرات' : 'حصص'}` : '—'}
                    ${countStudy > 0 ? `• 📖 ${countStudy}` : ''}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Current Selected Day Schedule Grid -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌟</span>
              <span>مواعيد يوم (${currentDay}):</span>
            </h4>
            <span class="text-xs font-bold text-slate-400">${dayItems.length} مواعيد مسجلة اليوم</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!dayItems.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📅</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد دروس أو محاضرات مسجلة ليوم (${currentDay})</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">أضف مواعيد حصصك وسناترك أو فترات المذاكرة الخاصة بك ليوم ${currentDay}!</p>
          <div class="flex justify-center gap-2 pt-2">
            <button onclick="Subjects.openAddStudentSlotModal('lesson')" class="sh-btn primary text-xs">+ إضافة موعد في ${currentDay}</button>
            <button onclick="Subjects.openAddStudentSlotModal('study')" class="sh-btn secondary text-xs">📚 حجز وقت مذاكرة</button>
          </div>
        </div>
      `;
    } else {
      dayItems.forEach(item => {
        const badge = getCategoryBadge(item);
        const isBreak = item.type === 'break';
        const isStudy = item.type === 'study';

        html += `
          <div class="sh-card p-5 rounded-3xl ${isBreak ? 'bg-amber-500/10 border-2 border-dashed border-amber-500/40' : (isStudy ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800')} shadow-sm flex flex-col justify-between gap-3 group">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-3 py-1 rounded-xl text-[10px] font-black ${badge.cls}">
                  ${badge.label}
                </span>
                <span class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                  ⏰ ${formatTime(item.startTime)} ➔ ${formatTime(item.endTime)}
                </span>
              </div>

              <h4 class="font-black text-sm text-slate-900 dark:text-white">${escapeHtml(item.subjectName)}</h4>

              ${!isBreak ? `
                <div class="text-xs text-slate-500 space-y-1">
                  ${item.teacherName ? `<div>👨‍🏫 الأستاذ / الدكتور: <strong>${escapeHtml(item.teacherName)}</strong></div>` : ''}
                  <div>📍 المكان: <strong>${escapeHtml(item.location || (isUni ? 'المدرج' : 'السنتر'))}</strong></div>
                  ${item.notes ? `<div class="text-[11px] text-slate-400">📝 ${escapeHtml(item.notes)}</div>` : ''}
                </div>
              ` : ''}
            </div>

            <div class="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="Subjects.deleteStudentSlot('${item.id}')" class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1 transition">
                <span>🗑️ حذف من اليوم</span>
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div></div>`;
    container.innerHTML = html;
  },

  selectScheduleDay(day) {
    this.selectedDay = day;
    this.renderActiveTab();
  },

  openAddStudentSlotModal(type = 'lesson') {
    const day = this.selectedDay;
    const isUni = Store.state.user && Store.state.user.role === 'uni';
    const subjects = Store.state.subjects || [];
    const teachers = Store.state.teachers || [];

    if (type === 'break') {
      const title = prompt('عنوان الاستراحة (مثال: راحة وصلاة العصر):', 'استراحة وصلاة ☕') || 'استراحة وصلاة ☕';
      const startTime = prompt('وقت البدء (مثال: 15:00):', '15:00') || '15:00';
      const endTime = prompt('وقت الانتهاء (مثال: 15:30):', '15:30') || '15:30';
      Store.addStudentScheduleItem({ type: 'break', subjectName: title, day, startTime, endTime, location: 'استراحة' });
      App.toast('تمت إضافة وقت الاستراحة بنجاح ☕', 'success');
      this.renderActiveTab();
      return;
    }

    if (type === 'study') {
      let subjName = '';
      if (subjects.length) {
        let choices = subjects.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
        let sel = prompt(`اختر رقم المادة التي ستذاكرها:\n\n${choices}\n\n(أو اكتب اسم المادة):`, '1');
        let idx = parseInt(sel) - 1;
        subjName = (idx >= 0 && idx < subjects.length) ? subjects[idx].name : (sel || 'مذاكرة عامة');
      } else {
        subjName = prompt('اكتب اسم المادة للمذاكرة:', 'مذاكرة عامة') || 'مذاكرة عامة';
      }
      const startTime = prompt(`وقت بدء المذاكرة ليوم (${day}):`, '18:00') || '18:00';
      const endTime = prompt(`وقت الانتهاء ليوم (${day}):`, '20:00') || '20:00';
      Store.addStudentScheduleItem({ type: 'study', subjectName: 'مذاكرة ' + subjName, day, startTime, endTime, location: 'غرفة المذاكرة' });
      App.toast('تمت إضافة موعد المذاكرة بنجاح 📚 (+20 XP)', 'success');
      this.renderActiveTab();
      return;
    }

    // Normal Lesson / Lecture modal
    let selectedSubj = null;
    if (subjects.length > 0) {
      let choices = subjects.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
      let choice = prompt(`اختر رقم المادة:\n\n${choices}\n\n(أو اكتب 0 لإدخال مادة أخرى):`, '1');
      let idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < subjects.length) {
        selectedSubj = subjects[idx];
      }
    }

    let subjectName = selectedSubj ? selectedSubj.name : prompt('اكتب اسم المادة أو الحصة:');
    if (!subjectName) return;

    let teacherName = '';
    if (teachers.length > 0) {
      let tChoices = teachers.map((t, i) => `${i + 1}. ${t.name} (${t.subject || ''})`).join('\n');
      let tChoice = prompt(`اختر رقم الأستاذ:\n\n${tChoices}\n\n(أو اضغط Enter لتجاوز):`, '1');
      let tIdx = parseInt(tChoice) - 1;
      if (tIdx >= 0 && tIdx < teachers.length) {
        teacherName = teachers[tIdx].name;
      }
    }
    if (!teacherName) {
      teacherName = prompt(isUni ? 'اسم الدكتور / المعيد (اختياري):' : 'اسم المدرس (اختياري):', '') || '';
    }

    let categoryChoices = isUni ?
      '1. 🏛️ محاضرة جامعية\n2. 🔬 سكشن عملي\n3. 💻 كورس تدريبي\n4. 📖 تدريب / درس خاص' :
      '1. 🏫 حضور سنتر\n2. 💻 حصة أونلاين\n3. 📖 درس خصوصي';
    
    let catSel = prompt(`اختر نوع الحصة:\n\n${categoryChoices}:`, '1');
    let sessionCategory = 'center';
    if (isUni) {
      if (catSel === '2') sessionCategory = 'section';
      else if (catSel === '3') sessionCategory = 'course';
      else if (catSel === '4') sessionCategory = 'private';
      else sessionCategory = 'lecture';
    } else {
      if (catSel === '2') sessionCategory = 'online';
      else if (catSel === '3') sessionCategory = 'private';
      else sessionCategory = 'center';
    }

    let location = prompt(isUni ? 'المكان (رقم المدرج / القاعة):' : 'المكان (اسم السنتر أو أونلاين):', isUni ? 'مدرج أ' : 'السنتر') || (isUni ? 'المدرج' : 'السنتر');
    let startTime = prompt(`وقت البدء ليوم (${day}) بصيغة 24 ساعة (مثال: 10:00 أو 14:30):`, '14:00') || '14:00';
    let endTime = prompt(`وقت الانتهاء ليوم (${day}) بصيغة 24 ساعة (مثال: 12:00 أو 16:30):`, '16:00') || '16:00';

    Store.addStudentScheduleItem({
      type: 'lesson',
      sessionCategory,
      subjectId: selectedSubj ? selectedSubj.id : '',
      subjectName,
      teacherName,
      day,
      startTime,
      endTime,
      location
    });

    App.toast(`تمت إضافة موعد [${subjectName}] في يوم (${day}) بنجاح! (+20 XP) 📅`, 'success');
    this.renderActiveTab();
  },

  deleteStudentSlot(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الموعد من جدولك؟')) return;
    Store.deleteStudentScheduleItem(id);
    this.renderActiveTab();
  },

  copyStudentScheduleToWhatsApp() {
    const schedule = Store.getStudentSchedule();
    if (!schedule.length) {
      App.toast('جدولك فارغ، أضف حصصاً أولاً لتصديرها!', 'warning');
      return;
    }

    const userName = Store.state.user.name || 'طالب';
    let msg = `📅 *الجدول الأسبوعي لمواعيدي ودروسي*\n`;
    msg += `🎓 *الطالب:* ${userName}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    this.DAYS.forEach(d => {
      const items = schedule.filter(x => x.day === d);
      if (items.length) {
        msg += `🗓️ *يوم ${d}:*\n`;
        items.forEach(it => {
          if (it.type === 'break') {
            msg += `   ☕ *${it.subjectName}* (${formatTime(it.startTime)} - ${formatTime(it.endTime)})\n`;
          } else if (it.type === 'study') {
            msg += `   📚 *${it.subjectName}* (${formatTime(it.startTime)} - ${formatTime(it.endTime)})\n`;
          } else {
            msg += `   📌 *${it.subjectName}* [${it.location || 'السنتر'}]\n`;
            msg += `      ⏰ الوقت: ${formatTime(it.startTime)} إلى ${formatTime(it.endTime)}\n`;
            if (it.teacherName) msg += `      👨‍🏫 الأستاذ: ${it.teacherName}\n`;
          }
        });
        msg += `\n`;
      }
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ *تم التنظيم عبر تطبيق Student Hub* 🎓`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg);
      App.toast('تم نسخ جدول دروسك للواتساب بنجاح! 📲 جاهز للمشاركة', 'success');
    }
  },

  // ===== 3. دليل المعلمين والسناتر =====
  renderTeachersTab(container) {
    const teachers = Store.state.teachers || [];

    let html = `
      <div class="space-y-4 animate-in fade-in duration-200">
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">👨‍🏫</span>
          <div>
            <strong>دليل المعلمين ومساعدي السناتر:</strong>
            <span class="text-slate-500 dark:text-slate-400">احفظ بيانات أساتذتك وأرقام هواتف المساعدين ومواقع السناتر للاتصال المباشر بنقرة واحدة عند الحاجة.</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    if (!teachers.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">👨‍🏫</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تسجل بيانات المعلمين أو مساعدي السناتر</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">سجل أرقام المساعدين والسناتر لتصل إليها بضغطة زر عند الحاجة!</p>
          <button class="sh-btn primary text-xs mt-2" onclick="Subjects.openTeacherForm()">+ إضافة معلم</button>
        </div>
      `;
    } else {
      teachers.forEach(t => {
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center text-xl font-black shrink-0">
                👨‍🏫
              </div>
              <div class="min-w-0 flex-1">
                <h4 class="font-black text-sm text-slate-900 dark:text-white truncate">${t.name}</h4>
                <span class="text-[11px] text-slate-400 block">${t.subject || 'مدرس المادة'} • ${t.center || 'السنتر'}</span>
              </div>
            </div>
            ${t.phone ? `
              <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span class="text-slate-400 font-bold">هاتف المساعد / الأستاذ:</span>
                <a href="tel:${t.phone}" class="font-mono font-bold text-indigo-400 hover:underline" dir="ltr">${t.phone} 📞</a>
              </div>
            ` : ''}
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  },

  del(id) {
    App.confirm('حذف المادة؟', 'هتتحذف معاها كل المهام والامتحانات المرتبطة بها.', () => {
      ['tasks', 'exams', 'lectures', 'pomodoroSessions'].forEach(k => {
        if (Store.state[k]) Store.state[k] = Store.state[k].filter(x => x.subjectId !== id);
      });
      Store.remove('subjects', id);
      Store.save();
      App.toast('تم الحذف');
      this.render();
    }, true);
  },

  openForm(id) {
    const s = id ? Store.state.subjects.find(x => x.id === id) : null;
    const name = prompt('اكتب اسم المادة الجديدة:', s ? s.name : '');
    if (!name) return;

    if (s) {
      s.name = name;
    } else {
      const color = SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)];
      Store.add('subjects', { name, color });
      Store.addXP(20, 'إضافة مادة دراسية جديدة');
    }
    Store.save();
    App.toast(s ? 'تم تعديل المادة' : 'تمت إضافة المادة بنجاح! (+20 XP)', 'success');
    this.render();
  },

  openTeacherForm() {
    const name = prompt('اكتب اسم الأستاذ:');
    if (!name) return;
    const subject = prompt('المادة التي يدرسها:') || '';
    const phone = prompt('رقم هاتف المساعد أو الحجز:') || '';
    const center = prompt('اسم السنتر / المنصة:') || '';

    if (!Store.state.teachers) Store.state.teachers = [];
    Store.state.teachers.push({ id: 't_' + Date.now(), name, subject, phone, center });
    Store.addXP(15, 'إضافة معلم');
    Store.save();
    App.toast('تمت إضافة الأستاذ بنجاح! (+15 XP)', 'success');
    this.render();
  },

  render() {
    this.renderRoleTabs();
    this.renderActiveTab();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Subjects.init();
});