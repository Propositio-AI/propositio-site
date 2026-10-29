import { ArrowUpRight } from 'lucide-react';

import { SectionHeading } from './SectionHeading';

const ISSUES = [
    [
        '考える余白',
        '勉強や部活動、受験準備の合間に、将来についてゆっくり考える時間をつくる難しさ。',
    ],
    [
        '話せる関係',
        '正解を求められそう。否定されるかもしれない。そんな不安を抱えず、本音を話せる相手の大切さ。',
    ],
    [
        '一人ひとりへの時間',
        '先生が生徒に寄り添いたくても、面談の時間や継続して支える余裕には限りがあること。',
    ],
];

/** 教員ヒアリングによる課題認識と、出典付きの全国調査を分けて示す。 */
export function IssueSection() {
    return (
        <section id="issue" className="home-section">
            <SectionHeading
                label="02 — 向き合う課題"
                title={['自分と向き合う時間と、', '話せる相手が必要です。']}
            />
            <p data-reveal="" className="home-body max-w-[48em]">
                私たちは、思いが言葉になるためには、経験を振り返り、安心して話せる環境が大切だと考えています。教員へのヒアリングから、次のような難しさが見えてきました。
            </p>
            <div className="grid gap-8 md:grid-cols-3">
                {ISSUES.map(([title, body], i) => (
                    <article
                        key={title}
                        data-reveal=""
                        className="issue-card relative flex flex-col gap-5"
                    >
                        <div
                            data-rule=""
                            aria-hidden="true"
                            className="h-1 w-10 rounded-full bg-accent-2"
                        />
                        <span className="text-xs font-semibold tracking-[.14em] text-neutral-700">
                            0{i + 1}
                        </span>
                        <h3 className="text-[clamp(24px,2.5vw,36px)] leading-[1.4]">{title}</h3>
                        <p className="home-body">{body}</p>
                    </article>
                ))}
            </div>
            <div
                data-reveal=""
                className="evidence-card grid items-center gap-6 md:grid-cols-[1fr_1.5fr] md:gap-12"
            >
                <p className="text-[clamp(88px,12vw,180px)] leading-none font-semibold tracking-[-.06em] text-accent">
                    46.7<span className="ml-2 text-[.35em]">%</span>
                </p>
                <div className="flex flex-col gap-4">
                    <p className="text-[clamp(20px,2vw,28px)] leading-[1.7] font-semibold">
                        「自分の個性や適性を考える学習」を
                        <br className="hidden sm:block" />
                        指導してほしかったと答えた高校生
                    </p>
                    <p className="text-xs leading-[1.9] text-neutral-700">
                        国立教育政策研究所・2025年調査（2026年公表）。公立高校の最終学年を対象とする生徒調査・問17、複数回答。授業が全くなかった割合ではありません。
                    </p>
                    <a
                        className="inline-flex min-h-11 items-center gap-2 self-start text-sm underline underline-offset-4 transition-colors hover:text-accent"
                        href="https://www.nier.go.jp/_uploads/2026/01/15_3_09_chosakekka_kouseito.pdf#page=33"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        調査の設問と結果を見る（PDF）
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
