import {
  Card,
  CardContent
} from "@/components/ui/card"
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FaInstagram } from "react-icons/fa";
import { Blog } from "@/lib/types";


type BlogCardProps = Blog & {
  variant?: "instagram" | "blog";
};

const BlogCard = ({
  id,
  title,
  description,
  publishedAt,
  tags,
  top_image,
  instagram_url,
  variant = "instagram",
}: BlogCardProps) => {
  const isInstagram = variant === "instagram";
  const href = isInstagram && instagram_url ? instagram_url : `/blogs/${id}`;

  return (
    <Card className="group w-72 shrink-0 overflow-hidden transition-all duration-300 hover:shadow-lg md:w-full md:max-w-sm">
      {isInstagram ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={top_image.url}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="text-xs font-medium bg-blue-500 text-white"
            >
              {tag.tag_name}
            </Badge>
          ))}
        </div>
        <h3 className="mb-2 line-clamp-2 min-h-12 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 min-h-12 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">公開日: {publishedAt.slice(0, 10)}</time>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FaInstagram className="h-4 w-4" />
            <span>Instagram</span>
          </div>
        </div>
      </CardContent>
        </a>
      ) : (
        <Link href={href} className="block">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={top_image.url}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs font-medium bg-blue-500 text-white"
                >
                  {tag.tag_name}
                </Badge>
              ))}
            </div>
            <h3 className="mb-2 line-clamp-2 min-h-12 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="mb-4 line-clamp-2 min-h-12 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-muted-foreground">公開日: {publishedAt.slice(0, 10)}</time>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>記事を読む</span>
              </div>
            </div>
          </CardContent>
        </Link>
      )}
    </Card>
  )
}

export default BlogCard
