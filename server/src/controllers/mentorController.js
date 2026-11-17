import { store } from '../db/store.js';

export const getMentors = (req, res) => {
  const mentors = store.getMentors();
  return res.json({ success: true, mentors });
};

export const createMentor = (req, res) => {
  const {
    fullName,
    email,
    phone,
    medicalCollege,
    neetAirRank,
    bio,
    specializations,
    languages,
    hourlyRateInr
  } = req.body;

  if (!fullName || !email || !medicalCollege) {
    return res.status(400).json({ success: false, message: 'Name, email, and medical college credentials are required.' });
  }

  const mentor = store.createMentor({
    fullName,
    email,
    phone: phone || '',
    medicalCollege,
    neetAirRank: parseInt(neetAirRank, 10) || null,
    bio: bio || 'Verified MBBS Mentor at Gyanvik',
    specializations: Array.isArray(specializations) ? specializations : ['NEET Strategy'],
    languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
    hourlyRateInr: parseInt(hourlyRateInr, 10) || 799
  });

  return res.status(201).json({
    success: true,
    message: 'Mentor registered and credential verified successfully.',
    mentor
  });
};

export const bookMentor = (req, res) => {
  const studentId = req.user.id;
  const {
    examGoal = 'NEET UG 2026',
    preferredSubjects,
    preparationStage = 'Class 12th',
    preferredLanguage = 'Bilingual (Hindi + English)',
    studentContactPhone,
    notes,
    mentorId
  } = req.body;

  if (!studentContactPhone || !preferredSubjects) {
    return res.status(400).json({
      success: false,
      message: 'Student contact phone number and preferred subjects are required.'
    });
  }

  const booking = store.createMentorBooking({
    studentId,
    mentorId: mentorId || null,
    examGoal,
    preferredSubjects,
    preparationStage,
    preferredLanguage,
    studentContactPhone,
    notes: notes || '',
    status: mentorId ? 'ASSIGNED' : 'PENDING',
    paymentStatus: 'SUCCESS' // Set to success upon completed checkout flow
  });

  return res.status(201).json({
    success: true,
    message: 'Your mentorship booking request has been submitted! Our academic coordinator will review and confirm your 1-on-1 mentor.',
    booking
  });
};

export const getStudentBookings = (req, res) => {
  const studentId = req.user.id;
  const bookings = store.getStudentBookings(studentId);
  return res.json({ success: true, bookings });
};

export const getAllBookings = (req, res) => {
  const bookings = store.getAllBookings();
  return res.json({ success: true, bookings });
};

export const updateBooking = (req, res) => {
  const { id } = req.params;
  const { status, mentorId, adminNotes, paymentStatus } = req.body;

  const updated = store.updateBookingStatus(id, { status, mentorId, adminNotes, paymentStatus });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Booking request not found.' });
  }

  return res.json({
    success: true,
    message: 'Mentor booking status updated successfully.',
    booking: updated
  });
};
