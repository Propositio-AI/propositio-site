import {
  Card,
  CardContent
} from "@/components/ui/card"
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FaInstagram } from "react-icons/fa";

interface BlogCardProps {
  title: string
  description: string
  date: string
  tags: string[]
  thumbnailUrl: string
  instagramUrl: string
}

const BlogCard = ({
  title,
  description,
  date,
  tags,
  thumbnailUrl,
  instagramUrl,
}: BlogCardProps) => {
  return (
    <Card className="group w-72 shrink-0 overflow-hidden transition-all duration-300 hover:shadow-lg md:w-full md:max-w-sm">
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnailUrl}
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
              key={tag}
              variant="secondary"
              className="text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="mb-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">{date}</time>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FaInstagram className="h-4 w-4" />
            <span>Instagram</span>
          </div>
        </div>
      </CardContent>
    </a>
    </Card>
  )
}

export default BlogCard
