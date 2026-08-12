-- Create enum types
CREATE TYPE project_category AS ENUM ('brand', 'narrative', 'music');
CREATE TYPE aspect_ratio AS ENUM ('4:3', '16:9', '1:1', '21:9');
CREATE TYPE grid_size AS ENUM ('large', 'medium', 'small');

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  eyebrow TEXT,
  category project_category NOT NULL DEFAULT 'brand',
  client TEXT,
  year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  summary TEXT,
  body_json JSONB DEFAULT '{}'::jsonb,
  mux_playback_id TEXT,
  youtube_id TEXT,
  poster_url TEXT,
  aspect_ratio aspect_ratio NOT NULL DEFAULT '16:9',
  grid_size grid_size NOT NULL DEFAULT 'medium',
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_projects_published_order ON public.projects (published, display_order ASC);
CREATE INDEX idx_projects_category ON public.projects (category);
CREATE INDEX idx_projects_slug ON public.projects (slug);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read published projects
CREATE POLICY "Public read published projects" ON public.projects
  FOR SELECT USING (published = true AND deleted_at IS NULL);

-- Authenticated admins have full access
CREATE POLICY "Admin full access" ON public.projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Storage policies for project-posters and project-gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('project-posters', 'project-posters', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-gallery', 'project-gallery', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read project posters" ON storage.objects FOR SELECT USING (bucket_id = 'project-posters');
CREATE POLICY "Admin upload project posters" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-posters');
CREATE POLICY "Admin update project posters" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-posters');
CREATE POLICY "Admin delete project posters" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-posters');

CREATE POLICY "Public read project gallery" ON storage.objects FOR SELECT USING (bucket_id = 'project-gallery');
CREATE POLICY "Admin upload project gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-gallery');
CREATE POLICY "Admin update project gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-gallery');
CREATE POLICY "Admin delete project gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-gallery');
