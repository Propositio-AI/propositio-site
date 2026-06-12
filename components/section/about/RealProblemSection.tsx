import SectionHeading from "@/components/parts/SectionHeading";
import Reveal from "@/components/parts/Reveal";

const RealProblemSection = () => {
  return (
    <section className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-26">
        <Reveal>
        <SectionHeading
          eyebrow="The Real Problem"
          title="教育システムが、その北極星を奪っている。"
        />
        </Reveal>
        <Reveal>
        <div className="mt-12 grid grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <p className="text-[17px] leading-[2.1] text-slate-600">
            日本の教育タイムラインは、小学校から大学までの16年間のうち、実に
            <strong className="text-slate-900">12年間（75%）</strong>
            を「将来何に使うか分からない基盤づくり」に費やします。どんな家を建てるのかも分からないまま、ひたすら基礎工事を続けている状態です。
            <br />
            <br />
            その結果、人生の大きな分岐点である「文理選択」ですら、目的地のないまま当てずっぽうのギャンブルになってしまう。社会に出ることが遠すぎて実感できず、生徒は目的もなく学習を消化しているのです。
          </p>
          <div className="rounded-3xl bg-slate-900 p-10 text-center text-white md:p-12">
            <p className="font-heading text-7xl font-extrabold leading-none tracking-tighter text-blue-400 md:text-[80px]">
              75%
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
              教育期間のうち、目的の見えない
              <br />
              基盤づくりに費やされる割合
            </p>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
};

export default RealProblemSection;
