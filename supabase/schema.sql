-- ============================================================
-- MindMap AI: Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize tables
-- ============================================================

-- 1. Profiles Table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Topics Table
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'coming_soon',
    difficulty TEXT NOT NULL DEFAULT 'Intermediate',
    estimated_minutes INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Misconceptions Taxonomy Table
CREATE TABLE IF NOT EXISTS public.misconceptions (
    id TEXT PRIMARY KEY, -- e.g. 'M01', 'M02', 'M03', 'M04', 'M05'
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    concept TEXT NOT NULL,
    explanation TEXT NOT NULL,
    key_distinction JSONB NOT NULL,
    analogy TEXT,
    example TEXT,
    reassessment_question JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
    concept TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    context TEXT,
    hints JSONB DEFAULT '[]'::jsonb,
    suggested_answers JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Student Attempts Table
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    question_id TEXT REFERENCES public.questions(id) ON DELETE SET NULL,
    question_prompt TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    misconception_id TEXT REFERENCES public.misconceptions(id) ON DELETE SET NULL,
    confidence NUMERIC(4, 2) DEFAULT 0.0,
    evidence_summary TEXT,
    intervention_type TEXT,
    is_reassessment BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Interventions Delivered Table
CREATE TABLE IF NOT EXISTS public.interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.attempts(id) ON DELETE CASCADE,
    misconception_id TEXT REFERENCES public.misconceptions(id) ON DELETE CASCADE,
    intervention_type TEXT NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- 7. Learning Progress / Concept Map Table
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
    concept_id TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started' | 'misconception' | 'improving' | 'mastered'
    active_misconception_id TEXT REFERENCES public.misconceptions(id) ON DELETE SET NULL,
    attempts_count INTEGER DEFAULT 0,
    last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, concept_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow public reading of topics & taxonomy, user-isolated writing)
CREATE POLICY "Public topics readable" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public misconceptions readable" ON public.misconceptions FOR SELECT USING (true);
CREATE POLICY "Public questions readable" ON public.questions FOR SELECT USING (true);
