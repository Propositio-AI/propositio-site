'use client';

import NewBlogDialog from "@/components/parts/blog/NewBlogDialog"
import { getAllBlogs } from "@/app/actions/blog"
import { useCallback, useEffect, useState } from "react"
import { Blog } from "@/lib/types"
import BlogManageTable from "@/components/parts/blog/BlogManageTable"
import Link from "next/link";

const ManageBlogsPage = () => {
  const [Blogs, setBlogs] = useState<Blog[]>([]);

  const fetchAllBlogs = useCallback(async () => {
    try {
      const newBlogs = await getAllBlogs();
      setBlogs(newBlogs);
    }
    catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  return (
    <main className="mt-30 md:mt-40 mb-40 w-full px-6 sm:px-15">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">ブログ管理</h1>
        <div className="flex items-center gap-4">
          <NewBlogDialog onCreated={fetchAllBlogs} />
          <Link href="/admin" className="text-blue-500 hover:underline">
            DashBoardへ→
          </Link>
        </div>
      </div>
      <BlogManageTable blogs={Blogs} onRefreshed={fetchAllBlogs} />
    </main>
  )
}

export default ManageBlogsPage
