-- Migration: 004_refine_animation_bookings.sql
-- Refine booking services from physical recording studio to animation & film production

-- Deactivate old studio rooms
UPDATE public.booking_services
SET active = false
WHERE name IN ('Recording', 'Rehearsal', 'Podcast');

-- Insert or update new animation video services
INSERT INTO public.booking_services (name, duration_minutes, description, active, display_order)
VALUES
  (
    'Animated Short Film / Narrative',
    60,
    'Original narrative animated films, festival shorts, and script-to-screen AI animation production.',
    true,
    1
  ),
  (
    '3D & AI Commercial Spot',
    45,
    'High-impact visual campaigns, broadcast commercial spots, and 3D product animation.',
    true,
    2
  ),
  (
    'Animated Music Video',
    60,
    'Full-length animated music videos, cinematic visualizers, and visual universe worldbuilding.',
    true,
    3
  ),
  (
    'Directorial Consultation & Pipeline',
    30,
    'Creative treatment review, visual lore bibles, and custom diffusion pipeline architecture.',
    true,
    4
  )
ON CONFLICT (name) DO UPDATE SET
  duration_minutes = EXCLUDED.duration_minutes,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  display_order = EXCLUDED.display_order;
