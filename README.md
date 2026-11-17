# GYANVIK – One Platform. Many Examinations. Clearer Opportunities.

A premier, full-stack, responsive competitive examination preparation and government opportunity discovery platform built with **React.js**, **Node.js**, **Express.js**, and **Supabase PostgreSQL**.

---

## 🌟 Executive Overview & Brand Identity

**GYANVIK** is engineered to serve millions of Indian students aiming for academic and career excellence across medical, engineering, civil services, defense, and school entrance examinations.

- **Brand Motto**: *One Platform. Many Examinations. Clearer Opportunities.*
- **Core Aesthetic**: Professional Navy Blue (`#070F2B` / `#0F172A`), White & Slate, with Golden Yellow accents (`#F59E0B` / `#FFB800`) and Medical Cyan/Emerald highlights.
- **Immediate Focus**: Complete, fully functional student journey for **NEET (UG)**, with configurable pathways for **IIT-JEE, GATE, and CUET**.

---

## 🚀 Key Features

### 1. Cinematic Introduction Screen
- **Movie-Trailer Experience**: The platform opens with a full-screen cinematic sequence where the brand name **GYANVIK** emerges in bold typography with glowing anamorphic lens flares, cosmic particle canvas animations, and synchronized Web Audio API sub-bass sweep & choral chimes.
- **Timed Auto-Transition**: Remains active for ~2.8 seconds before smoothly transitioning to the login portal (with "Skip to Portal" and audio controls).

### 2. Multi-Portal Authentication System
- **Three Separate Access Options**:
  1. **Student / User Portal**: Aspirant sign-in and registration with full name, email, target exam, current academic stage, and **Minor Safety Guardian-Consent Workflow**.
  2. **Admin Portal**: Authorized access for academic coordinators managing questions, test series, exam patterns, and mentor bookings.
  3. **Super Admin Portal**: Highest clearance for platform owners controlling admin provisioning, security audit logs, and monetization analytics.
- **Fast Demo Accounts**:
  - **Student**: `student@gyanvik.edu.in` / `Student@2026`
  - **Admin**: `admin@gyanvik.edu.in` / `Admin@2026`
  - **Super Admin**: `superadmin@gyanvik.edu.in` / `SuperAdmin@2026`

### 3. "SELECT YOUR JOURNEY" Hub
- **Personalized Aspirant Banner**: Welcoming the student by name.
- **Interactive Journey Selector**: Clickable cards for:
  - **NEET (UG)**: *Active & Fully Functional*
  - **IIT-JEE**: *Coming Soon – Configured for 2026/27*
  - **GATE**: *Coming Soon – In Development*
  - **CUET (UG)**: *Coming Soon – In Development*

### 4. Dedicated NEET Preparation Hub
- **Motivational Anchor**: Displayed prominently at the top:
  > *"Today's hard work is tomorrow's white coat."*
- **Continuous Scrolling Notification Ticker**: Live marquee featuring updated NEET notifications, exam dates, admit cards, answer keys, and counseling updates verified directly against the National Testing Agency (NTA).
- **Official Examination Pattern Table**:
  - Physics: 45 questions | 180 marks
  - Chemistry: 45 questions | 180 marks
  - Biology (Botany + Zoology): 90 questions | 360 marks
  - **Total**: 180 questions | 720 marks
  - Exam Mode: Offline (Pen and Paper - OMR)
  - Duration: 3 Hours (180 Minutes)
  - Question Type: Multiple Choice Questions (MCQs)
  - Marking Scheme: +4 for correct, -1 for wrong, 0 for unattempted
  - Conducting Authority: NTA
  - **Dynamic DB Management**: All values can be updated by Admins live without code redeployment.
- **CTA**: Prominent **"CRACK NEET WITH GYANVIK"** button unlocking the master preparation dashboard.

### 5. Master NEET Preparation Dashboard (3 Core Modules)
1. **PYQs (Previous Year Questions)**:
   - 4 Subjects: **Physics, Chemistry, Botany, Zoology**.
   - Filter by Examination Year (2024, 2023, 2022, 2021) and Chapter.
   - Interactive CBT Test Player: Question palette with color codes (Answered, Not Answered, Marked for Review), countdown timer, instant scoring (+4, -1, 0), accuracy %, subject breakdown, and line-by-line NCERT solutions.
2. **NCERT Books Library**:
   - Authorized digital library for Class 11th & 12th Physics, Chemistry, and Biology textbooks.
   - In-app reader modal with zoom controls and official PDF download links.
3. **GYANVIK PREMIUM**:
   - **(A) BOOK YOUR MENTOR**: Highlighting 7 core pillars (*Personal Guidance, Doubt Solving, Study Planning, Motivation, Performance Tracking, Exam Strategies, Stress Management*). Integrated booking form, transparent pricing (₹999/mo, ₹2499/qtr), sandbox payment, and admin mentor assignment.
   - **(B) TEST SERIES**: Full-length 720-mark grand mocks and subject speed drills with automatic weak-topic identification.
   - **(C) PYQ SOLVING**: High-yield problem-solving drills with 10-year historical weightage analysis.
   - **(D) SHORT NOTES & BLUEPRINTS**: Downloadable formula pocket sheets and high-weightage chapter blueprints.
   - **(E) AI CHATBOT**: Explicitly disabled and scope-locked per initial project scope guidelines.

### 6. Pan-Indian Exam & Opportunity Discovery
- Expansion module covering **UPSC Civil Services, IIT-JEE, NDA & Defence, SSC CGL, Central Bank PO, State Police SI, CTET, Jawahar Navodaya Vidyalaya (JNVST), and Sainik School (AISSEE)**.
- Filterable by Category and State, showing eligibility, age criteria, official links, and verified dates.

### 7. Competitions & National Talent Search
- Annual **Gyanvik National Medical Talent Search (GNMTS)** with rules, syllabus, prizes (iPads, 100% Scholarships), and national rankings.

### 8. Monetization & Sandbox Payment Gateway
- Complete sandbox checkout flow supporting simulated UPI, Cards, and NetBanking.
- Auto-generated GST-compliant invoice receipts (`GYAN-INV-2026-XXXX`).

### 9. Administration & Super Admin Governance
- **Admin Portal**: Dynamic NEET pattern configuration, notification publisher, question authoring, mentor-student matching, and student progress reports.
- **Super Admin Console**: Admin account provisioning, mentor recruitment (AIIMS/MAMC doctors), security audit logs with IP & actor tracking, and revenue dashboards.

---

## 📁 Monorepo Architecture

```
gyanvik/
├── client/                     # Frontend (React 19, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/         # CinematicIntro, Navbar, ExamPatternTable,
│   │   │                       # TestPlayerModal, MentorBookingModal,
│   │   │                       # NcertReaderModal, NotificationTicker, etc.
│   │   ├── context/            # AuthContext (Role-based access & session)
│   │   ├── pages/              # LoginPage, StudentDashboard, NeetPrepHub,
│   │   │                       # AdminPortal, SuperAdminPortal
│   │   ├── services/           # api.js (Unified REST API client)
│   │   ├── index.css           # Tailwind CSS directives & custom animations
│   │   └── App.jsx             # Route definitions & protected route guards
│   ├── index.html              # HTML shell & font imports
│   ├── tailwind.config.js      # Custom Gyanvik colors, keyframes & fonts
│   └── vite.config.js          # Vite config & API reverse proxy
│
├── server/                     # Backend API (Node.js, Express.js)
│   ├── src/
│   │   ├── config/             # Constants, Supabase client initialization
│   │   ├── controllers/        # Auth, Exam, Notification, Academic, Test,
│   │   │                       # Mentor, Payment, Discovery, Admin controllers
│   │   ├── db/                 # Store data layer & rich authentic seed data
│   │   ├── middleware/         # JWT verification, Role authorization, Audit logger
│   │   ├── routes/             # Express API routes
│   │   └── index.js            # Express server entry point & static file server
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 20261117_init_gyanvik_schema.sql # Complete PostgreSQL schema & RLS policies
│
├── package.json                # Monorepo root scripts
└── README.md
```

---

## 🛠️ Quick Start & Running Locally

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Start Frontend Client (Vite Dev Server)
```bash
cd client
npm install
npm run dev
# Client starts on http://localhost:5173
```

Alternatively, `http://localhost:5000` automatically serves the compiled production build from `client/dist`.

---

## 🗄️ Supabase Database & RLS Integration

1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run the SQL script located in `supabase/migrations/20261117_init_gyanvik_schema.sql`.
3. Add your project credentials to `server/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Even without cloud credentials, the platform runs with full database persistence in smart local store mode for offline development and evaluation.

---

## 🛡️ Security & Privacy Compliance

- **Encrypted Password Hashing**: Passwords secured using `bcryptjs` with salt rounds.
- **Server-Side Role Authorization**: Enforced across `STUDENT`, `ADMIN`, and `SUPER_ADMIN`.
- **Minor Safety**: Guardian consent and parent contact verification for minor aspirants.
- **Audit Logging**: Every administrative action, question mutation, and login is chronologically audited with IP addresses.
