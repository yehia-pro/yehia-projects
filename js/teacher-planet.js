/**
 * Student Hub - Teacher Studio & Planets Engine (استوديو المعلم المطور وجدول الـ 7 أيام الأفقي)
 * مخصص للمعلم فقط: سجل المجموعات الثابتة، جدول الـ 7 أيام الذكي بالاختيار المسبق، وكواكب البث والمذكرات.
 */

const TeacherStudio = {
  currentTab: 'schedule', // 'schedule' | 'groups' | 'planets' | 'joined'
  selectedDay: 'السبت',

  DAYS: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],

  init() {
    this.selectedDay = this.getTodayArabicName();
    this.renderTabs();
    this.renderActiveTab();
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.renderTabs();
    this.renderActiveTab();
  },

  renderTabs() {
    const el = document.getElementById('teacher-studio-tabs');
    if (!el) return;

    const isTeacher = Store.isTeacher();
    const tabs = isTeacher ? [
      { id: 'schedule', name: 'جدول الـ 7 أيام الأفقي 📅', icon: '⏰' },
      { id: 'groups', name: 'سجل المجموعات والسناتر 📁', icon: '👥' },
      { id: 'planets', name: 'كواكبي وقنوات البث 🪐', icon: '📢' }
    ] : [
      { id: 'joined', name: 'كواكب المعلمين المنضم إليها 🚀', icon: '🔑' }
    ];

    el.innerHTML = tabs.map(t => {
      const isSel = t.id === this.currentTab;
      return `
        <button onclick="TeacherStudio.switchTab('${t.id}')" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${isSel ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}">
          <span>${t.icon}</span>
          <span>${t.name}</span>
        </button>
      `;
    }).join('');
  },

  renderActiveTab() {
    const container = document.getElementById('teacher-studio-content');
    if (!container) return;

    if (this.currentTab === 'schedule') {
      this.renderScheduleTab(container);
    } else if (this.currentTab === 'groups') {
      this.renderGroupsTab(container);
    } else if (this.currentTab === 'planets') {
      this.renderMyPlanetsTab(container);
    } else {
      this.renderJoinedPlanetsTab(container);
    }
  },

  // ===== 1. جدول الـ 7 أيام الأفقي الذكي بالاختيار المسبق =====
  renderScheduleTab(container) {
    const schedule = Store.getTeacherSchedule();
    const savedGroups = Store.getSavedTeacherGroups();
    const currentDay = this.selectedDay;
    const dayItems = schedule.filter(x => x.day === currentDay);

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        
        <!-- Teacher Header Banner -->
        <div class="p-4 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-black">
              <span>👨‍🏫</span>
              <span>استوديو المعلم — جدول الـ 7 أيام الأسبوعي</span>
            </div>
            <h3 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">تنظيم المجموعات بالساعة وفترات الراحة</h3>
            <p class="text-xs text-slate-500 max-w-xl leading-relaxed">
              اختر اليوم من الشريط الأفقي، وأضف المجموعات باختيارها مباشرة من سجلك المسبق دون إعادة كتابتها، وصدر جدولك بضغطة زر!
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button onclick="TeacherStudio.openAddSlotModal('group')" class="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5">
              <span>+ إضافة موعد في يوم (${currentDay})</span>
            </button>
            <button onclick="TeacherStudio.openAddSlotModal('break')" class="px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5" title="إضافة وقت راحة بين المجاميع">
              <span>☕ وقت راحة</span>
            </button>
            <button onclick="TeacherStudio.copyScheduleToWhatsApp()" class="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5">
              <span>📲 نسخ للواتساب</span>
            </button>
          </div>
        </div>

        <!-- 7-Day Horizontal Bar (شريط الـ 7 أيام الأفقي مع عداد المجموعات) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-black text-slate-400 px-1">
            <span>🗓️ أيام الأسبوع السبعة:</span>
            <span class="text-indigo-500">اضغط على اليوم لعرض مواعيده</span>
          </div>
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            ${this.DAYS.map(d => {
              const countGroups = schedule.filter(x => x.day === d && x.type !== 'break').length;
              const countBreaks = schedule.filter(x => x.day === d && x.type === 'break').length;
              const isSel = this.selectedDay === d;
              return `
                <button onclick="TeacherStudio.selectDay('${d}')" class="min-w-[120px] p-3.5 rounded-2xl border text-center transition-all active:scale-95 flex-1 ${isSel ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg ring-2 ring-indigo-400/50' : 'bg-white dark:bg-[#121826] border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 text-slate-700 dark:text-slate-200'}">
                  <div class="font-black text-xs md:text-sm mb-1">${d}</div>
                  <div class="text-[10px] font-mono font-bold ${isSel ? 'text-indigo-200' : 'text-slate-400'}">
                    ${countGroups > 0 ? `⏰ ${countGroups} مجاميع` : '—'}
                    ${countBreaks > 0 ? `• ☕ ${countBreaks}` : ''}
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
              <span>مواعيد ومجموعات يوم (${currentDay}):</span>
            </h4>
            <span class="text-xs font-bold text-slate-400">${dayItems.length} مواعيد مسجلة اليوم</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!dayItems.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📅</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد مجموعات أو مواعيد مسجلة ليوم (${currentDay})</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            ${savedGroups.length ? 'اختر من مجموعاتك المسجلة مسبقاً وأضف مواعيد هذا اليوم بسهولة!' : 'ابدأ بإضافة مجموعاتك وسناترك في سجل المجموعات لترتيب جدولك!'}
          </p>
          <div class="flex justify-center gap-2 pt-2">
            <button onclick="TeacherStudio.openAddSlotModal('group')" class="sh-btn primary text-xs">+ إضافة موعد مجموعة في ${currentDay}</button>
            <button onclick="TeacherStudio.openAddSlotModal('break')" class="sh-btn secondary text-xs">☕ إضافة فترة استراحة</button>
          </div>
        </div>
      `;
    } else {
      dayItems.forEach(item => {
        const isBreak = item.type === 'break';
        html += `
          <div class="sh-card p-5 rounded-3xl ${isBreak ? 'bg-amber-500/10 border-2 border-dashed border-amber-500/40' : 'bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800'} shadow-sm flex flex-col justify-between gap-3 group">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-3 py-1 rounded-xl text-[10px] font-black ${isBreak ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'}">
                  ${isBreak ? '☕ فترة استراحة وصلاة' : item.stage || 'مجموعة دراسية'}
                </span>
                <span class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                  ⏰ ${formatTime(item.startTime)} ➔ ${formatTime(item.endTime)}
                </span>
              </div>

              <h4 class="font-black text-sm text-slate-900 dark:text-white">${item.title}</h4>

              ${!isBreak ? `
                <div class="text-xs text-slate-500 space-y-1">
                  <div class="flex items-center justify-between text-[11px]">
                    <span>📍 المكان: <strong>${item.location || 'السنتر'}</strong></span>
                    ${item.capacity ? `<span>👥 السعة: ${item.capacity} طالب</span>` : ''}
                  </div>
                  ${item.assistantPhone ? `
                    <div class="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>هاتف المساعد:</span>
                      <a href="tel:${item.assistantPhone}" class="font-mono font-bold text-indigo-400 hover:underline" dir="ltr">${item.assistantPhone}</a>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>

            <div class="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="TeacherStudio.deleteScheduleSlot('${item.id}')" class="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1 transition">
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

  selectDay(day) {
    this.selectedDay = day;
    this.renderScheduleTab(document.getElementById('teacher-studio-content'));
  },

  // ===== 2. سجل المجموعات والسناتر الثابتة (Saved Groups Directory) =====
  renderGroupsTab(container) {
    const groups = Store.getSavedTeacherGroups();

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        
        <div class="p-4 rounded-3xl bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-transparent border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-black">
              <span>📁</span>
              <span>سجل المجموعات والسناتر الثابتة</span>
            </div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">دليل مجموعاتك وسناترك التعليمية</h3>
            <p class="text-xs text-slate-500 max-w-xl">
              سجل أسماء مجموعاتك وأماكنها مرة واحدة هنا؛ لتختارها بضغطة زر من القائمة المنسدلة في جدول الـ 7 أيام دون إعادة كتابتها كل مرة!
            </p>
          </div>

          <button onclick="TeacherStudio.openAddSavedGroupModal()" class="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow active:scale-95 transition flex items-center gap-1.5 shrink-0">
            <span>+ تسجيل مجموعة جديدة</span>
          </button>
        </div>

        <!-- Saved Groups List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!groups.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📁</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تسجل أي مجموعات في الدليل بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">سجل أسماء مجموعاتك في السناتر أو الأونلاين لتسهيل اختيارها في الجدول الأسبوعي!</p>
          <button onclick="TeacherStudio.openAddSavedGroupModal()" class="sh-btn primary text-xs mt-2">+ تسجيل أول مجموعة (+25 XP)</button>
        </div>
      `;
    } else {
      groups.forEach(g => {
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-2">
              <span class="px-3 py-1 rounded-xl text-[10px] font-black bg-purple-500/20 text-purple-600 dark:text-purple-300">
                ${g.stage || 'مرحلة دراسية'}
              </span>
              ${g.capacity ? `<span class="text-[11px] font-bold text-slate-400 font-mono">👥 ${g.capacity} طالب</span>` : ''}
            </div>

            <h4 class="font-black text-sm text-slate-900 dark:text-white">${g.name}</h4>

            <div class="text-xs text-slate-500 space-y-1">
              <div>📍 المكان / السنتر: <strong>${g.location}</strong></div>
              ${g.assistantPhone ? `
                <div class="pt-1 flex items-center justify-between text-[11px]">
                  <span>هاتف المساعد:</span>
                  <a href="tel:${g.assistantPhone}" class="font-mono font-bold text-indigo-400 hover:underline" dir="ltr">${g.assistantPhone}</a>
                </div>
              ` : ''}
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="TeacherStudio.quickAddGroupToCurrentDay('${g.id}')" class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-black active:scale-95 transition">
                + إضافة ليوم (${this.selectedDay})
              </button>
              <button onclick="TeacherStudio.deleteSavedGroup('${g.id}')" class="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg text-xs" title="حذف">
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

  // ===== 3. كواكبي وقنوات البث الحصرية (Teacher Planets) =====
  renderMyPlanetsTab(container) {
    const planets = Store.getTeacherPlanets();

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        <div class="p-4 rounded-3xl bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-transparent border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-black">
              <span>🪐</span>
              <span>كواكب المعلمين الحصرية</span>
            </div>
            <h3 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">قناة البث ومكتبة مذكرات أستاذ المادة</h3>
            <p class="text-xs text-slate-500 max-w-xl">
              أنشئ كوكباً خاصاً بك لمادتك؛ يحصل الطلاب على كود الدعوة للانضمام وقراءة مذكراتك وتلقي إعلاناتك الرسمية فقط دون أي إزعاج!
            </p>
          </div>

          <button onclick="TeacherStudio.openCreatePlanetModal()" class="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md active:scale-95 transition flex items-center gap-2 shrink-0">
            <span>+ إنشاء كوكب جديد</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    if (!planets.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">🪐</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تنشئ أي كوكب تعليمي بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">أنشئ كوكب مادتك الآن وشارك كود الدعوة السري مع طلابك في السنتر أو المنصة!</p>
          <button onclick="TeacherStudio.openCreatePlanetModal()" class="sh-btn primary text-xs mt-2">+ إنشاء كوكب مادتك (+50 XP)</button>
        </div>
      `;
    } else {
      planets.forEach(p => {
        const postsCount = (p.posts || []).length;
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-purple-500/30 shadow-md space-y-4">
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono">
                  ${p.grade || 'ثانوي'}
                </span>
                <h4 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🪐</span>
                  <span>${p.name}</span>
                </h4>
                <p class="text-xs text-slate-500">${p.description || 'كوكب المادة وقناة البث الرسمية'}</p>
              </div>
              <span class="text-xs font-bold text-slate-400 font-mono">${postsCount} منشور ومذكرة</span>
            </div>

            <!-- Planet Secret Code Badge -->
            <div class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span class="text-[10px] text-slate-400 font-bold block">كود دعوة الكوكب للطلاب:</span>
                <strong class="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-wider">${p.code}</strong>
              </div>
              <button onclick="TeacherStudio.copyPlanetCode('${p.code}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] active:scale-95 transition">
                نسخ الكود 📋
              </button>
            </div>

            <!-- Post to Planet Quick Actions -->
            <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="TeacherStudio.openAddPostModal('${p.id}', 'announcement')" class="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition">
                📢 نشر إعلان
              </button>
              <button onclick="TeacherStudio.openAddPostModal('${p.id}', 'pdf')" class="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition">
                📑 رفع مذكرة PDF
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  },

  // ===== 4. كواكب المعلمين المنضم إليها الطالب (Joined Planets) =====
  renderJoinedPlanetsTab(container) {
    const joined = Store.getJoinedPlanets();

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        <div class="p-4 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-indigo-600/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🚀</span>
              <span>الانضمام إلى كوكب أستاذك</span>
            </h3>
            <p class="text-xs text-slate-500">ادخل كود الدعوة السري الذي استلمته من أستاذك لتفتح كوكبه ومذكراته الحصرية.</p>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input type="text" id="planet-join-input" placeholder="كود الكوكب (مثال: PLANET-PHYS-8421)" class="sh-input text-xs font-mono font-bold uppercase w-full sm:w-56" dir="ltr">
            <button onclick="TeacherStudio.submitJoinPlanet()" class="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow shrink-0 active:scale-95 transition">
              انضمام ➔
            </button>
          </div>
        </div>

        <!-- Joined Planets List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    if (!joined.length) {
      html += `
        <div class="col-span-full sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">🪐</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تنضم لأي كوكب معلم بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">اطلب كود الكوكب من أستاذك في السنتر أو المنصة وادخله بالأعلى (+40 XP)!</p>
        </div>
      `;
    } else {
      joined.forEach(p => {
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                  ${p.code}
                </span>
                <h4 class="font-black text-base text-slate-900 dark:text-white mt-1">${p.name}</h4>
                <p class="text-xs text-slate-400">${p.teacherName} • ${p.subject}</p>
              </div>
              <span class="text-2xl">🪐</span>
            </div>

            <!-- Posts Stream Inside Planet -->
            <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h5 class="text-xs font-black text-slate-700 dark:text-slate-300">📢 آخر رسائل ومذكرات الأستاذ:</h5>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                ${(p.posts && p.posts.length) ? p.posts.map(post => `
                  <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                    <div class="flex items-center justify-between">
                      <strong class="font-black text-slate-900 dark:text-white">${post.title}</strong>
                      <span class="text-[10px] text-slate-400">${post.createdAt}</span>
                    </div>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${post.content}</p>
                  </div>
                `).join('') : '<p class="text-xs text-slate-400">لا توجد منشورات جديدة بعد.</p>'}
              </div>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  },

  // ===== Modal: Add Slot with Dropdown Selection (الاختيار من القائمة) =====
  openAddSlotModal(type = 'group') {
    const isBreak = type === 'break';
    const day = this.selectedDay;
    const savedGroups = Store.getSavedTeacherGroups();

    if (isBreak) {
      const title = prompt('اكتب عنوان الاستراحة (مثال: راحة وصلاة العصر):', 'راحة وصلاة') || 'وقت راحة واستراحة ☕';
      const startTime = prompt('وقت البدء (مثال: 15:00):', '15:00') || '15:00';
      const endTime = prompt('وقت الانتهاء (مثال: 16:00):', '16:00') || '16:00';

      Store.addTeacherScheduleItem({
        type: 'break',
        title,
        day,
        startTime,
        endTime,
        location: 'استراحة'
      });
      App.toast('تمت إضافة فترة الاستراحة بنجاح ☕', 'success');
      this.render();
      return;
    }

    // If no saved groups exist, prompt to create one first or enter name
    let selectedGroup = null;
    if (savedGroups.length > 0) {
      let groupChoices = savedGroups.map((g, idx) => `${idx + 1}. ${g.name} (${g.location})`).join('\n');
      let choice = prompt(`اختر رقم المجموعة المسجلة:\n\n${groupChoices}\n\n(أو اكتب 0 لإدخال مجموعة جديدة):`, '1');
      let idx = parseInt(choice) - 1;
      if (idx >= 0 && idx < savedGroups.length) {
        selectedGroup = savedGroups[idx];
      }
    }

    let title = selectedGroup ? selectedGroup.name : prompt('اكتب اسم المجموعة:');
    if (!title) return;

    let location = selectedGroup ? selectedGroup.location : (prompt('اسم السنتر / المكان:', 'السنتر') || 'السنتر');
    let stage = selectedGroup ? selectedGroup.stage : (prompt('المرحلة (إعدادي / ثانوي / جامعة):', 'المرحلة الثانوية') || 'المرحلة الثانوية');
    let assistantPhone = selectedGroup ? selectedGroup.assistantPhone : '';
    let capacity = selectedGroup ? selectedGroup.capacity : 0;

    const startTime = prompt(`وقت البدء ليوم (${day}) بصيغة 24 ساعة (مثال: 14:00 أو 16:30):`, '14:00') || '14:00';
    const endTime = prompt(`وقت الانتهاء ليوم (${day}) بصيغة 24 ساعة (مثال: 16:00 أو 18:30):`, '16:00') || '16:00';

    Store.addTeacherScheduleItem({
      type: 'group',
      title,
      day,
      startTime,
      endTime,
      location,
      stage,
      capacity,
      assistantPhone
    });

    App.toast(`تمت إضافة موعد ${title} في يوم (${day}) بنجاح! (+20 XP) 📅`, 'success');
    this.render();
  },

  quickAddGroupToCurrentDay(groupId) {
    const group = Store.getSavedTeacherGroups().find(g => g.id === groupId);
    if (!group) return;

    const day = this.selectedDay;
    const startTime = prompt(`وقت البدء ليوم (${day}) لمجموعة [${group.name}]:`, '14:00') || '14:00';
    const endTime = prompt(`وقت الانتهاء ليوم (${day}):`, '16:00') || '16:00';

    Store.addTeacherScheduleItem({
      type: 'group',
      title: group.name,
      day,
      startTime,
      endTime,
      location: group.location,
      stage: group.stage,
      capacity: group.capacity,
      assistantPhone: group.assistantPhone
    });

    App.toast(`تمت إضافة [${group.name}] إلى يوم (${day}) بنجاح! 📅`, 'success');
    this.switchTab('schedule');
  },

  openAddSavedGroupModal() {
    const name = prompt('اكتب اسم المجموعة (مثال: سنتر التميز 3ث - بنات):');
    if (!name) return;
    const location = prompt('اسم السنتر / المكان:', 'سنتر الأوائل') || 'السنتر';
    const stage = prompt('المرحلة الدراسية (المرحلة الإعدادية / المرحلة الثانوية / المرحلة الجامعية):', 'المرحلة الثانوية') || 'المرحلة الثانوية';
    const capacity = parseInt(prompt('السعة الاستيعابية (عدد الطلاب التقريبي):', '50')) || 0;
    const assistantPhone = prompt('رقم هاتف المساعد للحجز والاستفسار:', '') || '';

    Store.addSavedTeacherGroup({
      name,
      location,
      stage,
      capacity,
      assistantPhone
    });

    App.toast(`تم تسجيل مجموعة [${name}] في الدليل بنجاح! (+25 XP) 📁`, 'success');
    this.render();
  },

  deleteSavedGroup(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المجموعة من دليلك؟')) return;
    Store.deleteSavedTeacherGroup(id);
    this.render();
  },

  deleteScheduleSlot(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الموعد من الجدول؟')) return;
    Store.deleteTeacherScheduleItem(id);
    this.render();
  },

  copyScheduleToWhatsApp() {
    const schedule = Store.getTeacherSchedule();
    if (!schedule.length) {
      App.toast('جدولك فارغ، أضف مجاميع أولاً لتصديرها!', 'warning');
      return;
    }

    const teacherName = Store.state.user.name || 'الأستاذ';
    const teacherSubject = Store.state.user.teacherSubject || 'المادة';

    let msg = `📅 *الجدول الأسبوعي لمجموعات الدروس والسناتر*\n`;
    msg += `👨‍🏫 *الأستاذ:* ${teacherName} (${teacherSubject})\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    this.DAYS.forEach(d => {
      const items = schedule.filter(x => x.day === d);
      if (items.length) {
        msg += `🗓️ *يوم ${d}:*\n`;
        items.forEach(it => {
          if (it.type === 'break') {
            msg += `   ☕ *${it.title}* (${formatTime(it.startTime)} - ${formatTime(it.endTime)})\n`;
          } else {
            msg += `   📌 *${it.title}* [${it.stage || 'مجموعة'}]\n`;
            msg += `      ⏰ الوقت: ${formatTime(it.startTime)} إلى ${formatTime(it.endTime)}\n`;
            msg += `      📍 المكان: ${it.location}\n`;
            if (it.assistantPhone) msg += `      📞 هاتف الحجز: ${it.assistantPhone}\n`;
          }
        });
        msg += `\n`;
      }
    });

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ *تم التنظيم عبر تطبيق Student Hub* 🎓`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(msg);
      App.toast('تم نسخ الجدول بصيغة الواتساب للحافظة بنجاح! 📲 جاهز للإرسال للجروبات', 'success');
    }
  },

  openCreatePlanetModal() {
    const name = prompt('اكتب اسم كوكبك التعليمي (مثال: كوكب الفيزياء الحديثة):');
    if (!name) return;
    const subject = prompt('المادة الدراسية (مثال: فيزياء):', Store.state.user.teacherSubject || 'فيزياء') || 'فيزياء';
    const description = prompt('وصف موجز للكوكب:') || '';

    const p = Store.createTeacherPlanet({ name, subject, description });
    App.toast(`مبروك! تم إنشاء كوكبك بنجاح! كود الدعوة: ${p.code} 🪐 (+50 XP)`, 'success');
    this.render();
  },

  copyPlanetCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      App.toast(`تم نسخ كود الدعوة ${code} للحافظة! 📋 شاركه مع طلابك`, 'success');
    }
  },

  openAddPostModal(planetId, type = 'announcement') {
    const title = prompt(type === 'pdf' ? 'عنوان المذكرة / الشيت:' : 'عنوان الإعلان أو التنبيه:');
    if (!title) return;
    const content = prompt(type === 'pdf' ? 'وصف المذكرة أو رابط التحميل:' : 'نص الإعلان أو التنبيه للطلاب:');
    if (!content) return;

    Store.addPlanetPost(planetId, { type, title, content });
    App.toast('تم النشر في كوكبك بنجاح! (+25 XP) 📢', 'success');
    this.render();
  },

  submitJoinPlanet() {
    const input = document.getElementById('planet-join-input');
    const code = input ? input.value : '';
    try {
      const res = Store.joinPlanetByCode(code);
      if (res.alreadyJoined) {
        App.toast('أنت منضم بالفعل لهذا الكوكب! 🪐', 'info');
      } else {
        App.toast(`تم الانضمام بنجاح لكوكب "${res.planet.name}"! (+40 XP) 🚀`, 'success');
        if (input) input.value = '';
      }
      this.render();
    } catch(e) {
      App.toast(e.message, 'error');
    }
  },

  getTodayArabicName() {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[new Date().getDay()];
  },

  render() {
    this.renderTabs();
    this.renderActiveTab();
  }
};
