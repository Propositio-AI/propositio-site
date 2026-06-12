import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PillLink from "@/components/parts/PillLink";
import { getBlogPost, getBlogPosts } from "@/lib/microcms";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: post.top_image ? { images: [{ url: post.top_image.url }] } : undefined,
  };
}

const BlogPostPage = async ({ params }: Props) => {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();

  return (
    <main className="w-full">
      <article className="mx-auto max-w-3xl px-5 pb-24 pt-14 md:px-0 md:pt-20">
        <header className="animate-k-rise">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-blue-600"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-snug tracking-tight text-slate-900 text-balance md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 font-heading text-sm text-slate-400">
            {post.publishedAt.slice(0, 10).replaceAll("-", ".")}
          </p>
        </header>
        {post.top_image && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-placeholder">
            <Image
              src={post.top_image.url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
        <div
          className="blog-content mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <footer className="mt-14 border-t border-slate-200 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/blog"
              className="font-heading text-sm font-bold text-blue-600 no-underline hover:text-blue-700"
            >
              ← Blog一覧に戻る
            </Link>
            <PillLink href="/contact" size="md">
              資料を請求する →
            </PillLink>
          </div>
        </footer>
      </article>
    </main>
  );
};

export default BlogPostPage;
