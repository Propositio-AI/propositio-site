import { Eyebrow } from '@/components/common/Eyebrow';

const SCENES = [
    {
        word: '進学',
        label: 'SCENE 01 — 大学進学',
        body: '周りに流されたまま、進学できてしまう時代になりつつあります。けれど大学は、自分の意志を持って進む場所。自分の意志とは何か、大学に何を求めるのか。それを理解するには、言語化が欠かせません。',
    },
    {
        word: '就活',
        label: 'SCENE 02 — 就職活動',
        body: '自分の気持ちややりたいこと、目指す将来像。それを自分でも理解し、うまく話せる人は多くありません。自分の大事にしたいことを理解して伝えるのは、とても難しいことです。',
    },
    {
        word: '生活',
        label: 'SCENE 03 — 日々の生活',
        body: '毎日の小さな選択も、何を大切にしたいのかが分からないまま、周りに合わせて決めてしまうことがあります。その積み重ねが、自分らしさをつくっていきます。',
    },
    {
        word: '人生',
        label: 'SCENE 04 — その先の人生',
        body: '進学も就職も、人生の一場面です。自分が大事にしたいことを言葉にできていれば、迷ったときも、自分の意志で選び直すことができます。',
    },
];

/**

「03 — 言語化が必要になる場面」セクション。画面に固定され、スクロールで4つの場面が切り替わる。

@param なし
@return 場面紹介セクションのJSX

**/
export function ScenesSection() {
    return (
        <section
            id="scenes"
            data-scenes=""
            className="grid h-screen grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] content-center gap-[clamp(24px,4vw,64px)] bg-surface px-gutter pt-[clamp(90px,11vh,120px)] pb-[clamp(40px,6vh,64px)]"
        >
            <div className="flex flex-col justify-between gap-6">
                <Eyebrow>03 — 言語化が必要になる場面</Eyebrow>
                <div
                    aria-hidden="true"
                    className="relative h-[clamp(110px,17vw,260px)] overflow-hidden"
                >
                    {SCENES.map((s) => (
                        <div
                            key={s.word}
                            data-sc-word=""
                            className="absolute top-0 left-0 text-[clamp(100px,16vw,240px)] leading-none font-bold tracking-[-.04em]"
                        >
                            {s.word}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4" aria-hidden="true">
                    <div className="flex w-[200px] gap-1.5">
                        {SCENES.map((s, i) => (
                            <span
                                key={s.word}
                                data-sc-dot=""
                                className="h-1 flex-1"
                                style={{
                                    background:
                                        i === 0 ? 'var(--color-ink)' : 'var(--color-neutral-300)',
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-semibold tracking-[.14em] tabular-nums">
                        <span data-sc-num="">01</span> / 04
                    </span>
                </div>
            </div>
            <div className="relative min-h-[clamp(240px,36vh,380px)] border-t-2 border-ink">
                {SCENES.map((s) => (
                    <div
                        key={s.word}
                        data-sc=""
                        className="absolute top-0 right-0 left-0 flex flex-col gap-5 pt-7"
                    >
                        <span className="text-xs font-semibold tracking-[.14em] text-neutral-600">
                            {s.label}
                        </span>
                        <p className="m-0 max-w-[30em] text-[clamp(17px,1.5vw,21px)] leading-[1.95]">
                            {s.body}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
