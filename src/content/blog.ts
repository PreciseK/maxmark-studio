import { projects } from "@/content/projects";

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  project: (typeof projects)[number];
  heroTime: number;
  body: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-an-ai-native-production-practice-in-africa",
    title: "Building an AI-native production practice in Africa",
    category: "Perspective",
    date: "August 06, 2026",
    excerpt:
      "A field note on combining new tools with the judgement, collaboration, and production craft the work still demands.",
    project: projects[0],
    heroTime: 1,
    body: [
      { type: "paragraph", text: "The interesting question is no longer whether artificial intelligence belongs in production. It is what kind of production culture we build around it, and whose point of view that culture carries." },
      { type: "paragraph", text: "For us, AI-native does not mean replacing the difficult parts of making things. It means creating a more responsive system around those parts: faster exploration, clearer pre-visualisation, and more room to protect the strongest idea." },
      { type: "heading", text: "Speed needs taste" },
      { type: "paragraph", text: "A tool can create options quickly. It cannot decide which option belongs in the world of the project. That judgement still comes from directors, artists, producers, performers, editors, and clients working with a shared intention." },
      { type: "quote", text: "The advantage is not making more images. It is finding the right image sooner, then giving it the craft it deserves." },
      { type: "paragraph", text: "Africa is not one market or one visual language. The work has to begin with attention: to context, to people, to sound, to place, and to the details that separate something specific from something merely fashionable." },
    ],
  },
  {
    slug: "inside-the-studio-from-rehearsal-to-final-take",
    title: "Inside the studio: from rehearsal to final take",
    category: "Studio Notes",
    date: "July 24, 2026",
    excerpt: "What a focused physical room changes for artists, producers, and teams preparing to perform.",
    project: projects[1],
    heroTime: 1,
    body: [
      { type: "paragraph", text: "A good studio is less about square footage than concentration. It gives people a place where the technical questions are already answered and the creative ones can receive full attention." },
      { type: "paragraph", text: "Rehearsals, podcast recordings, vocal sessions, and small-format shoots ask for different setups, but they all benefit from the same thing: a room that can change quickly without feeling temporary." },
      { type: "heading", text: "The room is part of the performance" },
      { type: "paragraph", text: "Lighting, acoustic treatment, sightlines, and simple hospitality shape what happens in front of a microphone or camera. When those details are calm, performers can be present." },
      { type: "quote", text: "The best technical setup is the one that disappears as soon as the take begins." },
      { type: "paragraph", text: "Our studio is designed for that transition: arrive with an idea, find the right configuration, and leave with something clear enough to move into the next stage." },
    ],
  },
  {
    slug: "the-new-language-of-music-visuals",
    title: "The new language of music visuals",
    category: "Culture",
    date: "July 10, 2026",
    excerpt: "Why the most interesting visual work around music is becoming faster, stranger, and more deeply authored.",
    project: projects[2],
    heroTime: 1,
    body: [
      { type: "paragraph", text: "Music images no longer live in a single frame or format. A release now moves through films, loops, portraits, live moments, covers, fragments, and fan-made responses, often all at once." },
      { type: "paragraph", text: "That expansion rewards a strong central idea. When the visual world is clear, every output can feel related without becoming a smaller copy of the hero film." },
      { type: "heading", text: "Build a world, not a rollout" },
      { type: "paragraph", text: "The most memorable music campaigns give the audience visual rules they can recognise: a palette, a gesture, a lens, a symbol, or a particular way of moving through space." },
      { type: "quote", text: "Consistency is not repetition. It is the feeling that every image came from the same imagination." },
      { type: "paragraph", text: "New tools make that world easier to expand. The creative task is making sure it still feels like the artist, not the tool." },
    ],
  },
  {
    slug: "why-fast-doesnt-have-to-look-cheap",
    title: "Why fast doesn’t have to look cheap",
    category: "Production",
    date: "June 19, 2026",
    excerpt: "Speed becomes useful when the production system protects the idea instead of compressing it.",
    project: projects[3],
    heroTime: 1,
    body: [
      { type: "paragraph", text: "Fast work looks cheap when speed removes the decisions that make an image feel intentional. The answer is not simply more time. It is deciding earlier what the work needs to do." },
      { type: "paragraph", text: "A focused reference, a clear hierarchy, and an honest production plan can remove days of indecision while protecting the details audiences actually notice." },
      { type: "heading", text: "Design the decision-making" },
      { type: "paragraph", text: "We build projects around approval moments, not around a long chain of software steps. That keeps feedback attached to meaning: performance, tone, rhythm, and story." },
      { type: "quote", text: "Efficiency should create space for judgement, not remove judgement from the process." },
      { type: "paragraph", text: "The result is not a shortcut aesthetic. It is a production rhythm that spends time where the audience can feel it." },
    ],
  },
  {
    slug: "five-notes-from-a-hybrid-production",
    title: "Five notes from a hybrid production",
    category: "Process",
    date: "June 03, 2026",
    excerpt: "Lessons from moving between live action, generated imagery, editorial, and finishing without losing continuity.",
    project: projects[4],
    heroTime: 1,
    body: [
      { type: "paragraph", text: "Hybrid production works when every technique serves the same visual intention. Without that, live action and generated imagery can feel like neighbouring projects rather than one film." },
      { type: "heading", text: "Continuity is a creative decision" },
      { type: "paragraph", text: "We define the constants first: camera behaviour, contrast, texture, performance energy, and the role each image plays in the edit. Those rules travel across tools." },
      { type: "paragraph", text: "Tests belong early. A rough composite can reveal more about the final language than a polished frame created before the edit has a pulse." },
      { type: "quote", text: "The seam disappears when every department is solving the same story problem." },
      { type: "paragraph", text: "Finishing is where the techniques finally become one image, but the continuity has to begin long before colour and sound." },
    ],
  },
  {
    slug: "what-were-watching-in-african-visual-culture",
    title: "What we’re watching in African visual culture",
    category: "Field Notes",
    date: "May 15, 2026",
    excerpt: "A recurring index of images, artists, releases, and ideas moving the continent’s visual language forward.",
    project: projects[5],
    heroTime: 1,
    body: [
      { type: "paragraph", text: "The continent’s visual culture is moving through music, fashion, film, design, photography, games, and everyday internet language at the same time. Watching well means following the connections between them." },
      { type: "paragraph", text: "We are interested in work that feels locally legible and globally surprising: images that know exactly where they are from without turning culture into decoration." },
      { type: "heading", text: "A living reference library" },
      { type: "paragraph", text: "Our studio index is intentionally unfinished. It collects new releases beside older films, vernacular graphics beside formal design, and independent experiments beside large campaigns." },
      { type: "quote", text: "A reference is most useful when it opens a direction instead of prescribing an answer." },
      { type: "paragraph", text: "This series will share some of those signals and the questions they raise for the work we want to make next." },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
