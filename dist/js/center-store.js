/**
 * CenterStore - Offline-first Storage Engine for Tutoring Centers
 * Production-Ready Clean Storage with Dark/Light Theme Manager
 */

const CENTER_STORAGE_KEY = 'center_attendance_v2';

// Web Audio API Sound Synthesizer (Instant 0-latency acoustic feedback without external files)
const CenterAudio = {
  ctx: null,
  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  },

  playSuccess() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio feedback:', e);
    }
  },

  playMakeup() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio feedback:', e);
    }
  },

  playAlert() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(196, now + 0.12); // G3
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio feedback:', e);
    }
  }
};

// ============ Unified Theme Manager (Light & Dark) ============
const CenterTheme = {
  init() {
    const saved = localStorage.getItem('center_theme') || 'light';
    this.apply(saved);
  },

  apply(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('center_theme', theme);
    this.updateIcons(theme);
  },

  toggle() {
    const isDark = document.documentElement.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    this.apply(next);
  },

  updateIcons(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي');
    });
  }
};

// ============ Production Clean Database Store ============
const CenterStore = {
  // Clean default data without fake students
  defaultData: {
    groups: [
      { id: 'g_301', name: '3ث - الأحد 4 عصراً (السنتر الرئيسي)', year: 'الصف الثالث الثانوي', day: 'الأحد', time: '04:00 م' },
      { id: 'g_302', name: '3ث - السبت 6 مساءً (مجموعة المساء)', year: 'الصف الثالث الثانوي', day: 'السبت', time: '06:00 م' },
      { id: 'g_201', name: '2ث - الإثنين 5 مساءً (السنتر الرئيسي)', year: 'الصف الثاني الثانوي', day: 'الإثنين', time: '05:00 م' },
      { id: 'g_101', name: '1ث - الثلاثاء 4 عصراً (السنتر الرئيسي)', year: 'الصف الأول الثانوي', day: 'الثلاثاء', time: '04:00 م' }
    ],
    students: [],     // Starts completely clean for real production use
    attendance: [],   // Starts clean
    examGrades: [],   // Starts clean
    summaries: [
      {
        id: 'sum_1',
        title: 'ملخص الباب الأول: القوانين والمفاهيم الأساسية',
        subject: 'الفيزياء',
        year: 'الصف الثالث الثانوي',
        pages: '8 صفحات',
        downloadUrl: '#',
        fileSize: '2.4 MB',
        date: '2026-09-12'
      },
      {
        id: 'sum_2',
        title: 'خريطة ذهنية شاملة لقواعد النحو كاملة',
        subject: 'اللغة العربية',
        year: 'الصف الثالث الثانوي',
        pages: '12 صفحة',
        downloadUrl: '#',
        fileSize: '3.8 MB',
        date: '2026-09-08'
      },
      {
        id: 'sum_3',
        title: 'مذكرة المراجعة السريعة وملاحظات الامتحان',
        subject: 'الكيمياء',
        year: 'الصف الثاني الثانوي',
        pages: '6 صفحات',
        downloadUrl: '#',
        fileSize: '1.9 MB',
        date: '2026-09-15'
      }
    ]
  },

  getData() {
    try {
      const raw = localStorage.getItem(CENTER_STORAGE_KEY);
      if (!raw) {
        this.saveData(this.defaultData);
        return this.defaultData;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading CenterStore:', e);
      return this.defaultData;
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(CENTER_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving CenterStore:', e);
    }
  },

  // Groups
  getGroups() {
    return this.getData().groups || [];
  },

  getGroupById(id) {
    return this.getGroups().find(g => g.id === id) || null;
  },

  // Students
  getStudents() {
    return this.getData().students || [];
  },

  getStudentById(id) {
    return this.getStudents().find(s => s.id === id) || null;
  },

  getStudentByCode(code) {
    if (!code) return null;
    const cleanCode = String(code).trim();
    return this.getStudents().find(s => String(s.code).trim() === cleanCode) || null;
  },

  getPendingStudents() {
    return this.getStudents().filter(s => s.status === 'pending');
  },

  getApprovedStudents() {
    return this.getStudents().filter(s => s.status === 'approved');
  },

  // Register New Student (Requires Admin approval)
  registerStudent(formData) {
    const data = this.getData();
    const existingStudents = data.students || [];

    let maxCode = 1000;
    existingStudents.forEach(s => {
      const parsed = parseInt(s.code, 10);
      if (!isNaN(parsed) && parsed > maxCode) maxCode = parsed;
    });

    const newCode = String(maxCode + 1);
    const newStudent = {
      id: 'std_' + Date.now(),
      code: newCode,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      parentPhone: formData.parentPhone.trim(),
      sheetNo: formData.sheetNo ? formData.sheetNo.trim() : '',
      birthDate: formData.birthDate || '',
      year: formData.year,
      groupId: formData.groupId,
      gender: formData.gender || 'male',
      photo: formData.photo || '',
      avatarId: formData.avatarId || (formData.gender === 'female' ? 'girl_1' : 'boy_1'),
      status: 'pending',
      password: formData.password || '123456',
      hasUnpaidSubscription: false,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    data.students.push(newStudent);
    this.saveData(data);
    return newStudent;
  },

  approveStudent(studentId) {
    const data = this.getData();
    const student = data.students.find(s => s.id === studentId);
    if (student) {
      student.status = 'approved';
      this.saveData(data);
      return student;
    }
    return null;
  },

  rejectStudent(studentId) {
    const data = this.getData();
    const student = data.students.find(s => s.id === studentId);
    if (student) {
      student.status = 'rejected';
      this.saveData(data);
      return student;
    }
    return null;
  },

  updateStudent(studentId, updates) {
    const data = this.getData();
    const index = data.students.findIndex(s => s.id === studentId);
    if (index !== -1) {
      data.students[index] = { ...data.students[index], ...updates };
      this.saveData(data);
      return data.students[index];
    }
    return null;
  },

  searchStudents(query) {
    if (!query) return this.getStudents();
    const q = query.trim().toLowerCase();
    return this.getStudents().filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.parentPhone.includes(q) ||
      String(s.code).includes(q) ||
      (s.sheetNo && s.sheetNo.includes(q))
    );
  },

  // ============ Attendance Engine (Kiosk) ============
  recordAttendance(barcodeOrCode, activeGroupId) {
    const student = this.getStudentByCode(barcodeOrCode);
    if (!student) {
      CenterAudio.playAlert();
      return {
        success: false,
        status: 'not_found',
        message: `لم يتم العثور على طالب بالكود أو الباركود (${barcodeOrCode})`
      };
    }

    if (student.status !== 'approved') {
      CenterAudio.playAlert();
      return {
        success: false,
        status: 'unapproved',
        student,
        message: `حساب الطالب (${student.name}) لم يتم اعتماده من الإدارة بعد.`
      };
    }

    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];
    const timeFormatted = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const alreadyChecked = data.attendance.find(a => 
      a.studentId === student.id && 
      a.date === today &&
      a.activeGroupId === activeGroupId
    );

    if (alreadyChecked) {
      CenterAudio.playWarning ? CenterAudio.playWarning() : CenterAudio.playAlert();
      return {
        success: true,
        isDuplicate: true,
        status: 'already_recorded',
        student,
        record: alreadyChecked,
        message: `تم تسجيل حضور الطالب (${student.name}) بالفعل اليوم في ${alreadyChecked.time}`
      };
    }

    const isMakeup = student.groupId !== activeGroupId;
    const studentOriginalGroup = this.getGroupById(student.groupId);
    const activeGroup = this.getGroupById(activeGroupId);

    const record = {
      id: 'att_' + Date.now(),
      studentId: student.id,
      studentCode: student.code,
      studentName: student.name,
      groupId: student.groupId,
      activeGroupId: activeGroupId,
      isMakeup: isMakeup,
      date: today,
      time: timeFormatted,
      timestamp: Date.now()
    };

    data.attendance.unshift(record);
    this.saveData(data);

    if (isMakeup) {
      CenterAudio.playMakeup();
    } else {
      CenterAudio.playSuccess();
    }

    return {
      success: true,
      status: isMakeup ? 'makeup' : 'regular',
      isMakeup: isMakeup,
      student: student,
      record: record,
      studentOriginalGroup: studentOriginalGroup,
      activeGroup: activeGroup,
      hasUnpaidSubscription: !!student.hasUnpaidSubscription,
      message: isMakeup 
        ? `طالب مجموعة أخرى (${studentOriginalGroup ? studentOriginalGroup.name : 'غير محددة'}) - تم تسجيله: تعويض 🔁`
        : `حضور نظامي للمجموعة ✅`
    };
  },

  getAttendanceHistory(studentId) {
    const data = this.getData();
    return (data.attendance || []).filter(a => a.studentId === studentId);
  },

  getTodayGroupAttendance(activeGroupId) {
    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];
    return (data.attendance || []).filter(a => 
      a.date === today && 
      a.activeGroupId === activeGroupId
    );
  },

  getStudentStats(studentId) {
    const records = this.getAttendanceHistory(studentId);
    const attendedCount = records.length;
    const makeupCount = records.filter(r => r.isMakeup).length;
    const absentCount = 0; 

    return {
      attendedCount,
      makeupCount,
      absentCount,
      attendancePercentage: attendedCount > 0 ? 100 : 0
    };
  },

  getStudentGrades(studentId) {
    const data = this.getData();
    return (data.examGrades || []).filter(g => g.studentId === studentId);
  },

  // Admin Accounts
  adminAccounts: [
    { username: 'admin', phone: '01000000000', password: 'admin', name: 'إدارة السنتر الرئيسية' },
    { username: 'center', phone: '01011111111', password: '123', name: 'مسؤول الحضور' }
  ],

  // Unified Login (Identifies if Admin or Student)
  login(identifier, password) {
    const cleanIdent = String(identifier).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // 1. Check Admin Accounts
    const adminAcc = this.adminAccounts.find(a => 
      (a.username.toLowerCase() === cleanIdent || a.phone === cleanIdent) && a.password === cleanPass
    );
    if (adminAcc) {
      localStorage.setItem('center_user_role', 'admin');
      localStorage.setItem('center_admin_name', adminAcc.name);
      return { success: true, role: 'admin', user: adminAcc };
    }

    // 2. Check Students
    const students = this.getStudents();
    const student = students.find(s => 
      (s.phone === cleanIdent || String(s.code).trim() === cleanIdent) && s.password === cleanPass
    );

    if (student) {
      if (student.status !== 'approved') {
        return { success: false, error: 'pending', student: student };
      }
      localStorage.setItem('center_user_role', 'student');
      localStorage.setItem('center_active_student_id', student.id);
      return { success: true, role: 'student', student: student };
    }

    return { success: false, error: 'invalid' };
  },

  logout() {
    localStorage.removeItem('center_user_role');
    localStorage.removeItem('center_active_student_id');
    localStorage.removeItem('center_admin_name');
  },

  isAdmin() {
    return localStorage.getItem('center_user_role') === 'admin';
  },

  isStudent() {
    return localStorage.getItem('center_user_role') === 'student';
  },

  // Groups Management
  addGroup(groupData) {
    const data = this.getData();
    data.groups = data.groups || [];
    const newGroup = {
      id: 'g_' + Date.now(),
      name: groupData.name.trim(),
      year: groupData.year,
      day: groupData.day,
      time: groupData.time
    };
    data.groups.push(newGroup);
    this.saveData(data);
    return newGroup;
  },

  deleteGroup(groupId) {
    const data = this.getData();
    data.groups = (data.groups || []).filter(g => g.id !== groupId);
    this.saveData(data);
    return true;
  },

  // Reset database to completely empty
  clearAllData() {
    this.saveData(this.defaultData);
  }
};

// Initialize Theme immediately on script load to prevent any flash
CenterTheme.init();

window.CenterStore = CenterStore;
window.CenterAudio = CenterAudio;
window.CenterTheme = CenterTheme;
