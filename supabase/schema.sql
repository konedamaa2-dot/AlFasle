-- =====================================================================
-- AlFasle LMS — Schéma de Base de Données PostgreSQL / Supabase
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TYPES ENUM
CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE enrollment_mode AS ENUM ('OPEN', 'INVITATION', 'MANUAL_APPROVAL');
CREATE TYPE class_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE inscription_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE course_status AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE submission_status AS ENUM ('SUBMITTED', 'GRADED', 'LATE');

-- 3. TABLE PROFILES (Liée à auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL DEFAULT 'Intermédiaire',
    category TEXT NOT NULL DEFAULT 'Informatique',
    capacity INT NOT NULL DEFAULT 30,
    enrollment_mode enrollment_mode NOT NULL DEFAULT 'MANUAL_APPROVAL',
    status class_status NOT NULL DEFAULT 'ACTIVE',
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_image TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE INSCRIPTIONS (Préinscriptions & Admissions)
CREATE TABLE IF NOT EXISTS public.inscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    status inscription_status NOT NULL DEFAULT 'PENDING',
    motivation TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    UNIQUE(user_id, classe_id)
);

-- 6. TABLE COURSES (Leçons & Chapitres)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classe_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    chapter_title TEXT DEFAULT 'Module 1 : Fondations',
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT, -- Markdown enrichi
    display_order INT DEFAULT 1,
    status course_status NOT NULL DEFAULT 'PUBLISHED',
    video_url TEXT,
    video_duration INT DEFAULT 0,
    resources JSONB DEFAULT '[]'::jsonb,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE ASSIGNMENTS (Devoirs & TP)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classe_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE SUBMISSIONS (Copies remises par les étudiants)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    attachment_name TEXT,
    attachment_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status submission_status NOT NULL DEFAULT 'SUBMITTED',
    UNIQUE(assignment_id, student_id)
);

-- 9. TABLE CORRECTIONS (Notes et Feedbacks)
CREATE TABLE IF NOT EXISTS public.corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID UNIQUE NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    grader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    feedback TEXT NOT NULL,
    graded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLE NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'SYSTEM',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Chacun peut voir les profils publics, seul l'utilisateur peut modifier le sien
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Classes: Visibles par tous, création/modification réservée aux enseignants et admins
CREATE POLICY "Classes viewable by everyone" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Teachers can insert classes" ON public.classes FOR INSERT WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "Teachers can update their classes" ON public.classes FOR UPDATE USING (auth.uid() = teacher_id);

-- Inscriptions: L'étudiant peut voir ses inscriptions, l'enseignant peut voir celles de sa classe
CREATE POLICY "Students see their inscriptions" ON public.inscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers see inscriptions for their classes" ON public.inscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.classes WHERE public.classes.id = inscriptions.classe_id AND public.classes.teacher_id = auth.uid())
);
CREATE POLICY "Students can apply" ON public.inscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can update inscription status" ON public.inscriptions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.classes WHERE public.classes.id = inscriptions.classe_id AND public.classes.teacher_id = auth.uid())
);

-- Submissions & Corrections
CREATE POLICY "Students can view their submissions" ON public.submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers can grade" ON public.corrections FOR ALL USING (auth.uid() = grader_id);
