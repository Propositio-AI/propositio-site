import { Eyebrow } from '@/components/common/Eyebrow';

const PRINCIPLES = [
    {
        num: '01',
        title: '当事者の声から、課題を確かめる',
        body: '私たち自身の経験を出発点にしながら、それだけを答えにしません。利用する人や現場の声を聞き、どんな場面で、何に困っているのかを確かめます。',
    },
    {
        num: '02',
        title: '技術より先に、届けたい価値を考える',
        body: 'AIを使うこと自体を目的にせず、その人が自分の思いを理解し、選択するうえで何が役立つのかを考えます。対話や人の関わりも含めて、適した方法を探ります。',
    },
    {
        num: '03',
        title: '仮説を小さく試し、学びからつくり直す',
        body: '私たちがよいと思うものが、本当に役立つとは限りません。実際に使ってもらい、何が助けになり、何が負担になったのかを確かめながら改善します。',
    },
    {
        num: '04',
        title: '自分たちにも「なぜ？」を問い続ける',
        body: 'なぜこの機能が必要なのか。誰の、どんな時間をよくするのか。つくる側も問い続け、得られた学びに応じて考えを更新します。',
    },
];

/**

「05 — PRINCIPLES」セクション。画面に固定され、縦スクロールに合わせて4枚のカードが横に流れる。

@param なし
@return プロダクトづくりの原則セクションのJSX

**/
export function PrinciplesSection() {
    return (
        <section
            id="principles"
            data-hsection=""
            className="relative h-screen overflow-hidden border-b-2 border-divider"
        >
            <div
                data-htrack=""
                className="flex h-full w-max items-stretch gap-[clamp(20px,3vw,40px)] px-gutter pt-[clamp(90px,10vh,120px)] pb-[clamp(60px,8vh,90px)]"
            >
                <div className="flex w-[min(82vw,460px)] flex-col justify-between gap-6">
                    <Eyebrow>05 — PRINCIPLES</Eyebrow>
                    <h2 className="m-0 text-[clamp(40px,5.4vw,84px)] leading-[1.12] tracking-[-.03em]">
                        プロダクト
                        <br />
                        づくりで
                        <br />
                        大切に
                        <br />
                        していること
                    </h2>
                    <div aria-hidden="true" className="text-xs font-semibold tracking-[.16em]">
                        SCROLL →
                    </div>
                </div>
                {PRINCIPLES.map((p) => (
                    <article
                        key={p.num}
                        data-hcard=""
                        className="flex w-[min(82vw,480px)] flex-col justify-between gap-6 border-2 border-ink bg-paper p-[clamp(24px,3vw,40px)] transition-colors hover:bg-surface"
                    >
                        <div
                            data-hc-in=""
                            aria-hidden="true"
                            className="text-[clamp(90px,12vw,170px)] leading-[.85] font-semibold tracking-[-.05em] text-transparent"
                            style={{ WebkitTextStroke: '1.5px var(--color-neutral-500)' }}
                        >
                            {p.num}
                        </div>
                        <div className="flex flex-col gap-3.5">
                            <h3
                                data-hc-in=""
                                className="m-0 text-[clamp(22px,2.2vw,30px)] leading-[1.4]"
                            >
                                {p.title}
                            </h3>
                            <p data-hc-in="" className="m-0 text-[15px] leading-[1.9]">
                                {p.body}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
            <div className="absolute right-gutter bottom-[clamp(28px,4vh,44px)] left-gutter h-0.5 bg-neutral-200">
                <div
                    data-hprogress=""
                    className="h-0.5 bg-ink"
                    style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
                />
            </div>
        </section>
    );
}
