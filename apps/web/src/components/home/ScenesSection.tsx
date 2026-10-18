import { Eyebrow } from '@/components/common/Eyebrow';

const SCENES = [
    {
        word: '文理',
        label: 'SCENE 01 — 文理選択',
        body: '自分はどちらに進むべきなのか。得意な教科だけで決めてしまってよいのか。早い段階で迫られる選択だからこそ、自分が本当に学びたいことを言葉にする必要があります。',
    },
    {
        word: '進学',
        label: 'SCENE 02 — 進学',
        body: '本当に学びたいのはこれなのか。大学名や偏差値だけではなく、その先で何を学び、どんな経験をしたいのかを、自分の言葉で確かめます。',
    },
    {
        word: '就活',
        label: 'SCENE 03 — 就職活動',
        body: '私はこの仕事を本当にしたいのか。自分に合っているのか。職種や条件を選ぶ前に、働くことで何を実現したいのかを考えます。',
    },
    {
        word: '人生',
        label: 'SCENE 04 — 人生',
        body: '私は将来、何をしていきたいのか。進路や仕事に限らず、どのように生きたいのか。自分の中にある答えを、自分だけの形にしていきます。',
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
                <Eyebrow>03 — 言葉にする場面</Eyebrow>
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
