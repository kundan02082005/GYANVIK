export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const DEFAULT_NEET_CONFIG = {
  examSlug: 'neet',
  examName: 'NEET (UG) - National Eligibility cum Entrance Test',
  motivationalQuote: "Today's hard work is tomorrow's white coat.",
  conductingAuthority: 'NTA (National Testing Agency)',
  examMode: 'Offline (Pen and Paper - OMR Sheet)',
  durationMinutes: 180,
  durationText: '3 Hours (180 Minutes)',
  questionType: 'Multiple Choice Questions (MCQs - 4 Options)',
  totalQuestions: 180,
  totalMarks: 720,
  markingScheme: {
    correct: 4,
    incorrect: -1,
    unattempted: 0,
    ruleText: '+4 for each correct response, -1 for each incorrect response, 0 for unattempted questions.'
  },
  paperStructure: [
    {
      subject: 'Physics',
      questions: 45,
      marks: 180,
      description: 'Section A (35 Qs) + Section B (Attempt 10 out of 15 Qs)'
    },
    {
      subject: 'Chemistry',
      questions: 45,
      marks: 180,
      description: 'Section A (35 Qs) + Section B (Attempt 10 out of 15 Qs)'
    },
    {
      subject: 'Biology (Botany + Zoology)',
      questions: 90,
      marks: 360,
      description: 'Botany: 45 Qs (180 Marks) + Zoology: 45 Qs (180 Marks)'
    },
    {
      subject: 'Total Examination Pattern',
      questions: 180,
      marks: 720,
      description: '180 questions to be attempted out of 200 total questions'
    }
  ],
  eligibilitySummary: 'Class 12 pass/appearing with Physics, Chemistry, Biology/Biotechnology and English. Minimum age 17 years.',
  officialPortal: 'https://exams.nta.ac.in/NEET/',
  lastUpdated: new Date().toISOString()
};

export const EXAM_CATEGORIES = [
  {
    slug: 'neet',
    name: 'NEET (UG)',
    fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    category: 'Medical',
    status: 'ACTIVE',
    badge: 'Fully Operational',
    tagline: 'Your Gateway to Premier Medical Colleges (AIIMS, JIPMER, GMCs)',
    description: 'Comprehensive preparation hub featuring authentic PYQs, NCERT mastery library, all-India mock tests, and 1-on-1 MBBS doctor mentorship.',
    color: 'emerald'
  },
  {
    slug: 'jee',
    name: 'IIT-JEE (Main & Adv)',
    fullName: 'Joint Entrance Examination',
    category: 'Engineering',
    status: 'COMING_SOON',
    badge: 'Coming Soon - Configured for 2026/27',
    tagline: 'Gateway to IITs, NITs, and IIITs',
    description: 'Advanced engineering test prep module with deep analytical problem solving, numerical questions, and IITian mentorship coming in next release.',
    color: 'blue'
  },
  {
    slug: 'gate',
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    category: 'Higher Education / PSU',
    status: 'COMING_SOON',
    badge: 'In Development',
    tagline: 'Gateway to M.Tech in IISc/IITs & Leading Maharatna PSUs',
    description: 'Specialized syllabus tracking, engineering mathematics, and subject test modules scheduled for rollout.',
    color: 'indigo'
  },
  {
    slug: 'cuet',
    name: 'CUET (UG)',
    fullName: 'Common University Entrance Test',
    category: 'Central Universities',
    status: 'COMING_SOON',
    badge: 'In Development',
    tagline: 'Access Premier Central Universities including DU, BHU, JNU & AMU',
    description: 'Domain subjects, general tests, and language modules under active curriculum alignment.',
    color: 'amber'
  }
];
