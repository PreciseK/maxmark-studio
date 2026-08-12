import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/content";
import { getMuxThumbnail } from "@/lib/mux";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog — Maxmark Studio",
  description: "Ideas, production notes, projects, and perspectives from Maxmark Studio.",
};

export default async function BlogPage() {
  const blogPosts = await getPublishedBlogPosts();
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>The Maxmark Blog</p>
        <h1>Ideas, process, and the work behind the work.</h1>
        <p className={styles.heroCopy}>
          Projects, studio notes, and perspectives from an African production studio working
          across storytelling, technology, music, and culture.
        </p>
        <div className={styles.heroMeta}>
          <span>Studio journal</span>
          <span>Scroll for the index</span>
        </div>
      </header>

      <main className={styles.postIndex}>
        <div className={styles.indexHeader}>
          <span>Latest entries</span>
          <span>All posts · {String(blogPosts.length).padStart(2, "0")}</span>
        </div>

        <div className={styles.postsGrid}>
          {blogPosts.map((post, index) => (
            <Link
              href={`/blog/${post.slug}`}
              className={`${styles.post} ${index === 0 ? styles.featuredPost : ""}`}
              style={{ "--post-index": index } as CSSProperties}
              key={post.slug}
            >
              <div className={styles.postMedia}>
                <Image
                  src={post.imageUrl ?? getMuxThumbnail(post.project.muxPlaybackId, { time: post.heroTime, width: 1280 })}
                  alt={`Still from ${post.project.title}`}
                  fill
                  unoptimized
                  sizes={index === 0 ? "100vw" : "(max-width: 800px) 100vw, 50vw"}
                  className={styles.postImage}
                />
                <span className={styles.postNumber}>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className={styles.postBody}>
                <div className={styles.postMeta}>
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className={styles.comingSoon}>Read story ↗</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <section className={styles.blogCta}>
        <p>Have a project, idea, or conversation for the studio?</p>
        <Link href="/contact">Let’s talk <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  );
}
