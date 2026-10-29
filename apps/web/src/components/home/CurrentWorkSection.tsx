import { Link } from 'react-router-dom';

import { SectionHeading } from './SectionHeading';

const WORK = [
    ['教員に聞く', '生徒が進路を選ぶ場面や、自己理解を支えるうえでの難しさを伺っています。'],
    [
        '専門家に学ぶ',
        '本人も整理できていない思いに、どのような質問や応答で向き合うのかを探っています。',
    ],
    [
        '実験で確かめる',
        '実験サービスを配信し、自己理解を支える方法を探っています。今後、Propositio Labでの実験を進める予定です。',
    ],
];

/** 調査・ヒアリング・実験の現在地と、実験計画を示す。 */
export function CurrentWorkSection() {
    return (
        <section id="work" className="home-section bg-surface">
            <SectionHeading
                label="04 — 現在の取り組み"
                title={['現場の声を聞き、', '対話の方法を確かめています。']}
            />
            <div className="grid gap-5 md:grid-cols-3">
                {WORK.map(([title, body], i) => (
                    <article
                        key={title}
                        data-work-card=""
                        className="work-card flex flex-col gap-6 p-[clamp(24px,3vw,40px)]"
                    >
                        <span
                            aria-hidden="true"
                            className="work-number text-[clamp(48px,5vw,72px)] leading-none font-semibold tracking-[-.06em]"
                        >
                            0{i + 1}
                        </span>
                        <h3 className="text-[clamp(24px,2.5vw,34px)] leading-[1.4]">{title}</h3>
                        <p className="home-body">{body}</p>
                    </article>
                ))}
            </div>
            <div
                data-reveal=""
                className="lab-card flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-[clamp(28px,4vw,54px)] tracking-[-.04em]">
                            Propositio Lab
                        </h3>
                        <span className="tag tag-outline">実験計画中</span>
                    </div>
                    <p className="home-body">次の自己理解実験を計画しています。</p>
                    <p className="text-sm leading-[1.9] text-neutral-700">
                        対話による自己理解の変化や、進路選択への効果を検証している段階です。
                    </p>
                </div>
                <Link
                    to="/activities"
                    className="btn btn-secondary min-h-11 self-start"
                    data-magnetic=""
                >
                    活動記録を読む →
                </Link>
            </div>
        </section>
    );
}
