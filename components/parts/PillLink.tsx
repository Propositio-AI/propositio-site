import Link from "next/link";
import { cn } from "@/lib/utils";

type PillLinkProps = {
  href: string;
  variant?: "primary" | "outline" | "white";
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

/** サイト全体で使う丸形のCTAリンク */
const PillLink = ({
  href,
  variant = "primary",
  size = "lg",
  className,
  children,
}: PillLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-heading font-bold no-underline transition-colors",
        size === "lg" ? "px-7 py-4 text-[15px]" : "px-5 py-[11px] text-sm",
        variant === "primary" &&
          "bg-blue-600 text-white shadow-[0_12px_26px_-10px_rgba(37,99,235,0.7)] hover:bg-blue-700",
        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
        variant === "white" && "bg-white text-blue-700 hover:bg-blue-50",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default PillLink;
