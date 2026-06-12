import type { Metadata } from "next";
import SectionHeading from "@/components/parts/SectionHeading";
import ArticleCard from "@/components/parts/blog/ArticleCard";
import BlogCardList from "@/components/parts/blog/BlogCardList";
import { getBlogPosts } from "@/lib/microcms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "キャリア教育・進路指導・AI活用——先生方の現場に役立つ視点をKarynosチームが発信します。",
};

const BlogPage = async () => {
  const posts = await getBlogPosts();

  return (
    <main className="w-full">
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:px-10 md:pt-24">
        <SectionHeading
          className="animate-k-rise"
          as="h1"
          eyebrow="Blog"
          title="教育の現場と、未来の話。"
          lead="キャリア教育・進路指導・AI活用——先生方の現場に役立つ視点を、Karynosチームが発信していきます。"
        />
      </section>
      <section className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-20 md:px-10 md:pb-32">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-[32px]">
          Instagram
        </h2>
        <p className="mt-2 text-[15px] text-slate-500">Instagramでも発信しています。</p>
        <div className="mt-8">
          <BlogCardList />
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
