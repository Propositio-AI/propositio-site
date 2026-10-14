import { SplitChars } from '@/components/motion/SplitChars';

/**

トップページのファーストビュー。グリッド線・装飾図形・タグライン・「Karynos」の大見出しを表示する。

@param なし
@return ヒーローセクションのJSX

**/
export function HeroSection() {
    return (
        <section
            id="top"
            data-hero=""
            className="relative flex min-h-screen flex-col justify-between gap-8 overflow-hidden px-gutter pt-[110px] pb-9"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid grid-cols-6 px-gutter"
            >
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} data-gl="" className="border-l border-neutral-200 last:border-r" />
                ))}
            </div>
            <div
                data-sweep=""
                aria-hidden="true"
                className="absolute top-[44%] right-0 left-0 h-px bg-neutral-300"
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
                    className="aspect-square w-[clamp(160px,22vw,320px)] rounded-full border border-dashed border-neutral-400"
                />
            </div>
            <div
                data-depth="-60"
                aria-hidden="true"
                className="pointer-events-none absolute top-[30%] right-[8%]"
            >
                <div
                    data-shape=""
                    className="aspect-square w-[clamp(10px,1vw,14px)] rounded-full bg-accent-2"
                />
            </div>

            <div
                data-hero-fade=""
                className="relative text-xs font-semibold tracking-[.14em] uppercase"
            >
                <span data-hero-scramble="">Propositio AI</span>
            </div>

            <div className="relative flex flex-col gap-[clamp(12px,2vw,24px)]">
                <p
                    data-hero-tag=""
                    className="m-0 max-w-[18em] text-[clamp(20px,2.8vw,40px)] leading-[1.5] font-medium text-pretty"
                >
                    <SplitChars text="自分の思いを知り、自分の意志で未来を選ぶ。" />
                </p>
                <h1
                    data-hero-title=""
                    className="m-0 overflow-hidden pb-[.04em] text-[clamp(88px,20vw,340px)] leading-[.86] font-bold tracking-[-.06em]"
                >
                    <SplitChars text="Karynos" />
                </h1>
            </div>

            <div className="relative flex flex-wrap items-end justify-between gap-8 border-t-2 border-ink pt-5">
                <p
                    data-hero-fade=""
                    className="m-0 max-w-[600px] text-[15px] leading-[1.9] text-pretty"
                >
                    Karynosは、Propositio
                    AIが取り組む、まだ言葉になっていない思いを整理する「言語化」を支える事業です。
                </p>
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
