import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import { projects } from "@/content/projects";
import { getProjectPageDetail, getPublishedProject, getPublishedProjects } from "@/lib/content";
import { getMuxThumbnail } from "@/lib/mux";
import styles from "./project.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);

  if (!project) return {};

  return {
    title: `${project.title} — Maxmark Studio`,
    description: (await getProjectPageDetail(project.slug)).summary,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const publishedProjects = await getPublishedProjects();
  const projectIndex = publishedProjects.findIndex((item) => item.slug === slug);
  if (projectIndex === -1) notFound();

  const project = publishedProjects[projectIndex];
  const detail = await getProjectPageDetail(project.slug);
  const nextProject = publishedProjects[(projectIndex + 1) % publishedProjects.length];

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <MuxLoopPlayer
          playbackId={project.muxPlaybackId}
          title={`${project.title} — ${project.client ?? "Maxmark Original"}`}
          className={styles.heroVideo}
        />
        <span className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroTopline}>
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <div className={styles.heroCopy}>
          <p>{project.client ?? "Maxmark Original"}</p>
          <h1>{project.title}</h1>
          <span className={styles.scrollCue}>Scroll to explore ↓</span>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.sectionLabel}>The project</p>
        <p className={styles.summary}>{detail.summary}</p>
        <div className={styles.projectFacts}>
          <div>
            <span>Client</span>
            <strong>{project.client ?? "Maxmark Originals"}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>{project.category}</strong>
          </div>
          <div>
            <span>Year</span>
            <strong>{project.year}</strong>
          </div>
          <div>
            <span>Services</span>
            <strong>{detail.services.join(" · ")}</strong>
          </div>
        </div>
      </section>

      <section className={styles.gallery} aria-label={`${project.title} project stills`}>
        {(detail.galleryUrls.length ? detail.galleryUrls : detail.galleryTimes).map((media, index) => (
          <figure
            className={`${styles.galleryItem} ${index === 1 || index === 3 ? styles.portraitItem : ""}`}
            key={String(media)}
          >
            <Image
              src={typeof media === "string" ? media : getMuxThumbnail(project.muxPlaybackId, { time: media, width: 1600 })}
              alt={`${project.title} project still ${index + 1}`}
              fill
              unoptimized
              sizes={index === 1 || index === 3 ? "(max-width: 800px) 100vw, 58vw" : "100vw"}
              className={styles.galleryImage}
            />
          </figure>
        ))}
      </section>

      <section className={styles.story}>
        <div>
          <p className={styles.sectionLabel}>The challenge</p>
          <p>{detail.challenge}</p>
        </div>
        <div>
          <p className={styles.sectionLabel}>Our approach</p>
          <p>{detail.approach}</p>
        </div>
      </section>

      <Link href={`/work/${nextProject.slug}`} className={styles.nextProject}>
        <Image
          src={getMuxThumbnail(nextProject.muxPlaybackId, { time: 1, width: 1600 })}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className={styles.nextImage}
        />
        <span className={styles.nextShade} aria-hidden="true" />
        <span className={styles.nextLabel}>Next project</span>
        <strong>{nextProject.title}</strong>
        <span className={styles.nextArrow} aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
