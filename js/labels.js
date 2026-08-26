// js/labels.js — Dynamic UI Labels حسب نوع الدراسة (school / uni)
const LABELS = {
  school: {
    pageTitle: 'المدرسين 👨‍🏫',
    pageName: 'المدرسين والسناتر',
    groupsPageTitle: 'المجموعات 👥',
    lecturesPageTitle: 'المحاضرات 🎬',
    tasksPageTitle: 'المهام والواجبات ✅',
    examsPageTitle: 'الامتحانات والاختبارات 📝',
    subjectsPageTitle: 'المواد الدراسية 🗂️',
    resourcesPageTitle: 'روابط سريعة ومصادر 🔗',
    statsPageTitle: 'إحصائياتي ومتابعة التقدم 📊',
    newBtn: '+ مدرس جديد',
    newGroupBtn: '+ مجموعة جديدة',
    newLectureBtn: '+ محاضرة جديدة',
    newTaskBtn: '+ مهمة جديدة',
    newExamBtn: '+ امتحان جديد',
    newSubjectBtn: '+ مادة جديدة',
    newResourceBtn: '+ رابط جديد',
    teacher: 'مدرس',
    teacherPlural: 'مدرسين',
    teacherTitle: 'أستاذ / مدرس',
    navTeachers: 'المدرسين',
    navGroups: 'المجموعات',
    navLectures: 'محاضرات',
    location: 'سنتر / قاعة',
    sessionType: 'حصة / درس',
    groupTypeCourse: 'كورس',
    groupTypePrivate: 'خصوصي',
    groupTypeOther: 'أخرى',
    lectureType: {
      lecture: 'محاضرة',
      section: 'سكشن',
      lab: 'معمل'
    },
    searchPlaceholder: 'ابحث في مهامك وامتحاناتك...',
    greeting: 'طالب مدرسة',
    onboardingGradeLabel: 'إنت في صف إيه؟',
    onboardingRoleSchool: 'طالب مدرسة',
    onboardingRoleUni: 'طالب جامعة'
  },
  uni: {
    pageTitle: 'الدكاترة والكورسات 🎓',
    pageName: 'الدكاترة والكورسات',
    groupsPageTitle: 'الكورسات والمجموعات 👥',
    lecturesPageTitle: 'محاضرات وسكاشن 🎬',
    tasksPageTitle: 'الواجبات والمهام ✅',
    examsPageTitle: 'الامتحانات والكويزات 📝',
    subjectsPageTitle: 'المواد الدراسية 🗂️',
    resourcesPageTitle: 'روابط سريعة ومصادر 🔗',
    statsPageTitle: 'إحصائياتي ومتابعة التقدم 📊',
    newBtn: '+ دكتور / كورس جديد',
    newGroupBtn: '+ مجموعة / كورس جديد',
    newLectureBtn: '+ محاضرة جديدة',
    newTaskBtn: '+ واجب جديد',
    newExamBtn: '+ امتحان جديد',
    newSubjectBtn: '+ مادة جديدة',
    newResourceBtn: '+ مصدر جديد',
    teacher: 'دكتور',
    teacherPlural: 'دكاترة',
    teacherTitle: 'دكتور / معيد',
    navTeachers: 'الدكاترة',
    navGroups: 'الكورسات',
    navLectures: 'محاضرات',
    location: 'مدرج / معمل / أكاديمية',
    sessionType: 'محاضرة / سكشن / معمل',
    groupTypeCourse: 'كورس',
    groupTypePrivate: 'سكشن',
    groupTypeOther: 'ساعات مكتبية',
    lectureType: {
      lecture: 'محاضرة دكتور',
      section: 'سكشن معيد',
      lab: 'معمل / Lab'
    },
    searchPlaceholder: 'ابحث في مهامك ومحاضراتك...',
    greeting: 'طالب جامعة',
    onboardingGradeLabel: 'إنت في سنة كام؟',
    onboardingRoleSchool: 'طالب مدرسة',
    onboardingRoleUni: 'طالب جامعة'
  }
};

const L = {
  // الـ role الحالي (افتراضي school لو مفيش)
  get role() {
    var r = (Store.state && Store.state.user && Store.state.user.role) || 'school';
    return r === 'uni' ? 'uni' : 'school';
  },

  // جلب label مع fallback
  get(key) {
    var role = this.role;
    return (LABELS[role] && LABELS[role][key]) || (LABELS.school[key] || '');
  },

  // لتغيير label معين
  set(key, val) {
    var role = this.role;
    LABELS[role][key] = val;
  },

  // لتطبيق الـ label على عنصر HTML عن طريق data-label
  applyAll() {
    var self = this;
    document.querySelectorAll('[data-label]').forEach(function (el) {
      var key = el.dataset.label;
      el.textContent = self.get(key);
    });
    document.querySelectorAll('[data-label-html]').forEach(function (el) {
      var key = el.dataset.labelHtml;
      el.innerHTML = self.get(key);
    });
  },

  // اختصارات
  isSchool() { return this.role === 'school'; },
  isUni() { return this.role === 'uni'; }
};
