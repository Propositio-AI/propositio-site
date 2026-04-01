import Link from "next/link";
import BlogCardList from "@/components/parts/blog/BlogCardList"; 

const BlogSection = () => {
  return (
    <div id="blog" className=" py-16 px-6 md:px-15">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Blog</h2>
      <p className="text-base sm:text-lg text-muted-foreground mb-6">
        Propositio AIの最新の記事や更新情報を掲載しています。
      </p>
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <BlogCardList />
      </div>
    </div>
  )
}

export default BlogSection
