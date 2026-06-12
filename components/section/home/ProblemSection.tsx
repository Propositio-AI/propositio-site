import SectionHeading from "@/components/parts/SectionHeading";
import NumberedCard from "@/components/parts/NumberedCard";
import Reveal from "@/components/parts/Reveal";

const problems = [
  {
    title: "「なぜ学ぶのか」が伝わらない",
    body: "将来役に立つと伝えたいのに、生徒一人ひとりの興味に結びつけて言葉にする余裕がない。",
  },
  {
    title: "個別の進路指導まで手が回らない",
    body: "日々の授業準備に追われ、生徒それぞれの夢に寄り添った進路の対話まで時間が割けない。",
  },
  {
    title: "学びと将来が分断されている",
    body: "生徒は「やらされている感」のまま学習を消化し、日々の学びと自分の将来を結びつけられずにいる。",
  },
];

const ProblemSection = () => {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="The Problem"
            title={
              <>
                生徒の未来に向き合いたい。
                <br />
                でも、その「時間」が残されていない。
              </>
            }
            lead="キャリア学習にもっと力を入れたい。一人ひとりの興味に合わせた進路の話をしたい。多くの先生が抱える想いと、現場の現実との間には大きなギャップがあります。"
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <NumberedCard index={i + 1} title={p.title} body={p.body} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
