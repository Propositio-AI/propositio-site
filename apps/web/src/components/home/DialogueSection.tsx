import { Plus } from 'lucide-react';

import { SectionHeading } from './SectionHeading';

/** 対話の方法を、実測結果と混同しない架空例で紹介する。 */
export function DialogueSection() {
    return (
        <section id="dialogue" className="home-section">
            <SectionHeading
                label="03 — 対話の研究"
                title={['どんな問いが、自分の言葉を', '見つける助けになるだろう。']}
            />
            <div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
                <div data-reveal="" className="flex flex-col gap-7">
                    <p className="home-body">
                        経験を尋ねる。言葉を確かめて返す。考える時間を待つ。私たちは、会話の流れや応答の仕方が、本人の気づきにどう関わるかを研究しています。
                    </p>
                    <p className="home-body">
                        本人が「それは違う」「まだわからない」と言えることも大切にしながら、思いに合う言葉を探せる対話を目指します。
                    </p>
                    <div aria-hidden="true" className="flex gap-3">
                        <span className="size-3 rounded-full bg-accent" />
                        <span className="size-3 rounded-full bg-accent-2" />
                        <span className="size-3 rounded-full border border-divider" />
                    </div>
                </div>
                <div data-dialogue="" className="flex min-w-0 flex-col gap-5">
                    <p className="text-xs leading-[1.8] text-neutral-700">
                        対話のイメージ
                        <br />
                        説明用の架空例です。実験結果ではありません。
                    </p>
                    <div data-dialogue-line="" className="dialogue-line">
                        <span className="dialogue-label">話し手</span>
                        <p>人と話すのが好きなんです。</p>
                    </div>
                    <div data-dialogue-line="" className="dialogue-line dialogue-reply">
                        <span className="dialogue-label">聞き手</span>
                        <p>どんな話をしているとき、特に楽しい？</p>
                    </div>
                    <details data-disclosure="" className="group">
                        <summary className="btn btn-secondary min-h-11 w-full cursor-pointer list-none justify-between gap-4 [&::-webkit-details-marker]:hidden">
                            <span className="group-open:hidden">対話の続きを見る</span>
                            <span className="hidden group-open:inline">対話を短く表示する</span>
                            <Plus
                                aria-hidden="true"
                                className="size-5 transition-transform duration-300 group-open:rotate-45"
                            />
                        </summary>
                        <div data-disclosure-body="" className="flex flex-col gap-5 pt-5">
                            <div className="dialogue-line">
                                <span className="dialogue-label">話し手</span>
                                <p>
                                    自分と違う考えを聞いて、一緒に考えるとき。自分の見方も変わるのが面白いのかも。
                                </p>
                            </div>
                            <div className="dialogue-line dialogue-reply">
                                <span className="dialogue-label">聞き手</span>
                                <p>考えを交わす時間が好き、という感じ？ それとも、少し違う？</p>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </section>
    );
}
