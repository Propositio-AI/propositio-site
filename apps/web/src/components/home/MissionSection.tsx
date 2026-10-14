import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

/**

「04 — MISSION」セクション。「それらしいもの」の部分は、生成されるように文字が繰り返し入れ替わる。

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
                    <Eyebrow>04 — MISSION</Eyebrow>
                </div>
                <h2
                    data-split-reveal=""
                    className="m-0 text-[clamp(40px,6.4vw,104px)] leading-[1.15] tracking-[-.03em]"
                >
                    <SplitChars text={['自分の意志を、', '自分の言葉で。']} />
                </h2>
                <p data-reveal="" className="m-0 max-w-[36em] text-base leading-[1.95]">
                    私たちは、自分が大切にしたいことや意志を言葉にする過程を支えるサービスを、研究・開発しています。
                </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-[clamp(24px,4vw,64px)] border-t-2 border-ink pt-[clamp(24px,3vw,40px)]">
                <p
                    data-reveal=""
                    className="m-0 text-[clamp(24px,3vw,44px)] leading-[1.55] font-semibold tracking-[-.01em]"
                >
                    AIで、なんでも
                    <span
                        data-ai=""
                        className="inline-block border-b-2 border-accent text-neutral-500"
                    >
                        それらしいもの
                    </span>
                    が生成できてしまう今だからこそ。
                </p>
                <p data-reveal="" className="m-0 max-w-[30em] text-base leading-[1.95]">
                    自分にとって大事なことを、自らの手で理解し、表現する。それを目指しています。
                </p>
            </div>
        </section>
    );
}
