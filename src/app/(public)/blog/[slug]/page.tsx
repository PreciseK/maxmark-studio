import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/blog";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/content";
import { getMuxThumbnail } from "@/lib/mux";
import styles from "./article.module.css";

interface PageProps { params: Promise<{ slug: string }>; }

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Maxmark Studio`, description: post.excerpt };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const publishedPosts = await getPublishedBlogPosts();
  const postIndex = publishedPosts.findIndex((item) => item.slug === slug);
  if (postIndex === -1) notFound();

  const post = publishedPosts[postIndex];
  const nextPost = publishedPosts[(postIndex + 1) % publishedPosts.length];

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className={styles.meta}><span>{post.category}</span><span>{post.date}</span></div>
        <h1>{post.title}</h1>
        <p className={styles.dek}>{post.excerpt}</p>
      </header>

      <figure className={styles.heroMedia}>
        <Image src={post.imageUrl ?? getMuxThumbnail(post.project.muxPlaybackId, { time: post.heroTime, width: 1800 })} alt={`Hero image for ${post.title}`} fill unoptimized priority sizes="100vw" />
        <figcaption>{post.project.title} · Maxmark Studio archive</figcaption>
      </figure>

      <div className={styles.articleGrid}>
        <aside><span>Filed under</span><strong>{post.category}</strong><Link href="/blog">← Back to Blog</Link></aside>
        <div className={styles.body}>
          {post.contentHtml ? <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} /> : post.body.map((block, index) => {
            if (block.type === "heading") return <h2 key={index}>{block.text}</h2>;
            if (block.type === "quote") return <blockquote key={index}>{block.text}</blockquote>;
            return <p key={index}>{block.text}</p>;
          })}
        </div>
      </div>

      <section className={styles.relatedProject}>
        <p>Related work</p>
        <Link href={`/work/${post.project.slug}`}>
          <span>{post.project.client ?? "Maxmark Original"}</span><strong>{post.project.title}</strong><span aria-hidden="true">↗</span>
        </Link>
      </section>

      <Link href={`/blog/${nextPost.slug}`} className={styles.nextPost}>
        <span>Next story</span><strong>{nextPost.title}</strong><i aria-hidden="true">→</i>
      </Link>
    </article>
  );
}
