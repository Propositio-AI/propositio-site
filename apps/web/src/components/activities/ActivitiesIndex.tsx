import { useRef } from 'react';

import { Eyebrow } from '@/components/common/Eyebrow';
import { PageFooter } from '@/components/layout/PageFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageWipe } from '@/components/motion/PageWipe';
import { SplitChars } from '@/components/motion/SplitChars';
import { usePageIntro } from '@/components/motion/usePageIntro';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { ActivityCard } from './ActivityCard';
import { CategoryTabs } from './CategoryTabs';

import type { ActivitySummary, CategoryResponse } from '@repo/api-client';

type ActivitiesIndexProps = {
    activities: ActivitySummary[];
    categories: CategoryResponse[];
    /** 選択中のカテゴリID（nullは「すべて」） */
    categoryId: string | null;
    /** 絞り込み条件に一致する記事の総数 */
    totalCount: number;
    hasMore: boolean;
    isLoading: boolean;
    isError: boolean;
    onSelectCategory: (id: string | null) => void;
    onLoadMore: () => void;
};

/**

活動記録一覧ページの本体（見出し・カテゴリ絞り込み・記事グリッド・「もっと見る」）。

@param props activities（表示する記事）、categories（カテゴリ一覧）、categoryId（選択中のカテゴリ）、totalCount（総数）、hasMore（続きがあるか）、isLoading / isError（取得状態）、onSelectCategory（カテゴリ選択時）、onLoadMore（もっと見る押下時）
@return 活動記録一覧ページのJSX

**/
export function ActivitiesIndex({
    activities,
    categories,
    categoryId,
    totalCount,
    hasMore,
    isLoading,
    isError,
    onSelectCategory,
    onLoadMore,
}: ActivitiesIndexProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    usePageIntro(rootRef, { direction: 'vertical' });

    // 新しく表示されたカードだけを下から登場させる（初回表示・カテゴリ切り替え・追加読み込み）
    useGSAP(
        () => {
            const fresh = gsap.utils.toArray<HTMLElement>('[data-card]:not([data-shown])');
            fresh.forEach((el) => el.setAttribute('data-shown', ''));
            if (!fresh.length || prefersReducedMotion()) return;
            gsap.fromTo(
                fresh,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.2 },
            );
        },
        { scope: rootRef, dependencies: [activities] },
    );

    return (
        <div
            ref={rootRef}
            className="inner-page relative flex min-h-screen flex-col overflow-x-clip bg-paper text-ink"
        >
            <PageWipe direction="vertical" origin="top" inkFirst />
            <SiteHeader variant="page" current="activities" />
            <main className="flex flex-1 flex-col">
                <section className="flex flex-col gap-6 px-gutter pt-[clamp(64px,9vw,120px)] pb-[clamp(32px,4vw,56px)]">
                    <div data-in="">
                        <Eyebrow>活動記録</Eyebrow>
                    </div>
                    <h1
                        data-title=""
                        className="m-0 overflow-hidden pb-[.04em] text-[clamp(46px,9vw,140px)] leading-[1.15] tracking-[-.06em]"
                    >
                        <SplitChars text="Activities" />
                    </h1>
                </section>

                <section
                    data-in=""
                    className="activity-filters flex flex-wrap items-center justify-between gap-4 px-gutter py-4"
                >
                    <CategoryTabs
                        categories={categories}
                        selectedId={categoryId}
                        onSelect={onSelectCategory}
                    />
                    <span
                        aria-live="polite"
                        className="text-xs font-semibold tracking-[.1em] text-neutral-700 tabular-nums"
                    >
                        {isLoading ? '' : `${totalCount} 件`}
                    </span>
                </section>

                <section className="flex flex-col gap-[clamp(40px,5vw,64px)] px-gutter pt-[clamp(32px,4vw,56px)] pb-[clamp(64px,8vw,120px)]">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-x-[clamp(20px,2.4vw,32px)] gap-y-[clamp(32px,4vw,56px)]">
                        {activities.map((a) => (
                            <ActivityCard
                                key={a.id}
                                activity={a}
                                headingLevel="h2"
                                showDescription
                            />
                        ))}
                    </div>
                    {isError && (
                        <p className="soft-panel m-0 text-base">
                            活動記録を読み込めませんでした。時間をおいて再度お試しください。
                        </p>
                    )}
                    {!isLoading && !isError && activities.length === 0 && (
                        <p className="soft-panel m-0 text-base">記事はまだありません。</p>
                    )}
                    {hasMore && (
                        <div className="flex justify-start">
                            <button
                                type="button"
                                className="btn btn-secondary min-w-60"
                                onClick={onLoadMore}
                            >
                                もっと見る ↓
                            </button>
                        </div>
                    )}
                </section>
            </main>
            <PageFooter
                links={[
                    { to: '/', label: 'トップ' },
                    { to: '/privacy', label: 'プライバシーポリシー' },
                ]}
            />
        </div>
    );
}
