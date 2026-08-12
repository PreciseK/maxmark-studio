"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import { getMuxThumbnail } from "@/lib/mux";
import type { Project } from "@/types";
import styles from "./WorkShowcase.module.css";

type ViewMode = "grid" | "carousel" | "list";

const viewModes: ViewMode[] = ["grid", "carousel", "list"];

function ProjectMedia({ project, paused = false }: { project: Project; paused?: boolean }) {
  return (
    <div className={styles.projectMedia}>
      <Image
        src={getMuxThumbnail(project.muxPlaybackId, { time: 0, width: 960 })}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 900px) 90vw, 42vw"
        className={styles.projectPoster}
      />
      <MuxLoopPlayer
        playbackId={project.muxPlaybackId}
        title={project.title}
        paused={paused}
        className={styles.projectVideo}
      />
      <span className={styles.mediaShade} aria-hidden="true" />
    </div>
  );
}

function ProjectCaption({ project }: { project: Project }) {
  return (
    <div className={styles.projectCaption}>
      <span className={styles.projectClient}>{project.client ?? "Maxmark Original"}</span>
      <h2 className={styles.projectTitle}>{project.title}</h2>
    </div>
  );
}

function ProjectCard({ project, order }: { project: Project; order: number }) {
  return (
    <Link href={`/work/${project.slug}`} className={styles.projectCard} style={{ order }}>
      <ProjectMedia project={project} />
      <ProjectCaption project={project} />
    </Link>
  );
}

function GridView({ projects }: { projects: Project[] }) {
  const columns = [0, 1, 2].map((column) =>
    projects
      .map((project, projectIndex) => ({ project, projectIndex }))
      .filter(({ projectIndex }) => projectIndex % 3 === column),
  );

  return (
    <div className={styles.projectGrid}>
      {columns.map((columnProjects, columnIndex) => (
        <div className={styles.gridColumn} key={columnIndex}>
          {columnProjects.map(({ project, projectIndex }) => (
            <ProjectCard project={project} order={projectIndex} key={project.slug} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CarouselView({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const previousIndex = (activeIndex - 1 + projects.length) % projects.length;
  const nextIndex = (activeIndex + 1) % projects.length;
  const activeProject = projects[activeIndex];

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <div
      className={styles.carousel}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      tabIndex={0}
      aria-label="Project carousel. Use the arrow keys to move between projects."
    >
      <div className={styles.carouselStage}>
        <button
          className={`${styles.carouselSide} ${styles.carouselPrevious}`}
          type="button"
          onClick={() => move(-1)}
          aria-label={`Show ${projects[previousIndex].title}`}
        >
          <ProjectMedia project={projects[previousIndex]} paused />
        </button>

        <Link href={`/work/${activeProject.slug}`} className={styles.carouselActive}>
          <ProjectMedia project={activeProject} />
        </Link>

        <button
          className={`${styles.carouselSide} ${styles.carouselNext}`}
          type="button"
          onClick={() => move(1)}
          aria-label={`Show ${projects[nextIndex].title}`}
        >
          <ProjectMedia project={projects[nextIndex]} paused />
        </button>
      </div>

      <div className={styles.carouselCaption} aria-live="polite">
        <span className={styles.projectClient}>{activeProject.client ?? "Maxmark Original"}</span>
        <h2 className={styles.carouselTitle}>{activeProject.title}</h2>
        <Link href={`/work/${activeProject.slug}`} className={styles.viewProjectLink}>
          View project <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className={styles.carouselControls}>
        <button type="button" onClick={() => move(-1)} aria-label="Previous project">
          ←
        </button>
        <div className={styles.carouselDots} aria-hidden="true">
          {projects.map((project, index) => (
            <span
              className={index === activeIndex ? styles.activeDot : undefined}
              key={project.slug}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next project">
          →
        </button>
      </div>
    </div>
  );
}

function ListView({ projects }: { projects: Project[] }) {
  return (
    <div className={styles.projectList}>
      {projects.map((project, index) => (
        <Link href={`/work/${project.slug}`} className={styles.listRow} key={project.slug}>
          <span className={styles.listIndex}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.listTitle}>{project.title}</span>
          <span className={styles.listClient}>{project.client ?? "Maxmark Original"}</span>
          <span className={styles.listMeta}>
            {project.category} · {project.year}
          </span>
          <span className={styles.listArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function WorkShowcase({ projects }: { projects: Project[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <section className={styles.showcase} aria-label="Selected work">
      <div className={styles.viewSwitch} aria-label="Choose project view">
        {viewModes.map((mode) => (
          <button
            type="button"
            className={viewMode === mode ? styles.activeView : undefined}
            aria-pressed={viewMode === mode}
            onClick={() => setViewMode(mode)}
            key={mode}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className={styles.viewContent} key={viewMode}>
        {viewMode === "grid" && <GridView projects={projects} />}
        {viewMode === "carousel" && <CarouselView projects={projects} />}
        {viewMode === "list" && <ListView projects={projects} />}
      </div>
    </section>
  );
}
