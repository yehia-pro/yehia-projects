// js/onboarding.js — معالج الإعداد الأولي الإجباري (Onboarding)
// يدعم التخصيص الكامل للطلاب (مدرسي / جامعي) والمعلمين مع إلزامية ملء البيانات

const ONB_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16','#06b6d4','#a855f7','#e11d48','#0ea5e9','#d946ef','#84cc16'];

const GRADES = [
  { id:'prep1', label:'الأول الإعدادي' },
  { id:'prep2', label:'الثاني الإعدادي' },
  { id:'prep3', label:'الثالث الإعدادي' },
  { id:'g1', label:'الأول الثانوي' },
  { id:'g2', label:'الثاني الثانوي' },
  { id:'g3', label:'الثالث الثانوي' }
];

const TEACHER_STAGES = [
  { id: 'prep', label: '🏫 المرحلة الإعدادية', desc: 'صفوف المرحلة الإعدادية' },
  { id: 'sec', label: '🎓 المرحلة الثانوية', desc: 'صفوف المرحلة الثانوية' },
  { id: 'uni', label: '🏛️ المرحلة الجامعية', desc: 'الكليات والمعاهد العليا' }
];

const TEACHER_SUBJECT_PRESETS = [
  'الفيزياء', 'الكيمياء', 'الأحياء', 'الرياضيات', 'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'التاريخ', 'الجغرافيا', 'الفلسفة والمنطق', 'علم النفس والاجتماع', 'الجيولوجيا', 'الحاسب والبرمجة', 'مواد طبية', 'مواد هندسية'
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
  _clickHandler: null,
  history: [],
  d: {
    name: '',
    role: '',
    grade: '',
    specialty: '',
    faculty: '',
    facultyName: '',
    year: '',
    term: '',
    count: 0,
    weeklyGoal: 4,
    picked: [],
    teacherSubject: '',
    teacherStages: [],
    planetName: ''
  },

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
      picked: st.subjects.map(function(s) { return s.name; }),
      teacherSubject: u.teacherSubject || '',
      teacherStages: u.teacherStages || [],
      planetName: u.planetName || ''
    };
    if ([2,4,6,8].indexOf(this.d.weeklyGoal) === -1) { this.d.weeklyGoal = 4; }
    this.build();
  },

  build() {
    var root = document.getElementById('onboarding-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'onboarding-root';
      root.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto';
      document.body.appendChild(root);
    }
    this.root = root;
    this.render();
  },

  close() {
    if (this.root) {
      if (this.root.remove) {
        this.root.remove();
      } else if (this.root.parentNode) {
        this.root.parentNode.removeChild(this.root);
      }
    }
    this.root = null;
    if (typeof App !== 'undefined' && App.refreshUI) {
      App.refreshUI();
    }
  },

  render() {
    if (!this.root) { return; }
    this.root.innerHTML = this.screen(this.step);

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

    // إعداد حقول الإدخال
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

    var tSubInp = document.getElementById('onb-teacher-subject');
    if (tSubInp) {
      tSubInp.value = this.d.teacherSubject;
      tSubInp.focus();
    }

    var tPlanetInp = document.getElementById('onb-planet-name');
    if (tPlanetInp) {
      tPlanetInp.value = this.d.planetName;
      tPlanetInp.focus();
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
    return this.d.role === 'school' ? 'طالب مدرسة / ثانوي' : this.d.role === 'uni' ? 'طالب جامعة' : this.d.role === 'teacher' ? 'معلم / دكتور جامعي' : '';
  },

  levelLabel() {
    var d = this.d;
    if (d.role === 'teacher') {
      var stages = (d.teacherStages || []).map(function(s) {
        var found = TEACHER_STAGES.find(function(ts) { return ts.id === s; });
        return found ? found.label.replace(/^[^\s]+\s/, '') : s;
      }).join(' و ');
      return (d.teacherSubject || 'معلم') + (stages ? ' (' + stages + ')' : '');
    }
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
    if (this.d.role === 'teacher') return 6;
    if (this.d.role === 'school') {
      if (this.d.grade === 'g2' || this.d.grade === 'g3') return 9;
      return 8;
    }
    if (this.d.role === 'uni') return 9;
    return 3;
  },

  screen(n) {
    var d = this.d;
    var self = this;
    var isSpec = d.role === 'school' && (d.grade === 'g2' || d.grade === 'g3');

    var backBtn = n > 0
      ? '<button data-a="back" class="onb-back-btn flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition active:scale-95" title="رجوع">&#8594;</button>'
      : '<div class="w-10"></div>';

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
        '<div class="w-10"></div>' +
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

    // ===== Step 0: Welcome =====
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
        '<h2 class="text-2xl font-black text-slate-900 dark:text-white">أهلاً بك في Student Hub 🚀</h2>' +
        '<p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">المنظومة التعليمية الذكية للطلاب والمعلمين</p>' +
        '</div>' +
        '<p class="text-xs text-slate-500 dark:text-slate-400">يرجى ملء بياناتك لتخصيص بيئة التطبيق بدقة بحسب مسارك الأكاديمي.</p>' +
        '<button data-a="next" class="sh-btn primary w-full text-base py-3.5 shadow-xl font-black">ابدأ الإعداد الآن ←</button>' +
        '</div>'
      );
    }

    // ===== Step 1: Name (إجباري) =====
    if (n === 1) {
      return shell(
        header('✏️','ما هو اسمك أو لقبك؟','سيظهر في جدولك وحسابك الشخصي') +
        '<div class="space-y-3">' +
        '<input id="onb-name" type="text" placeholder="اكتب اسمك هنا (مثال: أ. محمود / أحمد محمد)…" class="sh-input w-full text-lg text-center font-bold" autocomplete="name" />' +
        '<p class="text-xs text-center text-amber-500 font-bold">⚠️ ملء الاسم إجباري للمتابعة</p>' +
        '<button data-a="next" class="sh-btn primary w-full font-black">التالي ←</button>' +
        '</div>'
      );
    }

    // ===== Step 2: Role (إجباري) =====
    if (n === 2) {
      return shell(
        header('🎯','من أنت؟','اختر مسارك لتخصيص الواجهة المناسبة لك') +
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">' +
        this.roleCard('school','🎒','طالب مدرسي','إعدادي أو ثانوي') +
        this.roleCard('uni','🎓','طالب جامعي','كلية أو معهد') +
        this.roleCard('teacher','👨‍🏫','معلم / دكتور','استوديو المجموعات والكواكب') +
        '</div>' +
        (d.role ? '<button data-a="next" class="sh-btn primary w-full mt-3 font-black">التالي ←</button>' : '<p class="text-xs text-center text-slate-400 mt-2">اختر مسارك للمتابعة 👆</p>')
      );
    }

    // ===== مسار المعلم (TEACHER FLOW) =====
    if (d.role === 'teacher') {
      // Step 3: Teacher Subject
      if (n === 3) {
        return shell(
          header('📚','ما هي المادة التي تدرسها؟','اختر أو اكتب اسم مادتك الدراسية') +
          '<div class="space-y-3">' +
          '<input id="onb-teacher-subject" type="text" placeholder="اكتب اسم المادة (مثال: فيزياء، كيمياء، لغة عربية)…" class="sh-input w-full text-center font-bold" value="' + (d.teacherSubject || '') + '" />' +
          '<div class="flex flex-wrap justify-center gap-1.5 max-h-36 overflow-y-auto p-1">' +
          TEACHER_SUBJECT_PRESETS.map(function(sub) {
            var active = d.teacherSubject === sub;
            return '<button data-a="teacher-sub-chip" data-v="' + sub + '" class="px-2.5 py-1 rounded-xl text-xs font-bold transition ' + (active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300') + '">' + sub + '</button>';
          }).join('') +
          '</div>' +
          '<button data-a="next" class="sh-btn primary w-full font-black mt-2">التالي ←</button>' +
          '</div>'
        );
      }

      // Step 4: Teacher Stages (إعدادي / ثانوي / جامعة بحد أقصى 2)
      if (n === 4) {
        var stages = d.teacherStages || [];
        return shell(
          header('🏫','ما هي المراحل التي تدرس لها؟','اختر مرحلة واحدة أو مرحلتين كحد أقصى') +
          '<div class="space-y-2.5">' +
          TEACHER_STAGES.map(function(stg) {
            var isSel = stages.indexOf(stg.id) > -1;
            return '<button data-a="teacher-toggle-stage" data-v="' + stg.id + '" class="sh-card !p-4 w-full text-start flex items-center justify-between transition ' + (isSel ? '!border-2 !border-indigo-500 !bg-indigo-500/10' : '') + '">' +
              '<div>' +
              '<span class="font-black text-sm text-slate-800 dark:text-white block">' + stg.label + '</span>' +
              '<span class="text-xs text-slate-400">' + stg.desc + '</span>' +
              '</div>' +
              '<span class="text-lg font-black ' + (isSel ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300') + '">' + (isSel ? '✓' : '○') + '</span>' +
              '</button>';
          }).join('') +
          '<p class="text-xs text-center text-slate-400 font-bold">تم اختيار (' + stages.length + ' من 2 كحد أقصى)</p>' +
          '<button data-a="next" class="sh-btn primary w-full font-black">التالي ←</button>' +
          '</div>'
        );
      }

      // Step 5: Teacher Planet Name & Launch
      if (n === 5) {
        return shell(
          header('🪐','ما هو اسم كوكبك التعليمي؟','الاسم الذي سيظهر لطلابك عند مشاركة المذكرات والجدول') +
          '<div class="space-y-3">' +
          '<input id="onb-planet-name" type="text" placeholder="اسم الكوكب (مثال: كوكب العباقرة في الفيزياء)…" class="sh-input w-full text-center font-bold" value="' + (d.planetName || 'كوكب ' + (d.teacherSubject || 'المادة')) + '" />' +
          '<p class="text-xs text-slate-500 text-center leading-relaxed">سيتم إنشاء كوكب مادتك وتوليد كود دعوة سري لمشاركته مع طلابك فوراً!</p>' +
          '<button data-a="finish" class="sh-btn primary w-full text-base py-3.5 shadow-xl font-black">🚀 دخول استوديو المعلم والبدء</button>' +
          '</div>'
        );
      }
    }

    // ===== مسار الطالب المدرسي والجامعي (STUDENT FLOW) =====
    // Step 3: Grade (school) or Year (uni)
    if (n === 3) {
      if (d.role === 'school') {
        return shell(
          header('📚','إنت في صف إيه؟','اختر صفك الدراسي (من أولى إعدادي إلى ثالثة ثانوي)') +
          '<div class="space-y-2 max-h-72 overflow-y-auto">' +
          GRADES.map(function(g) {
            var active = d.grade === g.id;
            return '<button data-a="grade" data-v="' + g.id + '" class="sh-card !p-3.5 w-full text-start flex items-center justify-between ' + (active ? '!border-2 !border-indigo-500' : '') + '">' +
              '<span class="font-bold text-sm text-slate-800 dark:text-white">' + g.label + '</span>' +
              '<span class="text-xs text-slate-400">' + ((g.id === 'g2' || g.id === 'g3') ? '📋 اختر التخصص بعدها' : '✏️ موادك الأساسية') + '</span>' +
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

    // Step 4: Specialty (g2/g3) or Faculty (uni)
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

    // Step 5: Term (uni)
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

    // Step: Count of subjects (students)
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
        '<button data-a="next" class="sh-btn primary w-full font-black">التالي ←</button>' +
        '</div>'
      );
    }

    // Step: Pick subjects (students)
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
        '<input id="onb-sub-input" type="text" placeholder="اسم المادة…" class="sh-input flex-1 font-bold" />' +
        '<button data-a="add-sub" class="sh-btn primary whitespace-nowrap font-bold">+ أضف</button>' +
        '</div>' +
        (sugCount ? '<button data-a="use-suggested" class="sh-btn w-full text-xs font-bold" style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3)">📋 استخدم المواد المقترحة (' + sugCount + ' مادة)</button>' : '') +
        '<div class="flex flex-wrap gap-2 min-h-[48px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">' +
        (d.picked.length ? chips : '<span class="text-sm text-slate-400 self-center">اضغط + أضف لإضافة موادك…</span>') +
        '</div>' +
        '<div class="flex justify-between items-center">' +
        '<span class="text-xs text-slate-400 font-bold">' + d.picked.length + (d.count ? ' من ' + d.count : '') + ' مادة مختارة</span>' +
        '<button data-a="next" class="sh-btn ' + (d.picked.length ? 'primary' : 'ghost') + ' text-sm font-black">التالي ←</button>' +
        '</div>' +
        '</div>'
      );
    }

    // Step: Goal & Launch (students)
    var goalStep = d.role === 'uni' ? 8 : (isSpec ? 7 : 6);
    if (n === goalStep) {
      return shell(
        header('🎯','هدفك الأسبوعي','كام ساعة مذاكرة مركزة في الأسبوع؟') +
        '<div class="space-y-4">' +
        '<div class="flex flex-wrap justify-center gap-2">' +
        [2,4,6,8,10].map(function(g) {
          return '<button data-a="goal" data-v="' + g + '" class="sh-pomo-preset ' + (d.weeklyGoal === g ? 'active' : '') + '">' + g + ' س</button>';
        }).join('') +
        '</div>' +
        '<button data-a="finish" class="sh-btn primary w-full text-base py-3.5 shadow-xl font-black">🎉 إتمام الإعداد والدخول</button>' +
        '</div>'
      );
    }

    return '';
  },

  roleCard(id, emoji, title, sub) {
    var active = this.d.role === id;
    return '<button data-a="role" data-v="' + id + '" class="sh-card !p-4 text-center cursor-pointer transition active:scale-95 ' + (active ? '!border-2 !border-indigo-500 !bg-indigo-500/10 shadow-lg' : 'hover:border-indigo-500/40') + '">' +
      '<div class="text-3xl mb-1.5">' + emoji + '</div>' +
      '<div class="font-black text-xs md:text-sm text-slate-900 dark:text-white">' + title + '</div>' +
      '<div class="text-[10px] text-slate-400 mt-0.5">' + sub + '</div>' +
      '</button>';
  },

  action(a) {
    var self = this;
    var d = this.d;
    var isSpec = d.role === 'school' && (d.grade === 'g2' || d.grade === 'g3');

    switch (a.a) {
      case 'next':
        // Mandatory Validations
        if (this.step === 1) {
          var nInp = document.getElementById('onb-name');
          if (nInp) d.name = nInp.value.trim();
          if (!d.name) {
            App.toast('يرجى كتابة اسمك للمتابعة ⚠️', 'warning');
            return;
          }
        } else if (this.step === 2) {
          if (!d.role) {
            App.toast('يرجى تحديد مسارك الأكاديمي للمتابعة ⚠️', 'warning');
            return;
          }
        } else if (d.role === 'teacher') {
          if (this.step === 3) {
            var subInp = document.getElementById('onb-teacher-subject');
            if (subInp) d.teacherSubject = subInp.value.trim();
            if (!d.teacherSubject) {
              App.toast('يرجى إدخال اسم المادة التي تدرسها ⚠️', 'warning');
              return;
            }
          } else if (this.step === 4) {
            if (!d.teacherStages || !d.teacherStages.length) {
              App.toast('يرجى اختيار مرحلة تدريس واحدة على الأقل ⚠️', 'warning');
              return;
            }
          }
        }

        this.history.push(this.step);
        this.step = this._nextStep(this.step, d, isSpec);
        this.render();
        break;

      case 'back':
        if (this.history.length) {
          this.step = this.history.pop();
          this.render();
        }
        break;

      case 'role':
        d.role = a.v;
        this.history.push(this.step);
        this.step = 3;
        this.render();
        break;

      case 'teacher-sub-chip':
        d.teacherSubject = a.v;
        var tInp = document.getElementById('onb-teacher-subject');
        if (tInp) tInp.value = a.v;
        this.render();
        break;

      case 'teacher-toggle-stage':
        if (!Array.isArray(d.teacherStages)) d.teacherStages = [];
        var idx = d.teacherStages.indexOf(a.v);
        if (idx > -1) {
          d.teacherStages.splice(idx, 1);
        } else {
          if (d.teacherStages.length >= 2) {
            App.toast('الحد الأقصى هو اختيار مرحلتين فقط ⚠️', 'warning');
            return;
          }
          d.teacherStages.push(a.v);
        }
        this.render();
        break;

      case 'grade':
        d.grade = a.v;
        this.history.push(this.step);
        if (a.v === 'g2' || a.v === 'g3') {
          this.step = 4;
        } else {
          this.step = 4;
        }
        this.render();
        break;

      case 'spec':
        d.specialty = a.v;
        this.history.push(this.step);
        this.step = 5;
        this.render();
        break;

      case 'year':
        d.year = a.v;
        this.history.push(this.step);
        this.step = 4;
        this.render();
        break;

      case 'faculty':
        d.faculty = a.v;
        this.history.push(this.step);
        this.step = 5;
        this.render();
        break;

      case 'term':
        d.term = a.v;
        this.history.push(this.step);
        this.step = 6;
        this.render();
        break;

      case 'count':
        d.count = parseInt(a.v, 10) || 0;
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

  _nextStep(current, d, isSpec) {
    if (d.role === 'teacher') {
      return current + 1;
    }
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

  finish() {
    var d = this.d;
    var st = Store.state;

    // Handle Teacher Finish
    if (d.role === 'teacher') {
      var pInp = document.getElementById('onb-planet-name');
      if (pInp && pInp.value.trim()) d.planetName = pInp.value.trim();

      st.user = {
        name: d.name,
        role: 'teacher',
        teacherSubject: d.teacherSubject || 'عام',
        teacherStages: d.teacherStages || ['sec'],
        planetName: d.planetName || 'كوكب ' + d.teacherSubject,
        onboardingDone: true,
        xp: 100,
        level: 1
      };

      // Create initial Teacher Planet automatically
      Store.createTeacherPlanet({
        name: d.planetName || 'كوكب ' + d.teacherSubject,
        subject: d.teacherSubject,
        grade: (d.teacherStages || []).join(' + ')
      });

      Store.save();
      this.close();
      App.toast('مرحباً بك يا أستاذنا في Student Hub! تم تجهيز استوديو المجموعات وكوكبك بنجاح 🪐 (+100 XP)', 'success');
      setTimeout(function() {
        if (!window.location.pathname.endsWith('subjects.html')) {
          window.location.href = 'subjects.html';
        } else {
          window.location.reload();
        }
      }, 400);
      return;
    }

    // Handle Student Finish
    var norm = function(s) { return String(s).replace(/^(ال|الت|الا|الآ)/, ''); };
    var subs = d.picked.map(function(n, i) {
      return {
        id: 'sub_' + (Date.now() + i),
        name: n,
        color: ONB_COLORS[i % ONB_COLORS.length]
      };
    });

    st.user = {
      name: d.name,
      role: d.role,
      grade: d.grade,
      specialty: d.specialty,
      faculty: d.faculty,
      facultyName: d.facultyName,
      year: d.year,
      term: d.term,
      count: d.count || subs.length,
      weeklyGoal: d.weeklyGoal,
      onboardingDone: true,
      xp: 50,
      level: 1
    };

    st.subjects = subs;
    Store.save();
    this.close();
    App.toast('تم إعداد حسابك الدراسي بنجاح! بالتوفيق والنجاح 🌟 (+50 XP)', 'success');
  }
};
