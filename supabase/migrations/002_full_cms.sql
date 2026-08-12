-- Maxmark Studio full CMS: run after 001_initial_schema.sql.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS challenge TEXT,
  ADD COLUMN IF NOT EXISTS approach TEXT,
  ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Perspective',
  excerpt TEXT,
  content_html TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT,
  mux_playback_id TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.site_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio_html TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','unsubscribed')),
  source TEXT NOT NULL DEFAULT 'website',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','closed','spam')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.booking_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.booking_services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_public ON public.blog_posts (published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_public ON public.team_members (published, display_order);
CREATE INDEX IF NOT EXISTS idx_bookings_calendar ON public.bookings (booking_date, start_time, status);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contact_submissions (status, created_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published blog" ON public.blog_posts FOR SELECT USING (published AND deleted_at IS NULL);
CREATE POLICY "Public read site pages" ON public.site_pages FOR SELECT USING (true);
CREATE POLICY "Public read team" ON public.team_members FOR SELECT USING (published AND deleted_at IS NULL);
CREATE POLICY "Public read booking services" ON public.booking_services FOR SELECT USING (active);
CREATE POLICY "Public create subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create contacts" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin blog access" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin site page access" ON public.site_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin team access" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin subscriber access" ON public.subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin contact access" ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin service access" ON public.booking_services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin booking access" ON public.bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read site media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
CREATE POLICY "Admin upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media');
CREATE POLICY "Admin update site media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media');
CREATE POLICY "Admin delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media');

INSERT INTO public.booking_services (name, duration_minutes, description, display_order) VALUES
  ('Recording', 120, 'Vocals, instruments, and music production sessions.', 1),
  ('Rehearsal', 180, 'Artist, band, and live-set preparation.', 2),
  ('Podcast', 120, 'Recorded interviews, conversations, and video podcasts.', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.site_pages (page_key, title, content_json) VALUES
  ('about', 'About', '{"heroStatement":"Maxmark is a production studio creating films, brand worlds, and music visuals with cinematic craft at African market speed.","beliefTitle":"The story comes first. Technology helps it travel further.","beliefCopy":"Maxmark Studio brings filmmakers, designers, producers, and technologists into one connected production practice.","joinImageUrl":"/about/head-of-production.png"}'),
  ('studio', 'Studio', '{"heroTitle":"Built for sound.","heroCopy":"A physical studio for recording, rehearsals, podcasts, and the moments between the idea and the take.","heroImageUrl":"/studio/recording-room.png","recordingImageUrl":"/studio/recording-room.png","rehearsalImageUrl":"/studio/rehearsal-room.png","podcastImageUrl":"/studio/podcast-room.png"}')
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO public.projects (slug,title,category,client,year,mux_playback_id,aspect_ratio,grid_size,featured,display_order,published,published_at)
VALUES
('ritual-of-motion','Ritual of Motion','brand','Adidas Africa',2024,'VCBESmjDlV4eRLTFzQ2j75KtN1XrKyV9sdwaAQXNv38','4:3','large',true,1,true,now()),
('the-last-frontier','The Last Frontier','narrative','Netflix Africa',2024,'CkqEBNBjOnsS5xdeHV9VakK2k8j1j500FATUoIAWnnv4','4:3','large',true,2,true,now()),
('frequency','Frequency','music','Burna Boy',2024,'zFaTv2EtIEW3dzkNTxBzHvcCJPEG009AR61Ng8h2RPGI','16:9','medium',true,3,true,now()),
('heritage-drop','Heritage Drop','brand','Johnnie Walker',2024,'00uZ5D3R3y7XM7J67GBZQCBe89j02E1uL01HZ8MW2ocBUc','16:9','medium',true,4,true,now()),
('isoka','Isoka','narrative',NULL,2024,'KN702xowBcoN1Qq7NKudjBv1l02HMkW2QMkHAlmY7jsak','1:1','small',true,5,true,now()),
('golden-hour','Golden Hour','music','Ayra Starr',2024,'q3ld4vu00a9IeOlIQFuj6jltcdbS1MM102yz2Of1n601t4','1:1','small',true,6,true,now())
ON CONFLICT (slug) DO UPDATE SET featured=true, published=true, display_order=EXCLUDED.display_order;
