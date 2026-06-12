import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { Blog } from "@/lib/types";

/** Instagram投稿のカード。ArticleCardとデザインを揃えている */
const BlogCard = ({
  title,
  description,
  publishedAt,
  tags,
  top_image,
  instagram_url,
}: Blog) => {
  return (
    <a
      href={instagram_url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover-lift block overflow-hidden rounded-[22px] border border-slate-100 bg-white no-underline"
    >
      <div className="relative aspect-video overflow-hidden bg-placeholder">
        <Image
          src={top_image.url}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-7">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600"
            >
              {tag.tag_name}
            </span>
          ))}
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-relaxed text-slate-900 text-balance">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-heading text-[13px] text-slate-400">
            {publishedAt.slice(0, 10).replaceAll("-", ".")}
          </p>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <FaInstagram className="size-4" />
            Instagram
          </span>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
