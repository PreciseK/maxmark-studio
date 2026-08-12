import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";
import { getSitePage, getTeamMembers } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — Maxmark Studio",
  description:
    "Maxmark Studio is an AI-native production studio creating films, brand worlds, music visuals, and original stories from Africa.",
};

const leadership = [
  {
    name: "Name Placeholder",
    role: "Founder / Creative Director",
    image: "/about/creative-director.png",
    alt: "Placeholder portrait of a Black African male creative director",
  },
  {
    name: "Name Placeholder",
    role: "Executive Producer",
    image: "/about/executive-producer.png",
    alt: "Placeholder portrait of a Black African female executive producer",
  },
  {
    name: "Name Placeholder",
    role: "Creative Technologist",
    image: "/about/creative-technologist.png",
    alt: "Placeholder portrait of a Black African male creative technologist",
  },
  {
    name: "Name Placeholder",
    role: "Head of Production",
    image: "/about/head-of-production.png",
    alt: "Placeholder portrait of a Black African female production leader",
  },
];

export default async function AboutPage() {
  const [pageContent, cmsTeam] = await Promise.all([
    getSitePage("about", {
      heroStatement: "Maxmark is a production studio creating films, brand worlds, and music visuals with cinematic craft at African market speed.",
      beliefTitle: "The story comes first. Technology helps it travel further.",
      beliefHtml: "<p>Maxmark Studio brings filmmakers, designers, producers, and technologists into one connected production practice. We combine live action, AI-native workflows, and post-production around the needs of each idea.</p><p>Our perspective is rooted in Africa and built for a global screen. The goal is memorable work with a clear point of view.</p>",
      joinImageUrl: "/about/head-of-production.png",
    }),
    getTeamMembers(),
  ]);
  const people = cmsTeam.length ? cmsTeam.map((member) => ({ name: member.name, role: member.role, image: member.image_url || "/about/creative-director.png", alt: `${member.name}, ${member.role}`, bioHtml: member.bio_html })) : leadership.map((person) => ({ ...person, bioHtml: "<p>Profile, experience, and selected credits coming soon.</p>" }));
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Independent · African · AI-native</p>
        <h1>About</h1>
        <p className={styles.heroStatement}>
          {pageContent.heroStatement}
        </p>
        <div className={styles.heroIndex}>
          <span>Est. in Africa</span>
          <span>Built for what’s next</span>
        </div>
      </header>

      <section className={styles.intro}>
        <div className={styles.introHeading}>
          <p className={styles.eyebrow}>What we believe</p>
          <h2>{pageContent.beliefTitle}</h2>
        </div>
        <div className={styles.introCopy} dangerouslySetInnerHTML={{ __html: pageContent.beliefHtml }} />
      </section>

      <section className={styles.principles}>
        <article>
          <span>01</span>
          <h3>We build worlds.</h3>
          <p>
            From one film to an entire visual language, we develop ideas that can move across
            campaigns, music, entertainment, and culture.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>We stay end-to-end.</h3>
          <p>
            Strategy, development, production, AI workflows, post, and delivery stay connected so
            the original idea survives the process.
          </p>
        </article>
      </section>

      <section className={styles.leadership}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Leadership</p>
          <h2>The people shaping the studio.</h2>
          <p>Portraits and profiles are placeholders until the Maxmark team roster is supplied.</p>
        </div>

        <div className={styles.peopleGrid}>
          {people.map((person, index) => (
            <article className={styles.person} key={`${person.role}-${index}`}>
              <div className={styles.personMedia}>
                <Image
                  src={person.image}
                  alt={person.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  className={styles.personImage}
                />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <div className={styles.placeholderBio} dangerouslySetInnerHTML={{ __html: person.bioHtml }} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.joinSection}>
        <div className={styles.joinPortrait}>
          <Image
            src={pageContent.joinImageUrl}
            alt="Placeholder portrait of a Black African production leader in a creative studio"
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
            className={styles.joinImage}
          />
        </div>
        <div className={styles.joinCopy}>
          <p className={styles.eyebrow}>Work with us</p>
          <h2>Good work needs more points of view.</h2>
          <p>
            We are always interested in meeting directors, producers, artists, designers, and
            technologists who care deeply about craft and where production is going next.
          </p>
          <Link href="mailto:info@maxmarkstudio.com?subject=Working%20with%20Maxmark%20Studio">
            Introduce yourself <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <Link href="/blog" className={styles.aboutCta}>
        <span>Ideas, process, and studio notes</span>
        <strong>Read the blog</strong>
        <i aria-hidden="true">↗</i>
      </Link>
    </div>
  );
}
