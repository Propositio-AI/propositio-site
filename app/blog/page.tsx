import type { Metadata } from "next";
import SectionHeading from "@/components/parts/SectionHeading";
import BlogCardList from "@/components/parts/blog/BlogCardList";

export const metadata: Metadata = {
  title: "Blog",
  description: "キャリア教育・進路指導・AI活用——先生方の現場に役立つ視点をKarynosチームが発信します。",
};

const BlogPage = () => {
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
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10 md:pb-32">
        <BlogCardList />
      </section>
    </main>
  );
};

export default BlogPage;
