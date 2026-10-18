import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

const COLUMNS = [
    {
        num: '01',
        en: 'ISSUE',
        title: '答えは、自分の中にある',
        body: '将来どうなりたいか。何を大切にしたいか。考えていないのではなく、答えがまだ自分の言葉になっていないことが課題だと考えています。',
    },
    {
        num: '02',
        en: 'APPROACH',
        title: '対話から、言葉を見つける',
        body: '一方的に答えを与えるのではなく、対話を通じて、その人の中にある思いや価値観を言葉にすることを目指します。',
    },
    {
        num: '03',
        en: 'OUTCOME',
        title: '自分だけの形にする',
        body: '曖昧だった思いを、自分が納得できる言葉と選択へ。誰もが夢を実現できる世界を目指しています。',
    },
];

/**

「01 — ABOUT」セクション。課題・取り組み・目指す姿の3カラムと、採択情報を表示する。

@param なし
@return AboutセクションのJSX

**/
export function AboutSection() {
    return (
        <section
            id="about"
            className="flex flex-col gap-[clamp(32px,5vw,64px)] border-t-2 border-divider px-gutter py-[clamp(80px,10vw,140px)]"
        >
            <div className="flex flex-col gap-6">
                <div data-reveal="">
                    <Eyebrow>01 — ABOUT</Eyebrow>
                </div>
                <h2
                    data-split-reveal=""
                    className="m-0 text-[clamp(36px,5.4vw,88px)] leading-[1.2] tracking-[-.03em]"
                >
                    <SplitChars
                        text={['夢がないのではなく、', 'まだ言葉になっていない。']}
                    />
                </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(16px,2vw,28px)]">
                {COLUMNS.map((col) => (
                    <div
                        key={col.num}
                        data-about-col=""
                        className="relative flex flex-col gap-[18px] px-[clamp(0px,2vw,28px)] py-7"
                    >
                        <div
                            data-about-line=""
                            className="absolute top-0 right-0 left-0 h-0.5 bg-ink"
                            style={{ transformOrigin: 'left' }}
                        />
                        <div className="flex justify-between text-xs font-semibold tracking-[.14em] text-neutral-600">
                            <span>{col.num}</span>
                            <span>{col.en}</span>
                        </div>
                        <h3 className="m-0 text-[clamp(28px,3vw,44px)] tracking-[-.02em]">
                            {col.title}
                        </h3>
                        <p className="m-0 text-base leading-[1.95]">{col.body}</p>
                    </div>
                ))}
            </div>
            <div
                data-reveal=""
                className="flex flex-wrap items-center gap-4 border-t border-neutral-300 pt-5"
            >
                <span className="tag tag-outline">公認団体</span>
                <span className="text-[15px] leading-[1.7] font-semibold">
                    プロジェクトKarynosは、チームPropositio AIが運営する同志社大学ローム記念館プロジェクトであり、学校法人同志社の公認団体として活動しています。
                </span>
            </div>
        </section>
    );
}
