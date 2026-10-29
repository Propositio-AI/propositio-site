import { Link } from 'react-router-dom';

import { SectionHeading } from './SectionHeading';

/** 中高生・保護者ができる一歩と、協力・連携の問い合わせ導線。 */
export function JoinSection() {
    return (
        <section id="join" className="home-section bg-accent-100">
            <SectionHeading
                label="08 — 今日の小さな一歩"
                title={['最近、夢中になったこと。', '誰かと、話してみませんか。']}
            />
            <div data-reveal="" className="flex flex-col gap-5">
                <p className="home-body">
                    何が面白かったのか。どんな瞬間がうれしかったのか。
                    <br />
                    身近な経験から、自分の思いを言葉にしてみる。
                </p>
                <p className="home-body">
                    保護者の方も、お子さんがそう感じた理由に、耳を傾けてみてください。
                </p>
            </div>
            <div
                data-reveal=""
                className="flex flex-col items-start gap-7 border-t border-divider pt-8 lg:flex-row lg:items-center lg:justify-between"
            >
                <p className="home-body max-w-[44em]">
                    ヒアリングへのご協力、学校との実証、専門家の助言、開発への参加、活動へのご支援も受け付けています。
                </p>
                <Link className="btn btn-primary min-h-12" to="/contact" data-magnetic="">
                    協力・連携のお問い合わせ →
                </Link>
            </div>
        </section>
    );
}
