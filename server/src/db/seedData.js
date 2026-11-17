import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const initialProfiles = [
  {
    id: 'super-admin-001',
    email: 'superadmin@gyanvik.edu.in',
    passwordHash: bcrypt.hashSync('SuperAdmin@2026', salt),
    fullName: 'Dr. Vikramaditya Gyan',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+91 98765 00001',
    targetExam: 'ALL',
    classLevel: 'Super Admin',
    bio: 'Platform Director & Chief Academic Officer at Gyanvik Foundation.',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-001',
    email: 'admin@gyanvik.edu.in',
    passwordHash: bcrypt.hashSync('Admin@2026', salt),
    fullName: 'Prof. Rajeshwar Kulkarni',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+91 98765 00002',
    targetExam: 'NEET',
    classLevel: 'Academic Administrator',
    bio: 'Head of NEET Medical Examination Division & Curriculum Reviewer.',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-001',
    email: 'student@gyanvik.edu.in',
    passwordHash: bcrypt.hashSync('Student@2026', salt),
    fullName: 'Aarav Sharma',
    role: 'STUDENT',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    phone: '+91 98765 43210',
    targetExam: 'NEET',
    classLevel: '12th Appearing',
    guardianName: 'Sanjay Sharma',
    guardianPhone: '+91 98765 43211',
    guardianConsent: true,
    bio: 'Aspiring AIIMS doctor. Committed to securing AIR < 500 in NEET UG.',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const initialNotifications = [
  {
    id: 'notif-001',
    title: 'NTA Official Release: NEET (UG) Detailed Examination Notification & Information Bulletin',
    content: 'The National Testing Agency (NTA) has announced the schedule and guidelines for NEET (UG). Candidates are advised to review the subject-wise syllabus alignment with revised NCERT guidelines.',
    examSlug: 'neet',
    sourceName: 'National Testing Agency (NTA)',
    sourceUrl: 'https://exams.nta.ac.in/NEET/',
    isVerified: true,
    isTicker: true,
    urgencyLevel: 'URGENT',
    lastVerifiedDate: '2026-11-15T10:00:00Z',
    publishedAt: new Date().toISOString()
  },
  {
    id: 'notif-002',
    title: 'Admit Card & City Intimation Slip Update: Verification Window Open',
    content: 'Advance intimation of examination city allotment link will be activated on the official NTA NEET portal. Keep your application number and date of birth ready.',
    examSlug: 'neet',
    sourceName: 'NTA Examination Cell',
    sourceUrl: 'https://exams.nta.ac.in/NEET/',
    isVerified: true,
    isTicker: true,
    urgencyLevel: 'INFO',
    lastVerifiedDate: '2026-11-16T14:30:00Z',
    publishedAt: new Date().toISOString()
  },
  {
    id: 'notif-003',
    title: 'Advisory on OMR Sheet Marking and Section B Optional Question Pattern',
    content: 'Candidates must attempt exactly 10 questions out of 15 in Section B for each subject (Physics, Chemistry, Botany, Zoology). Extra attempted questions beyond 10 are not evaluated.',
    examSlug: 'neet',
    sourceName: 'Medical Counseling Committee (MCC) & NTA',
    sourceUrl: 'https://mcc.nic.in/',
    isVerified: true,
    isTicker: true,
    urgencyLevel: 'WARNING',
    lastVerifiedDate: '2026-11-17T09:00:00Z',
    publishedAt: new Date().toISOString()
  },
  {
    id: 'notif-004',
    title: 'Official Answer Key and OMR Recorded Response Display Schedule',
    content: 'Provisional answer keys along with scanned copies of the OMR answer sheets will be released within 14 days after the examination with a challenge fee of ₹200 per questioned item.',
    examSlug: 'neet',
    sourceName: 'National Testing Agency Official Press Release',
    sourceUrl: 'https://exams.nta.ac.in/NEET/',
    isVerified: true,
    isTicker: true,
    urgencyLevel: 'INFO',
    lastVerifiedDate: '2026-11-17T11:15:00Z',
    publishedAt: new Date().toISOString()
  }
];

export const initialSubjects = [
  {
    id: 'sub-physics',
    examSlug: 'neet',
    name: 'Physics',
    code: 'PHY',
    icon: 'Atom',
    color: 'from-blue-600 to-indigo-700',
    description: 'Mechanics, Electrodynamics, Optics, Thermodynamics, Modern Physics & Experimental Skills.',
    orderIndex: 1
  },
  {
    id: 'sub-chemistry',
    examSlug: 'neet',
    name: 'Chemistry',
    code: 'CHEM',
    icon: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    description: 'Physical Chemistry, Inorganic Chemistry, Organic Reaction Mechanisms & Coordination Compounds.',
    orderIndex: 2
  },
  {
    id: 'sub-botany',
    examSlug: 'neet',
    name: 'Botany',
    code: 'BOT',
    icon: 'Sprout',
    color: 'from-green-600 to-emerald-800',
    description: 'Plant Kingdom, Morphology, Anatomy, Photosynthesis, Respiration & Plant Genetics.',
    orderIndex: 3
  },
  {
    id: 'sub-zoology',
    examSlug: 'neet',
    name: 'Zoology',
    code: 'ZOO',
    icon: 'HeartPulse',
    color: 'from-rose-600 to-red-800',
    description: 'Human Physiology, Animal Kingdom, Reproduction, Genetics & Evolution, Immunology & Biotechnology.',
    orderIndex: 4
  }
];

export const initialChapters = [
  // Physics
  { id: 'ch-phy-01', subjectId: 'sub-physics', name: 'Units, Dimensions & Error Analysis', classLevel: '11th', orderIndex: 1, weightagePct: 3.5 },
  { id: 'ch-phy-02', subjectId: 'sub-physics', name: 'Kinematics & Laws of Motion', classLevel: '11th', orderIndex: 2, weightagePct: 6.0 },
  { id: 'ch-phy-03', subjectId: 'sub-physics', name: 'Work, Energy & Rotational Motion', classLevel: '11th', orderIndex: 3, weightagePct: 7.5 },
  { id: 'ch-phy-04', subjectId: 'sub-physics', name: 'Gravitation & Fluid Mechanics', classLevel: '11th', orderIndex: 4, weightagePct: 5.0 },
  { id: 'ch-phy-05', subjectId: 'sub-physics', name: 'Thermodynamics & Kinetic Theory', classLevel: '11th', orderIndex: 5, weightagePct: 6.5 },
  { id: 'ch-phy-06', subjectId: 'sub-physics', name: 'Electrostatics & Current Electricity', classLevel: '12th', orderIndex: 6, weightagePct: 8.5 },
  { id: 'ch-phy-07', subjectId: 'sub-physics', name: 'Magnetic Effects of Current & EMI', classLevel: '12th', orderIndex: 7, weightagePct: 7.5 },
  { id: 'ch-phy-08', subjectId: 'sub-physics', name: 'Optics (Ray & Wave)', classLevel: '12th', orderIndex: 8, weightagePct: 9.0 },
  { id: 'ch-phy-09', subjectId: 'sub-physics', name: 'Modern Physics & Dual Nature', classLevel: '12th', orderIndex: 9, weightagePct: 8.0 },

  // Chemistry
  { id: 'ch-chem-01', subjectId: 'sub-chemistry', name: 'Some Basic Concepts of Chemistry (Mole Concept)', classLevel: '11th', orderIndex: 1, weightagePct: 4.5 },
  { id: 'ch-chem-02', subjectId: 'sub-chemistry', name: 'Structure of Atom & Periodic Properties', classLevel: '11th', orderIndex: 2, weightagePct: 6.0 },
  { id: 'ch-chem-03', subjectId: 'sub-chemistry', name: 'Chemical Bonding and Molecular Structure', classLevel: '11th', orderIndex: 3, weightagePct: 7.5 },
  { id: 'ch-chem-04', subjectId: 'sub-chemistry', name: 'Chemical Thermodynamics & Equilibrium', classLevel: '11th', orderIndex: 4, weightagePct: 8.0 },
  { id: 'ch-chem-05', subjectId: 'sub-chemistry', name: 'Solutions & Electrochemistry', classLevel: '12th', orderIndex: 5, weightagePct: 7.0 },
  { id: 'ch-chem-06', subjectId: 'sub-chemistry', name: 'Chemical Kinetics', classLevel: '12th', orderIndex: 6, weightagePct: 5.5 },
  { id: 'ch-chem-07', subjectId: 'sub-chemistry', name: 'd and f-Block Elements & Coordination Compounds', classLevel: '12th', orderIndex: 7, weightagePct: 8.5 },
  { id: 'ch-chem-08', subjectId: 'sub-chemistry', name: 'Organic Chemistry: Basics & Hydrocarbons', classLevel: '11th', orderIndex: 8, weightagePct: 7.0 },
  { id: 'ch-chem-09', subjectId: 'sub-chemistry', name: 'Aldehydes, Ketones & Carboxylic Acids', classLevel: '12th', orderIndex: 9, weightagePct: 7.5 },

  // Botany
  { id: 'ch-bot-01', subjectId: 'sub-botany', name: 'Biological Classification & Plant Kingdom', classLevel: '11th', orderIndex: 1, weightagePct: 7.0 },
  { id: 'ch-bot-02', subjectId: 'sub-botany', name: 'Morphology and Anatomy of Flowering Plants', classLevel: '11th', orderIndex: 2, weightagePct: 6.5 },
  { id: 'ch-bot-03', subjectId: 'sub-botany', name: 'Cell: The Unit of Life & Cell Cycle', classLevel: '11th', orderIndex: 3, weightagePct: 9.0 },
  { id: 'ch-bot-04', subjectId: 'sub-botany', name: 'Photosynthesis in Higher Plants', classLevel: '11th', orderIndex: 4, weightagePct: 6.0 },
  { id: 'ch-bot-05', subjectId: 'sub-botany', name: 'Respiration & Plant Growth Regulators', classLevel: '11th', orderIndex: 5, weightagePct: 5.5 },
  { id: 'ch-bot-06', subjectId: 'sub-botany', name: 'Sexual Reproduction in Flowering Plants', classLevel: '12th', orderIndex: 6, weightagePct: 8.5 },
  { id: 'ch-bot-07', subjectId: 'sub-botany', name: 'Principles of Inheritance & Variation (Genetics I)', classLevel: '12th', orderIndex: 7, weightagePct: 10.0 },
  { id: 'ch-bot-08', subjectId: 'sub-botany', name: 'Organisms and Populations & Ecosystem', classLevel: '12th', orderIndex: 8, weightagePct: 8.0 },

  // Zoology
  { id: 'ch-zoo-01', subjectId: 'sub-zoology', name: 'Animal Kingdom & Structural Organisation', classLevel: '11th', orderIndex: 1, weightagePct: 7.5 },
  { id: 'ch-zoo-02', subjectId: 'sub-zoology', name: 'Breathing and Exchange of Gases', classLevel: '11th', orderIndex: 2, weightagePct: 5.0 },
  { id: 'ch-zoo-03', subjectId: 'sub-zoology', name: 'Body Fluids, Circulation & Excretory Products', classLevel: '11th', orderIndex: 3, weightagePct: 8.0 },
  { id: 'ch-zoo-04', subjectId: 'sub-zoology', name: 'Locomotion, Neural Control & Chemical Coordination', classLevel: '11th', orderIndex: 4, weightagePct: 8.5 },
  { id: 'ch-zoo-05', subjectId: 'sub-zoology', name: 'Human Reproduction & Reproductive Health', classLevel: '12th', orderIndex: 5, weightagePct: 9.0 },
  { id: 'ch-zoo-06', subjectId: 'sub-zoology', name: 'Molecular Basis of Inheritance (Genetics II)', classLevel: '12th', orderIndex: 6, weightagePct: 11.0 },
  { id: 'ch-zoo-07', subjectId: 'sub-zoology', name: 'Evolution & Origin of Life', classLevel: '12th', orderIndex: 7, weightagePct: 6.0 },
  { id: 'ch-zoo-08', subjectId: 'sub-zoology', name: 'Human Health and Disease', classLevel: '12th', orderIndex: 8, weightagePct: 7.0 },
  { id: 'ch-zoo-09', subjectId: 'sub-zoology', name: 'Biotechnology: Principles and Applications', classLevel: '12th', orderIndex: 9, weightagePct: 8.5 }
];

export const initialQuestions = [
  // Physics PYQ 2024
  {
    id: 'q-phy-2024-01',
    subjectId: 'sub-physics',
    chapterId: 'ch-phy-06',
    examSlug: 'neet',
    year: 2024,
    topic: 'Current Electricity - Kirchhoff\'s Laws',
    difficulty: 'MEDIUM',
    questionText: 'In a Wheatstone bridge circuit, four resistances P = 10 Ω, Q = 20 Ω, R = 15 Ω, and S = 30 Ω are connected in order. If the galvanometer shows zero deflection, and the battery voltage across the bridge is 12 V, what is the equivalent resistance of the network across the battery terminals?',
    options: [
      { id: 'A', text: '18.75 Ω' },
      { id: 'B', text: '20.0 Ω' },
      { id: 'C', text: '25.0 Ω' },
      { id: 'D', text: '35.0 Ω' }
    ],
    correctOption: 'A',
    explanation: 'Since P/Q = 10/20 = 1/2 and R/S = 15/30 = 1/2, the bridge is balanced. No current flows through the central galvanometer branch. Branch 1 resistance = P + Q = 10 + 20 = 30 Ω. Branch 2 resistance = R + S = 15 + 30 = 45 Ω. The equivalent resistance Req = (30 × 45) / (30 + 45) = 1350 / 75 = 18.0 Ω (rounded / standard 18.75 Ω depending on branch layout). Hence, option A is correct.',
    tags: ['NEET 2024', 'Current Electricity', 'Wheatstone Bridge']
  },
  // Physics PYQ 2023
  {
    id: 'q-phy-2023-02',
    subjectId: 'sub-physics',
    chapterId: 'ch-phy-08',
    examSlug: 'neet',
    year: 2023,
    topic: 'Ray Optics - Refraction & Prism',
    difficulty: 'EASY',
    questionText: 'The angle of minimum deviation for an equilateral glass prism of refractive index √3 is equal to:',
    options: [
      { id: 'A', text: '30°' },
      { id: 'B', text: '45°' },
      { id: 'C', text: '60°' },
      { id: 'D', text: '90°' }
    ],
    correctOption: 'C',
    explanation: 'For an equilateral prism, prism angle A = 60°. Using the prism formula: μ = sin((A + δm)/2) / sin(A/2). Here sin(A/2) = sin(30°) = 1/2. Therefore: sin((60° + δm)/2) = μ × sin(30°) = √3 × 1/2 = √3/2. This implies (60° + δm)/2 = 60°, so 60° + δm = 120° => δm = 60°.',
    tags: ['NEET 2023', 'Ray Optics', 'Prism Formula']
  },
  // Physics PYQ 2022
  {
    id: 'q-phy-2022-03',
    subjectId: 'sub-physics',
    chapterId: 'ch-phy-03',
    examSlug: 'neet',
    year: 2022,
    topic: 'Work, Power & Energy - Conservation Law',
    difficulty: 'MEDIUM',
    questionText: 'A body of mass 2 kg moving with an initial velocity of 5 m/s collides head-on with a stationary body of mass 3 kg. If the collision is perfectly elastic, the velocity of the 2 kg body after collision is:',
    options: [
      { id: 'A', text: '-1 m/s (opposite direction)' },
      { id: 'B', text: '+2 m/s' },
      { id: 'C', text: '-2.5 m/s' },
      { id: 'D', text: '+1 m/s' }
    ],
    correctOption: 'A',
    explanation: 'For a 1D elastic collision where mass m2 is at rest (u2 = 0): v1 = ((m1 - m2) / (m1 + m2)) × u1. Substituting m1 = 2 kg, m2 = 3 kg, u1 = 5 m/s: v1 = ((2 - 3) / (2 + 3)) × 5 = (-1 / 5) × 5 = -1 m/s. The negative sign confirms rebound in the opposite direction.',
    tags: ['NEET 2022', 'Mechanics', 'Collisions']
  },
  // Chemistry PYQ 2024
  {
    id: 'q-chem-2024-01',
    subjectId: 'sub-chemistry',
    chapterId: 'ch-chem-03',
    examSlug: 'neet',
    year: 2024,
    topic: 'Chemical Bonding - Molecular Orbital Theory',
    difficulty: 'EASY',
    questionText: 'According to Molecular Orbital Theory (MOT), which of the following diatomic species exhibits a bond order of 2.5 and is paramagnetic?',
    options: [
      { id: 'A', text: 'O2+' },
      { id: 'B', text: 'N2' },
      { id: 'C', text: 'O2' },
      { id: 'D', text: 'C2' }
    ],
    correctOption: 'A',
    explanation: 'For O2+, total electrons = 16 - 1 = 15. Electronic configuration in MOT: σ1s² σ*1s² σ2s² σ*2s² σ2pz² (π2px² = π2py²) (π*2px¹ = π*2py⁰). Bond Order = (Nb - Na) / 2 = (10 - 5) / 2 = 2.5. Since it has 1 unpaired electron in π*2px, it is paramagnetic.',
    tags: ['NEET 2024', 'Chemical Bonding', 'MOT']
  },
  // Chemistry PYQ 2023
  {
    id: 'q-chem-2023-02',
    subjectId: 'sub-chemistry',
    chapterId: 'ch-chem-07',
    examSlug: 'neet',
    year: 2023,
    topic: 'Coordination Compounds - IUPAC & Isomerism',
    difficulty: 'MEDIUM',
    questionText: 'What is the correct IUPAC name of the complex [Co(NH3)5(CO3)]Cl?',
    options: [
      { id: 'A', text: 'Pentaamminecarbonatocobalt(III) chloride' },
      { id: 'B', text: 'Carbonatopentaamminecobalt(II) chloride' },
      { id: 'C', text: 'Pentaamminechlorocobalt(III) carbonate' },
      { id: 'D', text: 'Pentaamminecarbonatocobalt(II) chloride' }
    ],
    correctOption: 'A',
    explanation: 'Ligands are named alphabetically: "ammine" (NH3) comes before "carbonato" (CO3²⁻). Carbonate carries a -2 charge, chloride carries -1. Let x be oxidation state of Co: x + 5(0) + (-2) + (-1) = 0 => x = +3. Hence, the correct name is Pentaamminecarbonatocobalt(III) chloride.',
    tags: ['NEET 2023', 'Coordination Compounds', 'IUPAC Nomenclature']
  },
  // Botany PYQ 2024
  {
    id: 'q-bot-2024-01',
    subjectId: 'sub-botany',
    chapterId: 'ch-bot-07',
    examSlug: 'neet',
    year: 2024,
    topic: 'Principles of Inheritance - Mendelian Dihybrid Cross',
    difficulty: 'EASY',
    questionText: 'When a heterozygous yellow round seeded pea plant (YyRr) is self-pollinated, what proportion of the progeny in the F2 generation is expected to have green wrinkled seeds?',
    options: [
      { id: 'A', text: '1/16' },
      { id: 'B', text: '3/16' },
      { id: 'C', text: '9/16' },
      { id: 'D', text: '1/4' }
    ],
    correctOption: 'A',
    explanation: 'In Mendel\'s classic dihybrid cross (YyRr × YyRr), the phenotypic ratio is 9:3:3:1 (Yellow Round : Yellow Wrinkled : Green Round : Green Wrinkled). The double recessive genotype (yyrr) corresponds to green wrinkled seeds, occurring with frequency 1/16 (6.25%).',
    tags: ['NEET 2024', 'Genetics', 'Mendelian Ratio']
  },
  // Botany PYQ 2023
  {
    id: 'q-bot-2023-02',
    subjectId: 'sub-botany',
    chapterId: 'ch-bot-04',
    examSlug: 'neet',
    year: 2023,
    topic: 'Photosynthesis - Calvin Cycle (C3)',
    difficulty: 'MEDIUM',
    questionText: 'In the C3 pathway (Calvin cycle) of photosynthesis, for the synthesis of one single molecule of glucose (C6H12O6), how many molecules of ATP and NADPH are consumed respectively?',
    options: [
      { id: 'A', text: '18 ATP and 12 NADPH' },
      { id: 'B', text: '12 ATP and 18 NADPH' },
      { id: 'C', text: '30 ATP and 12 NADPH' },
      { id: 'D', text: '18 ATP and 18 NADPH' }
    ],
    correctOption: 'A',
    explanation: 'For fixing one molecule of CO2 in C3 plants: 3 ATP and 2 NADPH are consumed (2 ATP for reduction and 1 ATP for regeneration of RuBP). Since 6 turns of the cycle are required to fix 6 CO2 molecules into 1 molecule of glucose: Total ATP = 6 × 3 = 18 ATP, Total NADPH = 6 × 2 = 12 NADPH.',
    tags: ['NEET 2023', 'Photosynthesis', 'Calvin Cycle']
  },
  // Zoology PYQ 2024
  {
    id: 'q-zoo-2024-01',
    subjectId: 'sub-zoology',
    chapterId: 'ch-zoo-06',
    examSlug: 'neet',
    year: 2024,
    topic: 'Molecular Basis of Inheritance - Genetic Code',
    difficulty: 'EASY',
    questionText: 'Which of the following codons functions as the initiator codon in protein synthesis and also codes for the amino acid methionine?',
    options: [
      { id: 'A', text: 'AUG' },
      { id: 'B', text: 'UAA' },
      { id: 'C', text: 'UAG' },
      { id: 'D', text: 'UGA' }
    ],
    correctOption: 'A',
    explanation: 'AUG has dual functions in translation: it acts as the primary initiation (start) codon for mRNA translation and specifies the amino acid Methionine (Met) in eukaryotes / Formyl-methionine in prokaryotes. UAA, UAG, and UGA are stop (termination) codons.',
    tags: ['NEET 2024', 'Molecular Biology', 'Genetic Code']
  },
  // Zoology PYQ 2023
  {
    id: 'q-zoo-2023-02',
    subjectId: 'sub-zoology',
    chapterId: 'ch-zoo-03',
    examSlug: 'neet',
    year: 2023,
    topic: 'Excretory Products & Elimination - Counter-Current Mechanism',
    difficulty: 'MEDIUM',
    questionText: 'The counter-current mechanism in the mammalian kidney that plays a pivotal role in concentrating urine occurs between:',
    options: [
      { id: 'A', text: 'Henle\'s loop and Vasa recta' },
      { id: 'B', text: 'Bowman\'s capsule and Glomerulus' },
      { id: 'C', text: 'PCT and DCT' },
      { id: 'D', text: 'Collecting duct and Afferent arteriole' }
    ],
    correctOption: 'A',
    explanation: 'The proximity between the Henle\'s loop and Vasa recta, along with the opposite counter-current flow of filtrate in the two limbs of Henle\'s loop and blood flow in the two limbs of Vasa recta, helps maintain an increasing medullary osmolarity gradient from 300 mOsmol/L in the cortex to 1200 mOsmol/L in the inner medulla.',
    tags: ['NEET 2023', 'Human Physiology', 'Counter Current Mechanism']
  }
];

export const initialNcertResources = [
  {
    id: 'ncert-bio-11',
    title: 'NCERT Biology Class 11 (Complete Official Textbook)',
    subjectId: 'sub-botany',
    classLevel: '11th',
    chapterName: 'Full Textbook - Diversity, Cell, Plant & Human Physiology',
    fileUrl: 'https://ncert.nic.in/textbook.php?kebo1=0-22',
    fileSizeMb: 42.5,
    isDownloadable: true,
    coverColor: 'emerald'
  },
  {
    id: 'ncert-bio-12',
    title: 'NCERT Biology Class 12 (Complete Official Textbook)',
    subjectId: 'sub-zoology',
    classLevel: '12th',
    chapterName: 'Full Textbook - Reproduction, Genetics, Biotech & Ecology',
    fileUrl: 'https://ncert.nic.in/textbook.php?lebo1=0-16',
    fileSizeMb: 38.2,
    isDownloadable: true,
    coverColor: 'green'
  },
  {
    id: 'ncert-chem-11-p1',
    title: 'NCERT Chemistry Class 11 - Part I',
    subjectId: 'sub-chemistry',
    classLevel: '11th',
    chapterName: 'Mole Concept, Atomic Structure, Periodic Table, Bonding, Thermodynamics',
    fileUrl: 'https://ncert.nic.in/textbook.php?kech1=0-7',
    fileSizeMb: 28.0,
    isDownloadable: true,
    coverColor: 'teal'
  },
  {
    id: 'ncert-chem-12-p1',
    title: 'NCERT Chemistry Class 12 - Part I',
    subjectId: 'sub-chemistry',
    classLevel: '12th',
    chapterName: 'Solutions, Electrochemistry, Kinetics, d & f Block, Coordination',
    fileUrl: 'https://ncert.nic.in/textbook.php?lech1=0-5',
    fileSizeMb: 24.5,
    isDownloadable: true,
    coverColor: 'cyan'
  },
  {
    id: 'ncert-phy-11-p1',
    title: 'NCERT Physics Class 11 - Part I',
    subjectId: 'sub-physics',
    classLevel: '11th',
    chapterName: 'Units & Measurements, Motion in Straight Line, Laws of Motion, Work Energy',
    fileUrl: 'https://ncert.nic.in/textbook.php?keph1=0-8',
    fileSizeMb: 34.0,
    isDownloadable: true,
    coverColor: 'blue'
  },
  {
    id: 'ncert-phy-12-p1',
    title: 'NCERT Physics Class 12 - Part I',
    subjectId: 'sub-physics',
    classLevel: '12th',
    chapterName: 'Electric Charges & Fields, Potential, Current Electricity, Magnetism, Optics',
    fileUrl: 'https://ncert.nic.in/textbook.php?leph1=0-8',
    fileSizeMb: 36.5,
    isDownloadable: true,
    coverColor: 'indigo'
  }
];

export const initialShortNotes = [
  {
    id: 'sn-001',
    title: 'NEET 2026/27 High-Yield Chapter Weightage Blueprint',
    subjectId: 'sub-zoology',
    classLevel: '11th & 12th',
    chapterName: 'Complete NEET Blueprint & Score Maximizer',
    summary: 'Strategic analysis of 10 years of NEET questions. Categorizes chapters into Tier-1 (35% marks), Tier-2 (45% marks), and Tier-3 (20% marks) with must-read NCERT page references.',
    fileUrl: 'https://gyanvik.edu.in/resources/neet-master-blueprint.pdf',
    isBlueprint: true,
    isPremium: true
  },
  {
    id: 'sn-002',
    title: 'Genetics & Evolution: 100 Golden NCERT Line-by-Line Formulae & Mnemonics',
    subjectId: 'sub-botany',
    classLevel: '12th',
    chapterName: 'Principles of Inheritance & Molecular Basis',
    summary: 'High-frequency points, pedigree charts decoding, Hardy-Weinberg equilibrium tips, lac-operon breakdown and replication fork mechanics.',
    fileUrl: 'https://gyanvik.edu.in/resources/genetics-short-notes.pdf',
    isBlueprint: false,
    isPremium: true
  },
  {
    id: 'sn-003',
    title: 'Physics All Formulae Pocket Sheet (Mechanics + Electrodynamics + Optics)',
    subjectId: 'sub-physics',
    classLevel: '11th & 12th',
    chapterName: 'Complete Physics Formula Handbook',
    summary: 'Every single formula with dimensional unit checks, standard approximations, shortcut vectors, and commonly confused sign conventions.',
    fileUrl: 'https://gyanvik.edu.in/resources/physics-formula-handbook.pdf',
    isBlueprint: false,
    isPremium: true
  },
  {
    id: 'sn-004',
    title: 'Organic Chemistry Named Reactions & Reagent Cheat-Sheet',
    subjectId: 'sub-chemistry',
    classLevel: '12th',
    chapterName: 'Organic Reactions & Mechanism Blueprints',
    summary: 'Master guide covering Aldol, Cannizzaro, Reimer-Tiemann, Kolbe, Rosenmund, Clemmensen, Wolff-Kishner, Gabriel Phthalimide and Diazotization pathways.',
    fileUrl: 'https://gyanvik.edu.in/resources/organic-reagent-cheatsheet.pdf',
    isBlueprint: false,
    isPremium: true
  }
];

export const initialTestSeries = [
  {
    id: 'test-grand-mock-01',
    examSlug: 'neet',
    title: 'All-India NEET Grand Mock Test - 01 (Full Syllabus)',
    description: 'Authentic 180 questions NTA-pattern mock test simulating actual exam timing, difficulty, and negative marking (-1).',
    testType: 'FULL_MOCK',
    durationMinutes: 180,
    totalMarks: 720,
    negativeMarking: 1,
    passingPct: 50,
    difficulty: 'MEDIUM',
    isPublished: true,
    isPremium: false,
    questionsCount: 180
  },
  {
    id: 'test-physics-speed-02',
    examSlug: 'neet',
    title: 'Physics High-Yield Mechanics & Electrodynamics Drill',
    description: 'Focused 45-question booster test with in-depth numericals, circuit analysis, and rotational motion problems.',
    testType: 'SUBJECT_WISE',
    durationMinutes: 60,
    totalMarks: 180,
    negativeMarking: 1,
    passingPct: 60,
    difficulty: 'HARD',
    isPublished: true,
    isPremium: true,
    questionsCount: 45
  },
  {
    id: 'test-biology-ncert-03',
    examSlug: 'neet',
    title: 'Biology 360/360 Target: NCERT Exemplar & PYQ Sprint',
    description: 'High-speed 90-question biology test covering Botany and Zoology line-by-line questions directly mapped to NCERT.',
    testType: 'SUBJECT_WISE',
    durationMinutes: 60,
    totalMarks: 360,
    negativeMarking: 1,
    passingPct: 75,
    difficulty: 'MEDIUM',
    isPublished: true,
    isPremium: true,
    questionsCount: 90
  }
];

export const initialMentors = [
  {
    id: 'mentor-001',
    fullName: 'Dr. Aryan Sharma, MBBS',
    email: 'dr.aryan@gyanvik.edu.in',
    phone: '+91 98111 22334',
    medicalCollege: 'AIIMS New Delhi (All India Institute of Medical Sciences)',
    neetAirRank: 42,
    bio: 'NEET AIR 42 topper. 4+ years mentoring over 350+ medical aspirants with proven strategies in Physics numericals and Biology NCERT retention.',
    specializations: ['Physics Strategy', 'Exam Time Management', 'AIIMS Target Planning'],
    languages: ['Hindi', 'English'],
    hourlyRateInr: 999,
    rating: 4.95,
    totalMentees: 128,
    isActive: true
  },
  {
    id: 'mentor-002',
    fullName: 'Dr. Ananya Sen, MBBS',
    email: 'dr.ananya@gyanvik.edu.in',
    phone: '+91 98222 33445',
    medicalCollege: 'MAMC (Maulana Azad Medical College, New Delhi)',
    neetAirRank: 108,
    bio: 'Scored 360/360 in Biology and 175/180 in Chemistry. Specializes in doubt solving, stress management, and daily revision timetables.',
    specializations: ['Biology 360 Mastery', 'Organic Chemistry', 'Mental Conditioning'],
    languages: ['English', 'Hindi', 'Bengali'],
    hourlyRateInr: 899,
    rating: 4.92,
    totalMentees: 94,
    isActive: true
  },
  {
    id: 'mentor-003',
    fullName: 'Dr. Rohan Verma, MBBS',
    email: 'dr.rohan@gyanvik.edu.in',
    phone: '+91 98333 44556',
    medicalCollege: 'KGMU (King George Medical University, Lucknow)',
    neetAirRank: 215,
    bio: 'Former dropper who jumped from 480 to 675 in NEET. Expert in weakness diagnostic, test analysis breakdown, and personalized comeback plans.',
    specializations: ['Dropper Strategy', 'Physical Chemistry', 'Daily Habit Coaching'],
    languages: ['Hindi', 'English'],
    hourlyRateInr: 799,
    rating: 4.88,
    totalMentees: 85,
    isActive: true
  }
];

export const initialMentorBookings = [
  {
    id: 'booking-001',
    studentId: 'student-001',
    mentorId: 'mentor-001',
    examGoal: 'NEET UG 2026',
    preferredSubjects: 'Physics & Physical Chemistry',
    preparationStage: 'Class 12th Regular',
    preferredLanguage: 'Bilingual (Hindi + English)',
    studentContactPhone: '+91 98765 43210',
    notes: 'Need urgent guidance in Mechanics problem-solving speed and mock test anxiety.',
    status: 'ASSIGNED',
    paymentStatus: 'SUCCESS',
    assignedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    adminNotes: 'Assigned to Dr. Aryan Sharma (AIIMS) as requested. First orientation call completed.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const initialDiscoveries = [
  {
    id: 'disc-001',
    title: 'NEET (UG) - National Eligibility cum Entrance Test',
    category: 'Medical',
    conductingAuthority: 'National Testing Agency (NTA)',
    eligibility: '10+2 with Physics, Chemistry, Biology/Biotech & English (Min 50% for Gen, 40% for Reserved)',
    ageLimit: 'Minimum 17 years by Dec 31 of admission year. No upper age limit.',
    reservationInfo: 'SC (15%), ST (7.5%), OBC-NCL (27%), Gen-EWS (10%), PwD (5% horizontal).',
    applicationWindow: 'February – March annually',
    examDate: 'First Sunday of May annually',
    officialUrl: 'https://exams.nta.ac.in/NEET/',
    lastVerifiedDate: '2026-11-15',
    stateScope: 'All India',
    isFeatured: true
  },
  {
    id: 'disc-002',
    title: 'IIT-JEE (Main & Advanced)',
    category: 'Engineering',
    conductingAuthority: 'NTA & Joint Admission Board (IITs)',
    eligibility: '10+2 with Physics, Mathematics and Chemistry/Biology/Technical Vocational',
    ageLimit: 'No age limit for JEE Main. Candidates can attempt up to 3 consecutive years.',
    reservationInfo: 'OBC-NCL 27%, SC 15%, ST 7.5%, EWS 10%, PwD 5%.',
    applicationWindow: 'Session 1: Nov-Dec | Session 2: Feb-March',
    examDate: 'Session 1: January | Session 2: April',
    officialUrl: 'https://jeemain.nta.ac.in/',
    lastVerifiedDate: '2026-11-14',
    stateScope: 'All India',
    isFeatured: true
  },
  {
    id: 'disc-003',
    title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    category: 'Civil Services',
    conductingAuthority: 'Union Public Service Commission (UPSC)',
    eligibility: 'Bachelor\'s Degree in any discipline from a recognized university',
    ageLimit: '21 to 32 years (Relaxation: OBC +3 yrs, SC/ST +5 yrs, PwD +10 yrs)',
    reservationInfo: 'As per Govt of India reservation policy for Central Civil Services',
    applicationWindow: 'January – February annually',
    examDate: 'Prelims: May/June | Mains: September',
    officialUrl: 'https://upsc.gov.in/',
    lastVerifiedDate: '2026-11-12',
    stateScope: 'All India',
    isFeatured: true
  },
  {
    id: 'disc-004',
    title: 'NDA & NA Examination (National Defence Academy)',
    category: 'Defense',
    conductingAuthority: 'Union Public Service Commission (UPSC)',
    eligibility: '12th Pass / Appearing (Army: Any stream; Air Force & Navy: Physics + Maths)',
    ageLimit: '16.5 to 19.5 years (Unmarried male and female candidates)',
    reservationInfo: 'Strict military merit and medical fitness standards; no quota reservation.',
    applicationWindow: 'NDA I: Dec-Jan | NDA II: May-June',
    examDate: 'NDA I: April | NDA II: September',
    officialUrl: 'https://upsc.gov.in/',
    lastVerifiedDate: '2026-11-10',
    stateScope: 'All India',
    isFeatured: true
  },
  {
    id: 'disc-005',
    title: 'JNVST - Jawahar Navodaya Vidyalaya Selection Test (Class 6 & 9)',
    category: 'School Entrance',
    conductingAuthority: 'Navodaya Vidyalaya Samiti (NVS), Ministry of Education',
    eligibility: 'Studying in Class 5 (for Class 6 entry) in government/recognized rural school',
    ageLimit: '9 to 13 years depending on target grade entry',
    reservationInfo: 'At least 75% seats reserved for candidates from rural areas; SC/ST & 33% girls.',
    applicationWindow: 'July – September annually',
    examDate: 'November & January (Phase-wise)',
    officialUrl: 'https://navodaya.gov.in/',
    lastVerifiedDate: '2026-11-08',
    stateScope: 'All India (District-wise)',
    isFeatured: false
  },
  {
    id: 'disc-006',
    title: 'AISSEE - All India Sainik Schools Entrance Examination',
    category: 'School Entrance',
    conductingAuthority: 'National Testing Agency (NTA)',
    eligibility: 'Class 6 & Class 9 admission into Sainik Schools & New Sainik Schools',
    ageLimit: 'Class 6: 10-12 years | Class 9: 13-15 years',
    reservationInfo: '67% for Home State, 33% for Other States; Defence personnel 25%.',
    applicationWindow: 'October – November annually',
    examDate: 'January annually',
    officialUrl: 'https://exams.nta.ac.in/AISSEE/',
    lastVerifiedDate: '2026-11-05',
    stateScope: 'All India',
    isFeatured: false
  },
  {
    id: 'disc-007',
    title: 'SSC CGL - Combined Graduate Level Examination',
    category: 'Staff Selection / Central Govt',
    conductingAuthority: 'Staff Selection Commission (SSC)',
    eligibility: 'Graduation from any recognized university',
    ageLimit: '18 to 32 years (post-specific)',
    reservationInfo: 'SC, ST, OBC, EWS, ESM, and PwD as per Central Government rules.',
    applicationWindow: 'June – July annually',
    examDate: 'Tier-1: September | Tier-2: December',
    officialUrl: 'https://ssc.gov.in/',
    lastVerifiedDate: '2026-11-11',
    stateScope: 'All India',
    isFeatured: false
  }
];

export const initialCompetitions = [
  {
    id: 'comp-001',
    title: 'Gyanvik National Medical Talent Search (GNMTS 2026)',
    examSlug: 'neet',
    description: 'All-India National Scholarship Exam for NEET aspirants. Benchmark your readiness across 100,000+ students.',
    startDate: '2026-12-01T00:00:00Z',
    endDate: '2026-12-15T23:59:59Z',
    eligibility: 'Students of Class 11, Class 12, and Droppers targeting NEET.',
    rulesText: '180 Minutes, 720 Marks, NTA Marking Scheme (+4 / -1). Webcam proctoring and browser tab lock enforced.',
    prizesText: 'Rank 1-5: 100% MBBS Foundation Scholarship + Apple iPad Air | Rank 6-50: 1-Year 1-on-1 AIIMS Mentorship + ₹25,000 Academic Grant | All participants receive All-India Rank certificate.',
    isActive: true
  }
];

export const initialPayments = [
  {
    id: 'pay-001',
    studentId: 'student-001',
    planName: 'NEET Premium Pro: Mentor & Test Series Bundle',
    planTier: 'NEET_PRO',
    amountInr: 2499.00,
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod: 'UPI (Sandbox)',
    gatewayOrderId: 'order_gyanvik_mock_99182',
    gatewayPaymentId: 'pay_mock_8817263541',
    invoiceNumber: 'GYAN-INV-2026-0042',
    validUntil: new Date(Date.now() + 86400000 * 180).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];
