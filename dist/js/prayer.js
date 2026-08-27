// js/prayer.js — نظام مواقيت الصلاة التتابعي الصارم، السنن، الورد القرآني، الأذكار، والقبلة
// مبني وفق معايير: anthropics/skills@frontend-design & emilkowalski/skills@improve-animations

const EGYPT_CITIES = [
  { id: 'cairo', name: 'القاهرة', lat: 30.0444, lng: 31.2357 },
  { id: 'giza', name: 'الجيزة', lat: 30.0131, lng: 31.2089 },
  { id: 'alexandria', name: 'الإسكندرية', lat: 31.2001, lng: 29.9187 },
  { id: 'mansoura', name: 'المنصورة (الدقهلية)', lat: 31.0409, lng: 31.3785 },
  { id: 'tanta', name: 'طنطا (الغربية)', lat: 30.7865, lng: 31.0004 },
  { id: 'zagazig', name: 'الزقازيق (الشرقية)', lat: 30.5877, lng: 31.5020 },
  { id: 'banha', name: 'بنها (القليوبية)', lat: 30.4660, lng: 31.1853 },
  { id: 'shebin', name: 'شبين الكوم (المنوفية)', lat: 30.5522, lng: 31.0094 },
  { id: 'damanhour', name: 'دمنهور (البحيرة)', lat: 31.0425, lng: 30.4674 },
  { id: 'damietta', name: 'دمياط', lat: 31.4175, lng: 31.8144 },
  { id: 'portsaid', name: 'بورسعيد', lat: 31.2653, lng: 32.3019 },
  { id: 'ismailia', name: 'الإسماعيلية', lat: 30.5965, lng: 32.2715 },
  { id: 'suez', name: 'السويس', lat: 29.9668, lng: 32.5498 },
  { id: 'kafr_el_sheikh', name: 'كفر الشيخ', lat: 31.1107, lng: 30.9388 },
  { id: 'fayoum', name: 'الفيوم', lat: 29.3084, lng: 30.8428 },
  { id: 'beni_suef', name: 'بني سويف', lat: 29.0661, lng: 31.0994 },
  { id: 'minya', name: 'المنيا', lat: 28.1099, lng: 30.7503 },
  { id: 'asyut', name: 'أسيوط', lat: 27.1801, lng: 31.1837 },
  { id: 'sohag', name: 'سوهاج', lat: 26.5569, lng: 31.6948 },
  { id: 'qena', name: 'قنا', lat: 26.1551, lng: 32.7160 },
  { id: 'luxor', name: 'الأقصر', lat: 25.6872, lng: 32.6396 },
  { id: 'aswan', name: 'أسوان', lat: 24.0889, lng: 32.8998 },
  { id: 'hurghada', name: 'الغردقة (البحر الأحمر)', lat: 27.2579, lng: 33.8116 },
  { id: 'matrouh', name: 'مرسى مطروح', lat: 31.3543, lng: 27.2373 },
  { id: 'arish', name: 'العريش (شمال سيناء)', lat: 31.1325, lng: 33.8033 },
  { id: 'sharm', name: 'شرم الشيخ (جنوب سيناء)', lat: 27.9158, lng: 34.3299 },
  { id: 'kharga', name: 'الخارجة (الوادي الجديد)', lat: 25.4514, lng: 30.5475 }
];

const ARAB_CITIES = [
  { id: 'makkah', name: 'مكة المكرمة 🇸🇦', lat: 21.4225, lng: 39.8262 },
  { id: 'medina', name: 'المدينة المنورة 🇸🇦', lat: 24.5247, lng: 39.5692 },
  { id: 'riyadh', name: 'الرياض 🇸🇦', lat: 24.7136, lng: 46.6753 },
  { id: 'jeddah', name: 'جدة 🇸🇦', lat: 21.4858, lng: 39.1925 },
  { id: 'dubai', name: 'دبي 🇦🇪', lat: 25.2048, lng: 55.2708 },
  { id: 'abudhabi', name: 'أبوظبي 🇦🇪', lat: 24.4539, lng: 54.3773 },
  { id: 'kuwait', name: 'الكويت 🇰🇼', lat: 29.3759, lng: 47.9774 },
  { id: 'doha', name: 'الدوحة 🇶🇦', lat: 25.2854, lng: 51.5310 },
  { id: 'amman', name: 'عمّان 🇯🇴', lat: 31.9454, lng: 35.9284 },
  { id: 'baghdad', name: 'بغداد 🇮🇶', lat: 33.3152, lng: 44.3661 },
  { id: 'damascus', name: 'دمشق 🇸🇾', lat: 33.5138, lng: 36.2765 },
  { id: 'beirut', name: 'بيروت 🇱🇧', lat: 33.8938, lng: 35.5018 },
  { id: 'jerusalem', name: 'القدس الشريف 🇵🇸', lat: 31.7683, lng: 35.2137 },
  { id: 'muscat', name: 'مسقط 🇴🇲', lat: 23.5859, lng: 58.4059 },
  { id: 'manama', name: 'المنامة 🇧🇭', lat: 26.2285, lng: 50.5860 },
  { id: 'tripoli', name: 'طرابلس 🇱🇾', lat: 32.8872, lng: 13.1913 },
  { id: 'tunis', name: 'تونس 🇹🇳', lat: 36.8065, lng: 10.1815 },
  { id: 'algiers', name: 'الجزائر 🇩🇿', lat: 36.7538, lng: 3.0588 },
  { id: 'rabat', name: 'الرباط 🇲🇦', lat: 34.020882, lng: -6.84165 },
  { id: 'khartoum', name: 'الخرطوم 🇸🇩', lat: 15.5007, lng: 32.5599 },
  { id: 'istanbul', name: 'إسطنبول 🇹🇷', lat: 41.0082, lng: 28.9784 }
];

const CALC_METHODS = {
  Egypt: { name: 'الهيئة المصرية العامة للمساحة', fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { name: 'جامعة أم القرى (مكة المكرمة)', fajrAngle: 18.5, ishaInterval: 90 },
  MWL: { name: 'رابطة العالم الإسلامي', fajrAngle: 18.0, ishaAngle: 17.0 },
  ISNA: { name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', fajrAngle: 15.0, ishaAngle: 15.0 },
  Karachi: { name: 'جامعة العلوم الإسلامية بكراتشي', fajrAngle: 18.0, ishaAngle: 18.0 },
  Dubai: { name: 'الهيئة العامة للشؤون الإسلامية (الإمارات)', fajrAngle: 18.2, ishaAngle: 18.2 }
};

const PRAYER_KEYS = [
  { key: 'fajr', name: 'الفجر', icon: '🌅', color: 'from-indigo-600 to-blue-700' },
  { key: 'sunrise', name: 'الشروق', icon: '☀️', color: 'from-amber-500 to-yellow-600', isSunrise: true },
  { key: 'dhuhr', name: 'الظهر', icon: '🌤️', color: 'from-sky-500 to-indigo-600' },
  { key: 'asr', name: 'العصر', icon: '⛅', color: 'from-orange-500 to-amber-600' },
  { key: 'maghrib', name: 'المغرب', icon: '🌇', color: 'from-rose-500 to-red-600' },
  { key: 'isha', name: 'العشاء', icon: '🌙', color: 'from-purple-700 to-slate-900' }
];

const SUNNAH_ITEMS = [
  { key: 'fajr', name: 'سنة الفجر (ركعتان)', desc: 'قبل الفجر — خير من الدنيا وما فيها', rakaat: 2, parent: 'fajr' },
  { key: 'duha', name: 'صلاة الضحى (الأوابين)', desc: 'بعد الشروق بـ 15 دقيقة حتى قبل الظهر', rakaat: 2, isExtra: true },
  { key: 'dhuhr_before', name: 'سنة الظهر القبلية (4 ركعات)', desc: 'قبل الظهر مثنى مثنى', rakaat: 4, parent: 'dhuhr' },
  { key: 'dhuhr_after', name: 'سنة الظهر البعدية (ركعتان)', desc: 'بعد صلاة الظهر', rakaat: 2, parent: 'dhuhr' },
  { key: 'maghrib', name: 'سنة المغرب (ركعتان)', desc: 'بعد صلاة المغرب', rakaat: 2, parent: 'maghrib' },
  { key: 'isha', name: 'سنة العشاء (ركعتان)', desc: 'بعد صلاة العشاء', rakaat: 2, parent: 'isha' },
  { key: 'witr', name: 'صلاة الشفع والوتر', desc: 'بعد العشاء أو في جوف الليل', rakaat: 3, isExtra: true },
  { key: 'qiyam', name: 'قيام الليل (التهجد)', desc: 'في الثلث الأخير من الليل', rakaat: 2, isExtra: true }
];

// ==========================================
// أصوات المؤذنين والشيوخ والتنبيهات المعتمدة (ملفات محلية مدمجة 100%)
// ==========================================
const ADHAN_RECITERS = [
  {
    id: 'makkah',
    name: 'أذان المسجد الحرام (مكة المكرمة) — الشيخ علي ملا 🕋',
    audioUrl: 'assets/audio/adhan_makkah.mp3'
  },
  {
    id: 'afasy',
    name: 'أذان الشيخ مشاري راشد العفاسي 🇰🇼',
    audioUrl: 'assets/audio/adhan_afasy.mp3'
  },
  {
    id: 'egypt_refaat',
    name: 'أذان مصر التاريخي — الشيخ محمد رفعت 🇪🇬',
    audioUrl: 'assets/audio/adhan_egypt_refaat.mp3'
  },
  {
    id: 'egypt_minshawi',
    name: 'أذان الشيخ محمد صديق المنشاوي 🇪🇬',
    audioUrl: 'assets/audio/adhan_egypt_minshawi.mp3'
  },
  {
    id: 'banna',
    name: 'أذان الشيخ محمود علي البنا (القاهرة) 🇪🇬',
    audioUrl: 'assets/audio/adhan_banna.mp3'
  },
  {
    id: 'aqsa',
    name: 'أذان المسجد الأقصى المبارك (القدس الشريف) 🇵🇸',
    audioUrl: 'assets/audio/adhan_aqsa.mp3'
  },
  {
    id: 'qatami',
    name: 'أذان الشيخ ناصر القطامي 🇸🇦',
    audioUrl: 'assets/audio/adhan_qatami.mp3'
  },
  {
    id: 'abdulbasit',
    name: 'أذان الشيخ عبد الباسط عبد الصمد 🇪🇬',
    audioUrl: 'assets/audio/adhan_abdulbasit.mp3'
  },
  {
    id: 'takbeer',
    name: 'تكبيرات الأذان الحقيقية (الحرم المكي) 🔊',
    audioUrl: 'assets/audio/takbeerat_haram.mp3'
  },
  {
    id: 'silent',
    name: 'صامت (بدون صوت) 🔕',
    silent: true
  }
];

// ==========================================
// فهرس الأجزاء الثلاثين من القرآن الكريم (30 Juz Index)
// ==========================================
const QURAN_JUZ = [
  { num: 1, name: 'الجزء الأول (الم)', startSurah: 'الفاتحة', startPage: 1, endPage: 21 },
  { num: 2, name: 'الجزء الثاني (سيقول)', startSurah: 'البقرة', startPage: 22, endPage: 41 },
  { num: 3, name: 'الجزء الثالث (تلك الرسل)', startSurah: 'البقرة', startPage: 42, endPage: 61 },
  { num: 4, name: 'الجزء الرابع (لن تنالوا)', startSurah: 'آل عمران', startPage: 62, endPage: 81 },
  { num: 5, name: 'الجزء الخامس (والمحصنات)', startSurah: 'النساء', startPage: 82, endPage: 101 },
  { num: 6, name: 'الجزء السادس (لا يحب الله)', startSurah: 'النساء', startPage: 102, endPage: 121 },
  { num: 7, name: 'الجزء السابع (وإذا سمعوا)', startSurah: 'المائدة', startPage: 122, endPage: 141 },
  { num: 8, name: 'الجزء الثامن (ولو أننا)', startSurah: 'الأنعام', startPage: 142, endPage: 161 },
  { num: 9, name: 'الجزء التاسع (قال الملأ)', startSurah: 'الأعراف', startPage: 162, endPage: 181 },
  { num: 10, name: 'الجزء العاشر (واعلموا)', startSurah: 'الأنفال', startPage: 182, endPage: 201 },
  { num: 11, name: 'الجزء الحادي عشر (يعتذرون)', startSurah: 'التوبة', startPage: 202, endPage: 221 },
  { num: 12, name: 'الجزء الثاني عشر (وما من دابة)', startSurah: 'هود', startPage: 222, endPage: 241 },
  { num: 13, name: 'الجزء الثالث عشر (وما أبرئ)', startSurah: 'يوسف', startPage: 242, endPage: 261 },
  { num: 14, name: 'الجزء الرابع عشر (ربما)', startSurah: 'الحجر', startPage: 262, endPage: 281 },
  { num: 15, name: 'الجزء الخامس عشر (سبحان)', startSurah: 'الإسراء', startPage: 282, endPage: 301 },
  { num: 16, name: 'الجزء السادس عشر (قال ألم)', startSurah: 'الكهف', startPage: 302, endPage: 321 },
  { num: 17, name: 'الجزء السابع عشر (اقترب)', startSurah: 'الأنبياء', startPage: 322, endPage: 341 },
  { num: 18, name: 'الجزء الثامن عشر (قد أفلح)', startSurah: 'المؤمنون', startPage: 342, endPage: 361 },
  { num: 19, name: 'الجزء التاسع عشر (وقال الذين)', startSurah: 'الفرقان', startPage: 362, endPage: 381 },
  { num: 20, name: 'الجزء العشرون (فما كان)', startSurah: 'النمل', startPage: 382, endPage: 401 },
  { num: 21, name: 'الجزء الحادي والعشرون (اتل ما أوحي)', startSurah: 'العنكبوت', startPage: 402, endPage: 421 },
  { num: 22, name: 'الجزء الثاني والعشرون (ومن يقنت)', startSurah: 'الأحزاب', startPage: 422, endPage: 441 },
  { num: 23, name: 'الجزء الثالث والعشرون (وما أنزلنا)', startSurah: 'يس', startPage: 442, endPage: 461 },
  { num: 24, name: 'الجزء الرابع والعشرون (فمن أظلم)', startSurah: 'الزمر', startPage: 462, endPage: 481 },
  { num: 25, name: 'الجزء الخامس والعشرون (إليه يرد)', startSurah: 'فصلت', startPage: 482, endPage: 501 },
  { num: 26, name: 'الجزء السادس والعشرون (حم)', startSurah: 'الأحقاف', startPage: 502, endPage: 521 },
  { num: 27, name: 'الجزء السابع والعشرون (قال فما خطبكم)', startSurah: 'الذاريات', startPage: 522, endPage: 541 },
  { num: 28, name: 'الجزء الثامن والعشرون (قد سمع)', startSurah: 'المجادلة', startPage: 542, endPage: 561 },
  { num: 29, name: 'الجزء التاسع والعشرون (تبارك)', startSurah: 'الملك', startPage: 562, endPage: 581 },
  { num: 30, name: 'الجزء الثلاثون (عمّ)', startSurah: 'النبأ', startPage: 582, endPage: 604 }
];

// ==========================================
// فهرس ومكتبة سور القرآن الكريم الـ 114 كاملة
// ==========================================
const QURAN_SURAHS = [
  { num: 1, name: 'الفاتحة', ayahs: 7, page: 1, type: 'مكية' },
  { num: 2, name: 'البقرة', ayahs: 286, page: 2, type: 'مدنية' },
  { num: 3, name: 'آل عمران', ayahs: 200, page: 50, type: 'مدنية' },
  { num: 4, name: 'النساء', ayahs: 176, page: 77, type: 'مدنية' },
  { num: 5, name: 'المائدة', ayahs: 120, page: 106, type: 'مدنية' },
  { num: 6, name: 'الأنعام', ayahs: 165, page: 128, type: 'مكية' },
  { num: 7, name: 'الأعراف', ayahs: 206, page: 151, type: 'مكية' },
  { num: 8, name: 'الأنفال', ayahs: 75, page: 177, type: 'مدنية' },
  { num: 9, name: 'التوبة', ayahs: 129, page: 187, type: 'مدنية' },
  { num: 10, name: 'يونس', ayahs: 109, page: 208, type: 'مكية' },
  { num: 11, name: 'هود', ayahs: 123, page: 221, type: 'مكية' },
  { num: 12, name: 'يوسف', ayahs: 111, page: 235, type: 'مكية' },
  { num: 13, name: 'الرعد', ayahs: 43, page: 249, type: 'مدنية' },
  { num: 14, name: 'إبراهيم', ayahs: 52, page: 255, type: 'مكية' },
  { num: 15, name: 'الحجر', ayahs: 99, page: 262, type: 'مكية' },
  { num: 16, name: 'النحل', ayahs: 128, page: 267, type: 'مكية' },
  { num: 17, name: 'الإسراء', ayahs: 111, page: 282, type: 'مكية' },
  { num: 18, name: 'الكهف', ayahs: 110, page: 293, type: 'مكية' },
  { num: 19, name: 'مريم', ayahs: 98, page: 305, type: 'مكية' },
  { num: 20, name: 'طه', ayahs: 135, page: 312, type: 'مكية' },
  { num: 21, name: 'الأنبياء', ayahs: 112, page: 322, type: 'مكية' },
  { num: 22, name: 'الحج', ayahs: 78, page: 332, type: 'مدنية' },
  { num: 23, name: 'المؤمنون', ayahs: 118, page: 342, type: 'مكية' },
  { num: 24, name: 'النور', ayahs: 64, page: 350, type: 'مدنية' },
  { num: 25, name: 'الفرقان', ayahs: 77, page: 359, type: 'مكية' },
  { num: 26, name: 'الشعراء', ayahs: 227, page: 367, type: 'مكية' },
  { num: 27, name: 'النمل', ayahs: 93, page: 377, type: 'مكية' },
  { num: 28, name: 'القصص', ayahs: 88, page: 385, type: 'مكية' },
  { num: 29, name: 'العنكبوت', ayahs: 69, page: 396, type: 'مكية' },
  { num: 30, name: 'الروم', ayahs: 60, page: 404, type: 'مكية' },
  { num: 31, name: 'لقمان', ayahs: 34, page: 411, type: 'مكية' },
  { num: 32, name: 'السجدة', ayahs: 30, page: 415, type: 'مكية' },
  { num: 33, name: 'الأحزاب', ayahs: 73, page: 418, type: 'مدنية' },
  { num: 34, name: 'سبأ', ayahs: 54, page: 428, type: 'مكية' },
  { num: 35, name: 'فاطر', ayahs: 45, page: 434, type: 'مكية' },
  { num: 36, name: 'يس', ayahs: 83, page: 440, type: 'مكية' },
  { num: 37, name: 'الصافات', ayahs: 182, page: 446, type: 'مكية' },
  { num: 38, name: 'ص', ayahs: 88, page: 453, type: 'مكية' },
  { num: 39, name: 'الزمر', ayahs: 75, page: 458, type: 'مكية' },
  { num: 40, name: 'غافر', ayahs: 85, page: 467, type: 'مكية' },
  { num: 41, name: 'فصلت', ayahs: 54, page: 477, type: 'مكية' },
  { num: 42, name: 'الشورى', ayahs: 53, page: 483, type: 'مكية' },
  { num: 43, name: 'الزخرف', ayahs: 89, page: 489, type: 'مكية' },
  { num: 44, name: 'الدخان', ayahs: 59, page: 496, type: 'مكية' },
  { num: 45, name: 'الجاثية', ayahs: 37, page: 499, type: 'مكية' },
  { num: 46, name: 'الأحقاف', ayahs: 35, page: 502, type: 'مكية' },
  { num: 47, name: 'محمد', ayahs: 38, page: 507, type: 'مدنية' },
  { num: 48, name: 'الفتح', ayahs: 29, page: 511, type: 'مدنية' },
  { num: 49, name: 'الحجرات', ayahs: 18, page: 515, type: 'مدنية' },
  { num: 50, name: 'ق', ayahs: 45, page: 518, type: 'مكية' },
  { num: 51, name: 'الذاريات', ayahs: 60, page: 520, type: 'مكية' },
  { num: 52, name: 'الطور', ayahs: 49, page: 523, type: 'مكية' },
  { num: 53, name: 'النجم', ayahs: 62, page: 526, type: 'مكية' },
  { num: 54, name: 'القمر', ayahs: 55, page: 528, type: 'مكية' },
  { num: 55, name: 'الرحمن', ayahs: 78, page: 531, type: 'مدنية' },
  { num: 56, name: 'الواقعة', ayahs: 96, page: 534, type: 'مكية' },
  { num: 57, name: 'الحديد', ayahs: 29, page: 537, type: 'مدنية' },
  { num: 58, name: 'المجادلة', ayahs: 22, page: 542, type: 'مدنية' },
  { num: 59, name: 'الحشر', ayahs: 24, page: 545, type: 'مدنية' },
  { num: 60, name: 'الممتحنة', ayahs: 13, page: 549, type: 'مدنية' },
  { num: 61, name: 'الصف', ayahs: 14, page: 551, type: 'مدنية' },
  { num: 62, name: 'الجمعة', ayahs: 11, page: 553, type: 'مدنية' },
  { num: 63, name: 'المنافقون', ayahs: 11, page: 554, type: 'مدنية' },
  { num: 64, name: 'التغابن', ayahs: 18, page: 556, type: 'مدنية' },
  { num: 65, name: 'الطلاق', ayahs: 12, page: 558, type: 'مدنية' },
  { num: 66, name: 'التحريم', ayahs: 12, page: 560, type: 'مدنية' },
  { num: 67, name: 'الملك', ayahs: 30, page: 562, type: 'مكية' },
  { num: 68, name: 'القلم', ayahs: 52, page: 564, type: 'مكية' },
  { num: 69, name: 'الحاقة', ayahs: 52, page: 566, type: 'مكية' },
  { num: 70, name: 'المعارج', ayahs: 44, page: 568, type: 'مكية' },
  { num: 71, name: 'نوح', ayahs: 28, page: 570, type: 'مكية' },
  { num: 72, name: 'الجن', ayahs: 28, page: 572, type: 'مكية' },
  { num: 73, name: 'المزمل', ayahs: 20, page: 574, type: 'مكية' },
  { num: 74, name: 'المدثر', ayahs: 56, page: 575, type: 'مكية' },
  { num: 75, name: 'القيامة', ayahs: 40, page: 577, type: 'مكية' },
  { num: 76, name: 'الإنسان', ayahs: 31, page: 578, type: 'مدنية' },
  { num: 77, name: 'المرسلات', ayahs: 50, page: 580, type: 'مكية' },
  { num: 78, name: 'النبأ', ayahs: 40, page: 582, type: 'مكية' },
  { num: 79, name: 'النازعات', ayahs: 46, page: 583, type: 'مكية' },
  { num: 80, name: 'عبس', ayahs: 42, page: 585, type: 'مكية' },
  { num: 81, name: 'التكوير', ayahs: 29, page: 586, type: 'مكية' },
  { num: 82, name: 'الانفطار', ayahs: 19, page: 587, type: 'مكية' },
  { num: 83, name: 'المطففين', ayahs: 36, page: 587, type: 'مكية' },
  { num: 84, name: 'الانشقاق', ayahs: 25, page: 589, type: 'مكية' },
  { num: 85, name: 'البروج', ayahs: 22, page: 590, type: 'مكية' },
  { num: 86, name: 'الطارق', ayahs: 17, page: 591, type: 'مكية' },
  { num: 87, name: 'الأعلى', ayahs: 19, page: 591, type: 'مكية' },
  { num: 88, name: 'الغاشية', ayahs: 26, page: 592, type: 'مكية' },
  { num: 89, name: 'الفجر', ayahs: 30, page: 593, type: 'مكية' },
  { num: 90, name: 'البلد', ayahs: 20, page: 594, type: 'مكية' },
  { num: 91, name: 'الشمس', ayahs: 15, page: 595, type: 'مكية' },
  { num: 92, name: 'الليل', ayahs: 21, page: 595, type: 'مكية' },
  { num: 93, name: 'الضحى', ayahs: 11, page: 596, type: 'مكية' },
  { num: 94, name: 'الشرح', ayahs: 8, page: 596, type: 'مكية' },
  { num: 95, name: 'التين', ayahs: 8, page: 597, type: 'مكية' },
  { num: 96, name: 'العلق', ayahs: 19, page: 597, type: 'مكية' },
  { num: 97, name: 'القدر', ayahs: 5, page: 598, type: 'مكية' },
  { num: 98, name: 'البينة', ayahs: 8, page: 598, type: 'مدنية' },
  { num: 99, name: 'الزلزلة', ayahs: 8, page: 599, type: 'مدنية' },
  { num: 100, name: 'العاديات', ayahs: 11, page: 599, type: 'مكية' },
  { num: 101, name: 'القارعة', ayahs: 11, page: 600, type: 'مكية' },
  { num: 102, name: 'التكاثر', ayahs: 8, page: 600, type: 'مكية' },
  { num: 103, name: 'العصر', ayahs: 3, page: 601, type: 'مكية' },
  { num: 104, name: 'الهمزة', ayahs: 9, page: 601, type: 'مكية' },
  { num: 105, name: 'الفيل', ayahs: 5, page: 601, type: 'مكية' },
  { num: 106, name: 'قريش', ayahs: 4, page: 602, type: 'مكية' },
  { num: 107, name: 'الماعون', ayahs: 7, page: 602, type: 'مكية' },
  { num: 108, name: 'الكوثر', ayahs: 3, page: 602, type: 'مكية' },
  { num: 109, name: 'الكافرون', ayahs: 6, page: 603, type: 'مكية' },
  { num: 110, name: 'النصر', ayahs: 3, page: 603, type: 'مدنية' },
  { num: 111, name: 'المسد', ayahs: 5, page: 603, type: 'مكية' },
  { num: 112, name: 'الإخلاص', ayahs: 4, page: 604, type: 'مكية' },
  { num: 113, name: 'الفلق', ayahs: 5, page: 604, type: 'مكية' },
  { num: 114, name: 'الناس', ayahs: 6, page: 604, type: 'مكية' }
];

// ==========================================
// 1. المحرك الفلكي الرياضي الدقيق (Astronomical Calculation Engine)
// ==========================================
const PrayerCalc = {
  dtr: (d) => (d * Math.PI) / 180,
  rtd: (r) => (r * 180) / Math.PI,
  sin: (d) => Math.sin(PrayerCalc.dtr(d)),
  cos: (d) => Math.cos(PrayerCalc.dtr(d)),
  tan: (d) => Math.tan(PrayerCalc.dtr(d)),
  arcsin: (x) => PrayerCalc.rtd(Math.asin(x)),
  arccos: (x) => PrayerCalc.rtd(Math.acos(x)),
  arctan: (x) => PrayerCalc.rtd(Math.atan(x)),
  arccot: (x) => PrayerCalc.rtd(Math.atan(1 / x)),
  arctan2: (y, x) => PrayerCalc.rtd(Math.atan2(y, x)),

  fixAngle: (a) => {
    a = a - 360.0 * Math.floor(a / 360.0);
    return a < 0 ? a + 360.0 : a;
  },

  fixHour: (h) => {
    h = h - 24.0 * Math.floor(h / 24.0);
    return h < 0 ? h + 24.0 : h;
  },

  julianDay: (year, month, day) => {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  },

  sunPosition: (jd) => {
    const D = jd - 2451545.0;
    const g = PrayerCalc.fixAngle(357.529 + 0.98560028 * D);
    const q = PrayerCalc.fixAngle(280.459 + 0.98564736 * D);
    const L = PrayerCalc.fixAngle(q + 1.915 * PrayerCalc.sin(g) + 0.020 * PrayerCalc.sin(2 * g));
    const e = 23.439 - 0.00000036 * D;
    const d = PrayerCalc.arcsin(PrayerCalc.sin(e) * PrayerCalc.sin(L));
    let RA = PrayerCalc.arctan2(PrayerCalc.cos(e) * PrayerCalc.sin(L), PrayerCalc.cos(L)) / 15.0;
    RA = PrayerCalc.fixHour(RA);
    const EqT = q / 15.0 - RA;
    return { declination: d, equation: EqT };
  },

  sunAngleTime: (angle, jd, lat, lng, isSunrise) => {
    const sun = PrayerCalc.sunPosition(jd);
    const noon = PrayerCalc.fixHour(12 - sun.equation - lng / 15.0);
    const angleRad = PrayerCalc.sin(angle);
    const latRad = PrayerCalc.sin(lat);
    const decRad = PrayerCalc.sin(sun.declination);
    const cosLat = PrayerCalc.cos(lat);
    const cosDec = PrayerCalc.cos(sun.declination);

    const val = (angleRad - latRad * decRad) / (cosLat * cosDec);
    if (val > 1 || val < -1) return noon;
    const hourAngle = PrayerCalc.arccos(val) / 15.0;
    return isSunrise ? noon - hourAngle : noon + hourAngle;
  },

  asrTime: (factor, jd, lat, lng) => {
    const sun = PrayerCalc.sunPosition(jd);
    const noon = PrayerCalc.fixHour(12 - sun.equation - lng / 15.0);
    const angle = PrayerCalc.arccot(factor + PrayerCalc.tan(Math.abs(lat - sun.declination)));
    const val = (PrayerCalc.sin(angle) - PrayerCalc.sin(lat) * PrayerCalc.sin(sun.declination)) /
                (PrayerCalc.cos(lat) * PrayerCalc.cos(sun.declination));
    if (val > 1 || val < -1) return noon + 3.25;
    const hourAngle = PrayerCalc.arccos(val) / 15.0;
    return noon + hourAngle;
  },

  calculate: (date, lat, lng, methodKey, asrMethod) => {
    date = date || new Date();
    const method = CALC_METHODS[methodKey] || CALC_METHODS.Egypt;
    const asrFactor = asrMethod === 'Hanafi' ? 2 : 1;
    const timeZone = -date.getTimezoneOffset() / 60.0;

    const jd = PrayerCalc.julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const sun = PrayerCalc.sunPosition(jd);
    const noon = PrayerCalc.fixHour(12 - sun.equation - lng / 15.0);

    const fajr = PrayerCalc.sunAngleTime(-method.fajrAngle, jd, lat, lng, true);
    const sunrise = PrayerCalc.sunAngleTime(-0.8333, jd, lat, lng, true);
    const dhuhr = noon + (1 / 60.0); // +1 min buffer
    const asr = PrayerCalc.asrTime(asrFactor, jd, lat, lng);
    const maghrib = PrayerCalc.sunAngleTime(-0.8333, jd, lat, lng, false);
    
    let isha;
    if (method.ishaInterval) {
      isha = maghrib + method.ishaInterval / 60.0;
    } else {
      isha = PrayerCalc.sunAngleTime(-method.ishaAngle, jd, lat, lng, false);
    }

    const timesObj = {
      fajr: PrayerCalc.timeToDate(date, fajr + timeZone),
      sunrise: PrayerCalc.timeToDate(date, sunrise + timeZone),
      dhuhr: PrayerCalc.timeToDate(date, dhuhr + timeZone),
      asr: PrayerCalc.timeToDate(date, asr + timeZone),
      maghrib: PrayerCalc.timeToDate(date, maghrib + timeZone),
      isha: PrayerCalc.timeToDate(date, isha + timeZone)
    };

    // حساب الثلث الأخير من الليل وصلاة الضحى
    const tomorrowFajr = new Date(timesObj.fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    const nightDurationMs = tomorrowFajr.getTime() - timesObj.maghrib.getTime();
    
    timesObj.midnight = new Date(timesObj.maghrib.getTime() + nightDurationMs / 2);
    timesObj.lastThird = new Date(tomorrowFajr.getTime() - nightDurationMs / 3);
    
    timesObj.duhaStart = new Date(timesObj.sunrise.getTime() + 15 * 60000);
    timesObj.duhaEnd = new Date(timesObj.dhuhr.getTime() - 15 * 60000);

    return timesObj;
  },

  timeToDate: (baseDate, hoursFloat) => {
    hoursFloat = PrayerCalc.fixHour(hoursFloat);
    const hours = Math.floor(hoursFloat);
    const minutesFloat = (hoursFloat - hours) * 60.0;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.round((minutesFloat - minutes) * 60.0);

    const d = new Date(baseDate);
    d.setHours(hours, minutes, seconds, 0);
    return d;
  },

  getHijriDate: (date) => {
    date = date || new Date();
    try {
      const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      return formatter.format(date);
    } catch(e) {
      return 'التقويم الهجري';
    }
  }
};

// ==========================================
// 2. نظام تتبع الصلوات والأصوات والأذكار
// ==========================================
const PrayerSystem = {
  _timer: null,
  _listeners: [],
  _urgentTriggered: {},
  _currentAudio: null,

  init() {
    this.startLiveTracker();
    this.scheduleNativeNotifications();
  },

  scheduleNativeNotifications() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) {
        const LN = window.Capacitor.Plugins.LocalNotifications;
        LN.requestPermissions().then(perm => {
          if (perm.display === 'granted') {
            const times = this.getTodayTimes();
            const prayers = [
              { id: 101, key: 'fajr', title: '🕌 حان الآن موعد أذان الفجر' },
              { id: 102, key: 'dhuhr', title: '🕌 حان الآن موعد أذان الظهر' },
              { id: 103, key: 'asr', title: '🕌 حان الآن موعد أذان العصر' },
              { id: 104, key: 'maghrib', title: '🕌 حان الآن موعد أذان المغرب' },
              { id: 105, key: 'isha', title: '🕌 حان الآن موعد أذان العشاء' }
            ];
            
            const notifs = [];
            const now = new Date();
            prayers.forEach(p => {
              const pDate = times[p.key];
              if (pDate && pDate > now) {
                notifs.push({
                  id: p.id,
                  title: p.title,
                  body: 'حي على الصلاة، حي على الفلاح — تقبل الله طاعتكم 🤲',
                  schedule: { at: pDate },
                  sound: 'adhan_makkah.wav',
                  smallIcon: 'ic_stat_icon_config_sample'
                });
              }
            });

            if (notifs.length) {
              LN.schedule({ notifications: notifs }).catch(() => {});
            }
          }
        }).catch(() => {});
      }
    } catch(e) {}
  },

  getSettings() {
    const st = Store.state;
    return (st && st.prayerSettings) ? st.prayerSettings : {
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
  },

  saveSettings(patch) {
    const cur = this.getSettings();
    Store.state.prayerSettings = Object.assign({}, cur, patch);
    Store.save();
    this.notifyUpdate();
    this.scheduleNativeNotifications();
  },

  getTodayTimes(date) {
    date = date || new Date();
    const cfg = this.getSettings();
    const times = PrayerCalc.calculate(date, cfg.lat, cfg.lng, cfg.method, cfg.asrMethod);

    if (cfg.adjustments) {
      if (cfg.adjustments.fajr) times.fajr.setMinutes(times.fajr.getMinutes() + Number(cfg.adjustments.fajr));
      if (cfg.adjustments.dhuhr) times.dhuhr.setMinutes(times.dhuhr.getMinutes() + Number(cfg.adjustments.dhuhr));
      if (cfg.adjustments.asr) times.asr.setMinutes(times.asr.getMinutes() + Number(cfg.adjustments.asr));
      if (cfg.adjustments.maghrib) times.maghrib.setMinutes(times.maghrib.getMinutes() + Number(cfg.adjustments.maghrib));
      if (cfg.adjustments.isha) times.isha.setMinutes(times.isha.getMinutes() + Number(cfg.adjustments.isha));
    }

    return times;
  },

  getPrayerState(prayerKey, now, todayTimes, log) {
    now = now || new Date();
    todayTimes = todayTimes || this.getTodayTimes(now);
    log = log || Store.getPrayerLog(localDateStr(now));

    const pDate = todayTimes[prayerKey];
    const logVal = log[prayerKey];

    if (logVal === 'on_time' || logVal === true || logVal === 'jamaah') return 'done_on_time';
    if (logVal === 'qada') return 'done_qada';

    if (now < pDate) {
      return 'upcoming';
    }

    const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const idx = prayerOrder.indexOf(prayerKey);
    let nextPrayerTime = null;

    if (prayerKey === 'isha') {
      nextPrayerTime = todayTimes.midnight || todayTimes.fajr;
    } else if (idx > -1 && idx < prayerOrder.length - 1) {
      nextPrayerTime = todayTimes[prayerOrder[idx + 1]];
    }

    if (nextPrayerTime && now >= nextPrayerTime) {
      return 'missed';
    }

    return 'current';
  },

  canCheckPrayer(prayerKey, now, todayTimes) {
    now = now || new Date();
    todayTimes = todayTimes || this.getTodayTimes(now);
    const pDate = todayTimes[prayerKey];
    return now >= pDate;
  },

  getSequentialStatus(now) {
    now = now || new Date();
    const todayTimes = this.getTodayTimes(now);
    const log = Store.getPrayerLog(localDateStr(now));

    const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const pDates = prayerOrder.map(k => ({ key: k, date: todayTimes[k] }));

    let current = null;
    let next = null;

    for (let i = 0; i < pDates.length; i++) {
      if (now < pDates[i].date) {
        next = pDates[i];
        current = i > 0 ? pDates[i - 1] : null;
        break;
      }
    }

    if (!next) {
      current = pDates[pDates.length - 1];
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = this.getTodayTimes(tomorrow);
      next = { key: 'fajr', date: tomorrowTimes.fajr, isTomorrow: true };
    }

    if (!current) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yestTimes = this.getTodayTimes(yesterday);
      current = { key: 'isha', date: yestTimes.isha, isYesterday: true };
    }

    const totalWindowMs = next.date.getTime() - current.date.getTime();
    const elapsedMs = Math.max(0, now.getTime() - current.date.getTime());
    const remainingMs = Math.max(0, next.date.getTime() - now.getTime());
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalWindowMs) * 100)));

    // فحص التنبيه العاجل (قبل خروج الوقت بـ 15 دقيقة)
    const isUrgent = remainingMs > 0 && remainingMs <= 15 * 60000;
    if (isUrgent && current && current.key !== 'sunrise') {
      const curState = this.getPrayerState(current.key, now, todayTimes, log);
      if (curState === 'current' && !this._urgentTriggered[current.key + '_' + localDateStr(now)]) {
        this._urgentTriggered[current.key + '_' + localDateStr(now)] = true;
        this.triggerUrgentWarning(current.key);
      }
    }

    const formatRemaining = (ms) => {
      const totalSec = Math.floor(ms / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      if (h > 0) return `${h} س و ${m} د و ${s} ث`;
      if (m > 0) return `${m} دقيقة و ${s} ثانية`;
      return `${s} ثانية`;
    };

    const formatCountdown = (ms) => {
      const totalSec = Math.floor(ms / 1000);
      const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
      const s = String(totalSec % 60).padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    const nextMeta = PRAYER_KEYS.find(p => p.key === next.key) || { name: next.key, icon: '🕌' };
    const curMeta = PRAYER_KEYS.find(p => p.key === current.key) || { name: current.key, icon: '🕌' };

    const sequence = PRAYER_KEYS.map(p => {
      const pDate = todayTimes[p.key];
      const state = p.isSunrise ? 'sunrise' : this.getPrayerState(p.key, now, todayTimes, log);
      const canCheck = p.isSunrise ? false : this.canCheckPrayer(p.key, now, todayTimes);

      return {
        key: p.key,
        name: p.name,
        icon: p.icon,
        time: pDate,
        timeFormatted: formatTime(pDate.getHours() + ':' + String(pDate.getMinutes()).padStart(2, '0')),
        state,
        canCheck,
        isSunrise: !!p.isSunrise,
        isCurrent: current.key === p.key,
        isNext: next.key === p.key
      };
    });

    return {
      now,
      current: { key: current.key, name: curMeta.name, icon: curMeta.icon, date: current.date },
      next: { key: next.key, name: nextMeta.name, icon: nextMeta.icon, date: next.date },
      remainingMs,
      remainingText: formatRemaining(remainingMs),
      countdownText: formatCountdown(remainingMs),
      progressPercent,
      isUrgent,
      sequence,
      todayTimes,
      hijriDate: PrayerCalc.getHijriDate(now)
    };
  },

  getQiblaDirection(lat, lng) {
    const meccaLat = 21.422487;
    const meccaLng = 39.826206;

    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (meccaLat * Math.PI) / 180;
    const Δλ = ((meccaLng - lng) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let θ = Math.atan2(y, x);
    let bearing = ((θ * 180) / Math.PI + 360) % 360;

    return Math.round(bearing);
  },

  detectLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('المتصفح لا يدعم تحديد الموقع'));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          PrayerSystem.saveSettings({
            city: 'custom_gps',
            cityName: 'موقعي الحالي (GPS 📍)',
            lat,
            lng
          });
          resolve({ lat, lng });
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  },

  startLiveTracker() {
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      this.notifyUpdate();
      this.checkAndTriggerLiveAdhan();
    }, 1000);
  },

  _playedAdhans: {},

  checkAndTriggerLiveAdhan() {
    const settings = this.getSettings();
    if (!settings.notifications || settings.adhanSound === 'silent') return;

    const now = new Date();
    const todayTimes = this.getTodayTimes(now);
    const dateKey = localDateStr(now);
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    prayers.forEach(pKey => {
      const pTime = todayTimes[pKey];
      if (!pTime) return;
      const diffMs = now.getTime() - pTime.getTime();
      const uniqueKey = `${dateKey}_${pKey}`;

      if (diffMs >= 0 && diffMs <= 45000 && !this._playedAdhans[uniqueKey]) {
        this._playedAdhans[uniqueKey] = true;
        this.triggerAdhanAlert(pKey, pTime);
      }
    });
  },

  triggerAdhanAlert(prayerKey, pTime) {
    const meta = PRAYER_KEYS.find(p => p.key === prayerKey) || { name: prayerKey };
    this.playAdhan(this.getSettings().adhanSound || 'makkah');

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🕌 حان الآن موعد أذان صلاة ${meta.name}`, {
          body: `حي على الصلاة، حي على الفلاح — التوقيت المحلي لمدينة ${this.getSettings().cityName || 'القاهرة'}`,
          icon: 'assets/icon-only.png'
        });
      } catch(e) {}
    }

    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`🕌 حان الآن موعد أذان صلاة ${meta.name}! الله أكبر الله أكبر`, 'info');
    }
  },

  onUpdate(fn) {
    this._listeners.push(fn);
  },

  notifyUpdate() {
    const status = this.getSequentialStatus();
    this._listeners.forEach(fn => {
      try { fn(status); } catch(e) {}
    });
  },

  // ===== محرك تشغيل أصوات الشيوخ والأذان والتنبيهات الصوتية الحقيقية =====
  playAdhan(reciterId) {
    reciterId = reciterId || this.getSettings().adhanSound || 'makkah';
    if (reciterId === 'silent') return;

    this.stopAudio();

    const reciters = [
      { id: 'makkah', name: 'أذان الحرم المكي الشريف 🕋', audioUrl: 'assets/audio/adhan_makkah.mp3' },
      { id: 'afasy', name: 'الشيخ مشاري راشد العفاسي 🇰🇼', audioUrl: 'assets/audio/adhan_afasy.mp3' },
      { id: 'egypt_refaat', name: 'الشيخ محمد رفعت 🇪🇬', audioUrl: 'assets/audio/adhan_egypt_refaat.mp3' },
      { id: 'egypt_minshawi', name: 'الشيخ محمد صديق المنشاوي 🇪🇬', audioUrl: 'assets/audio/adhan_egypt_minshawi.mp3' },
      { id: 'abdulbasit', name: 'الشيخ عبد الباسط عبد الصمد 🇪🇬', audioUrl: 'assets/audio/adhan_abdulbasit.mp3' },
      { id: 'qatami', name: 'الشيخ ناصر القطامي 🇸🇦', audioUrl: 'assets/audio/adhan_qatami.mp3' },
      { id: 'aqsa', name: 'أذان المسجد الأقصى المبارك 🇵🇸', audioUrl: 'assets/audio/adhan_aqsa.mp3' },
      { id: 'banna', name: 'الشيخ محمود علي البنا 🇪🇬', audioUrl: 'assets/audio/adhan_banna.mp3' }
    ];

    const reciter = reciters.find(r => r.id === reciterId) || reciters[0];

    if (reciter && reciter.audioUrl) {
      try {
        const audio = new Audio(reciter.audioUrl);
        audio.volume = 1.0;
        this._currentAudio = audio;
        audio.play().catch(() => {
          this.synthesizeTakbeerat();
        });
        return audio;
      } catch(e) {
        this.synthesizeTakbeerat();
      }
    } else {
      this.synthesizeTakbeerat();
    }
  },

  synthesizeTakbeerat() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const takbeerNotes = [
        [392, 0.0, 0.45],  // G4
        [440, 0.45, 0.45], // A4
        [523, 0.9, 0.7],   // C5
        [440, 1.6, 0.4],   // A4
        [392, 2.0, 0.8],   // G4
        [523, 3.0, 0.5],   // C5
        [587, 3.5, 0.5],   // D5
        [659, 4.0, 0.9]    // E5
      ];

      takbeerNotes.forEach(([freq, start, dur]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.1);
      });

      setTimeout(() => { try { ctx.close(); } catch(e){} }, 6000);
    } catch(e) {}
  },

  playVoiceReminder(prayerName) {
    if (typeof App !== 'undefined' && App.sound) {
      App.sound('warn');
    }
    // Web Audio alert chime for urgent reminder
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.4);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.45);
      });
      setTimeout(() => { try { ctx.close(); } catch(e){} }, 1500);
    } catch(e) {}
  },

  stopAudio() {
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
      } catch(e) {}
      this._currentAudio = null;
    }
  },

  triggerUrgentWarning(prayerKey) {
    const meta = PRAYER_KEYS.find(p => p.key === prayerKey) || { name: prayerKey };
    this.playVoiceReminder(meta.name);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⚠️ تنبيه عاجل: متبقي 15 دقيقة على انتهاء وقت صلاة ${meta.name}!`, {
          body: `سارع بأداء صلاة ${meta.name} قبل أذان الصلاة التالية. تقبل الله طاعتكم 🤲`,
          icon: 'icon.svg',
          badge: 'icon.svg',
          tag: 'urgent-prayer-' + prayerKey
        });
      } catch(e) {}
    }

    if (navigator.vibrate) {
      try { navigator.vibrate([300, 150, 300, 150, 600]); } catch(e) {}
    }

    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`⚠️ تنبيه عاجل: متبقي 15 دقيقة على انتهاء وقت صلاة ${meta.name}! سارع بأدائها 🤲`, 'warning');
    }
  },

  // ===== موسوعة الأذكار المأثورة الصحيحة الكاملة =====
  athkar: {
    morning: [
      { id: 'm1', text: 'آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.', count: 1, fadl: 'من قالها حين يصبح أُجير من الجن حتى يمسي (صحيح الترغيب).' },
      { id: 'm2', text: 'قراءة سورة الإخلاص، وسورة الفلق، وسورة الناس (3 مرات).', count: 3, fadl: 'تكفيك من كل شيء (رواه أبو داود والترمذي وصححه الألباني).' },
      { id: 'm3', text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.', count: 1, fadl: 'رواه مسلم في صحيحه.' },
      { id: 'm4', text: 'سَيِّدُ الاسْتِغْفَارِ: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.', count: 1, fadl: 'من قالها موقناً بها حين يصبح فمات من يومه دخل الجنة (صحيح البخاري).' },
      { id: 'm5', text: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ.', count: 4, fadl: 'من قالها أعتقه الله من النار (رواه أبو داود).' },
      { id: 'm6', text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.', count: 3, fadl: 'سؤال العافية والسلامة في الحواس والبدن (رواه أحمد وأبو داود).' },
      { id: 'm7', text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.', count: 7, fadl: 'من قالها سبع مرات كفاه الله ما أهمه من أمر الدنيا والآخرة (رواه أبو داود).' },
      { id: 'm8', text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.', count: 3, fadl: 'لم يضره شيء في يومه ذلك (رواه الترمذي وصححه).' },
      { id: 'm9', text: 'رَضِيتُ بِاللَّهِ رَبّاً، وَبِالْإِسْلَامِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.', count: 3, fadl: 'كان حقاً على الله أن يرضيه يوم القيامة (رواه أحمد والترمذي).' },
      { id: 'm10', text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.', count: 1, fadl: 'تفويض الأمر لله وصلاح الشأن كله (رواه الحاكم وصححه الألباني).' },
      { id: 'm11', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.', count: 3, fadl: 'تزن ساعات طويلة من الذكر والتسبيح (صحيح مسلم).' },
      { id: 'm12', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً.', count: 1, fadl: 'دعاء النبي ﷺ بعد صلاة الصبح (رواه ابن ماجه وصححه الألباني).' },
      { id: 'm13', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.', count: 10, fadl: 'من صلى عليّ عشراً حين يصبح أدركته شفاعتي يوم القيامة (رواه الطبراني).' },
      { id: 'm14', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ (100 مرة).', count: 100, fadl: 'مغفرة الذنوب وانشراح الصدر (صحيح البخاري ومسلم).' }
    ],

    evening: [
      { id: 'e1', text: 'آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...', count: 1, fadl: 'من قالها حين يمسي أُجير من الجن حتى يصبح.' },
      { id: 'e2', text: 'قراءة سورة الإخلاص، وسورة الفلق، وسورة الناس (3 مرات).', count: 3, fadl: 'تكفيك من كل شيء.' },
      { id: 'e3', text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.', count: 1, fadl: 'حفظ الليل واللجوء إلى الله (صحيح مسلم).' },
      { id: 'e4', text: 'سَيِّدُ الاسْتِغْفَارِ: اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ...', count: 1, fadl: 'من قالها موقناً بها ومات في ليلته دخل الجنة.' },
      { id: 'e5', text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', count: 3, fadl: 'لم يضره شيء ولا حمة (سم ولذع) في تلك الليلة (صحيح مسلم).' },
      { id: 'e6', text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.', count: 3, fadl: 'حفظ تام من كل سوء ومكروه.' },
      { id: 'e7', text: 'رَضِيتُ بِاللَّهِ رَبّاً، وَبِالْإِسْلَامِ دِيناً، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيّاً.', count: 3, fadl: 'رضا الله تعالى يوم القيامة.' },
      { id: 'e8', text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.', count: 7, fadl: 'كفاية الهموم كلها.' },
      { id: 'e9', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.', count: 10, fadl: 'إدراك شفاعة النبي ﷺ.' }
    ],

    postPrayer: [
      { id: 'p1', text: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.', count: 1 },
      { id: 'p2', text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.', count: 1 },
      { id: 'p3', text: 'سُبْحَانَ اللَّهِ (33 مرة).', count: 33 },
      { id: 'p4', text: 'الْحَمْدُ لِلَّهِ (33 مرة).', count: 33 },
      { id: 'p5', text: 'اللَّهُ أَكْبَرُ (33 مرة).', count: 33 },
      { id: 'p6', text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (تمام المائة).', count: 1, fadl: 'غُفرت خطاياه وإن كانت مثل زبد البحر (صحيح مسلم).' },
      { id: 'p7', text: 'قراءة آية الكرسي والمعوذات والإخلاص دبر كل صلاة.', count: 1, fadl: 'لم يمنعه من دخول الجنة إلا أن يموت (صحيح النسائي).' }
    ],

    study: [
      { id: 's1', title: 'قبل بدء المذاكرة والاستذكار', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ فَهْمَ النَّبِيِّينَ، وَحِفْظَ الْمُرْسَلِينَ، وَإِلْهَامَ الْمَلَائِكَةِ الْمُقَرَّبِينَ. اللَّهُمَّ اجْعَلْ أَلْسِنَتَنَا عَامِرَةً بِذِكْرِكَ، وَقُلُوبَنَا بِخَشْيَتِكَ، وَأَسْرَارَنَا بِطَاعَتِكَ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.' },
      { id: 's2', title: 'عند تعسر الفهم والمسائل الصعبة', text: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً، يَا مُعَلِّمَ إِبْرَاهِيمَ عَلِّمْنِي، وَيَا مُفَهِّمَ سُلَيْمَانَ فَهِّمْنِي.' },
      { id: 's3', title: 'بعد الانتهاء من المذاكرة', text: 'اللَّهُمَّ إِنِّي أَسْتَوْدِعُكَ مَا قَرَأْتُ وَمَا حَفِظْتُ وَمَا تَعَلَّمْتُ، فَرُدَّهُ عِنْدَ حَاجَتِي إِلَيْهِ، وَلَا تُنْسِنِيهِ يَا رَبَّ الْعَالَمِينَ.' },
      { id: 's4', title: 'عند دخول قاعة الامتحان', text: 'رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَل لِّي مِن لَّدُنكَ سُلْطَاناً نَّصِيراً. رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي.' }
    ],

    sleep: [
      { id: 'sl1', text: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.', count: 1 },
      { id: 'sl2', text: 'قراءة سورة الملك (المنجية من عذاب القبر).', count: 1, fadl: 'تشفع لصاحبها حتى يُغفر له (رواه أبو داود والترمذي وصححه الألباني).' },
      { id: 'sl3', text: 'التسبيح 33، والتحميد 33، والتكبير 34 عند النوم.', count: 1, fadl: 'خير من خادم وقوة للبدن (صحيح البخاري ومسلم).' }
    ]
  },

  // ===== مشغل الأذان التلقائي بالوقت الحقيقي =====
  startRealtimeTicker() {
    if (this._tickerInterval) clearInterval(this._tickerInterval);
    this._notifiedPrayers = this._notifiedPrayers || {};

    const check = () => {
      const now = new Date();
      const currentHHMM = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      const todayStr = localDateStr();

      try {
        const times = this.getTodayTimes();
        ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(pKey => {
          const prayerTime = times[pKey];
          if (!prayerTime) return;

          const notifyKey = `${todayStr}_${pKey}_adhan`;

          // تشغيل الأذان الصوتي الفعلي عند حلول الدقيقة المحددة
          if (currentHHMM === prayerTime && !this._notifiedPrayers[notifyKey]) {
            this._notifiedPrayers[notifyKey] = true;
            this.triggerAdhanAlert(pKey);
          }
        });
      } catch(e) {}
    };

    this._tickerInterval = setInterval(check, 10000);
    check();
  },

  triggerAdhanAlert(prayerKey) {
    const meta = PRAYER_KEYS.find(p => p.key === prayerKey) || { name: prayerKey };
    const settings = this.getSettings();
    if (!settings.notifications) return;

    // تشغيل ملف الصوت الخاص بالشيخ المختار
    this.playAdhan(settings.adhanSound || 'makkah');

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🕌 حان الآن موعد أذان صلاة ${meta.name}`, {
          body: `حي على الصلاة، حي على الفلاح — التوقيت المحلي لمدينة ${settings.cityName || 'القاهرة'}`,
          icon: 'icon.svg',
          badge: 'icon.svg',
          tag: 'adhan-' + prayerKey,
          requireInteraction: true
        });
      } catch(e) {}
    }

    if (navigator.vibrate) {
      try { navigator.vibrate([500, 250, 500, 250, 1000]); } catch(e) {}
    }

    // إظهار نافذة الأذان الفخمة
    const modalId = 'adhan-live-popup';
    let el = document.getElementById(modalId);
    if (!el) {
      el = document.createElement('div');
      el.id = modalId;
      el.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300';
      document.body.appendChild(el);
    }

    const reciter = ADHAN_RECITERS.find(r => r.id === settings.adhanSound) || ADHAN_RECITERS[0];

    el.innerHTML = `
      <div class="sh-card p-6 md:p-8 rounded-3xl max-w-md w-full text-center space-y-5 bg-gradient-to-b from-indigo-950/90 to-slate-900/95 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="w-20 h-20 mx-auto rounded-3xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-4xl shadow-inner animate-pulse">
          🕌
        </div>
        <div class="space-y-1 relative z-10">
          <span class="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300">الله أكبر • الله أكبر</span>
          <h3 class="text-2xl font-black text-white mt-1">حان الآن موعد أذان صلاة ${meta.name}</h3>
          <p class="text-xs text-indigo-200">حسب توقيت ${settings.cityName || 'القاهرة'}</p>
          <p class="text-[11px] text-amber-400 mt-1 font-bold">بصوت: ${reciter.name}</p>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2 relative z-10">
          <button onclick="PrayerSystem.stopAudio(); document.getElementById('adhan-live-popup')?.remove();" class="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg active:scale-95 transition">
            إيقاف الصوت والدعاء 🤲
          </button>
          <a href="prayer.html" onclick="document.getElementById('adhan-live-popup')?.remove();" class="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition">
            فتح صفحة الصلاة ➔
          </a>
        </div>
      </div>
    `;

    if (typeof App !== 'undefined' && App.toast) {
      App.toast(`🕌 حان الآن موعد أذان صلاة ${meta.name}!`, 'success');
    }
  }
};

PrayerSystem.init();
PrayerSystem.startRealtimeTicker();
