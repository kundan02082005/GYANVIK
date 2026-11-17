-- ========================================================================
-- GYANVIK: One Platform. Many Examinations. Clearer Opportunities.
-- Supabase PostgreSQL Schema & Row-Level Security (RLS) Policies
-- Migration: 20261117_init_gyanvik_schema.sql
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================
-- 1. ENUMS & DOMAINS
-- ========================================================================
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('STUDENT', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status_type AS ENUM ('PENDING', 'APPROVED', 'ASSIGNED', 'REJECTED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_type AS ENUM ('EASY', 'MEDIUM', 'HARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE test_type_enum AS ENUM ('FULL_MOCK', 'SUBJECT_WISE', 'CHAPTER_WISE', 'TOPIC_WISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ========================================================================
-- 2. CORE USER PROFILES TABLE
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role_type NOT NULL DEFAULT 'STUDENT',
    avatar_url TEXT,
    phone TEXT,
    target_exam TEXT DEFAULT 'NEET',
    class_level TEXT DEFAULT '12th',
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_consent BOOLEAN DEFAULT FALSE,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 3. EXAMINATION CATEGORIES & CONFIGURATION (DYNAMICALLY CONFIGURABLE)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.exam_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_slug TEXT UNIQUE NOT NULL REFERENCES public.exam_categories(slug) ON DELETE CASCADE,
    motivational_quote TEXT DEFAULT 'Today''s hard work is tomorrow''s white coat.',
    paper_structure JSONB NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 180,
    total_marks INT NOT NULL DEFAULT 720,
    total_questions INT NOT NULL DEFAULT 180,
    exam_mode TEXT NOT NULL DEFAULT 'Offline (Pen and Paper)',
    question_type TEXT NOT NULL DEFAULT 'Multiple Choice Questions (MCQs)',
    correct_mark INT NOT NULL DEFAULT 4,
    negative_mark INT NOT NULL DEFAULT 1,
    unattempted_mark INT NOT NULL DEFAULT 0,
    conducting_authority TEXT NOT NULL DEFAULT 'NTA (National Testing Agency)',
    notes TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 4. NOTIFICATIONS & TICKER (OFFICIAL & VERIFIED)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_slug TEXT REFERENCES public.exam_categories(slug) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_name TEXT NOT NULL DEFAULT 'National Testing Agency (NTA)',
    source_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    is_ticker BOOLEAN DEFAULT TRUE,
    urgency_level TEXT DEFAULT 'INFO',
    last_verified_date TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 5. ACADEMIC STRUCTURE: SUBJECTS, CHAPTERS, QUESTIONS (PYQs)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_slug TEXT NOT NULL REFERENCES public.exam_categories(slug) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_slug, code)
);

CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class_level TEXT NOT NULL DEFAULT '11th',
    order_index INT DEFAULT 0,
    weightage_pct NUMERIC(4, 1) DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    exam_slug TEXT NOT NULL DEFAULT 'NEET',
    year INT NOT NULL,
    question_text TEXT NOT NULL,
    question_image_url TEXT,
    options JSONB NOT NULL,
    correct_option TEXT NOT NULL,
    explanation TEXT,
    difficulty difficulty_type DEFAULT 'MEDIUM',
    topic TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 6. NCERT BOOKS & SHORT NOTES / BLUEPRINTS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.ncert_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    class_level TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(5, 2) DEFAULT 4.5,
    is_downloadable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.short_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    class_level TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    summary TEXT,
    file_url TEXT NOT NULL,
    is_blueprint BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 7. TEST SERIES & MOCK EXAMINATIONS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.test_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_slug TEXT NOT NULL DEFAULT 'NEET',
    title TEXT NOT NULL,
    description TEXT,
    test_type test_type_enum DEFAULT 'FULL_MOCK',
    duration_minutes INT NOT NULL DEFAULT 180,
    total_marks INT NOT NULL DEFAULT 720,
    negative_marking INT NOT NULL DEFAULT 1,
    passing_pct INT DEFAULT 50,
    difficulty difficulty_type DEFAULT 'MEDIUM',
    is_published BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID NOT NULL REFERENCES public.test_series(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    marks INT NOT NULL DEFAULT 4,
    negative_marks INT NOT NULL DEFAULT 1,
    order_index INT NOT NULL DEFAULT 0,
    UNIQUE(test_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.test_series(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    submit_time TIMESTAMPTZ,
    score INT DEFAULT 0,
    total_marks INT DEFAULT 720,
    accuracy_pct NUMERIC(5, 2) DEFAULT 0.0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    unattempted_count INT DEFAULT 0,
    responses JSONB DEFAULT '{}'::jsonb,
    subject_breakdown JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 8. GYANVIK PREMIUM: MENTOR SYSTEM & BOOKINGS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    medical_college TEXT NOT NULL,
    neet_air_rank INT,
    bio TEXT,
    specializations TEXT[] DEFAULT ARRAY['Physics', 'Chemistry', 'Biology'],
    languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
    hourly_rate_inr INT DEFAULT 499,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    total_mentees INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mentor_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
    exam_goal TEXT NOT NULL DEFAULT 'NEET 2026/2027',
    preferred_subjects TEXT NOT NULL,
    preparation_stage TEXT DEFAULT 'Class 12th Regular',
    preferred_language TEXT DEFAULT 'Bilingual (Hindi + English)',
    student_contact_phone TEXT NOT NULL,
    notes TEXT,
    status booking_status_type DEFAULT 'PENDING',
    payment_status payment_status_type DEFAULT 'PENDING',
    assigned_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 9. MONETIZATION, SUBSCRIPTIONS & SANDBOX PAYMENTS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions_and_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'NEET_PRO',
    amount_inr NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status_type DEFAULT 'SUCCESS',
    payment_method TEXT DEFAULT 'UPI / Card (Sandbox)',
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    invoice_number TEXT UNIQUE NOT NULL,
    valid_until TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 10. COMPETITIONS, OLYMPIADS & SCHOLARSHIPS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    exam_slug TEXT DEFAULT 'NEET',
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    eligibility TEXT,
    rules_text TEXT,
    prizes_text TEXT,
    test_id UUID REFERENCES public.test_series(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.competition_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    accuracy_pct NUMERIC(5, 2) DEFAULT 0.0,
    all_india_rank INT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, student_id)
);

-- ========================================================================
-- 11. EXAMINATION & GOVT OPPORTUNITY DISCOVERY (EXPANSION)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.exam_discoveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    conducting_authority TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    age_limit TEXT,
    reservation_info TEXT,
    application_window TEXT,
    exam_date TEXT,
    official_url TEXT NOT NULL,
    last_verified_date TIMESTAMPTZ DEFAULT NOW(),
    state_scope TEXT DEFAULT 'All India',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 12. AUDIT LOGS (SECURITY & SUPER ADMIN MONITORING)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ncert_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions_and_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_discoveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions to check role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'ADMIN' OR role = 'SUPER_ADMIN')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read their own, admins can read all
CREATE POLICY "Profiles viewable by self or admin" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles updatable by self" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public Read Catalog Tables (Available to all authenticated users & visitors)
CREATE POLICY "Exam categories public read" ON public.exam_categories FOR SELECT USING (true);
CREATE POLICY "Exam configs public read" ON public.exam_configurations FOR SELECT USING (true);
CREATE POLICY "Notifications public read" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Subjects public read" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Chapters public read" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Questions public read" ON public.questions FOR SELECT USING (true);
CREATE POLICY "NCERT public read" ON public.ncert_resources FOR SELECT USING (true);
CREATE POLICY "Short notes public read" ON public.short_notes FOR SELECT USING (true);
CREATE POLICY "Test series public read" ON public.test_series FOR SELECT USING (true);
CREATE POLICY "Test questions public read" ON public.test_questions FOR SELECT USING (true);
CREATE POLICY "Mentors public read" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Competitions public read" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Exam discoveries public read" ON public.exam_discoveries FOR SELECT USING (true);

-- Student-specific data isolation
CREATE POLICY "Test attempts viewable by owner or admin" ON public.test_attempts
    FOR SELECT USING (auth.uid() = student_id OR public.is_admin());
CREATE POLICY "Test attempts insertable by owner" ON public.test_attempts
    FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Test attempts updatable by owner" ON public.test_attempts
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Bookings viewable by owner or admin" ON public.mentor_bookings
    FOR SELECT USING (auth.uid() = student_id OR public.is_admin());
CREATE POLICY "Bookings insertable by owner" ON public.mentor_bookings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Payments viewable by owner or admin" ON public.subscriptions_and_payments
    FOR SELECT USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Competition participation by self" ON public.competition_participants
    FOR SELECT USING (auth.uid() = student_id OR public.is_admin());

-- Admin write policies on academic and operational content
CREATE POLICY "Admin write exam categories" ON public.exam_categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write exam configs" ON public.exam_configurations FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write notifications" ON public.notifications FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write subjects" ON public.subjects FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write chapters" ON public.chapters FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write questions" ON public.questions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write ncert" ON public.ncert_resources FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write short notes" ON public.short_notes FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write test series" ON public.test_series FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write test questions" ON public.test_questions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write mentors" ON public.mentors FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write mentor bookings" ON public.mentor_bookings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write competitions" ON public.competitions FOR ALL USING (public.is_admin());
CREATE POLICY "Admin write exam discoveries" ON public.exam_discoveries FOR ALL USING (public.is_admin());

-- Super Admin exclusive tables: audit logs
CREATE POLICY "Super admin audit logs read" ON public.audit_logs FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super admin audit logs insert" ON public.audit_logs FOR INSERT WITH CHECK (true);
