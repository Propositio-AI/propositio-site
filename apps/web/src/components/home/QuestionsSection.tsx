import { ArrowDownRight, Plus } from 'lucide-react';

import { SectionHeading } from './SectionHeading';

const QUESTIONS = [
    {
        title: '数学が得意だから、理系かな。',
        question: '数学のどんなところが好きですか？',
        body: '答えを見つけること、仕組みを考えること、誰かと考えを交わすこと。あなたが夢中になるのは、どんな瞬間でしょう。',
    },
    {
        title: 'この大学に、行きたい。',
        question: 'そこで、どんな時間を過ごしたいですか？',
        body: '学びたいこと、出会いたい人、やってみたいこと。大学名の先にある思いを、少し考えてみませんか。',
    },
    {
        title: 'やりたいことは、まだない。',
        question: '最近、つい時間を使ってしまったことはありますか？',
        body: '小さな「好き」や気になることも、自分について考える手がかりになります。',
    },
];

/** 身近な選択を入口に、本人がまだ言葉にしていない思いを考える。 */
export function QuestionsSection() {
    return (
        <section id="questions" className="home-section bg-surface">
            <SectionHeading
                label="01 — 身近な選択から"
                title={['「どこへ進むか」は考えた。', '「どう過ごしたいか」は、どうだろう。']}
            />
            <div className="flex flex-col gap-4">
                {QUESTIONS.map((item, i) => (
                    <details
                        key={item.title}
                        data-disclosure=""
                        data-reveal=""
                        className="question-card group"
                    >
                        <summary className="flex cursor-pointer list-none items-center gap-4 py-7 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden sm:gap-8">
                            <span className="text-xs font-semibold text-neutral-700">0{i + 1}</span>
                            <span className="flex-1 text-[clamp(19px,2.4vw,34px)] leading-[1.6] font-semibold">
                                {item.title}
                            </span>
                            <Plus
                                aria-hidden="true"
                                className="question-plus size-9 shrink-0 transition-transform duration-300 group-open:rotate-45"
                            />
                        </summary>
                        <div
                            data-disclosure-body=""
                            className="grid gap-4 pb-8 pl-8 sm:grid-cols-[auto_1fr] sm:pl-12"
                        >
                            <ArrowDownRight aria-hidden="true" className="size-7 text-accent" />
                            <div className="max-w-[46em]">
                                <h3 className="mb-3 text-xl leading-[1.7]">{item.question}</h3>
                                <p className="home-body">{item.body}</p>
                            </div>
                        </div>
                    </details>
                ))}
            </div>
            <p data-reveal="" className="home-body max-w-[44em]">
                すぐに答えが出なくても、大丈夫。
                <br />
                「まだ言葉にできていない思いがあるかもしれない」。その気づきから、始められます。
            </p>
        </section>
    );
}
