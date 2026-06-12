import NumberedCard from "@/components/parts/NumberedCard";
import Reveal from "@/components/parts/Reveal";

const values = [
  {
    title: "現場の声を起点に",
    body: "生徒と先生のリアルな声を一番に。机上ではなく現場からプロダクトをつくります。",
  },
  {
    title: "情報共有の徹底",
    body: "オープンな情報共有で、一人ひとりが意思決定に参加できるチームを目指します。",
  },
  {
    title: "可能性を信じる",
    body: "生徒の可能性も、仲間の可能性も。最大化できる土壌を共につくります。",
  },
];

const ValuesSection = () => {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-[32px]">
          私たちが大切にしていること
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <NumberedCard index={i + 1} title={v.title} body={v.body} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
