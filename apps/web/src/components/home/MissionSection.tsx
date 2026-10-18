import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

/**

「04 — APPROACH」セクション。対話と一次情報を軸に、Karynosの方法を示す。

@param なし
@return ミッションセクションのJSX

**/
export function MissionSection() {
    return (
        <section
            id="mission"
            className="flex flex-col gap-[clamp(32px,5vw,64px)] border-t-2 border-divider px-gutter py-[clamp(90px,11vw,140px)]"
        >
            <div className="flex flex-col gap-6">
                <div data-reveal="">
                    <Eyebrow>04 — APPROACH</Eyebrow>
                </div>
                <h2
                    data-split-reveal=""
                    className="m-0 text-[clamp(40px,6.4vw,104px)] leading-[1.15] tracking-[-.03em]"
                >
                    <SplitChars text={['答えを与えず、', '言葉を引き出す。']} />
                </h2>
                <p data-reveal="" className="m-0 max-w-[36em] text-base leading-[1.95]">
                    自分の中に答えがあっても、うまく言葉にできない。そのむず痒さや無念さを、対話の力でなくしていきたいと考えています。
                </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-px border border-ink bg-ink">
                {[
                    ['01', '対話', '問いかけ、話し、考える。対話を通じて、その人の中にある思いや答えの言語化を促します。'],
                    ['02', '実際の声', '私たちの考えだけで方法を決めません。専門家、大学生、社会人など、さまざまな人の声を大切にします。'],
                ].map(([num, title, body]) => (
                    <article key={num} data-reveal="" className="flex min-h-64 flex-col bg-paper p-6">
                        <span className="text-xs font-semibold tracking-[.14em] text-neutral-600">{num}</span>
                        <h3 className="mt-auto mb-3 text-2xl">{title}</h3>
                        <p className="m-0 text-sm leading-[1.8]">{body}</p>
                    </article>
                ))}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-[clamp(24px,4vw,64px)] border-t-2 border-ink pt-[clamp(24px,3vw,40px)]">
                <p
                    data-reveal=""
                    className="m-0 text-[clamp(24px,3vw,44px)] leading-[1.55] font-semibold tracking-[-.01em]"
                >
                    どれだけ技術が進んでも、
                    <span
                        data-ai=""
                        className="inline-block border-b-2 border-accent text-neutral-500"
                    >
                        自分の答え
                    </span>
                    は自分の中にある。
                </p>
                <p data-reveal="" className="m-0 max-w-[30em] text-base leading-[1.95]">
                    私たちは技術で答えを決めるのではなく、対話を支え、一人ひとりが自分の言葉を見つけられるサービスを開発しています。
                </p>
            </div>
        </section>
    );
}
