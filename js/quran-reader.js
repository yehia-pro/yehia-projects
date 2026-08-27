/**
 * Student Hub - مصحف المدينة النبوية المتجه عالي النقاء (SVG Vector Madinah Mushaf)
 * مجمع الملك فهد لطباعة المصحف الشريف — بدقة متناهية لا تتبكسل مع التفسير والتلاوة الصوتية عند الطلب
 */

const QuranReader = {
  _currentPage: 1,
  _totalPages: 604,
  _reciter: 'ar.alafasy', // 'ar.alafasy' | 'ar.husary' | 'ar.abdulbasit' | 'ar.minshawi' | 'ar.maher'
  _currentAudio: null,
  _isPlayingAudio: false,

  // قائمة السور وأرقام صفحات بداياتها في مصحف المدينة النبوية (114 سورة)
  SURAHS: [
    { num: 1, name: 'الفاتحة', startPage: 1, ayahs: 7, type: 'مكية' },
    { num: 2, name: 'البقرة', startPage: 2, ayahs: 286, type: 'مدنية' },
    { num: 3, name: 'آل عمران', startPage: 50, ayahs: 200, type: 'مدنية' },
    { num: 4, name: 'النساء', startPage: 77, ayahs: 176, type: 'مدنية' },
    { num: 5, name: 'المائدة', startPage: 106, ayahs: 120, type: 'مدنية' },
    { num: 6, name: 'الأنعام', startPage: 128, ayahs: 165, type: 'مكية' },
    { num: 7, name: 'الأعراف', startPage: 151, ayahs: 206, type: 'مكية' },
    { num: 8, name: 'الأنفال', startPage: 177, ayahs: 75, type: 'مدنية' },
    { num: 9, name: 'التوبة', startPage: 187, ayahs: 129, type: 'مدنية' },
    { num: 10, name: 'يونس', startPage: 208, ayahs: 109, type: 'مكية' },
    { num: 11, name: 'هود', startPage: 221, ayahs: 123, type: 'مكية' },
    { num: 12, name: 'يوسف', startPage: 235, ayahs: 111, type: 'مكية' },
    { num: 13, name: 'الرعد', startPage: 249, ayahs: 43, type: 'مدنية' },
    { num: 14, name: 'إبراهيم', startPage: 255, ayahs: 52, type: 'مكية' },
    { num: 15, name: 'الحجر', startPage: 262, ayahs: 99, type: 'مكية' },
    { num: 16, name: 'النحل', startPage: 267, ayahs: 128, type: 'مكية' },
    { num: 17, name: 'الإسراء', startPage: 282, ayahs: 111, type: 'مكية' },
    { num: 18, name: 'الكهف', startPage: 293, ayahs: 110, type: 'مكية' },
    { num: 19, name: 'مريم', startPage: 305, ayahs: 98, type: 'مكية' },
    { num: 20, name: 'طه', startPage: 312, ayahs: 135, type: 'مكية' },
    { num: 21, name: 'الأنبياء', startPage: 322, ayahs: 112, type: 'مكية' },
    { num: 22, name: 'الحج', startPage: 332, ayahs: 78, type: 'مدنية' },
    { num: 23, name: 'المؤمنون', startPage: 342, ayahs: 118, type: 'مكية' },
    { num: 24, name: 'النور', startPage: 350, ayahs: 64, type: 'مدنية' },
    { num: 25, name: 'الفرقان', startPage: 359, ayahs: 77, type: 'مكية' },
    { num: 26, name: 'الشعراء', startPage: 367, ayahs: 227, type: 'مكية' },
    { num: 27, name: 'النمل', startPage: 377, ayahs: 93, type: 'مكية' },
    { num: 28, name: 'القصص', startPage: 385, ayahs: 88, type: 'مكية' },
    { num: 29, name: 'العنكبوت', startPage: 396, ayahs: 69, type: 'مكية' },
    { num: 30, name: 'الروم', startPage: 404, ayahs: 60, type: 'مكية' },
    { num: 31, name: 'لقمان', startPage: 411, ayahs: 34, type: 'مكية' },
    { num: 32, name: 'السجدة', startPage: 415, ayahs: 30, type: 'مكية' },
    { num: 33, name: 'الأحزاب', startPage: 418, ayahs: 73, type: 'مدنية' },
    { num: 34, name: 'سبأ', startPage: 428, ayahs: 54, type: 'مكية' },
    { num: 35, name: 'فاطر', startPage: 434, ayahs: 45, type: 'مكية' },
    { num: 36, name: 'يس', startPage: 440, ayahs: 83, type: 'مكية' },
    { num: 37, name: 'الصافات', startPage: 446, ayahs: 182, type: 'مكية' },
    { num: 38, name: 'ص', startPage: 453, ayahs: 88, type: 'مكية' },
    { num: 39, name: 'الزمر', startPage: 458, ayahs: 75, type: 'مكية' },
    { num: 40, name: 'غافر', startPage: 467, ayahs: 85, type: 'مكية' },
    { num: 41, name: 'فصلت', startPage: 477, ayahs: 54, type: 'مكية' },
    { num: 42, name: 'الشورى', startPage: 483, ayahs: 53, type: 'مكية' },
    { num: 43, name: 'الزخرف', startPage: 489, ayahs: 89, type: 'مكية' },
    { num: 44, name: 'الدخان', startPage: 496, ayahs: 59, type: 'مكية' },
    { num: 45, name: 'الجاثية', startPage: 499, ayahs: 37, type: 'مكية' },
    { num: 46, name: 'الأحقاف', startPage: 502, ayahs: 35, type: 'مكية' },
    { num: 47, name: 'محمد', startPage: 507, ayahs: 38, type: 'مدنية' },
    { num: 48, name: 'الفتح', startPage: 511, ayahs: 29, type: 'مدنية' },
    { num: 49, name: 'الحجرات', startPage: 515, ayahs: 18, type: 'مدنية' },
    { num: 50, name: 'ق', startPage: 518, ayahs: 45, type: 'مكية' },
    { num: 51, name: 'الذاريات', startPage: 520, ayahs: 60, type: 'مكية' },
    { num: 52, name: 'الطور', startPage: 523, ayahs: 49, type: 'مكية' },
    { num: 53, name: 'النجم', startPage: 526, ayahs: 62, type: 'مكية' },
    { num: 54, name: 'القمر', startPage: 528, ayahs: 55, type: 'مكية' },
    { num: 55, name: 'الرحمن', startPage: 531, ayahs: 78, type: 'مدنية' },
    { num: 56, name: 'الواقعة', startPage: 534, ayahs: 96, type: 'مكية' },
    { num: 57, name: 'الحديد', startPage: 537, ayahs: 29, type: 'مدنية' },
    { num: 58, name: 'المجادلة', startPage: 542, ayahs: 22, type: 'مدنية' },
    { num: 59, name: 'الحشر', startPage: 545, ayahs: 24, type: 'مدنية' },
    { num: 60, name: 'الممتحنة', startPage: 549, ayahs: 13, type: 'مدنية' },
    { num: 61, name: 'الصف', startPage: 551, ayahs: 14, type: 'مدنية' },
    { num: 62, name: 'الجمعة', startPage: 553, ayahs: 11, type: 'مدنية' },
    { num: 63, name: 'المنافقون', startPage: 554, ayahs: 11, type: 'مدنية' },
    { num: 64, name: 'التغابن', startPage: 556, ayahs: 18, type: 'مدنية' },
    { num: 65, name: 'الطلاق', startPage: 558, ayahs: 12, type: 'مدنية' },
    { num: 66, name: 'التحريم', startPage: 560, ayahs: 12, type: 'مدنية' },
    { num: 67, name: 'الملك', startPage: 562, ayahs: 30, type: 'مكية' },
    { num: 68, name: 'القلم', startPage: 564, ayahs: 52, type: 'مكية' },
    { num: 69, name: 'الحاقة', startPage: 566, ayahs: 52, type: 'مكية' },
    { num: 70, name: 'المعارج', startPage: 568, ayahs: 44, type: 'مكية' },
    { num: 71, name: 'نوح', startPage: 570, ayahs: 28, type: 'مكية' },
    { num: 72, name: 'الجن', startPage: 572, ayahs: 28, type: 'مكية' },
    { num: 73, name: 'المزمل', startPage: 574, ayahs: 20, type: 'مكية' },
    { num: 74, name: 'المدثر', startPage: 575, ayahs: 56, type: 'مكية' },
    { num: 75, name: 'القيامة', startPage: 577, ayahs: 40, type: 'مكية' },
    { num: 76, name: 'الإنسان', startPage: 578, ayahs: 31, type: 'مدنية' },
    { num: 77, name: 'المرسلات', startPage: 580, ayahs: 50, type: 'مكية' },
    { num: 78, name: 'النبأ', startPage: 582, ayahs: 40, type: 'مكية' },
    { num: 79, name: 'النازعات', startPage: 583, ayahs: 46, type: 'مكية' },
    { num: 80, name: 'عبس', startPage: 585, ayahs: 42, type: 'مكية' },
    { num: 81, name: 'التكوير', startPage: 586, ayahs: 29, type: 'مكية' },
    { num: 82, name: 'الانفطار', startPage: 587, ayahs: 19, type: 'مكية' },
    { num: 83, name: 'المطففين', startPage: 587, ayahs: 36, type: 'مكية' },
    { num: 84, name: 'الانشقاق', startPage: 589, ayahs: 25, type: 'مكية' },
    { num: 85, name: 'البروج', startPage: 590, ayahs: 22, type: 'مكية' },
    { num: 86, name: 'الطارق', startPage: 591, ayahs: 17, type: 'مكية' },
    { num: 87, name: 'الأعلى', startPage: 591, ayahs: 19, type: 'مكية' },
    { num: 88, name: 'الغاشية', startPage: 592, ayahs: 26, type: 'مكية' },
    { num: 89, name: 'الفجر', startPage: 593, ayahs: 30, type: 'مكية' },
    { num: 90, name: 'البلد', startPage: 594, ayahs: 20, type: 'مكية' },
    { num: 91, name: 'الشمس', startPage: 595, ayahs: 15, type: 'مكية' },
    { num: 92, name: 'الليل', startPage: 595, ayahs: 21, type: 'مكية' },
    { num: 93, name: 'الضحى', startPage: 596, ayahs: 11, type: 'مكية' },
    { num: 94, name: 'الشرح', startPage: 596, ayahs: 8, type: 'مكية' },
    { num: 95, name: 'التين', startPage: 597, ayahs: 8, type: 'مكية' },
    { num: 96, name: 'العلق', startPage: 597, ayahs: 19, type: 'مكية' },
    { num: 97, name: 'القدر', startPage: 598, ayahs: 5, type: 'مكية' },
    { num: 98, name: 'البينة', startPage: 598, ayahs: 8, type: 'مدنية' },
    { num: 99, name: 'الزلزلة', startPage: 599, ayahs: 8, type: 'مدنية' },
    { num: 100, name: 'العاديات', startPage: 599, ayahs: 11, type: 'مكية' },
    { num: 101, name: 'القارعة', startPage: 600, ayahs: 11, type: 'مكية' },
    { num: 102, name: 'التكاثر', startPage: 600, ayahs: 8, type: 'مكية' },
    { num: 103, name: 'العصر', startPage: 601, ayahs: 3, type: 'مكية' },
    { num: 104, name: 'الهمزة', startPage: 601, ayahs: 9, type: 'مكية' },
    { num: 105, name: 'الفيل', startPage: 601, ayahs: 5, type: 'مكية' },
    { num: 106, name: 'قريش', startPage: 602, ayahs: 4, type: 'مكية' },
    { num: 107, name: 'الماعون', startPage: 602, ayahs: 7, type: 'مكية' },
    { num: 108, name: 'الكوثر', startPage: 602, ayahs: 3, type: 'مكية' },
    { num: 109, name: 'الكافرون', startPage: 603, ayahs: 6, type: 'مكية' },
    { num: 110, name: 'النصر', startPage: 603, ayahs: 3, type: 'مدنية' },
    { num: 111, name: 'المسد', startPage: 603, ayahs: 5, type: 'مكية' },
    { num: 112, name: 'الإخلاص', startPage: 604, ayahs: 4, type: 'مكية' },
    { num: 113, name: 'الفلق', startPage: 604, ayahs: 5, type: 'مكية' },
    { num: 114, name: 'الناس', startPage: 604, ayahs: 6, type: 'مكية' }
  ],

  // الأجزاء الثلاثون وأرقام صفحاتها
  JUZ_PAGES: [
    { num: 1, name: 'الجزء الأول (الم)', startPage: 1 },
    { num: 2, name: 'الجزء الثاني (سيقول)', startPage: 22 },
    { num: 3, name: 'الجزء الثالث (تلك الرسل)', startPage: 42 },
    { num: 4, name: 'الجزء الرابع (لن تنالوا)', startPage: 62 },
    { num: 5, name: 'الجزء الخامس (والمحصنات)', startPage: 82 },
    { num: 6, name: 'الجزء السادس (لا يحب الله)', startPage: 102 },
    { num: 7, name: 'الجزء السابع (وإذا سمعوا)', startPage: 122 },
    { num: 8, name: 'الجزء الثامن (ولو أننا)', startPage: 142 },
    { num: 9, name: 'الجزء التاسع (قال الملأ)', startPage: 162 },
    { num: 10, name: 'الجزء العاشر (واعلموا)', startPage: 182 },
    { num: 11, name: 'الجزء الحادي عشر (يعتذرون)', startPage: 202 },
    { num: 12, name: 'الجزء الثاني عشر (وما من دابة)', startPage: 222 },
    { num: 13, name: 'الجزء الثالث عشر (وما أبرئ)', startPage: 242 },
    { num: 14, name: 'الجزء الرابع عشر (ربما)', startPage: 262 },
    { num: 15, name: 'الجزء الخامس عشر (سبحان)', startPage: 282 },
    { num: 16, name: 'الجزء السادس عشر (قال ألم)', startPage: 302 },
    { num: 17, name: 'الجزء السابع عشر (اقترب)', startPage: 322 },
    { num: 18, name: 'الجزء الثامن عشر (قد أفلح)', startPage: 342 },
    { num: 19, name: 'الجزء التاسع عشر (وقال الذين)', startPage: 362 },
    { num: 20, name: 'الجزء العشرون (فما كان)', startPage: 382 },
    { num: 21, name: 'الجزء الحادي والعشرون (اتل ما أوحي)', startPage: 402 },
    { num: 22, name: 'الجزء الثاني والعشرون (ومن يقنت)', startPage: 422 },
    { num: 23, name: 'الجزء الثالث والعشرون (وما أنزلنا)', startPage: 442 },
    { num: 24, name: 'الجزء الرابع والعشرون (فمن أظلم)', startPage: 462 },
    { num: 25, name: 'الجزء الخامس والعشرون (إليه يرد)', startPage: 482 },
    { num: 26, name: 'الجزء السادس والعشرون (حم)', startPage: 502 },
    { num: 27, name: 'الجزء السابع والعشرون (قال فما خطبكم)', startPage: 522 },
    { num: 28, name: 'الجزء الثامن والعشرون (قد سمع)', startPage: 542 },
    { num: 29, name: 'الجزء التاسع والعشرون (تبارك)', startPage: 562 },
    { num: 30, name: 'الجزء الثلاثون (عمّ)', startPage: 582 }
  ],

  // الشيوخ القراء للتلاوة عند الطلب
  RECITERS: [
    { id: 'ar.alafasy', name: 'الشيخ مشاري راشد العفاسي 🇰🇼', cdnCode: 'Alafasy_128kbps' },
    { id: 'ar.husary', name: 'الشيخ محمود خليل الحصري (المصحف المرتل) 🇪🇬', cdnCode: 'Husary_128kbps' },
    { id: 'ar.abdulbasit', name: 'الشيخ عبد الباسط عبد الصمد (المرتل) 🇪🇬', cdnCode: 'Abdul_Basit_Murattal_192kbps' },
    { id: 'ar.minshawi', name: 'الشيخ محمد صديق المنشاوي (المرتل) 🇪🇬', cdnCode: 'Minshawy_Murattal_128kbps' },
    { id: 'ar.maher', name: 'الشيخ ماهر المعيقلي (إمام الحرم المكي) 🇸🇦', cdnCode: 'Maher_AlMuaiqly_64kbps' }
  ],

  getPageSvgUrl(page) {
    // سيرفر الـ SVG المتجه الرسمي عالي النقاء
    return `https://www.mp3quran.net/api/quran_pages_svg/${page}.svg`;
  },

  getPagePngFallback(page) {
    return `https://quran.ksu.edu.sa/ayat/safahat1/${page}.png`;
  },

  getPageMeta(page) {
    let curSurah = this.SURAHS[0];
    for (let i = 0; i < this.SURAHS.length; i++) {
      if (this.SURAHS[i].startPage <= page) {
        curSurah = this.SURAHS[i];
      } else {
        break;
      }
    }

    let curJuz = this.JUZ_PAGES[0];
    for (let j = 0; j < this.JUZ_PAGES.length; j++) {
      if (this.JUZ_PAGES[j].startPage <= page) {
        curJuz = this.JUZ_PAGES[j];
      } else {
        break;
      }
    }

    return {
      surah: curSurah,
      juz: curJuz,
      page
    };
  },

  init(containerId = 'quran-reader-container') {
    const bm = Store.state.quranBookmark;
    if (bm && bm.page && bm.page >= 1 && bm.page <= 604) {
      this._currentPage = bm.page;
    } else {
      this._currentPage = 1;
    }

    this.render(containerId);
    this.attachKeyListeners();
  },

  render(containerId = 'quran-reader-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const page = this._currentPage;
    const meta = this.getPageMeta(page);
    const bm = Store.state.quranBookmark;
    const isBookmarkedHere = bm && bm.page === page;

    container.innerHTML = `
      <div class="space-y-4 animate-in fade-in duration-200 select-none">
        
        <!-- Official Reassurance & Vector Quality Banner -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">✨</span>
            <div>
              <strong class="text-emerald-700 dark:text-emerald-300 block">مصحف المدينة النبوية المتجه (Vector SVG) — بدون بكسلة</strong>
              <span class="text-[11px] text-slate-500 dark:text-slate-400">صفحات مجمع الملك فهد الأصلية عالية الوضوح مع التفسير الميسر والتلاوة الصوتية عند الطلب.</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="QuranReader.openTafsirModal()" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow active:scale-95 transition flex items-center gap-1">
              <span>📖</span>
              <span>التفسير الميسر</span>
            </button>
            <button onclick="QuranReader.openAudioModal()" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow active:scale-95 transition flex items-center gap-1">
              <span>🔊</span>
              <span>الاستماع للتلاوة</span>
            </button>
          </div>
        </div>

        <!-- Top Navigation & Jump Toolbar -->
        <div class="sh-card p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          <!-- Surah & Juz Pickers -->
          <div class="flex items-center gap-2">
            <button onclick="QuranReader.openSurahsModal()" class="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5 active:scale-95 transition">
              <span>📖</span>
              <span>سورة ${meta.surah.name}</span>
              <span class="text-[10px] text-slate-400">▼</span>
            </button>

            <button onclick="QuranReader.openJuzModal()" class="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 active:scale-95 transition">
              <span>${meta.juz.name}</span>
              <span class="text-[10px] text-slate-400">▼</span>
            </button>
          </div>

          <!-- Page Quick Input & Bookmark Action -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl">
              <span class="text-[11px] font-bold text-slate-400">ص</span>
              <input type="number" min="1" max="604" value="${page}" onchange="QuranReader.goToPage(parseInt(this.value))" class="w-12 bg-transparent text-center font-mono font-black text-xs text-slate-900 dark:text-white outline-none">
              <span class="text-[11px] font-bold text-slate-400">/ 604</span>
            </div>

            <button onclick="QuranReader.setBookmarkHere()" class="px-3.5 py-2 rounded-2xl ${isBookmarkedHere ? 'bg-amber-500 text-white shadow-md' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} text-xs font-black active:scale-95 transition flex items-center gap-1.5">
              <span>${isBookmarkedHere ? '📌 محفوظ هنا' : '🔖 حفظ الفاصل'}</span>
            </button>
          </div>
        </div>

        <!-- Authentic Vector Mushaf Frame -->
        <div class="sh-card p-2 md:p-6 rounded-3xl bg-[#fbf9f4] dark:bg-[#0c121e] border-2 border-amber-500/30 shadow-2xl relative flex flex-col items-center justify-center min-h-[520px] overflow-hidden">
          
          <!-- Loading Spinner -->
          <div id="quran-page-loader" class="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 hidden">
            <div class="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin"></div>
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">جاري فتح صفحة المصحف المتجهة (SVG)...</span>
          </div>

          <!-- Crisp Vector SVG Container -->
          <div class="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-amber-900/10 dark:border-amber-500/20 bg-white p-1">
            <img 
              id="quran-mushaf-img" 
              src="${this.getPageSvgUrl(page)}" 
              alt="مصحف المدينة صفحة ${page}" 
              class="w-full h-auto object-contain mx-auto block transition-opacity duration-300 filter contrast-[1.03]"
              onload="QuranReader.onImageLoaded()"
              onerror="this.src=QuranReader.getPagePngFallback(${page}); QuranReader.onImageLoaded();"
            >
          </div>

          <!-- Page Bottom Meta -->
          <div class="w-full max-w-2xl flex items-center justify-between text-xs font-bold text-amber-900/80 dark:text-amber-300/90 pt-3 px-2 font-mono">
            <span>سورة ${meta.surah.name}</span>
            <span class="text-sm font-black text-slate-900 dark:text-white bg-amber-500/20 px-3.5 py-0.5 rounded-full">صفحة ${page}</span>
            <span>${meta.juz.name}</span>
          </div>

        </div>

        <!-- Bottom Page Flipping Controls -->
        <div class="flex items-center justify-between gap-3 pt-1">
          <!-- In Arabic Quran: Next page is on the LEFT (←) and Prev is on the RIGHT (→) -->
          <button onclick="QuranReader.nextPage()" ${page >= 604 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="active:scale-95 transition"'} class="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs md:text-sm shadow-md flex items-center justify-center gap-2">
            <span>←</span>
            <span>الصفحة التالية (ص ${Math.min(604, page + 1)})</span>
          </button>

          <button onclick="QuranReader.openBookmark()" class="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-black text-xs active:scale-95 transition" title="الانتقال لعلامة التوقف المحفوظة">
            📌 فاصلي
          </button>

          <button onclick="QuranReader.prevPage()" ${page <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="active:scale-95 transition"'} class="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs md:text-sm shadow-md flex items-center justify-center gap-2">
            <span>الصفحة السابقة (ص ${Math.max(1, page - 1)})</span>
            <span>→</span>
          </button>
        </div>

      </div>

      <!-- Modal: Tafsir Muyassar (التفسير الميسر المعتمد) -->
      <div id="quran-tafsir-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div class="space-y-0.5">
              <h3 class="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>📖</span>
                <span>التفسير الميسر — سورة ${meta.surah.name} (صفحة ${page})</span>
              </h3>
              <p class="text-[11px] text-slate-400">معتمد من مجمع الملك فهد لطباعة المصحف الشريف</p>
            </div>
            <button onclick="QuranReader.closeTafsirModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">✕</button>
          </div>
          <div class="overflow-y-auto space-y-3 flex-1 pr-1 text-xs leading-relaxed text-slate-800 dark:text-slate-100" id="quran-tafsir-content">
            <div class="p-6 text-center text-slate-400 space-y-2">
              <div class="w-8 h-8 mx-auto rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
              <p>جاري جلب التفسير الميسر للآيات...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Audio Recitation Streamer (الاستماع للتلاوة الصوتية) -->
      <div id="quran-audio-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 flex flex-col border border-slate-200 dark:border-slate-800 text-center">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span>🔊</span>
              <span>تلاوة سورة ${meta.surah.name}</span>
            </h3>
            <button onclick="QuranReader.closeAudioModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">✕</button>
          </div>

          <div class="space-y-3">
            <label class="block text-xs font-bold text-slate-600 dark:text-slate-300 text-right">اختر القارئ المفضل:</label>
            <select id="quran-reciter-select" onchange="QuranReader._reciter=this.value" class="sh-input text-xs font-bold">
              ${this.RECITERS.map(r => `<option value="${r.id}" ${r.id === this._reciter ? 'selected' : ''}>${r.name}</option>`).join('')}
            </select>
          </div>

          <div class="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <span class="text-3xl block" id="audio-status-icon">🎵</span>
            <div class="space-y-0.5">
              <h4 class="font-black text-sm text-slate-900 dark:text-white" id="audio-surah-label">سورة ${meta.surah.name}</h4>
              <p class="text-[11px] text-slate-400" id="audio-player-status">جاهز للتشغيل عند الطلب</p>
            </div>

            <div class="flex items-center justify-center gap-2 pt-2">
              <button onclick="QuranReader.toggleSurahAudio(${meta.surah.num})" id="audio-play-btn" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md active:scale-95 transition">
                ▶️ تشغيل التلاوة
              </button>
              <button onclick="QuranReader.stopAudio()" class="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs active:scale-95 transition">
                ⏹️ إيقاف
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Fast Surahs Index -->
      <div id="quran-surahs-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="font-black text-slate-900 dark:text-white text-base">فهرس سور القرآن الكريم (١١٤ سورة) 📖</h3>
            <button onclick="QuranReader.closeSurahsModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">✕</button>
          </div>
          <input type="text" placeholder="ابحث باسم السورة..." oninput="QuranReader.filterSurahModal(this.value)" class="sh-input text-xs font-bold">
          <div class="overflow-y-auto space-y-1.5 flex-1 pr-1" id="quran-surahs-modal-list">
            ${this.SURAHS.map(s => `
              <div onclick="QuranReader.goToPage(${s.startPage}); QuranReader.closeSurahsModal();" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition border border-transparent hover:border-emerald-500/30">
                <div class="flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs flex items-center justify-center">${s.num}</span>
                  <div>
                    <h5 class="font-black text-xs text-slate-900 dark:text-white">سورة ${s.name}</h5>
                    <span class="text-[10px] text-slate-400">${s.type} • ${s.ayahs} آية</span>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-amber-500">ص ${s.startPage}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Modal: Fast Juz Index -->
      <div id="quran-juz-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="font-black text-slate-900 dark:text-white text-base">فهرس أجزاء القرآن الكريم (٣٠ جزءاً) 🕋</h3>
            <button onclick="QuranReader.closeJuzModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">✕</button>
          </div>
          <div class="overflow-y-auto space-y-1.5 flex-1 pr-1">
            ${this.JUZ_PAGES.map(j => `
              <div onclick="QuranReader.goToPage(${j.startPage}); QuranReader.closeJuzModal();" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition border border-transparent hover:border-emerald-500/30">
                <span class="font-black text-xs text-slate-900 dark:text-white">${j.name}</span>
                <span class="text-xs font-mono font-bold text-amber-500">ص ${j.startPage}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  goToPage(page) {
    page = Math.max(1, Math.min(604, parseInt(page) || 1));
    this._currentPage = page;
    const loader = document.getElementById('quran-page-loader');
    if (loader) loader.classList.remove('hidden');
    this.render();
  },

  nextPage() {
    if (this._currentPage < 604) {
      this.goToPage(this._currentPage + 1);
    }
  },

  prevPage() {
    if (this._currentPage > 1) {
      this.goToPage(this._currentPage - 1);
    }
  },

  onImageLoaded() {
    const loader = document.getElementById('quran-page-loader');
    if (loader) loader.classList.add('hidden');
  },

  setBookmarkHere() {
    const page = this._currentPage;
    const meta = this.getPageMeta(page);

    Store.state.quranBookmark = {
      surahNum: meta.surah.num,
      surahName: meta.surah.name,
      page: page,
      ayah: 1,
      updatedAt: new Date().toISOString()
    };

    Store.addXP(20, 'تحديث فاصل القرآن الكريم');
    Store.save();

    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`تم حفظ فاصل القراءة عند سورة ${meta.surah.name} (صفحة ${page}) بنجاح! (+20 XP) 📌`, 'success');
    }
    this.render();
  },

  openBookmark() {
    const bm = Store.state.quranBookmark;
    if (bm && bm.page) {
      this.goToPage(bm.page);
      if (typeof App !== 'undefined' && App.toast) {
        App.toast(`تم الانتقال لعلامتك المحفوظة: سورة ${bm.surahName} (صفحة ${bm.page}) 🔖`);
      }
    } else {
      if (typeof App !== 'undefined' && App.toast) {
        App.toast('لم تقم بحفظ أي فاصل بعد، اضغط على "حفظ الفاصل" لحفظ صفحتك الحالية', 'info');
      }
    }
  },

  // ===== التفسير الميسر عند الطلب =====
  async openTafsirModal() {
    const m = document.getElementById('quran-tafsir-modal');
    if (m) m.classList.remove('hidden');

    const content = document.getElementById('quran-tafsir-content');
    if (!content) return;

    const meta = this.getPageMeta(this._currentPage);

    try {
      // جلب تفسير السورة من التفسير الميسر الرسمي
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${meta.surah.num}/ar.muyassar`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.ayahs) {
          content.innerHTML = json.data.ayahs.map(a => `
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div class="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                <span>﴿${a.numberInSurah}﴾</span>
                <span class="text-xs">تفسير الآية ${a.numberInSurah}</span>
              </div>
              <p class="text-slate-700 dark:text-slate-200 leading-relaxed font-serif text-sm">${a.text}</p>
            </div>
          `).join('');
          return;
        }
      }
    } catch(e) {}

    content.innerHTML = `
      <div class="p-6 text-center text-slate-500 space-y-2">
        <p>يمكنك قراءة التفسير مباشرة عبر رابط المصحف المعتمد:</p>
        <a href="https://quran.com/${meta.surah.num}" target="_blank" class="sh-btn primary text-xs mt-2 inline-flex items-center gap-1">
          <span>فتح تفسير سورة ${meta.surah.name} على Quran.com</span>
          <span>↗</span>
        </a>
      </div>
    `;
  },

  closeTafsirModal() {
    const m = document.getElementById('quran-tafsir-modal');
    if (m) m.classList.add('hidden');
  },

  // ===== الاستماع للتلاوة الصوتية عند الطلب =====
  openAudioModal() {
    const m = document.getElementById('quran-audio-modal');
    if (m) m.classList.remove('hidden');
  },

  closeAudioModal() {
    const m = document.getElementById('quran-audio-modal');
    if (m) m.classList.add('hidden');
  },

  toggleSurahAudio(surahNum) {
    if (this._isPlayingAudio && this._currentAudio) {
      this.stopAudio();
      return;
    }

    const reciterObj = this.RECITERS.find(r => r.id === this._reciter) || this.RECITERS[0];
    const surah3 = String(surahNum).padStart(3, '0');
    const audioUrl = `https://server8.mp3quran.net/afs/${surah3}.mp3`;

    const statusLbl = document.getElementById('audio-player-status');
    const playBtn = document.getElementById('audio-play-btn');
    const icon = document.getElementById('audio-status-icon');

    if (statusLbl) statusLbl.textContent = 'جاري التحميل والتشغيل...';

    this._currentAudio = new Audio(audioUrl);
    this._currentAudio.play().then(() => {
      this._isPlayingAudio = true;
      if (playBtn) playBtn.textContent = '⏸️ إيقاف مؤقت';
      if (statusLbl) statusLbl.textContent = `جاري الاستماع بصوت: ${reciterObj.name}`;
      if (icon) icon.textContent = '🔊';
    }).catch(e => {
      if (statusLbl) statusLbl.textContent = 'تعذر تشغيل الصوت، تأكد من الاتصال بالإنترنت';
    });

    this._currentAudio.onended = () => {
      this.stopAudio();
    };
  },

  stopAudio() {
    if (this._currentAudio) {
      this._currentAudio.pause();
      this._currentAudio.currentTime = 0;
      this._currentAudio = null;
    }
    this._isPlayingAudio = false;
    const playBtn = document.getElementById('audio-play-btn');
    const statusLbl = document.getElementById('audio-player-status');
    const icon = document.getElementById('audio-status-icon');
    if (playBtn) playBtn.textContent = '▶️ تشغيل التلاوة';
    if (statusLbl) statusLbl.textContent = 'تم إيقاف التلاوة';
    if (icon) icon.textContent = '🎵';
  },

  openSurahsModal() {
    const m = document.getElementById('quran-surahs-modal');
    if (m) m.classList.remove('hidden');
  },

  closeSurahsModal() {
    const m = document.getElementById('quran-surahs-modal');
    if (m) m.classList.add('hidden');
  },

  openJuzModal() {
    const m = document.getElementById('quran-juz-modal');
    if (m) m.classList.remove('hidden');
  },

  closeJuzModal() {
    const m = document.getElementById('quran-juz-modal');
    if (m) m.classList.add('hidden');
  },

  filterSurahModal(query) {
    const q = (query || '').trim().toLowerCase();
    const list = document.getElementById('quran-surahs-modal-list');
    if (!list) return;

    const cards = list.children;
    this.SURAHS.forEach((s, idx) => {
      const match = s.name.toLowerCase().includes(q) || String(s.num).includes(q) || String(s.startPage).includes(q);
      if (cards[idx]) {
        cards[idx].style.display = match ? 'flex' : 'none';
      }
    });
  },

  attachKeyListeners() {
    if (this._keysAttached) return;
    this._keysAttached = true;

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        this.nextPage();
      } else if (e.key === 'ArrowRight') {
        this.prevPage();
      }
    });
  }
};
