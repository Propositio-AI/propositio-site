import SectionHeading from "@/components/parts/SectionHeading";
import PlaceholderPanel from "@/components/parts/PlaceholderPanel";
import Reveal from "@/components/parts/Reveal";

const steps = [
  {
    step: "STEP 01",
    title: "Dream Matching",
    subtitle: "仮の進路設定",
    body: "マッチングアプリ風のUIで、AIとの対話から生徒の興味・関心をもとに「仮の進路」を提案。これまでにない出会いから、生徒は自分なりの目的を持って学習に向き合えます。",
    placeholder: "matching UI",
  },
  {
    step: "STEP 02",
    title: "Dream Action",
    subtitle: "検証と理解",
    body: "設定した進路に対し、「今学んでいる内容が将来どう活きるのか」をAIが提示。授業資料から個別最適化された教材を生成し、日々の学習と将来の選択が一貫した意味でつながります。",
    placeholder: "learning material",
  },
];

const SolutionSection = () => {
  return (
    <section className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Our Solution"
            title={
              <>
                夢を見つけ、学びにつなげる。
                <br />
                2つのステップ。
              </>
            }
            lead="Karynosは、ただの教育プラットフォームではありません。生徒の“将来”までを考える、全く新しい教育の形です。"
          />
        </Reveal>
        {steps.map(({ step, title, subtitle, body, placeholder }, i) => (
          <Reveal key={title}>
            <div className="mt-14 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
              <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                <span className="font-heading text-sm font-extrabold tracking-wide text-blue-400">{step}</span>
                <h3 className="mt-2.5 font-heading text-[28px] font-extrabold tracking-tight text-slate-900">
                  {title}
                </h3>
                <p className="mt-1.5 font-heading text-[13px] text-slate-400">{subtitle}</p>
                <p className="mt-4 text-base leading-loose text-slate-600">{body}</p>
              </div>
              <PlaceholderPanel
                label={placeholder}
                className={`h-[260px] md:h-[320px] ${i % 2 === 1 ? "md:order-1" : ""}`}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default SolutionSection;
