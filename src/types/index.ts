export type ProjectCategory = "Brand" | "Narrative" | "Music";
export type GridSize = "large" | "medium" | "small";
export type AspectRatio = "4:3" | "16:9" | "1:1";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  client?: string;
  year: number;
  eyebrow?: string;
  muxPlaybackId: string;
  youtubeId?: string;
  aspectRatio: AspectRatio;
  gridSize: GridSize;
  featured: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
};

export type JournalEntry = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
};

export type ContactEmail = {
  label: string;
  email: string;
  description: string;
};

export type Social = {
  name: string;
  url: string;
  icon: "instagram" | "x" | "linkedin" | "youtube" | "vimeo";
};

export type StudioContent = {
  manifesto: string;
  contactEmails: ContactEmail[];
  socials: Social[];
};
