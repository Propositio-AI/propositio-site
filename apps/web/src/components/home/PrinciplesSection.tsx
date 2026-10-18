import { Eyebrow } from '@/components/common/Eyebrow';

const PRINCIPLES = [
    {
        num: '01',
        title: '調査',
        body: '関連する論文を検索し、すでに明らかになっている知見や議論を調べています。',
    },
    {
        num: '02',
        title: 'ヒアリング',
        body: '専門家、大学生、社会人をはじめ、幅広い立場の人から実際の声を聞いています。',
    },
    {
        num: '03',
        title: '検証',
        body: '調査とヒアリングから仮説を立て、その仮説が正しいかを確かめています。',
    },
    {
        num: '04',
        title: '開発',
        body: 'チームの技術力を活かし、私たちにしかできないサービスの開発に取り組んでいます。',
    },
    {
        num: '05',
        title: '情報発信',
        body: 'Instagramとこのウェブサイトを通じて、活動や検証の過程を発信しています。',
    },
];

/**

「05 — CURRENT WORK」セクション。画面に固定され、縦スクロールに合わせて5枚の活動カードが横に流れる。

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
                    <Eyebrow>05 — CURRENT WORK</Eyebrow>
                    <h2 className="m-0 text-[clamp(40px,5.4vw,84px)] leading-[1.12] tracking-[-.03em]">
                        いま、
                        <br />
                        取り組んで
                        <br />
                        いること
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
