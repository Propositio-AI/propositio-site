import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

const COLUMNS = [
    {
        num: '01',
        en: 'PROBLEM',
        title: '課題',
        body: '自分が何を大切にしたいのか分からないまま、周りの期待や流れで、進学や就職を決めてしまうことがあります。',
    },
    {
        num: '02',
        en: 'APPROACH',
        title: '取り組み',
        body: 'まだ言葉になっていない思いを、対話を通じて整理する「言語化」。その支え方を研究・開発しています。',
    },
    {
        num: '03',
        en: 'GOAL',
        title: '目指す姿',
        body: '一人ひとりが自分の大切にしたいことに気づき、自分の意志で未来を選べる社会をつくります。',
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
                        text={['思いを言葉にできないまま、', '大切な選択をしていませんか。']}
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
                <span className="tag tag-outline">採択</span>
                <span className="text-[15px] leading-[1.7] font-semibold">
                    Propositio AIは「2026年度
                    同志社大学ローム記念館プロジェクト」として活動しています。
                </span>
            </div>
        </section>
    );
}
