const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('gyanvik_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(email, password, loginType) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, loginType })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Exam Config & Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/exams/categories`);
    return res.json();
  },

  async getExamConfig(slug = 'neet') {
    const res = await fetch(`${API_BASE}/exams/config/${slug}`);
    return res.json();
  },

  async updateExamConfig(slug, data) {
    const res = await fetch(`${API_BASE}/exams/config/${slug}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE}/exams/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Notifications & Ticker
  async getTicker(examSlug = 'neet') {
    const res = await fetch(`${API_BASE}/notifications/ticker?examSlug=${examSlug}`);
    return res.json();
  },

  async getNotifications(examSlug = 'neet') {
    const res = await fetch(`${API_BASE}/notifications?examSlug=${examSlug}`);
    return res.json();
  },

  async createNotification(data) {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateNotification(id, data) {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteNotification(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Academic: Subjects, Chapters, Questions, NCERT, Short Notes
  async getSubjects(examSlug = 'neet') {
    const res = await fetch(`${API_BASE}/academic/subjects?examSlug=${examSlug}`);
    return res.json();
  },

  async getChapters(subjectId) {
    const res = await fetch(`${API_BASE}/academic/chapters?subjectId=${subjectId || ''}`);
    return res.json();
  },

  async getQuestions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/academic/questions?${query}`);
    return res.json();
  },

  async createQuestion(data) {
    const res = await fetch(`${API_BASE}/academic/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateQuestion(id, data) {
    const res = await fetch(`${API_BASE}/academic/questions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteQuestion(id) {
    const res = await fetch(`${API_BASE}/academic/questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getNcert(subjectId) {
    const res = await fetch(`${API_BASE}/academic/ncert?subjectId=${subjectId || ''}`);
    return res.json();
  },

  async createNcert(data) {
    const res = await fetch(`${API_BASE}/academic/ncert`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getShortNotes(subjectId) {
    const res = await fetch(`${API_BASE}/academic/short-notes?subjectId=${subjectId || ''}`);
    return res.json();
  },

  async createShortNote(data) {
    const res = await fetch(`${API_BASE}/academic/short-notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Tests & Mock CBT
  async getTestSeries(examSlug = 'neet') {
    const res = await fetch(`${API_BASE}/tests?examSlug=${examSlug}`);
    return res.json();
  },

  async getTestDetails(id) {
    const res = await fetch(`${API_BASE}/tests/${id}`);
    return res.json();
  },

  async submitTest(data) {
    const res = await fetch(`${API_BASE}/tests/attempt`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyTestHistory() {
    const res = await fetch(`${API_BASE}/tests/history`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createTestSeries(data) {
    const res = await fetch(`${API_BASE}/tests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Mentors
  async getMentors() {
    const res = await fetch(`${API_BASE}/mentors`);
    return res.json();
  },

  async bookMentor(data) {
    const res = await fetch(`${API_BASE}/mentors/book`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyBookings() {
    const res = await fetch(`${API_BASE}/mentors/my-bookings`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getAllBookings() {
    const res = await fetch(`${API_BASE}/mentors/all-bookings`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateBooking(id, data) {
    const res = await fetch(`${API_BASE}/mentors/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createMentor(data) {
    const res = await fetch(`${API_BASE}/mentors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Payments (Sandbox)
  async createPaymentOrder(data) {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async verifyPayment(data) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyPayments() {
    const res = await fetch(`${API_BASE}/payments/my-transactions`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getAllPayments() {
    const res = await fetch(`${API_BASE}/payments/all`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Discoveries & Competitions
  async getDiscoveries(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/discovery/exams?${query}`);
    return res.json();
  },

  async createDiscovery(data) {
    const res = await fetch(`${API_BASE}/discovery/exams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getCompetitions(examSlug = 'neet') {
    const res = await fetch(`${API_BASE}/discovery/competitions?examSlug=${examSlug}`);
    return res.json();
  },

  // Admin & Super Admin Management
  async getPlatformStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getAllStudents() {
    const res = await fetch(`${API_BASE}/admin/students`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateStudentStatus(id, isActive) {
    const res = await fetch(`${API_BASE}/admin/students/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });
    return res.json();
  },

  async getAllAdmins() {
    const res = await fetch(`${API_BASE}/admin/admins`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createAdminAccount(data) {
    const res = await fetch(`${API_BASE}/admin/admins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAdminRole(id, data) {
    const res = await fetch(`${API_BASE}/admin/admins/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAuditLogs(limit = 50) {
    const res = await fetch(`${API_BASE}/admin/audit-logs?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
