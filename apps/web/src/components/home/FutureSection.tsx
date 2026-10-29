import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

/** 進路選択から、その先の時間の使い方へと目指す未来をつなぐ。 */
export function FutureSection() {
    return (
        <section id="future" data-future="" className="home-section">
            <div data-reveal="">
                <Eyebrow>05 — 目指す未来</Eyebrow>
            </div>
            <h2
                data-fill=""
                className="text-[clamp(32px,5.4vw,88px)] leading-[1.45] tracking-[-.04em]"
            >
                <SplitChars
                    text={['「だから、私はこれを選ぶ。」', 'そう言える選択を増やしたい。']}
                />
            </h2>
            <div className="grid gap-7 md:grid-cols-2">
                <p data-reveal="" className="home-body">
                    自分が何を大切にしたいのかを知り、それを手がかりに選ぶ。あとから考えが変わったときも、自分の思いに立ち返って選び直す。
                </p>
                <p data-reveal="" className="home-body">
                    進路だけでなく、その先の人生でも、大切にしたいことに時間を使えるように。私たちは、納得できる選択と、後悔の少ない未来を目指しています。
                </p>
            </div>
            <p
                data-reveal=""
                className="text-[clamp(22px,3vw,40px)] leading-[1.6] font-semibold text-accent-2-700"
            >
                誰もが、夢を実現できる世界へ。
            </p>
        </section>
    );
}
