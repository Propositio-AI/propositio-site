import PillLink from "@/components/parts/PillLink";
import PlaceholderPanel from "@/components/parts/PlaceholderPanel";

/** ロード時に上から順へ立ち上げるためのディレイ */
const rise = (step: number) =>
  ({ animationDelay: `${step * 0.12}s` }) as React.CSSProperties;

const HeroSection = () => {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-10 md:pb-20 md:pt-24">
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-[560px] bg-blueprint-grid" />
      <div className="pointer-events-none absolute -right-20 top-10 size-[420px] bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22),rgba(96,165,250,0)_70%)]" />
      <div className="relative max-w-3xl">
        <span
          className="inline-block animate-k-rise font-heading text-xs font-bold uppercase tracking-[0.22em] text-blue-600"
          style={rise(0)}
        >
          Career × Learning Platform
        </span>
        <h1
          className="mt-5 animate-k-rise font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 text-balance md:text-6xl"
          style={rise(1)}
        >
          生徒の「今の学び」が、
          <br />
          <span className="text-blue-600">未来とつながる</span>教室へ。
        </h1>
        <p
          className="mt-6 max-w-xl animate-k-rise text-[17px] leading-[2.1] text-slate-600"
          style={rise(2)}
        >
          「これは将来役に立つよ」——そう伝えたいのに、うまく言葉にできない。
          <br />
          Karynosは、AIが生徒一人ひとりの“夢”と日々の学習を接続し、先生の想いを形にするキャリア学習プラットフォームです。
        </p>
        <div className="mt-9 flex animate-k-rise flex-wrap gap-3.5" style={rise(3)}>
          <PillLink href="/contact">資料を請求する →</PillLink>
          <PillLink href="/about" variant="outline">プロダクトを知る</PillLink>
        </div>
        <p
          className="mt-6 animate-k-rise font-heading text-[13px] tracking-wide text-slate-400"
          style={rise(4)}
        >
          対象 : 中学校・高等学校　/　提供形態 : 学校単位のSaaS
        </p>
      </div>
      <div className="animate-k-rise" style={rise(5)}>
        <PlaceholderPanel label="product dashboard — screenshot" className="mt-14 h-[320px] md:h-[420px]">
          <div className="absolute bottom-6 left-6 w-[230px] animate-k-float rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_22px_50px_-20px_rgba(15,23,42,0.25)] md:bottom-8 md:left-8">
            <span className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
              Dream Match
            </span>
            <p className="mt-2 text-sm font-bold text-slate-900">建築家 × 数学Ⅱ</p>
            <p className="mt-1 text-xs text-slate-400">今日の学びが、未来の設計図に。</p>
          </div>
        </PlaceholderPanel>
      </div>
    </section>
  );
};

export default HeroSection;
