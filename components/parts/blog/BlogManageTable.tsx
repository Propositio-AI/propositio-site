import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Blog } from "@/lib/types"
import { FaTrashAlt } from "react-icons/fa";
import { deleteBlog } from "@/app/actions/blog"

type BlogsProps = {
  blogs: Blog[];
  onDeleted?: () => Promise<void> | void;
}

const BlogManageTable = ({ blogs, onDeleted }: BlogsProps) => {

  const handleDelete = async (id:string) => {
    const confirmed = confirm("本当にこのブログを削除しますか？");
    if (!confirmed) {
      return;
    }

    try {
      await deleteBlog(id);
      await onDeleted?.();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  }

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("ja-JP")
  }

  const wrapCellClass = "whitespace-normal break-words align-top"

  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-28 whitespace-normal">公開日</TableHead>
          <TableHead className="w-40 whitespace-normal">タイトル</TableHead>
          <TableHead className="w-72 whitespace-normal">内容</TableHead>
          <TableHead className="w-48 whitespace-normal">サムネイル</TableHead>
          <TableHead className="w-48 whitespace-normal">リンク</TableHead>
          <TableHead className="w-36 whitespace-normal">タグ</TableHead>
          <TableHead className="w-20 whitespace-normal">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id}>
            <TableCell className={`font-medium ${wrapCellClass}`}>{formatDate(blog.published_at)}</TableCell>
            <TableCell className={wrapCellClass}>{blog.title}</TableCell>
            <TableCell className={wrapCellClass}>{blog.description}</TableCell>
            <TableCell className="whitespace-normal break-all align-top">{blog.thumbnail_url}</TableCell>
            <TableCell className="whitespace-normal break-all align-top">{blog.instagram_url}</TableCell>
            <TableCell className={wrapCellClass}>{blog.tags.join(", ")}</TableCell>
            <TableCell className="whitespace-normal break-all align-top">
              <Button variant="destructive" className="w-7 h-7 rounded-xs" onClick={() => handleDelete(blog.id)} >
                <FaTrashAlt className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default BlogManageTable
