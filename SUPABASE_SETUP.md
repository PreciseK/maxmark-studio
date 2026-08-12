# Supabase CMS Setup

1. Create a Supabase project named `maxmark-studio`.
2. Save the database password securely.
3. Copy these values from Supabase Settings → API into `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)
4. In Supabase Studio → SQL Editor, run these files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_full_cms.sql`
5. The migrations create the public storage buckets and access policies automatically:
   - `project-posters`
   - `project-gallery`
   - `site-media`
6. In Authentication → Users, add the administrator email and password.
7. In Authentication → Providers → Email, disable public user signups.
8. Restart the development server and sign in at `/admin/login`.

The public website uses built-in content until Supabase is connected. Once connected, published database content becomes authoritative. The homepage only loads projects where both `published` and `featured` are enabled.
