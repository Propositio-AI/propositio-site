import socialLinksData from "@/data/socialLinks.json";
import { ICONS } from "@/lib/icons";
import type { SocialLink } from "@/lib/types";

const socialLinks = socialLinksData as Record<string, SocialLink>;

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-4"
>
      {Object.entries(socialLinks).map(([key, value]) => {
        const Icon = ICONS[value.icon];

        if (!Icon) return null;

        return (
          <a
            key={key}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="w-6 h-6" />
          </a>
        )
      })}
    </div>
  )
}

export default SocialLinks
