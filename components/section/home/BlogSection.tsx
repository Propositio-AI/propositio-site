import Link from "next/link";
import BlogCardList from "@/components/parts/blog/BlogCardList"; 

const BlogSection = () => {
  return (
    <div id="blog" className="py-16 px-6 md:px-15 bg-gray-50">
      <div className="container mx-auto space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-2">Blog</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Propositio AIの最新の記事や更新情報を掲載しています。
            </p>
          </div>
          <Link href="/blogs" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            ブログ一覧を見る
          </Link>
        </div>
        <BlogCardList />
      </div>
    </div>
  )
}

export default BlogSection
