import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { ActivityCard } from '@/components/activities/ActivityCard';
import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';

import type { ActivitySummary } from '@repo/api-client';

type LatestActivitiesSectionProps = {
    /** 表示する最新の記事（最大3件） */
    activities: ActivitySummary[];
    /** 取得中か */
    isLoading: boolean;
    /** 取得に失敗したか */
    isError: boolean;
};

/**

「06 — ACTIVITIES」セクション。最新の活動記録を3件並べ、一覧ページへのリンクを置く。
記事の取得はトップページのデータ取得完了後になるため、カードの登場演出はこのコンポーネントで行う。

@param props activities（最新の記事）、isLoading（取得中か）、isError（取得に失敗したか）
@return 最新の活動記録セクションのJSX

**/
export function LatestActivitiesSection({
    activities,
    isLoading,
    isError,
}: LatestActivitiesSectionProps) {
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
            // 記事の表示で高さが変わるため、固定（pin）セクションの位置を再計算する
            ScrollTrigger.refresh();
            if (!cards.length || prefersReducedMotion()) return;
            gsap.from(cards, {
                y: 70,
                opacity: 0,
                duration: 1.1,
                stagger: 0.1,
                ease: 'expo.out',
                scrollTrigger: { trigger: cards[0], start: 'top 88%' },
            });
        },
        { scope: gridRef, dependencies: [activities.length] },
    );

    return (
        <section
            id="activities"
            className="flex flex-col gap-[clamp(32px,4vw,56px)] px-gutter py-[clamp(80px,10vw,140px)]"
        >
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex flex-col gap-6">
                    <div data-reveal="">
                        <Eyebrow>06 — ACTIVITIES</Eyebrow>
                    </div>
                    <h2
                        data-split-reveal=""
                        className="m-0 text-[clamp(40px,6vw,96px)] leading-[1.1] tracking-[-.03em]"
                    >
                        <SplitChars text="活動記録" />
                    </h2>
                </div>
                <div data-reveal="">
                    <Link className="btn btn-secondary" to="/activities" data-magnetic="">
                        すべて見る →
                    </Link>
                </div>
            </div>
            <div
                ref={gridRef}
                className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-[clamp(20px,2.4vw,32px)] gap-y-[clamp(28px,3vw,40px)]"
            >
                {activities.map((a) => (
                    <ActivityCard key={a.id} activity={a} />
                ))}
                {isLoading &&
                    Array.from({ length: 3 }, (_, i) => (
                        <div key={i} aria-hidden="true" className="flex flex-col gap-4">
                            <div className="aspect-[16/10] animate-pulse border-2 border-neutral-200 bg-surface" />
                            <div className="h-3 w-1/3 bg-surface" />
                            <div className="h-5 w-4/5 bg-surface" />
                        </div>
                    ))}
            </div>
            {isError && (
                <p className="m-0 text-[15px] text-neutral-700">
                    活動記録を読み込めませんでした。時間をおいて再度お試しください。
                </p>
            )}
            {!isLoading && !isError && activities.length === 0 && (
                <p className="m-0 border-t-2 border-ink py-12 text-base">記事はまだありません。</p>
            )}
        </section>
    );
}
