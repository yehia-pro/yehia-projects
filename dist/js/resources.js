// js/resources.js — مكتبة المذاكرة الذكية، قارئ الـ PDF المحلي، البطاقات التفاعلية، والمنصات
// متوافق مع: anthropics/skills@frontend-design & ceorkm/mobile-app-ui-design

const ResourcesPage = {
  currentTab: 'pdfs', // 'pdfs' | 'flashcards' | 'streams' | 'platforms'

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
      { id: 'pdfs', name: 'مذكراتي والـ PDF 📄', icon: '📑' },
      { id: 'flashcards', name: 'البطاقات الذكية 🎴', icon: '⚡' },
      { id: 'streams', name: 'الملخصات بالأكواد 🔄', icon: '📡' },
      { id: 'platforms', name: 'منصات المعلمين 🌐', icon: '🎓' }
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

    if (this.currentTab === 'pdfs') {
      this.renderPdfsTab(container);
    } else if (this.currentTab === 'flashcards') {
      this.renderFlashcardsTab(container);
    } else if (this.currentTab === 'streams') {
      this.renderStreamsTab(container);
    } else {
      this.renderPlatformsTab(container);
    }
  },

  // ===== 1. تبويب مذكرات الـ PDF وقارئ الكتب المحلي =====
  renderPdfsTab(container) {
    const pdfs = Store.state.localPdfs || [];

    let html = `
      <div class="space-y-5 animate-in fade-in duration-200">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">📑</span>
          <div>
            <strong>دليل مكتبة واستوديو الـ PDF المحلي:</strong>
            <span class="text-slate-500 dark:text-slate-400">ارفع مذكراتك وكتبك من هاتفك أو حاسوبك؛ تُخزن محلياً داخل جهازك (IndexedDB) بدون استهلاك لسيرفرات وبدون إنترنت مع حفظ موضع القراءة تلقائياً!</span>
          </div>
        </div>

        <!-- PDF Upload Hero Card -->
        <div class="sh-card p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/60 border-2 border-dashed border-indigo-500/40 text-center space-y-4 relative overflow-hidden">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-3xl shadow-inner">
            📄
          </div>
          <div class="space-y-1 max-w-md mx-auto">
            <h3 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">رافع ومكتبة مذكرات الـ PDF من جهازك</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              اختر أي ملخص أو مذكرة من هاتفك أو حاسوبك لتُحفظ محلياً وتتصفحها في أي وقت بدون إنترنت مع حفظ مواضع القراءة.
            </p>
          </div>

          <div class="pt-2 flex items-center justify-center gap-3">
            <label class="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs md:text-sm shadow-lg shadow-indigo-500/20 cursor-pointer active:scale-95 transition flex items-center gap-2">
              <span>+ رفع مذكرة من الجهاز (PDF)</span>
              <input type="file" accept="application/pdf" class="hidden" onchange="ResourcesPage.handlePdfSelect(event)">
            </label>
          </div>
        </div>

        <!-- PDF Books Grid -->
        <div class="flex items-center justify-between gap-3 pt-2">
          <h4 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>📚</span>
            <span>مذكراتي المحفوظة (${pdfs.length})</span>
          </h4>
        </div>
    `;

    if (!pdfs.length) {
      html += `
        <div class="sh-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📂</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لا توجد مذكرات PDF مرفوعة بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">ارفع أول مذكرة لك لتبدأ المذاكرة وتدوين الملاحظات وتحصل على +25 XP!</p>
        </div>
      `;
    } else {
      html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">`;
      pdfs.forEach(p => {
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition group">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="px-2.5 py-1 rounded-xl text-[10px] font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono">
                  ${p.subjectName || 'مذكرة دراسية'}
                </span>
                <span class="text-[10px] font-bold text-slate-400 font-mono">${p.sizeMB}</span>
              </div>
              <h4 class="font-black text-sm text-slate-900 dark:text-white line-clamp-2">${p.title}</h4>
              <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span>🔖 آخر موضع: صفحة <strong>${p.lastPageRead || 1}</strong></span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button onclick="PDFStudio.openReader('${p.id}')" class="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow active:scale-95 transition flex items-center justify-center gap-1.5">
                <span>📖 فتح وقراءة</span>
              </button>
              <button onclick="PDFStudio.deletePdf('${p.id}')" class="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition text-xs" title="حذف">
                🗑️
              </button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
  },

  async handlePdfSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const subjectName = prompt('اكتب اسم المادة (مثال: فيزياء، كيمياء، عربي):', 'عام') || 'عام';
    const title = prompt('اكتب عنوان المذكرة (مثال: ملخص الباب الأول):', file.name.replace(/\.pdf$/i, '')) || file.name;
    
    await PDFStudio.handleFileUpload(file, { subjectName, title });
    this.render();
  },

  // ===== 2. تبويب البطاقات الذكية والتكرار المتباعد =====
  renderFlashcardsTab(container) {
    const decks = Store.getFlashcardDecks();
    
    let html = `
      <div class="space-y-5 animate-in fade-in duration-200">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">🎴</span>
          <div>
            <strong>دليل البطاقات الذكية والتكرار المتباعد (Leitner System):</strong>
            <span class="text-slate-500 dark:text-slate-400">طريقة علمية مجربة لمراجعة المصطلحات والقوانين؛ اضغط على البطاقة لقلبها واختبر حفظك لنقل البطاقة للذاكرة طويلة المدى.</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎴</span>
              <span>المجموعات الدراسية والتكرار المتباعد</span>
            </h3>
            <p class="text-xs text-slate-500">اختر المجموعة وابدأ المراجعة الذكية.</p>
          </div>
          <button onclick="ResourcesPage.openCreateDeckModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow active:scale-95 transition">
            + إنشاء مجموعة بطاقات
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Decks Sidebar -->
          <div class="space-y-2.5">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider">المجموعات الدراسية</h4>
            <div class="space-y-2 max-h-[450px] overflow-y-auto pr-1">
    `;

    if (!decks.length) {
      html += `<div class="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-400">لا توجد مجموعات بطاقات</div>`;
    } else {
      decks.forEach((d, idx) => {
        const count = (d.cards || []).length;
        const mastered = (d.cards || []).filter(c => c.box === 3).length;
        html += `
          <div onclick="ResourcesPage.selectFlashcardDeck('${d.id}')" id="deck-card-${d.id}" class="sh-card p-3.5 rounded-2xl cursor-pointer transition border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 flex items-center justify-between">
            <div class="space-y-0.5">
              <h5 class="font-black text-xs text-slate-900 dark:text-white">${d.name}</h5>
              <span class="text-[10px] text-slate-400">${count} بطاقة • ${mastered} متقنة</span>
            </div>
            <span class="text-xs font-bold text-indigo-400">➔</span>
          </div>
        `;
      });
    }

    html += `
            </div>
          </div>

          <!-- Active Deck Interactive Study Box -->
          <div class="md:col-span-2 space-y-4">
            <div id="flashcard-study-box" class="sh-card p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 min-h-[300px] flex flex-col items-center justify-center text-center space-y-5">
              <!-- Rendered via Flashcards engine -->
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (decks.length > 0) {
      this.selectFlashcardDeck(decks[0].id);
    }
  },

  selectFlashcardDeck(deckId) {
    this._currentDeckId = deckId;
    this._currentCardIndex = 0;
    this._isCardFlipped = false;
    this.renderActiveFlashcard();
  },

  renderActiveFlashcard() {
    const box = document.getElementById('flashcard-study-box');
    if (!box) return;

    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === this._currentDeckId) || decks[0];
    if (!deck || !deck.cards || !deck.cards.length) {
      box.innerHTML = `
        <span class="text-4xl">🎴</span>
        <h4 class="font-black text-sm text-slate-800 dark:text-white">هذه المجموعة فارغة</h4>
        <button onclick="ResourcesPage.openAddCardModal('${deck?.id}')" class="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">+ إضافة بطاقة سؤال وجواب</button>
      `;
      return;
    }

    const card = deck.cards[this._currentCardIndex % deck.cards.length];
    const total = deck.cards.length;
    const currentNum = (this._currentCardIndex % total) + 1;

    box.innerHTML = `
      <div class="w-full flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-slate-100 dark:border-slate-800">
        <span class="font-bold text-indigo-400">${deck.name}</span>
        <span>بطاقة ${currentNum} من ${total}</span>
      </div>

      <!-- Flip 3D Interactive Card -->
      <div onclick="ResourcesPage.flipFlashcard()" class="w-full p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-2 border-indigo-500/30 cursor-pointer select-none transition-all duration-300 transform active:scale-95 space-y-3 min-h-[160px] flex flex-col items-center justify-center">
        <span class="text-xs font-black px-2.5 py-1 rounded-full ${this._isCardFlipped ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}">
          ${this._isCardFlipped ? 'الإجابة / المفهوم 💡' : 'السؤال / المصطلح (اضغط للقلب) 🔄'}
        </span>
        <p class="text-base md:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
          ${this._isCardFlipped ? (card.back || card.answer) : (card.front || card.question)}
        </p>
      </div>

      <!-- Rating / Next Controls -->
      <div class="flex items-center gap-2 pt-2">
        <button onclick="ResourcesPage.rateFlashcard(1)" class="px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold transition">
          ❌ صعب
        </button>
        <button onclick="ResourcesPage.rateFlashcard(2)" class="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-bold transition">
          ⚡ متوسط
        </button>
        <button onclick="ResourcesPage.rateFlashcard(3)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow transition">
          ✅ متقن (+10 XP)
        </button>
        <button onclick="ResourcesPage.nextFlashcard()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition">
          التالي ➔
        </button>
      </div>
    `;
  },

  flipFlashcard() {
    this._isCardFlipped = !this._isCardFlipped;
    this.renderActiveFlashcard();
  },

  nextFlashcard() {
    this._currentCardIndex++;
    this._isCardFlipped = false;
    this.renderActiveFlashcard();
  },

  rateFlashcard(rating) {
    if (rating === 3) Store.addXP(10, 'إتقان بطاقة تعليمية');
    this.nextFlashcard();
  },

  // ===== 3. تبويب الملخصات والأكواد المتجددة =====
  renderStreamsTab(container) {
    const streams = Store.getSharedStreams();
    const notes = Store.getSharedNotes();

    let html = `
      <div class="space-y-6 animate-in fade-in duration-200">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">📡</span>
          <div>
            <strong>دليل باقات الأكواد التشاركية:</strong>
            <span class="text-slate-500 dark:text-slate-400">شارك ملخصاتك مع زملائك بتوليد كود فوري (NOTE- أو CHAN-)، أو ادخل كود أستاذك لمتابعة دروسه وتحديثاته تلقائياً!</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>📡</span>
              <span>الملخصات وباقات الأكواد المتجددة</span>
            </h3>
            <p class="text-xs text-slate-500">شارك تجميعة حصصك بكود فوري أو تابع باقات أستاذك.</p>
          </div>
          <div class="flex gap-2">
            <button onclick="ResourcesPage.openCreateNoteModal()" class="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition">
              + حصة فردية
            </button>
            <button onclick="ResourcesPage.openCreateStreamModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow transition">
              + إنشاء باقة متجددة
            </button>
          </div>
        </div>

        <!-- Streams List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    if (!streams.length && !notes.length) {
      html += `
        <div class="col-span-full sh-card p-8 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">📡</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تنضم لأي باقة أو تشارك ملخصاً بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">انقر بالأعلى لإنشاء كود ملخصك ومشاركته مع زملائك!</p>
        </div>
      `;
    } else {
      streams.forEach(s => {
        const count = (s.lessons || []).length;
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-2">
              <span class="px-2.5 py-1 rounded-xl text-[10px] font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono">
                ${s.code}
              </span>
              <span class="text-[10px] font-bold text-slate-400">${count} حصص</span>
            </div>
            <h4 class="font-black text-sm text-slate-900 dark:text-white">${s.title}</h4>
            <p class="text-xs text-slate-500 line-clamp-2">${s.description || 'باقة حصص متجددة'}</p>
            <div class="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onclick="ResourcesPage.openStreamLessonsModal('${s.id}')" class="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition">
                عرض الحصص (${count})
              </button>
              <button onclick="ResourcesPage.shareStreamCode('${s.code}')" class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition">
                مشاركة 🔗
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  },

  // ===== 4. تبويب منصات المعلمين الذكية =====
  renderPlatformsTab(container) {
    const platforms = Store.getCustomPlatforms();

    let html = `
      <div class="space-y-5 animate-in fade-in duration-200">
        <!-- Guided Explanation Note -->
        <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
          <span class="text-lg shrink-0">🌐</span>
          <div>
            <strong>دليل منصات المعلمين المباشرة:</strong>
            <span class="text-slate-500 dark:text-slate-400">احفظ روابط منصات المعلمين التعليمية التي تدرس عليها (مثل بسطتهالك، منصة الأستاذ...) ليجلب التطبيق اللوجو التلقائي وتفتحها بنقرة واحدة.</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌐</span>
              <span>بوابة منصات المعلمين المباشرة</span>
            </h3>
            <p class="text-xs text-slate-500">احفظ روابط منصات أساتذتك مع جلب اللوجو التلقائي للوصول السريع.</p>
          </div>
          <button onclick="ResourcesPage.openAddPlatformModal()" class="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow active:scale-95 transition">
            + إضافة منصة أستاذ
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    if (!platforms.length) {
      html += `
        <div class="col-span-full sh-card p-8 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <span class="text-4xl block">🎓</span>
          <h4 class="font-black text-sm text-slate-800 dark:text-white">لم تضف أي منصات معلمين بعد</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">أضف منصة أستاذك (مثل بسطتهالك، عبد المعبود...) لتفتحها بنقرة واحدة!</p>
        </div>
      `;
    } else {
      platforms.forEach(p => {
        const title = escapeHtml(p.name || p.title || 'منصة تعليمية');
        const icon = p.icon || p.iconUrl || 'icon.svg';
        const teacher = escapeHtml(p.teacherName || 'أستاذ المادة');
        html += `
          <div class="sh-card p-5 rounded-3xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-500/40 transition">
            <div class="flex items-center gap-3 min-w-0">
              <img src="${icon}" alt="${title}" class="w-10 h-10 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 p-1 shrink-0" onerror="this.src='icon.svg'">
              <div class="min-w-0">
                <h4 class="font-black text-sm text-slate-900 dark:text-white truncate">${title}</h4>
                <span class="text-[10px] text-slate-400 block truncate">${teacher}</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <a href="${p.url}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition">
                فتح ➔
              </a>
              <button onclick="ResourcesPage.deletePlatform('${p.id}')" class="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg text-xs" title="حذف">
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

  // Helpers
  render() {
    this.renderTabs();
    this.renderActiveTab();
  },

  openAddPlatformModal() {
    const title = prompt('اكتب اسم المنصة (مثال: منصة بسطتهالك):');
    if (!title) return;
    const url = prompt('الصق رابط المنصة الإلكترونية (URL):');
    if (!url) return;
    const teacherName = prompt('اسم الأستاذ:', '') || '';

    Store.addCustomPlatform({ title, url, teacherName });
    if (typeof App !== 'undefined' && App.toast) App.toast('تمت إضافة المنصة بنجاح! 🎉', 'success');
    this.render();
  },

  deletePlatform(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المنصة؟')) return;
    Store.deleteCustomPlatform(id);
    this.render();
  },

  openCreateStreamModal() {
    const title = prompt('اكتب اسم الباقة المتجددة (مثال: باقة فيزياء 3 ثانوي 2026):');
    if (!title) return;
    const description = prompt('وصف مختصر للباقة:') || '';
    const st = Store.createSharedStream({ title, description });
    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`تم إنشاء الباقة بنجاح! كود المشاركة: ${st.code} 📡`, 'success');
    }
    this.render();
  },

  openCreateNoteModal() {
    const title = prompt('اكتب عنوان الحصة أو الملخص:');
    if (!title) return;
    const note = Store.createSharedNote({ title });
    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`تم إنشاء كود الحصة: ${note.code} (+30 XP) 📑`, 'success');
    }
    this.render();
  },

  shareStreamCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      if (typeof App !== 'undefined' && App.toast) App.toast(`تم نسخ الكود ${code} للحافظة! 📋`, 'success');
    }
  },

  openCreateDeckModal() {
    const name = prompt('اكتب اسم مجموعة البطاقات (مثال: قوانين الفيزياء - الباب الأول):');
    if (!name) return;
    const st = Store.state;
    if (!st.flashcards) st.flashcards = { decks: [] };
    const id = 'deck_' + Date.now();
    st.flashcards.decks.unshift({ id, name, cards: [] });
    Store.addXP(20, 'إنشاء مجموعة بطاقات جديدة');
    Store.save();
    this.render();
  },

  openAddCardModal(deckId) {
    const question = prompt('اكتب السؤال أو المصطلح (الوجه الأمامي للبطاقة):');
    if (!question) return;
    const answer = prompt('اكتب الإجابة أو المفهوم (الوجه الخلفي للبطاقة):');
    if (!answer) return;

    const decks = Store.getFlashcardDecks();
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      if (!deck.cards) deck.cards = [];
      deck.cards.push({ id: 'c_' + Date.now(), question, answer, box: 1 });
      Store.addXP(15, 'إضافة بطاقة جديدة');
      Store.save();
      this.render();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ResourcesPage.init();
});