// js/resources.js — مركز الملخصات الذكية، القنوات المتجددة، وبوابة منصات المعلمين
// متوافق مع: anthropics/skills@frontend-design & ceorkm/mobile-app-ui-design

const ResourcesPage = {
  currentTab: 'streams', // 'streams' | 'notes' | 'platforms' | 'links'

  init() {
    this.renderTabs();
    this.renderActiveTab();
    App.maybeFlash();
  },

  switchTab(tabKey) {
    this.currentTab = tabKey;
    this.renderTabs();
    this.renderActiveTab();
  },

  renderTabs() {
    const tabsContainer = document.getElementById('resources-tabs');
    if (!tabsContainer) return;

    const tabs = [
      { id: 'streams', name: 'الباقات المتجددة 🔄', icon: '📡' },
      { id: 'notes', name: 'الحصص الفردية 📝', icon: '📑' },
      { id: 'platforms', name: 'منصات المعلمين 🌐', icon: '🎓' },
      { id: 'links', name: 'المذكرات والمراجع 📁', icon: '🔗' }
    ];

    tabsContainer.innerHTML = tabs.map(t => {
      const isSel = t.id === this.currentTab;
      return `
        <button onclick="ResourcesPage.switchTab('${t.id}')" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${isSel ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}">
          <span>${t.icon}</span>
          <span>${t.name}</span>
        </button>
      `;
    }).join('');
  },

  renderActiveTab() {
    const container = document.getElementById('resources-content');
    if (!container) return;

    if (this.currentTab === 'streams') {
      this.renderStreamsTab(container);
    } else if (this.currentTab === 'notes') {
      this.renderNotesTab(container);
    } else if (this.currentTab === 'platforms') {
      this.renderPlatformsTab(container);
    } else {
      this.renderLinksTab(container);
    }
  },

  // ===== 1. تبويب الباقات المتجددة (Dynamic Live Streams) =====
  renderStreamsTab(container) {
    const streams = Store.getSharedStreams();
    
    let html = `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>📡</span>
              <span>القنوات والباقات المتجددة</span>
            </h3>
            <p class="text-xs text-slate-500">سلاسل الحصص التي تتجدد تلقائياً (الحصة 1، 2، 3...).</p>
          </div>
          <button onclick="ResourcesPage.openCreateStreamModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition">
            + إنشاء باقة متجددة
          </button>
        </div>
    `;

    if (!streams.length) {
      html += `
        <div class="sh-card p-8 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📡</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تنضم لأي باقة متجددة بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">ادخل كود الباقة من أستاذك أو زميلك، أو أنشئ باقة لمادتك وشاركها مع أصدقائك.</p>
        </div>
      `;
    } else {
      html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">` + streams.map(s => {
        const lessons = s.lessons || [];
        const isOwner = !!s.isOwner;

        return `
          <div class="sh-card p-5 rounded-3xl border border-indigo-500/20 bg-white dark:bg-slate-900 space-y-4 shadow-sm flex flex-col justify-between" data-code="${s.code}">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
                    كود الباقة: ${s.code}
                  </span>
                  <h4 class="font-black text-base text-slate-900 dark:text-white mt-1">${escapeHtml(s.title)}</h4>
                </div>
                <span class="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  ${lessons.length} حصص
                </span>
              </div>

              <div class="text-xs text-slate-500 space-y-1">
                ${s.subjectName ? `<div>📚 <strong>المادة:</strong> ${escapeHtml(s.subjectName)}</div>` : ''}
                ${s.teacherName ? `<div>👨‍🏫 <strong>الأستاذ:</strong> ${escapeHtml(s.teacherName)}</div>` : ''}
                ${s.description ? `<p class="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl mt-1">${escapeHtml(s.description)}</p>` : ''}
              </div>

              <!-- List of Lessons in Stream -->
              <div class="pt-2 space-y-2">
                <div class="text-xs font-bold text-slate-400">قائمة الحصص والتجميعات:</div>
                <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  ${lessons.map((les, idx) => `
                    <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                      <div class="min-w-0 flex-1">
                        <strong class="text-slate-800 dark:text-white block truncate">${escapeHtml(les.title)}</strong>
                        ${les.content ? `<p class="text-[10px] text-slate-400 line-clamp-1 mt-0.5">${escapeHtml(les.content)}</p>` : ''}
                      </div>
                      ${les.pdfUrl ? `<a href="${encodeURI(les.pdfUrl)}" target="_blank" class="px-2 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold shrink-0">PDF 📄</a>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Actions row -->
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button onclick="ResourcesPage.copyCode('${s.code}')" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 active:scale-95 transition">
                <span>📋</span>
                <span>نسخ الكود</span>
              </button>

              <div class="flex items-center gap-2">
                ${isOwner ? `
                  <button onclick="ResourcesPage.openAddLessonModal('${s.code}')" class="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold active:scale-95 transition">
                    + إضافة حصة
                  </button>
                ` : `
                  <button onclick="ResourcesPage.refreshStream('${s.code}')" class="px-3 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold active:scale-95 transition flex items-center gap-1">
                    <span>🔄</span>
                    <span>تحديث</span>
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('') + `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  // ===== 2. تبويب الملخصات الفردية (Single Notes) =====
  renderNotesTab(container) {
    const notes = Store.getSharedNotes();

    let html = `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>📑</span>
              <span>ملخصات الحصص الفردية</span>
            </h3>
            <p class="text-xs text-slate-500">ملخصات سريعة لكل درس على حدة.</p>
          </div>
          <button onclick="ResourcesPage.openCreateNoteModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition">
            + نشر ملخص حصة
          </button>
        </div>
    `;

    if (!notes.length) {
      html += `
        <div class="sh-card p-8 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📝</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد ملخصات فردية محفوظة</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">أدخل كود أي ملخص مشارك من زميلك أو اكتب ملخصاً جديداً وانشره بكود فوري.</p>
        </div>
      `;
    } else {
      html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">` + notes.map(n => {
        return `
          <div class="sh-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                  ${n.code}
                </span>
                <span class="text-[10px] text-slate-400 font-bold">${n.createdAt || ''}</span>
              </div>
              <h4 class="font-black text-sm text-slate-900 dark:text-white">${escapeHtml(n.title)}</h4>
              <div class="text-[11px] text-slate-500">
                ${n.subjectName ? `<span>📚 ${escapeHtml(n.subjectName)}</span>` : ''}
                ${n.teacherName ? ` • <span>👨‍🏫 ${escapeHtml(n.teacherName)}</span>` : ''}
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                ${escapeHtml(n.content)}
              </p>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button onclick="ResourcesPage.copyCode('${n.code}')" class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 active:scale-95 transition">
                <span>📋</span>
                <span>نسخ الكود</span>
              </button>
              ${n.pdfUrl ? `<a href="${encodeURI(n.pdfUrl)}" target="_blank" class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm">فتح الـ PDF 📄</a>` : ''}
            </div>
          </div>
        `;
      }).join('') + `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  // ===== 3. تبويب منصات المعلمين المخصصة (Custom Teacher Platforms) =====
  renderPlatformsTab(container) {
    const platforms = Store.getCustomPlatforms();

    let html = `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌐</span>
              <span>بوابة منصات المعلمين الذكية</span>
            </h3>
            <p class="text-xs text-slate-500">أضف رابط منصة مدرسك، والتطبيق يجلب لوجو المنصة وأيقونتها تلقائياً.</p>
          </div>
          <button onclick="ResourcesPage.openAddPlatformModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition">
            + إضافة منصة معلم جديدة
          </button>
        </div>
    `;

    if (!platforms.length) {
      html += `
        <div class="sh-card p-8 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">🎓</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تقم بإضافة أي منصات بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">اضغط على زر الإضافة واكتب رابط منصة أستاذك (مثل بسطتهالك، عبد المعبود...) لحفظها في شاشتك.</p>
        </div>
      `;
    } else {
      html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">` + platforms.map(p => {
        return `
          <div class="sh-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition">
            <div class="flex items-start gap-3.5">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                ${p.icon ? `<img src="${escapeHtml(p.icon)}" alt="${escapeHtml(p.name)}" class="w-full h-full object-contain rounded-xl" onerror="this.outerHTML='<span class=\\\'text-2xl\\\'>🎓</span>'"/>` : `<span class="text-2xl">🎓</span>`}
              </div>
              <div class="min-w-0 flex-1 space-y-0.5">
                <h4 class="font-black text-base text-slate-900 dark:text-white truncate">${escapeHtml(p.name)}</h4>
                ${p.teacherName ? `<div class="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">👨‍🏫 ${escapeHtml(p.teacherName)}</div>` : ''}
                ${p.notes ? `<p class="text-[11px] text-slate-400 line-clamp-1">${escapeHtml(p.notes)}</p>` : ''}
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button onclick="ResourcesPage.deletePlatform('${p.id}')" class="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-bold active:scale-95 transition" title="حذف">
                🗑️
              </button>

              <a href="${encodeURI(p.url)}" target="_blank" rel="noopener" class="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md text-center flex items-center justify-center gap-1.5 active:scale-95 transition">
                <span>فتح المنصة</span>
                <span>🚀</span>
              </a>
            </div>
          </div>
        `;
      }).join('') + `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  // ===== 4. تبويب المذكرات والمراجع الروابط السريعة (Links & PDFs) =====
  renderLinksTab(container) {
    const list = Store.state.resources || [];

    let html = `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔗</span>
              <span>المذكرات والمراجع المرفقة</span>
            </h3>
            <p class="text-xs text-slate-500">ملفات PDF، روابط درايف، وفيديوهات الشرح.</p>
          </div>
          <button onclick="ResourcesPage.openAddLinkModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition">
            + إضافة مرجع
          </button>
        </div>
    `;

    if (!list.length) {
      html += `
        <div class="sh-card p-8 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📁</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد مذكرات أو روابط مضافة</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">أضف روابط مذكرات الدروس وشروحات اليوتيوب وملفات الدرايف للوصول إليها بسرعة.</p>
        </div>
      `;
    } else {
      html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">` + list.map(r => {
        const sub = Store.subject(r.subjectId);
        const subName = sub ? sub.name : 'عام';

        return `
          <div class="sh-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 flex flex-col justify-between">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${subName}</span>
                <span>${r.type ? r.type.toUpperCase() : 'LINK'}</span>
              </div>
              <h4 class="font-black text-sm text-slate-900 dark:text-white">${escapeHtml(r.title)}</h4>
            </div>

            <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="ResourcesPage.deleteLink('${r.id}')" class="text-rose-500 text-xs font-bold px-2 py-1">حذف</button>
              <a href="${encodeURI(r.url)}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">فتح الرابط ➔</a>
            </div>
          </div>
        `;
      }).join('') + `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  // ===== Actions & Handlers =====
  submitQuickCode() {
    const input = document.getElementById('quick-code-input');
    if (!input || !input.value.trim()) return App.toast('يرجى كتابة الكود', 'warning');

    const res = Store.importSharedCode(input.value.trim());
    if (res.success) {
      input.value = '';
      if (res.type === 'stream') {
        this.switchTab('streams');
        App.toast(`🎉 انضممت بنجاح إلى باقة "${res.title}" (${res.count} حصص) وحصلت على +50 XP!`, 'success');
      } else {
        this.switchTab('notes');
        App.toast(`🎉 تم استيراد ملخص "${res.title}" بنجاح وحصلت على +30 XP!`, 'success');
      }
    } else {
      App.toast(res.error || 'كود غير صالح', 'danger');
    }
  },

  copyCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      App.toast(`تم نسخ الكود (${code}) للحافظة 📋 شاركه مع زملائك!`);
    } else {
      App.showModal(`<h3 class="font-black text-sm mb-2">كود المشاركة</h3><input type="text" readonly value="${code}" class="sh-input font-mono text-center text-lg"/>`);
    }
  },

  refreshStream(code) {
    App.toast('جاري فحص وتحديث الحصص الجديدة... 🔄');
    setTimeout(() => {
      App.toast('الباقة محدثة بأحدث الحصص والمذكرات ✨', 'success');
      this.renderActiveTab();
    }, 500);
  },

  deletePlatform(id) {
    App.confirm('حذف هذه المنصة؟', 'يمكنك إضافتها مجدداً في أي وقت.', () => {
      Store.deleteCustomPlatform(id);
      this.renderActiveTab();
      App.toast('تم حذف المنصة');
    }, true);
  },

  deleteLink(id) {
    App.confirm('حذف المرجع؟', '', () => {
      Store.remove('resources', id);
      this.renderActiveTab();
      App.toast('تم حذف المرجع');
    }, true);
  },

  // ===== Modals =====
  openAddPlatformModal() {
    document.getElementById('add-platform-modal').classList.remove('hidden');
  },

  closeAddPlatformModal() {
    document.getElementById('add-platform-modal').classList.add('hidden');
  },

  saveCustomPlatform() {
    const name = document.getElementById('plat-name-input').value.trim();
    const teacherName = document.getElementById('plat-teacher-input').value.trim();
    const url = document.getElementById('plat-url-input').value.trim();
    const notes = document.getElementById('plat-notes-input').value.trim();

    if (!url) return App.toast('يرجى وضع رابط المنصة', 'warning');

    Store.addCustomPlatform({ name, teacherName, url, notes });
    document.getElementById('plat-name-input').value = '';
    document.getElementById('plat-teacher-input').value = '';
    document.getElementById('plat-url-input').value = '';
    document.getElementById('plat-notes-input').value = '';
    this.closeAddPlatformModal();
    this.renderActiveTab();
    App.toast('تمت إضافة المنصة وحفظ لوجو الموقع بنجاح 🚀 (+25 XP)', 'success');
  },

  openCreateStreamModal() {
    document.getElementById('create-stream-modal').classList.remove('hidden');
  },

  closeCreateStreamModal() {
    document.getElementById('create-stream-modal').classList.add('hidden');
  },

  saveNewStream() {
    const title = document.getElementById('stream-title-input').value.trim();
    const subjectName = document.getElementById('stream-subject-input').value.trim();
    const teacherName = document.getElementById('stream-teacher-input').value.trim();
    const description = document.getElementById('stream-desc-input').value.trim();
    const firstLessonTitle = document.getElementById('stream-lesson1-title').value.trim();
    const firstLessonContent = document.getElementById('stream-lesson1-content').value.trim();
    const firstLessonPdf = document.getElementById('stream-lesson1-pdf').value.trim();

    if (!title || !firstLessonTitle) return App.toast('يرجى ملء عنوان الباقة وعنوان الحصة الأولى', 'warning');

    const stream = Store.createStream({
      title,
      subjectName,
      teacherName,
      description,
      firstLessonTitle,
      firstLessonContent,
      firstLessonPdf
    });

    this.closeCreateStreamModal();
    this.renderActiveTab();
    App.toast(`🎉 تم إنشاء الباقة بنجاح! كود المشاركة: ${stream.code}`, 'success');
  },

  openAddLessonModal(streamCode) {
    this._activeStreamCode = streamCode;
    document.getElementById('add-lesson-modal').classList.remove('hidden');
  },

  closeAddLessonModal() {
    document.getElementById('add-lesson-modal').classList.add('hidden');
  },

  saveNewLessonToStream() {
    const title = document.getElementById('new-lesson-title').value.trim();
    const content = document.getElementById('new-lesson-content').value.trim();
    const pdfUrl = document.getElementById('new-lesson-pdf').value.trim();

    if (!title) return App.toast('يرجى كتابة عنوان الحصة', 'warning');

    Store.addLessonToStream(this._activeStreamCode, { title, content, pdfUrl });
    document.getElementById('new-lesson-title').value = '';
    document.getElementById('new-lesson-content').value = '';
    document.getElementById('new-lesson-pdf').value = '';
    this.closeAddLessonModal();
    this.renderActiveTab();
    App.toast('تمت إضافة الحصة الجديدة بنجاح في الباقة ✨ (+30 XP)');
  },

  openCreateNoteModal() {
    document.getElementById('create-note-modal').classList.remove('hidden');
  },

  closeCreateNoteModal() {
    document.getElementById('create-note-modal').classList.add('hidden');
  },

  saveNewSingleNote() {
    const title = document.getElementById('note-title-input').value.trim();
    const subjectName = document.getElementById('note-subject-input').value.trim();
    const teacherName = document.getElementById('note-teacher-input').value.trim();
    const content = document.getElementById('note-content-input').value.trim();
    const pdfUrl = document.getElementById('note-pdf-input').value.trim();

    if (!title || !content) return App.toast('يرجى ملء عنوان الملخص والمحتوى', 'warning');

    const note = Store.createSingleNote({ title, subjectName, teacherName, content, pdfUrl });
    this.closeCreateNoteModal();
    this.renderActiveTab();
    App.toast(`🎉 تم نشر الملخص بنجاح! كود الحصة: ${note.code}`, 'success');
  },

  openAddLinkModal() {
    document.getElementById('add-link-modal').classList.remove('hidden');
  },

  closeAddLinkModal() {
    document.getElementById('add-link-modal').classList.add('hidden');
  },

  saveNewLink() {
    const title = document.getElementById('link-title-input').value.trim();
    const url = document.getElementById('link-url-input').value.trim();
    const type = document.getElementById('link-type-input').value;

    if (!title || !url) return App.toast('يرجى كتابة العنوان والرابط', 'warning');

    Store.add('resources', { title, url, type, subjectId: '' });
    this.closeAddLinkModal();
    this.renderActiveTab();
    App.toast('تمت إضافة المرجع بنجاح ✨');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ResourcesPage.init();
});