import {
  initialProfiles,
  initialNotifications,
  initialSubjects,
  initialChapters,
  initialQuestions,
  initialNcertResources,
  initialShortNotes,
  initialTestSeries,
  initialMentors,
  initialMentorBookings,
  initialDiscoveries,
  initialCompetitions,
  initialPayments
} from './seedData.js';
import { DEFAULT_NEET_CONFIG, EXAM_CATEGORIES } from '../config/constants.js';

class DataStore {
  constructor() {
    this.profiles = [...initialProfiles];
    this.examCategories = [...EXAM_CATEGORIES];
    this.examConfigs = {
      neet: { ...DEFAULT_NEET_CONFIG }
    };
    this.notifications = [...initialNotifications];
    this.subjects = [...initialSubjects];
    this.chapters = [...initialChapters];
    this.questions = [...initialQuestions];
    this.ncertResources = [...initialNcertResources];
    this.shortNotes = [...initialShortNotes];
    this.testSeries = [...initialTestSeries];
    this.testAttempts = [];
    this.mentors = [...initialMentors];
    this.mentorBookings = [...initialMentorBookings];
    this.discoveries = [...initialDiscoveries];
    this.competitions = [...initialCompetitions];
    this.payments = [...initialPayments];
    this.auditLogs = [
      {
        id: 'log-001',
        userId: 'super-admin-001',
        userEmail: 'superadmin@gyanvik.edu.in',
        userRole: 'SUPER_ADMIN',
        action: 'SYSTEM_INITIALIZATION',
        resourceType: 'PLATFORM',
        resourceId: 'ROOT',
        details: { message: 'Gyanvik Core Architecture and Database Engine Initialized' },
        ipAddress: '127.0.0.1',
        createdAt: new Date().toISOString()
      }
    ];
  }

  // --- Profiles / Users ---
  findUserByEmail(email) {
    return this.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.profiles.find(p => p.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      ...userData
    };
    this.profiles.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.profiles.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.profiles[idx] = { ...this.profiles[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.profiles[idx];
  }

  getAllUsers() {
    return this.profiles.map(({ passwordHash, ...rest }) => rest);
  }

  // --- Audit Logs ---
  addAuditLog({ userId, userEmail, userRole, action, resourceType, resourceId, details, ipAddress }) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      userEmail,
      userRole,
      action,
      resourceType,
      resourceId,
      details: details || {},
      ipAddress: ipAddress || '127.0.0.1',
      createdAt: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    return log;
  }

  getAuditLogs(limit = 50) {
    return this.auditLogs.slice(0, limit);
  }

  // --- Exam Configs ---
  getExamConfig(slug = 'neet') {
    return this.examConfigs[slug] || DEFAULT_NEET_CONFIG;
  }

  updateExamConfig(slug, configUpdates, adminId) {
    if (!this.examConfigs[slug]) {
      this.examConfigs[slug] = { ...DEFAULT_NEET_CONFIG, examSlug: slug };
    }
    this.examConfigs[slug] = {
      ...this.examConfigs[slug],
      ...configUpdates,
      updatedBy: adminId,
      lastUpdated: new Date().toISOString()
    };
    return this.examConfigs[slug];
  }

  // --- Notifications ---
  getNotifications(examSlug = 'neet') {
    return this.notifications.filter(n => !n.examSlug || n.examSlug === examSlug);
  }

  getTickerNotifications(examSlug = 'neet') {
    return this.notifications.filter(n => n.isTicker && (!n.examSlug || n.examSlug === examSlug));
  }

  createNotification(notifData) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      isVerified: true,
      isTicker: true,
      lastVerifiedDate: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      ...notifData
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  updateNotification(id, updates) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.notifications[idx] = { ...this.notifications[idx], ...updates };
    return this.notifications[idx];
  }

  deleteNotification(id) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx === -1) return false;
    this.notifications.splice(idx, 1);
    return true;
  }

  // --- Academic: Subjects, Chapters, Questions ---
  getSubjects(examSlug = 'neet') {
    return this.subjects.filter(s => s.examSlug === examSlug).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  getChapters(subjectId) {
    if (!subjectId) return this.chapters;
    return this.chapters.filter(c => c.subjectId === subjectId).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  getQuestions({ subjectId, chapterId, year, difficulty, examSlug = 'neet' }) {
    return this.questions.filter(q => {
      if (examSlug && q.examSlug !== examSlug) return false;
      if (subjectId && q.subjectId !== subjectId) return false;
      if (chapterId && q.chapterId !== chapterId) return false;
      if (year && q.year !== parseInt(year, 10)) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      return true;
    });
  }

  createQuestion(qData) {
    const newQ = {
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...qData
    };
    this.questions.unshift(newQ);
    return newQ;
  }

  updateQuestion(id, updates) {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return null;
    this.questions[idx] = { ...this.questions[idx], ...updates };
    return this.questions[idx];
  }

  deleteQuestion(id) {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return false;
    this.questions.splice(idx, 1);
    return true;
  }

  // --- NCERT Resources ---
  getNcertResources(subjectId) {
    if (!subjectId) return this.ncertResources;
    return this.ncertResources.filter(r => r.subjectId === subjectId);
  }

  createNcertResource(data) {
    const resource = {
      id: `ncert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.ncertResources.unshift(resource);
    return resource;
  }

  // --- Short Notes ---
  getShortNotes(subjectId) {
    if (!subjectId) return this.shortNotes;
    return this.shortNotes.filter(n => n.subjectId === subjectId);
  }

  createShortNote(data) {
    const note = {
      id: `sn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.shortNotes.unshift(note);
    return note;
  }

  // --- Test Series & Attempts ---
  getTestSeries(examSlug = 'neet') {
    return this.testSeries.filter(t => t.examSlug === examSlug);
  }

  getTestById(id) {
    return this.testSeries.find(t => t.id === id);
  }

  createTestSeries(data) {
    const newTest = {
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.testSeries.unshift(newTest);
    return newTest;
  }

  recordTestAttempt(attemptData) {
    const attempt = {
      id: `attempt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...attemptData
    };
    this.testAttempts.unshift(attempt);
    return attempt;
  }

  getStudentAttempts(studentId) {
    return this.testAttempts.filter(a => a.studentId === studentId);
  }

  // --- Mentors & Bookings ---
  getMentors() {
    return this.mentors.filter(m => m.isActive);
  }

  createMentor(mentorData) {
    const mentor = {
      id: `mentor-${Date.now()}`,
      isActive: true,
      rating: 5.0,
      totalMentees: 0,
      createdAt: new Date().toISOString(),
      ...mentorData
    };
    this.mentors.unshift(mentor);
    return mentor;
  }

  createMentorBooking(bookingData) {
    const booking = {
      id: `booking-${Date.now()}`,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    this.mentorBookings.unshift(booking);
    return booking;
  }

  getStudentBookings(studentId) {
    return this.mentorBookings
      .filter(b => b.studentId === studentId)
      .map(b => {
        const mentor = this.mentors.find(m => m.id === b.mentorId);
        return { ...b, mentor };
      });
  }

  getAllBookings() {
    return this.mentorBookings.map(b => {
      const student = this.profiles.find(p => p.id === b.studentId);
      const mentor = this.mentors.find(m => m.id === b.mentorId);
      return {
        ...b,
        student: student ? { id: student.id, fullName: student.fullName, email: student.email, phone: student.phone } : null,
        mentor: mentor || null
      };
    });
  }

  updateBookingStatus(id, { status, mentorId, adminNotes, paymentStatus }) {
    const idx = this.mentorBookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.mentorBookings[idx] = {
      ...this.mentorBookings[idx],
      ...(status && { status }),
      ...(mentorId && { mentorId, assignedAt: new Date().toISOString() }),
      ...(adminNotes && { adminNotes }),
      ...(paymentStatus && { paymentStatus }),
      updatedAt: new Date().toISOString()
    };
    return this.mentorBookings[idx];
  }

  // --- Payments & Subscriptions ---
  createPayment(paymentData) {
    const payment = {
      id: `pay-${Date.now()}`,
      invoiceNumber: `GYAN-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
      ...paymentData
    };
    this.payments.unshift(payment);
    return payment;
  }

  getStudentPayments(studentId) {
    return this.payments.filter(p => p.studentId === studentId);
  }

  getAllPayments() {
    return this.payments.map(p => {
      const student = this.profiles.find(u => u.id === p.studentId);
      return { ...p, studentName: student?.fullName || 'Student', studentEmail: student?.email || '' };
    });
  }

  // --- Competitions ---
  getCompetitions(examSlug = 'neet') {
    return this.competitions.filter(c => !c.examSlug || c.examSlug === examSlug);
  }

  createCompetition(compData) {
    const comp = {
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...compData
    };
    this.competitions.unshift(comp);
    return comp;
  }

  // --- Discoveries ---
  getDiscoveries({ category, stateScope } = {}) {
    return this.discoveries.filter(d => {
      if (category && d.category.toLowerCase() !== category.toLowerCase()) return false;
      if (stateScope && d.stateScope.toLowerCase() !== stateScope.toLowerCase()) return false;
      return true;
    });
  }

  createDiscovery(data) {
    const disc = {
      id: `disc-${Date.now()}`,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...data
    };
    this.discoveries.unshift(disc);
    return disc;
  }
}

export const store = new DataStore();
