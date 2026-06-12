import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** 暗い背景に置く場合は true */
  inverted?: boolean;
};

const Logo = ({ inverted = false }: LogoProps) => {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3 no-underline">
      <span className="inline-block size-[30px] rounded-[9px] bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_6px_14px_-4px_rgba(37,99,235,0.5)]" />
      <span
        className={cn(
          "font-heading text-[21px] font-extrabold tracking-tight",
          inverted ? "text-white" : "text-slate-900",
        )}
      >
        Karynos
      </span>
    </Link>
  );
};

export default Logo;
