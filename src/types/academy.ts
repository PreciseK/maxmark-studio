export type AcademyCourse = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  trailer_youtube_id?: string | null;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  modules?: AcademyModule[];
};

export type AcademyModule = {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  display_order: number;
  lessons?: AcademyLesson[];
};

export type LessonResource = {
  title: string;
  url: string;
  type: "file" | "link" | "preset" | "code";
};

export type AcademyLesson = {
  id: string;
  course_id: string;
  module_id: string;
  slug: string;
  title: string;
  description_markdown?: string | null;
  youtube_video_id: string;
  duration_minutes: number;
  is_free_preview: boolean;
  resources: LessonResource[];
  display_order: number;
  published: boolean;
  created_at: string;
  completed?: boolean;
};

export type AcademyPricingTier = {
  id: string; // 'lifetime' | 'subscription_monthly' | 'subscription_yearly'
  name: string;
  description?: string | null;
  amount_kobo: number;
  currency: string;
  billing_interval: "one_time" | "monthly" | "yearly";
  paystack_plan_code?: string | null;
  benefits: string[];
  is_popular: boolean;
  active: boolean;
};

export type AcademyEnrollment = {
  id: string;
  user_id: string;
  user_email: string;
  tier_id?: string | null;
  access_type: "lifetime" | "subscription" | "manual_grant";
  status: "active" | "past_due" | "cancelled" | "expired";
  paystack_reference?: string | null;
  current_period_end?: string | null;
  created_at: string;
};
