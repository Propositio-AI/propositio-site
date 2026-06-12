import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** 暗い背景に置く場合は true */
  inverted?: boolean;
  /** 見出しレベル (ページ先頭は h1) */
  as?: "h1" | "h2";
  className?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  lead,
  inverted = false,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) => {
  return (
    <div className={className}>
      {eyebrow && (
        <span
          className={cn(
            "inline-block font-heading text-xs font-bold uppercase tracking-[0.22em]",
            inverted ? "text-blue-200" : "text-blue-600",
          )}
        >
          {eyebrow}
        </span>
      )}
      <Tag
        className={cn(
          "mt-4 font-heading font-extrabold tracking-tight text-balance",
          Tag === "h1"
            ? "text-4xl leading-[1.12] md:text-5xl lg:text-[54px]"
            : "text-3xl leading-[1.2] md:text-[42px] md:leading-[1.18]",
          inverted ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-loose md:text-lg",
            inverted ? "text-blue-100" : "text-slate-600",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
