-- =========================================================
-- 003_academy.sql: Maxmark Animations Academy Schema & Paywall
-- =========================================================

-- 1. Academy Courses
CREATE TABLE IF NOT EXISTS public.academy_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  trailer_youtube_id TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_academy_courses_published ON public.academy_courses (published, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_academy_courses_slug ON public.academy_courses (slug);

-- 2. Academy Modules (Sections within a course)
CREATE TABLE IF NOT EXISTS public.academy_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_academy_modules_course ON public.academy_modules (course_id, display_order ASC);

-- 3. Academy Lessons (Individual video tutorials)
CREATE TABLE IF NOT EXISTS public.academy_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.academy_modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description_markdown TEXT DEFAULT '',
  youtube_video_id TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 10,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  resources JSONB DEFAULT '[]'::jsonb, -- Array of { title: string, url: string, type: string }
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  deleted_at TIMESTAMPTZ,
  UNIQUE(course_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_academy_lessons_module ON public.academy_lessons (module_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_academy_lessons_course_slug ON public.academy_lessons (course_id, slug);

-- 4. Academy Pricing Tiers (Lifetime & Subscription plans)
CREATE TABLE IF NOT EXISTS public.academy_pricing_tiers (
  id TEXT PRIMARY KEY, -- e.g. 'lifetime', 'subscription_monthly', 'subscription_yearly'
  name TEXT NOT NULL,
  description TEXT,
  amount_kobo BIGINT NOT NULL, -- in Kobo (e.g. 5000000 = 50,000 NGN)
  currency TEXT NOT NULL DEFAULT 'NGN',
  billing_interval TEXT NOT NULL DEFAULT 'one_time', -- 'one_time', 'monthly', 'yearly'
  paystack_plan_code TEXT, -- Paystack plan code for recurring subscriptions
  benefits JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true
);

-- 5. Academy Enrollments & Subscriptions
CREATE TABLE IF NOT EXISTS public.academy_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  tier_id TEXT REFERENCES public.academy_pricing_tiers(id),
  access_type TEXT NOT NULL CHECK (access_type IN ('lifetime', 'subscription', 'manual_grant')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
  paystack_reference TEXT,
  paystack_customer_code TEXT,
  paystack_subscription_code TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_academy_enrollments_user ON public.academy_enrollments (user_id, status);
CREATE INDEX IF NOT EXISTS idx_academy_enrollments_email ON public.academy_enrollments (user_email);

-- 6. Academy Lesson Progress
CREATE TABLE IF NOT EXISTS public.academy_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.academy_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_watched_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_academy_progress_user ON public.academy_lesson_progress (user_id);

-- Enable RLS
ALTER TABLE public.academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Courses & Modules: Public can read published
CREATE POLICY "Public read published academy_courses" ON public.academy_courses
  FOR SELECT USING (published = true AND deleted_at IS NULL);

CREATE POLICY "Public read academy_modules" ON public.academy_modules
  FOR SELECT USING (true);

-- Pricing tiers: Public can read active tiers
CREATE POLICY "Public read active academy_pricing_tiers" ON public.academy_pricing_tiers
  FOR SELECT USING (active = true);

-- Lessons: Public can read free preview lessons; enrolled users can read all published lessons
CREATE POLICY "Public read free preview lessons" ON public.academy_lessons
  FOR SELECT USING (published = true AND is_free_preview = true AND deleted_at IS NULL);

CREATE POLICY "Enrolled users read published lessons" ON public.academy_lessons
  FOR SELECT TO authenticated USING (
    published = true AND deleted_at IS NULL AND (
      is_free_preview = true OR EXISTS (
        SELECT 1 FROM public.academy_enrollments e
        WHERE e.user_id = auth.uid()
          AND e.status = 'active'
          AND (e.current_period_end IS NULL OR e.current_period_end > now())
      )
    )
  );

-- Enrollments: Users can read their own enrollments
CREATE POLICY "Users read own academy_enrollments" ON public.academy_enrollments
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Lesson Progress: Users can manage their own progress
CREATE POLICY "Users manage own lesson progress" ON public.academy_lesson_progress
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Admin full access across all academy tables
CREATE POLICY "Admin full access academy_courses" ON public.academy_courses
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%') WITH CHECK (true);

CREATE POLICY "Admin full access academy_modules" ON public.academy_modules
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%') WITH CHECK (true);

CREATE POLICY "Admin full access academy_lessons" ON public.academy_lessons
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%') WITH CHECK (true);

CREATE POLICY "Admin full access academy_pricing_tiers" ON public.academy_pricing_tiers
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%') WITH CHECK (true);

CREATE POLICY "Admin full access academy_enrollments" ON public.academy_enrollments
  FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' LIKE '%admin%') WITH CHECK (true);

-- Seed default pricing tiers (Lifetime & Subscriptions)
INSERT INTO public.academy_pricing_tiers (id, name, description, amount_kobo, currency, billing_interval, benefits, is_popular, active)
VALUES 
  (
    'lifetime',
    'Lifetime All-Access',
    'One-time payment for permanent access to all current and future tutorials, project files, and community.',
    15000000, -- 150,000 NGN
    'NGN',
    'one_time',
    '["Permanent access to all masterclasses", "Complete library of animation source files", "Direct access to private Maxmark creator circle", "Future course additions included forever", "Certificate of completion"]'::jsonb,
    true,
    true
  ),
  (
    'subscription_monthly',
    'Monthly Membership',
    'Flexible recurring access with full library unlock and ongoing mentorship.',
    2500000, -- 25,000 NGN / month
    'NGN',
    'monthly',
    '["Full access to all course lessons", "Downloadable project presets and templates", "Monthly live Q&A sessions", "Cancel anytime"]'::jsonb,
    false,
    true
  ),
  (
    'subscription_yearly',
    'Annual Membership',
    'Get 12 months for the price of 8 with full priority access.',
    20000000, -- 200,000 NGN / year
    'NGN',
    'yearly',
    '["Save over 30% compared to monthly", "All monthly membership benefits", "Priority portfolio reviews by Maxmark directors", "Early access to new release masterclasses"]'::jsonb,
    false,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  amount_kobo = EXCLUDED.amount_kobo,
  benefits = EXCLUDED.benefits;
