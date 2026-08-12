export type ReelVariant = "studio" | "project";

export type ReelSectionData = {
  id: string;
  muxPlaybackId: string;
  variant: ReelVariant;
  eyebrow: string;
  title: string;
  strapline?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export const reelSections: ReelSectionData[] = [
  {
    id: "studio-hero",
    muxPlaybackId: "VCBESmjDlV4eRLTFzQ2j75KtN1XrKyV9sdwaAQXNv38",
    variant: "studio",
    eyebrow: "MAXMARK STUDIO — EST. 2024",
    title: "An AI-Native\nProduction Studio",
    strapline:
      "Maxmark Studio creates brand films, narratives, and music visuals with cinematic craft — at African market speed.",
    primaryCta: { label: "Watch Showreel", href: "#reel-section-ritual-of-motion" },
  },
  {
    id: "ritual-of-motion",
    muxPlaybackId: "VCBESmjDlV4eRLTFzQ2j75KtN1XrKyV9sdwaAQXNv38",
    variant: "project",
    eyebrow: "Maxmark Studio Originals",
    title: "Ritual of Motion",
    primaryCta: { label: "Watch Project", href: "/work/ritual-of-motion" },
    secondaryCta: { label: "See All Brand Work", href: "/work?category=brand" },
  },
  {
    id: "the-last-frontier",
    muxPlaybackId: "CkqEBNBjOnsS5xdeHV9VakK2k8j1j500FATUoIAWnnv4",
    variant: "project",
    eyebrow: "Maxmark Studio Originals",
    title: "The Last Frontier",
    primaryCta: { label: "Watch Project", href: "/work/the-last-frontier" },
    secondaryCta: { label: "See All Narrative Work", href: "/work?category=narrative" },
  },
  {
    id: "frequency",
    muxPlaybackId: "zFaTv2EtIEW3dzkNTxBzHvcCJPEG009AR61Ng8h2RPGI",
    variant: "project",
    eyebrow: "Burna Boy",
    title: "Frequency",
    primaryCta: { label: "Watch Project", href: "/work/frequency" },
    secondaryCta: { label: "See All Music Work", href: "/work?category=music" },
  },
  {
    id: "heritage-drop",
    muxPlaybackId: "00uZ5D3R3y7XM7J67GBZQCBe89j02E1uL01HZ8MW2ocBUc",
    variant: "project",
    eyebrow: "Johnnie Walker",
    title: "Heritage Drop",
    primaryCta: { label: "Watch Project", href: "/work/heritage-drop" },
    secondaryCta: { label: "See All Brand Work", href: "/work?category=brand" },
  },
  {
    id: "isoka",
    muxPlaybackId: "KN702xowBcoN1Qq7NKudjBv1l02HMkW2QMkHAlmY7jsak",
    variant: "project",
    eyebrow: "Maxmark Studio Originals",
    title: "Isoka",
    primaryCta: { label: "Watch Project", href: "/work/isoka" },
    secondaryCta: { label: "See All Narrative Work", href: "/work?category=narrative" },
  },
  {
    id: "golden-hour",
    muxPlaybackId: "q3ld4vu00a9IeOlIQFuj6jltcdbS1MM102yz2Of1n601t4",
    variant: "project",
    eyebrow: "Ayra Starr",
    title: "Golden Hour",
    primaryCta: { label: "Watch Project", href: "/work/golden-hour" },
    secondaryCta: { label: "See All Music Work", href: "/work?category=music" },
  },
];
