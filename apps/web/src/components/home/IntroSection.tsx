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
            <Eyebrow>02 — 言葉にするということ</Eyebrow>
            <p
                data-fill-a=""
                className="m-0 max-w-[13em] text-[clamp(32px,5.4vw,88px)] leading-[1.35] font-semibold tracking-[-.02em]"
            >
                <SplitChars text="自分の思いや気持ちを言葉にすることは、とても難しい。" />
            </p>
        </section>
    );
}
