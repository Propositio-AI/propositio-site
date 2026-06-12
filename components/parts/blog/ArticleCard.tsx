import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/types";

type Props = {
  post: BlogPost;
};

/** microCMS通常ブログのカード。/blog/[id] へリンクする */
const ArticleCard = ({ post }: Props) => {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="hover-lift block overflow-hidden rounded-[22px] border border-slate-100 bg-white no-underline"
    >
      <div className="relative aspect-video overflow-hidden bg-placeholder">
        {post.top_image && (
          <Image
            src={post.top_image.url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="p-7">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600"
            >
              {tag.tag_name}
            </span>
          ))}
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-relaxed text-slate-900 text-balance">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {post.description}
        </p>
        <p className="mt-4 font-heading text-[13px] text-slate-400">
          {post.publishedAt.slice(0, 10).replaceAll("-", ".")}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
