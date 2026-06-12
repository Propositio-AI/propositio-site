import SectionHeading from "@/components/parts/SectionHeading";
import Reveal from "@/components/parts/Reveal";

type Stat = { value: string; label: string };

const teacherStats: Stat[] = [
  { value: "68%", label: "キャリア教育の実施時間が不足していると感じる" },
  { value: "49%", label: "準備のための時間が足りていない" },
];

const studentStats: Stat[] = [
  { value: "23%", label: "具体的な将来の夢が決まっている生徒" },
  { value: "52%", label: "進路選択・決定能力が不足している生徒" },
];

const StatGroup = ({ stats, valueClass, labelClass }: { stats: Stat[]; valueClass: string; labelClass: string }) => (
  <div className="mt-7 flex flex-wrap gap-10">
    {stats.map((s) => (
      <div key={s.label}>
        <p className={`font-heading text-5xl font-extrabold leading-none tracking-tight md:text-[56px] ${valueClass}`}>
          {s.value}
        </p>
        <p className={`mt-3 max-w-[200px] text-sm leading-relaxed ${labelClass}`}>{s.label}</p>
      </div>
    ))}
  </div>
);

const EvidenceSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="The Evidence" title="データが示す、現場の切実な課題。" />
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl bg-slate-900 p-8 text-white md:p-11">
            <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              For Teachers
            </span>
            <StatGroup stats={teacherStats} valueClass="text-blue-400" labelClass="text-slate-300" />
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="h-full rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 md:p-11">
            <span className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              For Students
            </span>
            <StatGroup stats={studentStats} valueClass="text-emerald-600" labelClass="text-slate-500" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default EvidenceSection;
