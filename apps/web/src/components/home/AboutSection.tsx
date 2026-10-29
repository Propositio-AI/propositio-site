import { SectionHeading } from './SectionHeading';

/** 活動の出発点と、プロジェクトを支えるチームを紹介する。 */
export function AboutSection() {
    return (
        <section id="about" className="home-section">
            <SectionHeading
                label="06 — 私たちについて"
                title={['私たちも、', '自分の思いに悩んできました。']}
            />
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
                <div data-reveal="" className="flex flex-col gap-6">
                    <p className="home-body">
                        自分は何をしたいのか。思っていることを、どう言葉にすればいいのか。代表自身も悩み、対話を通じて考えを整理した経験があります。
                    </p>
                    <p className="home-body">
                        同じように悩む人の力になりたい。その思いから、Karynosの活動を続けています。
                    </p>
                </div>
                <div data-reveal="" className="team-card flex flex-col gap-6">
                    <p className="flex items-baseline gap-3">
                        <span className="text-xl">約</span>
                        <span className="text-[clamp(72px,8vw,120px)] leading-none font-semibold tracking-[-.06em]">
                            20
                        </span>
                        <span className="text-xl">人</span>
                    </p>
                    <p className="text-xl font-semibold">全員が同志社大学の学部生</p>
                    <p className="home-body">
                        同志社大学ローム記念館プロジェクトとして、支援を受けながら活動しています。
                    </p>
                    <p className="text-sm leading-[1.9] text-neutral-700">
                        プロジェクト：Karynos
                        <br />
                        運営チーム：Propositio AI
                    </p>
                </div>
            </div>
        </section>
    );
}
