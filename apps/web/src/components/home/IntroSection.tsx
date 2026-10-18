import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

/**

「02 — 言葉にするということ」セクション。スクロールに合わせて一文が1文字ずつ塗られていく。

@param なし
@return イントロセクションのJSX

**/
export function IntroSection() {
    return (
        <section
            id="intro"
            data-opener=""
            className="flex min-h-screen flex-col justify-center gap-[clamp(28px,4vw,48px)] border-t-2 border-divider px-gutter py-[clamp(90px,11vw,140px)]"
        >
            <Eyebrow>02 — 言葉が未来を動かす</Eyebrow>
            <p
                data-fill-a=""
                className="m-0 max-w-[13em] text-[clamp(32px,5.4vw,88px)] leading-[1.35] font-semibold tracking-[-.02em]"
            >
                <SplitChars text="未来は、言葉から動き出す。" />
            </p>
            <div className="grid max-w-[1100px] gap-6 md:grid-cols-2">
                <p data-reveal="" className="m-0 text-base leading-[1.95]">
                    多くの人が「こんな未来に進みたい」という思いを持っています。けれど、その思いは曖昧なままになりがちです。
                </p>
                <p data-reveal="" className="m-0 text-base leading-[1.95]">
                    Karynosは、一次情報との出会いを通じて思いの輪郭を見つけ、自分の言葉で進路を選べる状態をつくります。
                </p>
            </div>
        </section>
    );
}
