import { SplitChars } from '@/components/motion/SplitChars';

/**

文理選択前の読者に問いかけるファーストビュー。淡い背景と丸い図形にワードマーク演出を組み合わせる。

@param なし
@return ヒーローセクションのJSX

**/
export function HeroSection() {
    return (
        <section
            id="top"
            data-hero=""
            className="hero-soft relative flex min-h-screen flex-col justify-between gap-8 overflow-hidden px-gutter pt-[130px] pb-12"
        >
            <div aria-hidden="true" className="hero-ambient pointer-events-none absolute inset-0">
                {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} data-gl="" className="hero-glow" />
                ))}
            </div>
            <div
                data-sweep=""
                aria-hidden="true"
                className="hero-sweep absolute right-[8%] bottom-[18%] h-1 w-20 rounded-full bg-accent-2"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
            />
            <div
                data-depth="40"
                aria-hidden="true"
                className="pointer-events-none absolute top-[12%] right-[16%]"
            >
                <div
                    data-shape=""
                    data-spin=""
                    className="hero-orb aspect-square w-[clamp(120px,17vw,240px)]"
                />
            </div>
            <div
                data-depth="-60"
                aria-hidden="true"
                className="pointer-events-none absolute top-[30%] right-[8%]"
            >
                <div
                    data-shape=""
                    className="hero-pebble aspect-square w-[clamp(28px,4vw,64px)] rounded-full"
                />
            </div>

            <div data-hero-fade="" className="relative text-xs font-semibold tracking-[.12em]">
                <span data-hero-scramble="" className="hero-label">
                    Karynos / Propositio AI
                </span>
                <p className="mt-3 text-sm tracking-normal">文理選択を迎えるあなたへ</p>
            </div>

            <div className="relative flex flex-col gap-[clamp(12px,2vw,24px)]">
                <h1
                    data-hero-tag=""
                    className="m-0 text-[clamp(22px,7.4vw,30px)] leading-[1.5] font-semibold tracking-[-.03em] sm:text-[clamp(30px,4.2vw,64px)]"
                >
                    <SplitChars text={['進路を選ぶ前に、', '自分の思いを、言葉に。']} />
                </h1>
                <p
                    data-hero-title=""
                    aria-hidden="true"
                    className="m-0 overflow-hidden pb-[.04em] text-[clamp(64px,14vw,200px)] leading-[1.15] font-bold tracking-[-.06em] whitespace-nowrap"
                >
                    <SplitChars text="Karynos" />
                </p>
            </div>

            <div className="relative flex flex-wrap items-end justify-between gap-8 pt-5">
                <div data-hero-fade="" className="flex max-w-[650px] flex-col gap-4">
                    <p className="text-base leading-[1.9]">
                        得意な科目。行きたい学校。
                        <br />
                        その先で、何をして、どんなふうに生きたいだろう。
                    </p>
                    <p className="text-sm leading-[1.9]">
                        Karynosは、自分の中にある思いを言葉にし、納得して進路を選べるように、対話による自己理解を研究するプロジェクトです。
                    </p>
                    <a
                        href="#questions"
                        className="btn btn-primary min-h-12 self-start"
                        data-magnetic=""
                    >
                        自分に問いかけてみる ↓
                    </a>
                </div>
                <div
                    data-hero-fade=""
                    aria-hidden="true"
                    className="flex items-center gap-3.5 text-xs font-semibold tracking-[.18em]"
                >
                    <span>SCROLL</span>
                    <div className="h-0.5 w-[72px] overflow-hidden bg-neutral-200">
                        <div data-scroll-line="" className="h-0.5 w-full bg-ink" />
                    </div>
                </div>
            </div>
        </section>
    );
}
