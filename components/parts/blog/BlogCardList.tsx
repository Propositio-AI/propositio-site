'use client';
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import { getClient } from "@/lib/client";
import { Blog } from "@/lib/types";

const BlogCardList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const client = getClient();
        const res = await client.get({ endpoint: "instagram"});
        setBlogs(res.contents);
    }
      catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchAllBlogs();
  }, []);


  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {
        blogs.map((blog) => (
          <BlogCard key={blog.id} id = {blog.id} title={blog.title} description={blog.description} publishedAt={blog.publishedAt} tags={blog.tags} top_image={blog.top_image} instagram_url={blog.instagram_url} />
        ))
      }
    </div>
  )
}

export default BlogCardList
