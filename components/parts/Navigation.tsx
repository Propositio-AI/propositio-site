'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0.5">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-[10px] px-3.5 py-2 font-heading text-sm font-semibold no-underline transition-colors hover:bg-slate-900/5",
              isActive ? "text-blue-600" : "text-slate-600",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
