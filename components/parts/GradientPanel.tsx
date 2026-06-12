import { cn } from "@/lib/utils";

type GradientPanelProps = {
  className?: string;
  children: React.ReactNode;
};

/** ブルーグラデーションの強調パネル。CTAや価値訴求のブロックに使う */
const GradientPanel = ({ className, children }: GradientPanelProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 p-10 text-white md:p-16",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-[280px] bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0)_70%)]" />
      <div className="relative">{children}</div>
    </div>
  );
};

export default GradientPanel;
