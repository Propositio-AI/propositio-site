'use client';
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import { getAllBlogs } from "@/app/actions/blog";
import { Blog } from "@/lib/types";

const BlogCardList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const newblogs = await getAllBlogs();
        setBlogs(newblogs);
      }
      catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchAllBlogs();
  }, []);


  return (
    <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-2">
      {
        blogs.map((blog) => (
          <BlogCard key={blog.id} title={blog.title} description={blog.description} date={blog.published_at} tags={blog.tags} thumbnailUrl={blog.thumbnail_url} instagramUrl={blog.instagram_url} />
        ))
      }
    </div>
  )
}

export default BlogCardList
