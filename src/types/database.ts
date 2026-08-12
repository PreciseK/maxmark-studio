export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type ProjectCategory = "brand" | "narrative" | "music";
export type AspectRatio = "4:3" | "16:9" | "1:1" | "21:9";
export type GridSize = "large" | "medium" | "small";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  category: ProjectCategory;
  client: string | null;
  year: number | null;
  summary: string | null;
  body_json: Json | null;
  mux_playback_id: string | null;
  youtube_id: string | null;
  poster_url: string | null;
  aspect_ratio: AspectRatio;
  grid_size: GridSize;
  featured: boolean;
  display_order: number;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  challenge: string | null;
  approach: string | null;
  services: string[] | null;
  gallery_urls: string[] | null;
};

export type ProjectInsert = {
  id?: string;
  slug: string;
  title: string;
  eyebrow?: string | null;
  category: ProjectCategory;
  client?: string | null;
  year?: number | null;
  summary?: string | null;
  body_json?: Json | null;
  mux_playback_id?: string | null;
  youtube_id?: string | null;
  poster_url?: string | null;
  aspect_ratio?: AspectRatio;
  grid_size?: GridSize;
  featured?: boolean;
  display_order?: number;
  published?: boolean;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  challenge?: string | null;
  approach?: string | null;
  services?: string[] | null;
  gallery_urls?: string[] | null;
};

export type ProjectUpdate = Partial<ProjectInsert>;

export type BlogPostRow = {
  id: string; slug: string; title: string; category: string; excerpt: string | null;
  content_html: string; hero_image_url: string | null; mux_playback_id: string | null;
  published: boolean; featured: boolean; published_at: string | null; created_at: string;
  updated_at: string; deleted_at: string | null;
};
export type SitePageRow = { id: string; page_key: string; title: string; content_json: Json; updated_at: string };
export type TeamMemberRow = { id: string; name: string; role: string; bio_html: string; image_url: string | null; display_order: number; published: boolean; created_at: string; updated_at: string; deleted_at: string | null };
export type SubscriberRow = { id: string; email: string; status: "active" | "unsubscribed"; source: string; subscribed_at: string; unsubscribed_at: string | null };
export type ContactSubmissionRow = { id: string; name: string; email: string; company: string | null; inquiry_type: string; message: string; status: "new" | "in_progress" | "closed" | "spam"; notes: string | null; created_at: string; updated_at: string };
export type BookingServiceRow = { id: string; name: string; duration_minutes: number; description: string | null; active: boolean; display_order: number };
export type BookingRow = { id: string; service_id: string | null; service_name: string; booking_date: string; start_time: string; duration_minutes: number; name: string; email: string; phone: string | null; company: string | null; notes: string | null; status: "pending" | "confirmed" | "completed" | "cancelled"; admin_notes: string | null; created_at: string; updated_at: string };

type TableDef<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      blog_posts: TableDef<BlogPostRow>;
      site_pages: TableDef<SitePageRow>;
      team_members: TableDef<TeamMemberRow>;
      subscribers: TableDef<SubscriberRow>;
      contact_submissions: TableDef<ContactSubmissionRow>;
      booking_services: TableDef<BookingServiceRow>;
      bookings: TableDef<BookingRow>;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_category: ProjectCategory;
      aspect_ratio: AspectRatio;
      grid_size: GridSize;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
