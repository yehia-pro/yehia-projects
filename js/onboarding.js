// js/onboarding.js — معالج الإعداد الأولي (Onboarding)
const ONB_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16','#06b6d4','#a855f7','#e11d48','#0ea5e9','#d946ef','#84cc16'];

const GRADES = [
  { id:'prep1', label:'الأول الإعدادي' },
  { id:'prep2', label:'الثاني الإعدادي' },
  { id:'prep3', label:'الثالث الإعدادي' },
  { id:'g1', label:'الأول الثانوي' },
  { id:'g2', label:'الثاني الثانوي' },
  { id:'g3', label:'الثالث الثانوي' }
];

const SPECIALTIES = {
  g2:[
    { id:'sci', label:'علمي', subjects:['الفيزياء','الكيمياء','الأحياء','الرياضيات','اللغة العربية','اللغة الإنجليزية','اللغة الفرنسية','التربية الدينية'] },
    { id:'lit', label:'أدبي', subjects:['التاريخ','الجغرافيا','علم النفس والاجتماع','الفلسفة والمنطق','اللغة العربية','اللغة الإنجليزية','اللغة الفرنسية','التربية الدينية'] }
  ],
  g3:[
    { id:'lit', label:'أدبي', subjects:['التاريخ','الجغرافيا','علم النفس والاجتماع','الاقتصاد والإحصاء','الفلسفة والمنطق','اللغة العربية','اللغة الإنجليزية','اللغة الفرنسية','التربية الدينية'] },
    { id:'sci-s', label:'علمي علوم', subjects:['الأحياء','الكيمياء','الفيزياء','الرياضيات','اللغة العربية','اللغة الإنجليزية','اللغة الفرنسية','التربية الدينية'] },
    { id:'sci-m', label:'علمي رياضة', subjects:['الرياضيات البحتة','الرياضيات التطبيقية','الفيزياء','الكيمياء','اللغة العربية','اللغة الإنجليزية','اللغة الفرنسية','التربية الدينية'] }
  ]
};

const FACULTIES = [
  { id:'med', label:'الطب البشري', subjects:['التشريح','الفسيولوجيا','الهستولوجي','الباثولوجي','الفارماكولوجي','الكيمياء الحيوية','الميكروبيولوجي','المناعة الطبية','الأمراض الباطنية','الجراحة العامة','الطب الشرعي','الطب النسا والتوليد'] },
  { id:'dent', label:'طب الأسنان', subjects:['التشريح','الفسيولوجيا','الهستولوجي','الباثولوجي','الفارماكولوجي','تشريح الفم والفكين','أمراض الفم','الجراحة الفموية','التقويم','الحشوات والعلاج الجذري','طب أسنان الأطفال','التاجات والجسور'] },
  { id:'pharm', label:'الصيدلة', subjects:['الكيمياء العضوية','الكيمياء غير العضوية','الكيمياء الحيوية','الفارماكولوجي','الصيدلانيات','الكيمياء الصيدلانية','التغذية','السموم','الميكروبيولوجي','البيولوجيا الجزيئية'] },
  { id:'physio', label:'العلاج الطبيعي', subjects:['التشريح','الفسيولوجيا','الكينيسيولوجيا','العلاج الطبيعي العضلي','العلاج الطبيعي العصبي','التأهيل الوظيفي','العلاج بالحركة','الـ ELECTROTHERAPY','التمارين العلاجية','التشخيص الوظيفي'] },
  { id:'nurs', label:'التمريض', subjects:['التشريح','الفسيولوجيا','التمريض الباطني','التمريض الجراحي','التمريض التخصصي','صحة عامة','الغذية العلاجية','الإسعافات الأولية','التثقيف الصحي'] },
  { id:'vet', label:'الطب البيطري', subjects:['التشريح البيطري','الفسيولوجيا البيطرية','الميكروبيولوجي','الأمراض الباطنية','الجراحة البيطرية','الأدوية البيطرية','التغذية','علم الحيوان','الأمراض المعدية'] },
  { id:'eng-mech', label:'هندسة ميكانيكية', subjects:['الرياضيات','الفيزياء الهندسية','الاستاتيكا','الديناميكا','مقاومة المواد','الديناميكا الحرارية','السوائل','الآلات والمعدات','التصنيع'] },
  { id:'eng-elec', label:'هندسة كهربائية', subjects:['الرياضيات','الفيزياء','الدوائر الكهربائية','الإلكترونيات الرقمية','التحكم الآلي','معالجة الإشارات','الاتصالات'] },
  { id:'eng-pet', label:'هندسة البترول', subjects:['الرياضيات','الفيزياء','الكيمياء','الاستاتيكا','هندسة الآبار','الاستكشاف','الإنتاج','النفط والغاز'] },
  { id:'eng-civil', label:'هندسة مدنية', subjects:['الرياضيات','الفيزياء','مقاومة المواد','الخرسانة المسلحة','الإنشاءات','الجيوتكنيك','الهيدروليكا','المساحة'] },
  { id:'eng-arch', label:'الهندسة المعمارية', subjects:['الرياضيات','الفيزياء','التصميم المعماري','الخرائطية','تاريخ العمارة'] },
  { id:'eng-chem', label:'هندسة كيميائية', subjects:['الرياضيات','الفيزياء','الكيمياء','الثرموديناميكا','عمليات النقل','الديناميكا الكيميائية','التصميم الكيميائي'] },
  { id:'cs', label:'الحاسبات والذكاء الاصطناعي', subjects:['هياكل البيانات','الخوارزميات','البرمجة','قواعد البيانات','شبكات الحاسب','الذكاء الاصطناعي','هندسة البرمجيات','التوافقيات','أنظمة التشغيل','أمن الحاسب'] },
  { id:'com', label:'التجارة وإدارة الأعمال', subjects:['المحاسبة المالية','الاقتصاد الكلي','الاقتصاد الجزئي','الإحصاء','إدارة الأعمال','التسويق','المالية العامة','القانون التجاري','إدارة الموارد البشرية'] },
  { id:'sci', label:'العلوم', subjects:['الكيمياء العضوية','الكيمياء غير العضوية','الفيزياء الحديثة','الفيزياء النووية','النبات','الحيوان','الجيولوجيا','الميكروبيولوجي','الرياضيات'] },
  { id:'arts', label:'الآداب', subjects:['اللسانية التطبيقية','الترجمة','الأدب العربي','الأدب الإنجليزي','القواعد البلاغية','الفلسفة','التاريخ','الجغرافيا'] },
  { id:'edu', label:'التربية', subjects:['سيكولوجية التعليم','المناهج وطرق التدريس','تكنولوجيا التعليم','اللسانية','الترجمة','الأدب العربي','القواعد'] },
  { id:'alsun', label:'الألسن', subjects:['اللسانية العامة','الترجمة الشفهية','الترجمة الكتابية','الأدب المقارن','الصوتيات'] },
  { id:'law', label:'الحقوق', subjects:['القانون المدني','القانون الجنائي','القانون التجاري','الأحوال الشخصية','القانون الدولي العام','القانون الدولي الخاص','القانون الإداري','القانون الدستوري'] },
  { id:'media', label:'الإعلام والاتصال', subjects:['الأساسيات الصحفية','العلاقات العامة','الإعلام الرقمي','الراديو والتلفزيون','الإنتاج الإعلامي','السوشيال ميديا','التصوير الصحفي'] },
  { id:'fine', label:'الفنون الجميلة', subjects:['الرسم','التصميم الجرافيكي','تاريخ الفن','التشريح الفني','النحت','الخط العربي','التصوير الفوتوغرافي'] },
  { id:'tourism', label:'السياحة والفنادق', subjects:['إدارة الفنادق','التسويق السياحي','الاقتصاد السياحي','إدارة المطاعم','الجغرافيا السياحية'] },
  { id:'agri', label:'الزراعة', subjects:['الميكروبيولوجي','علم النبات','التربة','الوراثة','الأمراض النباتية','الهندسة الزراعية','التغذية النباتية'] },
  { id:'social', label:'الخدمة الاجتماعية', subjects:['الأخصائية الاجتماعية','علم النفس الاجتماعي','الإحصاء الميداني','إدارة المؤسسات'] },
  { id:'sport', label:'التربية الرياضية', subjects:['التشريح','الفسيولوجيا','التدريب الرياضي','التغذية','الإصابات الرياضية','الألعاب الرياضية'] },
  { id:'other', label:'كلية أخرى', subjects:[] }
];

const UNI_TERMS = [
  { id:'1', label:'الترم الأول' },
  { id:'2', label:'الترم الثاني' }
];

const UNI_YEARS = [
  { id:'1', label:'السنة الأولى' },
  { id:'2', label:'السنة الثانية' },
  { id:'3', label:'السنة الثالثة' },
  { id:'4', label:'السنة الرابعة' },
  { id:'5', label:'السنة الخامسة' },
  { id:'6', label:'السنة السادسة' }
];

const Onboarding = {
  step: 0,
  editing: false,
  root: null,
  _clickHandler: null,   // نحفظ ref للـ handler عشان نشيله
  history: [],
  d: { name:'', role:'', grade:'', specialty:'', faculty:'', facultyName:'', year:'', term:'', count:0, weeklyGoal:4, picked:[] },

  start(editing) {
    var st = Store.state;
    var u = st.user;
    if (editing && !u.onboardingDone) { return; }
    this.editing = !!editing;
    this.step = 0;
    this.history = [];
    this.d = {
      name: u.name || '',
      role: u.role || '',
      grade: u.grade || '',
      specialty: u.specialty || '',
      faculty: u.faculty || '',
      facultyName: u.facultyName || '',
      year: u.year || '',
      term: u.term || '',
      count: u.count || st.subjects.length || 0,
      weeklyGoal: u.weeklyGoal || 4,
      picked: st.subjects.map(function(s) { return s.name; })
    };
    if ([2,4,6,8].indexOf(this.d.weeklyGoal) === -1) { this.d.weeklyGoal = 4; }
    this.build();
  },

  build() {
    if (!this.root) {
      this.root = document.createElement('div');
      this.root.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-sm';
      document.body.appendChild(this.root);
      document.body.style.overflow = 'hidden';
    }
    this.render();
  },

  close() {
    if (this.root) {
      // شيل الـ listener قبل الحذف
      if (this._clickHandler) {
        this.root.removeEventListener('click', this._clickHandler);
        this._clickHandler = null;
      }
      this.root.remove();
      this.root = null;
      document.body.style.overflow = '';
    }
  },

  render() {
    if (!this.root) { return; }
    this.root.innerHTML = this.screen(this.step);

    // ===== إصلاح: شيل الـ listener القديم قبل ما تضيف واحد جديد =====
    if (this._clickHandler) {
      this.root.removeEventListener('click', this._clickHandler);
    }
    var self = this;
    this._clickHandler = function(e) {
      var btn = e.target.closest('[data-a]');
      if (!btn) { return; }
      e.stopPropagation();
      self.action({ a: btn.dataset.a, v: btn.dataset.v });
    };
    this.root.addEventListener('click', this._clickHandler);

    // إعداد الـ inputs
    var nameInp = document.getElementById('onb-name');
    if (nameInp) {
      nameInp.value = this.d.name;
      nameInp.focus();
      nameInp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var v = nameInp.value.trim();
          if (v) { self.d.name = v; self.action({ a:'next' }); }
        }
      });
    }
    var subInp = document.getElementById('onb-sub-input');
    if (subInp) {
      subInp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var v = subInp.value.trim();
          if (v) { subInp.value = ''; self.addSub(v); }
        }
      });
    }
    var cntInp = document.getElementById('onb-count');
    if (cntInp) {
      cntInp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { self.action({ a:'next' }); }
      });
    }
    var goalInp = document.getElementById('onb-goal-input');
    if (goalInp) {
      goalInp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { self.action({ a:'next' }); }
      });
    }
  },

  dots() {
    var total = this.totalSteps();
    var self = this;
    return Array.from({ length: total }, function(_, i) {
      var cls = i < self.step ? 'bg-indigo-400' : (i === self.step ? 'bg-white' : 'bg-white/30');
      return '<span class="w-2 h-2 rounded-full ' + cls + '"></span>';
    }).join('');
  },

  suggested() {
    var list = [];
    var d = this.d;
    if (d.role === 'school' && d.grade) {
      if ((d.grade === 'g2' || d.grade === 'g3') && d.specialty) {
        var specs = SPECIALTIES[d.grade] || [];
        var sp = specs.find(function(x) { return x.id === d.specialty; });
        if (sp) { list = sp.subjects.slice(); }
      }
    } else if (d.role === 'uni' && d.faculty) {
      var f = FACULTIES.find(function(x) { return x.id === d.faculty; });
      if (f) { list = f.subjects.slice(); }
    }
    return list;
  },

  roleLabel() {
    return this.d.role === 'school' ? 'طالب مدرسة' : this.d.role === 'uni' ? 'طالب جامعة' : '';
  },

  levelLabel() {
    var d = this.d;
    if (d.role === 'school' && d.grade) {
      var g = GRADES.find(function(x) { return x.id === d.grade; });
      if (g && (d.grade === 'g2' || d.grade === 'g3') && d.specialty) {
        var specs = SPECIALTIES[d.grade] || [];
        var sp = specs.find(function(x) { return x.id === d.specialty; });
        return g.label + ' - ' + (sp ? sp.label : '');
      }
      return g ? g.label : '';
    }
    if (d.role === 'uni' && d.faculty) {
      var f = FACULTIES.find(function(x) { return x.id === d.faculty; });
      var y = UNI_YEARS.find(function(x) { return x.id === d.year; });
      var t = UNI_TERMS.find(function(x) { return x.id === d.term; });
      return (y ? y.label + ' - ' : '') + (f ? f.label : '') + (t ? ' - ' + t.label : '');
    }
    return '';
  },

  totalSteps() {
    if (this.d.role === 'school') {
      if (this.d.grade === 'g2' || this.d.grade === 'g3') return 9;
      return 8;
    }
    if (this.d.role === 'uni') return 9;
    return 3; // لو لسه محددش role
  },

  screen(n) {
    var d = this.d;
    var self = this;
    var isSpec = d.role === 'school' && (d.grade === 'g2' || d.grade === 'g3');

    // زرار الرجوع بيظهر من خطوة 1 فأكثر
    var backBtn = n > 0
      ? '<button data-a="back" class="onb-back-btn flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition active:scale-95" title="رجوع">&#8594;</button>'
      : '<div class="w-10"></div>';

    // زرار تخطي / إلغاء متاح دائماً لمنع تعليق الشاشة
    var cancelBtn = '<button data-a="skip" class="onb-skip-btn text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 flex items-center gap-1 transition active:scale-95" title="تخطي والدخول للتطبيق"><span>تخطي ✕</span></button>';

    var dotsLine = '<div class="flex gap-1.5 items-center">' + this.dots() + '</div>';

    var shell = function(inner) {
      return '<div class="sh-card !rounded-3xl p-6 md:p-8 w-full max-w-md my-auto shadow-2xl border border-indigo-500/20 bg-white/95 dark:bg-[#121826]/95 backdrop-blur-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">' +
        '<div class="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>' +
        '<div class="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>' +
        '<div class="onb-header-row flex items-center justify-between mb-5 relative z-10">' +
        backBtn +
        '<div class="flex flex-col items-center gap-1.5">' +
        '<div class="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">خطوة ' + (n+1) + ' من ' + self.totalSteps() + '</div>' +
        dotsLine +
        '</div>' +
        cancelBtn +
        '</div>' +
        '<div class="relative z-10">' + inner + '</div>' +
        '</div>';
    };

    var header = function(emoji, title, sub) {
      return '<div class="flex flex-col items-center gap-2.5 mb-6 text-center">' +
        '<div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600/20 to-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl shadow-inner animate-bounce">' + emoji + '</div>' +
        '<h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">' + title + '</h2>' +
        (sub ? '<p class="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">' + sub + '</p>' : '') +
        '</div>';
    };

    // ===== Step 0: Welcome / Stunning Splash Intro =====
    if (n === 0) {
      return shell(
        '<div class="flex flex-col items-center text-center space-y-4 py-2">' +
        '<div class="relative">' +
        '<div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 flex items-center justify-center shadow-2xl border-2 border-indigo-400/40 p-3 transform hover:scale-105 transition duration-300">' +
        '<img src="logo/student_hub_logo.png" alt="Student Hub" class="w-full h-full object-contain filter drop-shadow-md" onerror="this.outerHTML=\'<span class=\\\'text-4xl\\\'>🎓</span>\'">' +
        '</div>' +
        '<span class="absolute -top-1 -right-1 flex h-4 w-4"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span class="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span></span>' +
        '</div>' +
        '<div class="space-y-1">' +
        '<h2 class="text-2xl font-black text-slate-900 dark:text-white">أهلاً بيك في Student Hub 🚀</h2>' +
        '<p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">منصتك الدراسية الذكية والشاملة</p>' +
        '</div>' +
        '<div class="grid grid-cols-2 gap-2 w-full text-start py-2">' +
        '<div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><span>📚</span><span>المهام والمحاضرات</span></div>' +
        '<div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><span>🕌</span><span>مواقيت الصلاة والأذكار</span></div>' +
        '<div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><span>⏱️</span><span>التركيز وبومودورو</span></div>' +
        '<div class="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><span>🎯</span><span>الدرجات والإحصائيات</span></div>' +
        '</div>' +
        '<p class="text-xs text-slate-500 dark:text-slate-400">خد دقيقة واحدة لتخصيص التطبيق على حسب مرحلتك الدراسية</p>' +
        '<button data-a="next" class="sh-btn primary w-full text-base py-3.5 shadow-xl font-black">ابدأ التخصيص الآن ←</button>' +
        '</div>'
      );
    }

    // ===== Step 1: Name =====
    if (n === 1) {
      return shell(
        header('✏️','إيه اسمك؟','هيفضل محفوظ عندك بس') +
        '<div class="space-y-3">' +
        '<input id="onb-name" type="text" placeholder="اكتب اسمك هنا…" class="sh-input w-full text-lg text-center" autocomplete="given-name" />' +
        '<p class="text-xs text-center text-slate-400">هذا الحقل مطلوب ⚠️</p>' +
        '<button data-a="next" class="sh-btn primary w-full">التالي ←</button>' +
        '</div>'
      );
    }

    // ===== Step 2: Role =====
    if (n === 2) {
      return shell(
        header('🎯','إنت فين؟','اختر نوع دراستك') +
        '<div class="grid grid-cols-2 gap-3">' +
        this.roleCard('school','🎒','طالب مدرسة','إعدادي أو ثانوي') +
        this.roleCard('uni','🎓','طالب جامعة','كلية وتخصص') +
        '</div>' +
        (d.role ? '<button data-a="next" class="sh-btn primary w-full mt-3">التالي ←</button>' : '')
      );
    }

    // ===== Step 3: Grade (school) or Year (uni) =====
    if (n === 3) {
      if (d.role === 'school') {
        return shell(
          header('📚','إنت في صف إيه؟','اختر صفك الدراسي') +
          '<div class="space-y-2 max-h-72 overflow-y-auto">' +
          GRADES.map(function(g) {
            var active = d.grade === g.id;
            return '<button data-a="grade" data-v="' + g.id + '" class="sh-card !p-3.5 w-full text-start flex items-center justify-between ' + (active ? '!border-2 !border-indigo-500' : '') + '">' +
              '<span class="font-bold text-sm text-slate-800 dark:text-white">' + g.label + '</span>' +
              '<span class="text-xs text-slate-400">' + ((g.id === 'g2' || g.id === 'g3') ? '📋 اختر التخصص بعدها' : '✏️ هتكتب موادك') + '</span>' +
              '</button>';
          }).join('') +
          '</div>'
        );
      } else {
        return shell(
          header('📅','إنت في سنة كام؟','') +
          '<div class="space-y-2 max-h-72 overflow-y-auto">' +
          UNI_YEARS.map(function(y) {
            var active = d.year === y.id;
            return '<button data-a="year" data-v="' + y.id + '" class="sh-card !p-3.5 w-full text-start ' + (active ? '!border-2 !border-indigo-500' : '') + '">' +
              '<span class="font-bold text-sm text-slate-800 dark:text-white">' + y.label + '</span>' +
              '</button>';
          }).join('') +
          '</div>'
        );
      }
    }

    // ===== Step 4: Specialty (g2/g3) or Faculty (uni) =====
    if (n === 4) {
      if (d.role === 'school' && (d.grade === 'g2' || d.grade === 'g3')) {
        var opts = SPECIALTIES[d.grade] || [];
        return shell(
          header('🧭','اختر تخصصك','') +
          '<div class="space-y-2">' +
          opts.map(function(sp) {
            var active = d.specialty === sp.id;
            return '<button data-a="spec" data-v="' + sp.id + '" class="sh-card !p-4 w-full text-start flex items-center justify-between ' + (active ? '!border-2 !border-indigo-500' : '') + '">' +
              '<span class="font-bold text-slate-800 dark:text-white">' + sp.label + '</span>' +
              '<span class="sh-chip bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">' + sp.subjects.length + ' مادة</span>' +
              '</button>';
          }).join('') +
          '</div>'
        );
      } else if (d.role === 'uni') {
        return shell(
          header('🏫','اختر كليتك','') +
          '<div class="space-y-2 max-h-64 overflow-y-auto pl-1">' +
          FACULTIES.map(function(f) {
            var active = d.faculty === f.id;
            return '<button data-a="faculty" data-v="' + f.id + '" class="sh-card !p-3 w-full text-start flex items-center justify-between ' + (active ? '!border-2 !border-indigo-500' : '') + '">' +
              '<span class="font-bold text-sm text-slate-800 dark:text-white">' + f.label + '</span>' +
              '<span class="text-xs text-slate-400">' + (f.id === 'other' ? 'يدوي' : (f.subjects.length ? f.subjects.length + ' مادة' : '—')) + '</span>' +
              '</button>';
          }).join('') +
          '</div>'
        );
      }
    }

    // ===== Step 5: Term (uni) =====
    if (n === 5 && d.role === 'uni') {
      return shell(
        header('🗓️','إنت في ترم إيه؟','') +
        '<div class="grid grid-cols-2 gap-3">' +
        UNI_TERMS.map(function(t) {
          var active = d.term === t.id;
          return '<button data-a="term" data-v="' + t.id + '" class="sh-card !p-5 text-center ' + (active ? '!border-2 !border-indigo-500 !bg-indigo-500/10' : '') + '">' +
            '<div class="text-2xl mb-1">' + (t.id === '1' ? '🌱' : '🌿') + '</div>' +
            '<span class="font-bold text-slate-800 dark:text-white">' + t.label + '</span>' +
            '</button>';
        }).join('') +
        '</div>'
      );
    }

    // ===== خطوة عدد المواد =====
    // uni=6, spec school=5, non-spec school=4
    var countStep = d.role === 'uni' ? 6 : (isSpec ? 5 : 4);
    if (n === countStep) {
      return shell(
        header('🔢','عندك كام مادة؟','هتقدر تزيد أو تنقص بعدين') +
        '<div class="space-y-4">' +
        '<div class="flex flex-wrap justify-center gap-2">' +
        [4,6,8,10,12].map(function(c) {
          return '<button data-a="count" data-v="' + c + '" class="sh-pomo-preset ' + (d.count === c ? 'active' : '') + '">' + c + '</button>';
        }).join('') +
        '</div>' +
        '<div class="relative">' +
        '<input id="onb-count" type="number" min="1" max="20" placeholder="أو اكتب رقم مخصص (1–20)…" class="sh-input w-full text-center" value="' + (d.count || '') + '" />' +
        '</div>' +
        '<button data-a="next" class="sh-btn primary w-full">التالي ←</button>' +
        '</div>'
      );
    }

    // ===== خطوة المواد =====
    var subjStep = d.role === 'uni' ? 7 : (isSpec ? 6 : 5);
    if (n === subjStep) {
      var chips = d.picked
        .map(function(s, i) {
          return '<button data-a="pick" data-v="' + i + '" class="sh-chip cursor-pointer hover:opacity-70 transition" style="background:' + ONB_COLORS[i % ONB_COLORS.length] + '33;color:' + ONB_COLORS[i % ONB_COLORS.length] + ';border:1.5px solid ' + ONB_COLORS[i % ONB_COLORS.length] + '66">' + escapeHtml(s) + ' ✕</button>';
        })
        .join('');
      var sugCount = self.suggested().length;
      return shell(
        header('🗂️','اختار موادك','اضغط على المادة عشان تشيلها') +
        '<div class="space-y-3">' +
        '<div class="flex gap-2">' +
        '<input id="onb-sub-input" type="text" placeholder="اسم المادة…" class="sh-input flex-1" />' +
        '<button data-a="add-sub" class="sh-btn primary whitespace-nowrap">+ أضف</button>' +
        '</div>' +
        (sugCount ? '<button data-a="use-suggested" class="sh-btn w-full text-xs" style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3)">📋 استخدم المواد المقترحة (' + sugCount + ' مادة)</button>' : '') +
        '<div class="flex flex-wrap gap-2 min-h-[48px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">' +
        (d.picked.length ? chips : '<span class="text-sm text-slate-400 self-center">اضغط + أضف لإضافة موادك…</span>') +
        '</div>' +
        '<div class="flex justify-between items-center">' +
        '<span class="text-xs text-slate-400 font-bold">' + d.picked.length + (d.count ? ' من ' + d.count : '') + ' مادة مختارة</span>' +
        '<button data-a="next" class="sh-btn ' + (d.picked.length ? 'primary' : 'ghost') + ' text-sm">التالي ←</button>' +
        '</div>' +
        '</div>'
      );
    }

    // ===== خطوة الهدف الأسبوعي (school فقط) =====
    var goalStep = d.role === 'school' ? (isSpec ? 7 : 6) : -1;
    if (n === goalStep && d.role === 'school') {
      return shell(
        header('⏱️','هدف المذاكرة الأسبوعي','كام ساعة تحب تذاكر في الأسبوع؟') +
        '<div class="space-y-4">' +
        '<div class="flex flex-wrap justify-center gap-2">' +
        [5,10,15,20,30].map(function(g) {
          return '<button type="button" data-a="goal" data-v="' + g + '" class="sh-pomo-preset ' + (d.weeklyGoal === g ? 'active' : '') + '">' + g + ' س</button>';
        }).join('') +
        '</div>' +
        '<div class="relative">' +
        '<input id="onb-goal-input" type="number" min="1" max="80" placeholder="أو اكتب عدد ساعات مخصص (1–80)…" class="sh-input w-full text-center" value="' + (d.weeklyGoal || '') + '" />' +
        '</div>' +
        '<button data-a="next" class="sh-btn primary w-full">التالي ←</button>' +
        '</div>'
      );
    }

    // ===== Review screen (آخر شاشة) =====
    var subsChips = d.picked
      .map(function(s, i) {
        return '<span class="sh-chip" style="background:' + ONB_COLORS[i % ONB_COLORS.length] + '22;color:' + ONB_COLORS[i % ONB_COLORS.length] + ';border:1px solid ' + ONB_COLORS[i % ONB_COLORS.length] + '44">' + escapeHtml(s) + '</span>';
      })
      .join('');

    return shell(
      header('✅','كده كل حاجة جاهزة!','راجع بياناتك وابدأ') +
      '<div class="space-y-2 text-sm bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">' +
      '<div class="flex justify-between"><span class="text-slate-400 font-bold">الاسم</span><span class="font-bold text-slate-800 dark:text-white">' + escapeHtml(d.name || '—') + '</span></div>' +
      '<div class="flex justify-between"><span class="text-slate-400 font-bold">الدراسة</span><span class="font-bold text-slate-800 dark:text-white">' + self.roleLabel() + '</span></div>' +
      '<div class="flex justify-between"><span class="text-slate-400 font-bold">المستوى</span><span class="font-bold text-slate-800 dark:text-white text-end">' + escapeHtml(self.levelLabel() || '—') + '</span></div>' +
      (d.role === 'school' ? '<div class="flex justify-between"><span class="text-slate-400 font-bold">الهدف الأسبوعي</span><span class="font-bold text-slate-800 dark:text-white">' + d.weeklyGoal + ' ساعات</span></div>' : '') +
      '<div class="flex justify-between"><span class="text-slate-400 font-bold">عدد المواد</span><span class="font-bold text-slate-800 dark:text-white">' + d.picked.length + '</span></div>' +
      '<div><span class="text-slate-400 font-bold text-xs">المواد</span><div class="flex flex-wrap gap-1.5 mt-2">' + (d.picked.length ? subsChips : '<span class="text-slate-400 text-xs">بدون مواد</span>') + '</div></div>' +
      '</div>' +
      '<button data-a="finish" class="sh-btn success w-full text-base py-3">تمام، ابدأ 🎉</button>'
    );
  },

  roleCard(role, emoji, label, sub) {
    var active = this.d.role === role;
    return '<button data-a="role" data-v="' + role + '" class="sh-card !p-5 text-center border-2 transition ' +
      (active ? '!border-indigo-500 !bg-indigo-500/10' : '!border-transparent hover:!border-slate-200') + '">' +
      '<div class="text-4xl mb-2">' + emoji + '</div>' +
      '<div class="font-extrabold text-slate-800 dark:text-white">' + label + '</div>' +
      '<div class="text-xs text-slate-400 mt-1">' + sub + '</div>' +
      (active ? '<div class="mt-2 text-xs font-bold text-indigo-500">✓ محدد</div>' : '') +
      '</button>';
  },

  action(a) {
    var d = this.d;
    var self = this;
    var isSpec = d.role === 'school' && (d.grade === 'g2' || d.grade === 'g3');

    switch (a.a) {
      case 'next':
        // ===== Validation =====
        if (this.step === 1) {
          var nameEl = document.getElementById('onb-name');
          d.name = (nameEl ? nameEl.value : d.name).trim();
          if (!d.name) { App.toast('اكتب اسمك عشان نكمّل ⚠️','warning'); return; }
        }
        if (this.step === 2 && !d.role) {
          App.toast('اختار نوع الدراسة الأول ⚠️','warning'); return;
        }
        if (this.step === 3 && d.role === 'school' && !d.grade) {
          App.toast('اختار صفك الأول ⚠️','warning'); return;
        }
        if (this.step === 3 && d.role === 'uni' && !d.year) {
          App.toast('اختار سنة الجامعة الأول ⚠️','warning'); return;
        }
        if (this.step === 4 && d.role === 'school' && isSpec && !d.specialty) {
          App.toast('اختار تخصصك الأول ⚠️','warning'); return;
        }
        if (this.step === 4 && d.role === 'uni' && !d.faculty) {
          App.toast('اختار كليتك الأول ⚠️','warning'); return;
        }
        if (this.step === 5 && d.role === 'uni' && !d.term) {
          App.toast('اختار الترم الأول ⚠️','warning'); return;
        }
        // عدد المواد
        var countN = d.role === 'uni' ? 6 : (isSpec ? 5 : 4);
        if (this.step === countN) {
          var cntEl = document.getElementById('onb-count');
          var cnt = cntEl ? cntEl.value.trim() : '';
          var cv = parseInt(cnt, 10);
          if (d.count < 1 && (!cnt || isNaN(cv) || cv < 1)) {
            App.toast('حدد عدد المواد الأول ⚠️','warning'); return;
          }
          if (cnt && !isNaN(cv)) {
            if (cv < 1 || cv > 20) { App.toast('اكتب عدد من 1 لـ 20 ⚠️','warning'); return; }
            d.count = cv;
          }
        }
        // المواد
        var subjN = d.role === 'uni' ? 7 : (isSpec ? 6 : 5);
        if (this.step === subjN && !d.picked.length) {
          App.toast('اختار مادة واحدة على الأقل ⚠️','warning'); return;
        }
        // هدف الساعات الأسبوعي
        var goalStep = d.role === 'school' ? (isSpec ? 7 : 6) : -1;
        if (this.step === goalStep && d.role === 'school') {
          var goalEl = document.getElementById('onb-goal-input');
          var goalVal = goalEl ? goalEl.value.trim() : '';
          var gNum = parseInt(goalVal, 10);
          if (goalVal && !isNaN(gNum)) {
            if (gNum < 1 || gNum > 80) { App.toast('حدد عدد الساعات بين 1 و 80 ساعة ⚠️','warning'); return; }
            d.weeklyGoal = gNum;
          } else if (!d.weeklyGoal) {
            App.toast('حدد هدف الساعات الأسبوعي أولاً ⚠️','warning'); return;
          }
        }
        // ===== الانتقال الذكي =====
        this.history.push(this.step);
        this.step = this._nextStep(this.step, d, isSpec);
        this.render();
        break;

      case 'back':
        // ===== إصلاح: pop من الـ history بدون || 0 =====
        if (this.history.length > 0) {
          this.step = this.history.pop();
        }
        this.render();
        break;

      case 'cancel':
      case 'skip':
        this.skipAndEnter();
        break;

      case 'role':
        d.role = a.v;
        d.grade = ''; d.specialty = ''; d.faculty = ''; d.year = '';
        // لا تضيف لـ history عشان الـ role card بتغير في نفس الخطوة
        this.render(); // re-render نفس الخطوة عشان يظهر "محدد"
        break;

      case 'grade':
        d.grade = a.v;
        d.specialty = '';
        if (a.v !== 'g2' && a.v !== 'g3') { d.picked = []; }
        this.history.push(this.step);
        this.step = 4;
        this.render();
        break;

      case 'year':
        d.year = a.v;
        this.history.push(this.step);
        this.step = 4;
        this.render();
        break;

      case 'spec':
        d.specialty = a.v;
        d.picked = [];
        this.history.push(this.step);
        this.step = 5;
        this.render();
        break;

      case 'faculty':
        if (a.v === 'other') {
          var modal = App.showModal(
            '<h3 class="text-lg font-extrabold mb-3">🎓 اكتب اسم كليتك</h3>' +
            '<input id="custom-fac" type="text" class="sh-input w-full mb-4" placeholder="مثال: هندسة الإنتاج">' +
            '<div class="flex gap-2 justify-end">' +
            '<button class="sh-btn ghost" id="custom-fac-cancel">إلغاء</button>' +
            '<button class="sh-btn primary" id="custom-fac-save">التالي ←</button></div>'
          );
          setTimeout(function() {
            var x = document.getElementById('custom-fac');
            if (x) {
              x.focus();
              x.addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('custom-fac-save').click(); });
            }
          }, 100);
          document.getElementById('custom-fac-cancel').onclick = function() { App.closeModal(); };
          document.getElementById('custom-fac-save').onclick = function() {
            var v2 = document.getElementById('custom-fac').value.trim();
            if (!v2) { App.toast('اكتب اسم الكلية ⚠️','warning'); return; }
            self.d.faculty = 'other';
            self.d.facultyName = v2;
            self.d.picked = [];
            App.closeModal();
            self.history.push(self.step);
            self.step = 5;
            self.render();
          };
          return;
        }
        d.faculty = a.v;
        d.facultyName = '';
        d.picked = [];
        this.history.push(this.step);
        this.step = 5;
        this.render();
        break;

      case 'count':
        d.count = parseInt(a.v, 10) || 0;
        this.render();
        break;

      case 'term':
        d.term = a.v;
        this.history.push(this.step);
        this.step = 6;
        this.render();
        break;

      case 'goal':
        d.weeklyGoal = parseInt(a.v, 10) || 4;
        this.render();
        break;

      case 'use-suggested':
        d.picked = self.suggested().slice(0, d.count || self.suggested().length);
        this.render();
        break;

      case 'pick':
        this.togglePick(parseInt(a.v, 10));
        break;

      case 'add-sub':
        var subEl = document.getElementById('onb-sub-input');
        if (subEl) {
          var v2 = subEl.value.trim();
          subEl.value = '';
          if (v2) { this.addSub(v2); }
        }
        break;

      case 'finish':
        this.finish();
        break;
    }
  },

  // ===== انتقال ذكي للخطوة التالية =====
  _nextStep(current, d, isSpec) {
    if (d.role === 'school') {
      var map = { 0:1, 1:2, 2:3, 3: (isSpec ? 4 : 4), 4:5, 5:6, 6:7, 7:8 };
      return map[current] !== undefined ? map[current] : current + 1;
    } else if (d.role === 'uni') {
      var umap = { 0:1, 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9 };
      return umap[current] !== undefined ? umap[current] : current + 1;
    }
    return current + 1;
  },

  togglePick(i) {
    var d = this.d;
    if (i >= 0 && i < d.picked.length) {
      d.picked.splice(i, 1);
      this.render();
    }
  },

  addSub(v) {
    var d = this.d;
    if (d.count && d.picked.length >= d.count) {
      App.toast('كملت ' + d.count + ' مواد — شيل مادة لو عايز تضيف غيرها ⚠️','warning');
      return;
    }
    var norm = function(s) { return String(s).trim().toLowerCase().replace(/^(ال|الت|الا|الآ)/, ''); };
    var exists = d.picked.some(function(s) { return norm(s) === norm(v); });
    if (exists) { App.toast('المادة دي موجودة أصلاً ⚠️','warning'); return; }
    d.picked.push(v);
    this.render();
  },

  skipAndEnter() {
    var st = Store.state;
    if (!st.user.name) st.user.name = 'طالب متميز';
    if (!st.user.role) st.user.role = 'school';
    if (!st.user.grade) st.user.grade = 'g3';
    st.user.onboardingDone = true;
    if (!st.subjects.length) {
      st.subjects = [
        { id: 'sub-1', name: 'الرياضيات', color: '#6366f1' },
        { id: 'sub-2', name: 'الفيزياء', color: '#10b981' },
        { id: 'sub-3', name: 'اللغة الإنجليزية', color: '#f59e0b' },
        { id: 'sub-4', name: 'اللغة العربية', color: '#3b82f6' }
      ];
    }
    Store.save();
    this.close();
    App.toast('مرحباً بك في Student Hub! تم تجهيز حسابك بنجاح 🚀', 'success');
  },

  finish() {
    var d = this.d;
    var st = Store.state;
    var firstRun = !this.editing;
    var norm = function(s) { return String(s).replace(/^(ال|الت|الا|الآ)/, ''); };
    var subs = st.subjects.slice();

    if (firstRun) {
      subs = d.picked.map(function(n, i) {
        var found = st.subjects.find(function(s) { return norm(s.name) === norm(n); });
        return {
          id: found ? found.id : uid(),
          name: n,
          color: found ? found.color : ONB_COLORS[i % ONB_COLORS.length]
        };
      });
      st.subjects = subs;
      var keep = {};
      subs.forEach(function(s) { keep[s.id] = true; });
      ['tasks','exams','lectures','resources','grades','pomodoroSessions'].forEach(function(k) {
        st[k] = (st[k] || []).filter(function(it) { return it && keep[it.subjectId]; });
      });
    } else {
      var names = {};
      subs.forEach(function(s) { names[norm(s.name)] = true; });
      d.picked.forEach(function(n) {
        if (!names[norm(n)]) {
          subs.push({ id:uid(), name:n, color:ONB_COLORS[subs.length % ONB_COLORS.length] });
          names[norm(n)] = true;
        }
      });
      st.subjects = subs;
    }

    Store.update('user','',{
      name: d.name,
      role: d.role,
      grade: d.grade || '',
      specialty: d.specialty || '',
      faculty: d.faculty || '',
      facultyName: d.facultyName || '',
      year: d.year || '',
      term: d.term || '',
      count: d.count || d.picked.length,
      weeklyGoal: d.weeklyGoal,
      onboardingDone: true
    });
    Store.save();
    App.toast('تم حفظ إعداداتك 🎉','success');
    this.close();
    setTimeout(function() { location.reload(); }, 600);
  }
};
