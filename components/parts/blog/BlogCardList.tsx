'use client';
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { Blog } from "@/lib/types";

const BlogCardList = () => {
  const [instaBlogs, setInstaBlogs] = useState<Blog[]>([]);
  const [normalBlogs, setNormalBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const insta_res = await client.get({ endpoint: "instagram"});
        setInstaBlogs(insta_res.contents);
        const normal_res = await client.get({ endpoint: "blog"});
        setNormalBlogs(normal_res.contents);
      }
      catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchAllBlogs();
  }, []);


  return (
    <div className="flex w-full flex-col gap-8">
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Instagram</h3>
          <span className="text-sm text-muted-foreground">投稿の最新カード</span>
        </div>
        <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-2">
          {instaBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              description={blog.description}
              publishedAt={blog.publishedAt}
              tags={blog.tags}
              top_image={blog.top_image}
              instagram_url={blog.instagram_url}
              variant="instagram"
            />
          ))}
          {instaBlogs.length === 0 && (
            <p className="text-sm text-muted-foreground">Instagram投稿はまだありません。</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Blog</h3>
          <span className="text-sm text-muted-foreground">通常のブログ記事</span>
        </div>
        <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-2">
          {normalBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              description={blog.description}
              publishedAt={blog.publishedAt}
              tags={blog.tags}
              top_image={blog.top_image}
              instagram_url={blog.instagram_url}
              variant="blog"
            />
          ))}
          {normalBlogs.length === 0 && (
            <p className="text-sm text-muted-foreground">通常ブログはまだありません。</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default BlogCardList
