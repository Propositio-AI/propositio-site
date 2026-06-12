import { cn } from "@/lib/utils";

type PlaceholderPanelProps = {
  label: string;
  className?: string;
  children?: React.ReactNode;
};

/** スクリーンショット等が入る予定の場所を示すストライプのパネル */
const PlaceholderPanel = ({ label, className, children }: PlaceholderPanelProps) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-placeholder",
        className,
      )}
    >
      <span className="font-mono text-[13px] tracking-wider text-slate-400">
        [ {label} ]
      </span>
      {children}
    </div>
  );
};

export default PlaceholderPanel;
