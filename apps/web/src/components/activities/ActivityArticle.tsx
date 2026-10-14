import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { PageWipe } from '@/components/motion/PageWipe';
import { usePageIntro } from '@/components/motion/usePageIntro';
import { formatDate } from '@/lib/format';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { ActivityThumb } from './ActivityThumb';

import type { ActivityDetail } from '@repo/api-client';

/**

活動記録1件の本文（日付・カテゴリ・タイトル・概要・カバー画像・本文・前後の記事へのリンク）。
表示時にワイプ演出と読了プログレスバーを動かす。本文はバックエンドでサニタイズ済みのHTML。

@param props activity（表示する記事）
@return 記事本文のJSX

**/
export function ActivityArticle({ activity }: { activity: ActivityDetail }) {
    const rootRef = useRef<HTMLElement>(null);
    usePageIntro(rootRef, { direction: 'horizontal', title: 'none' });

    useGSAP(
        () => {
            if (!prefersReducedMotion()) {
                gsap.from('[data-cover]', {
                    clipPath: 'inset(0 0 100% 0)',
                    duration: 1.3,
                    delay: 0.8,
                    ease: 'expo.inOut',
                });
            }
            const bar = document.querySelector('[data-progress]');
            /**

            ページのスクロール量に合わせて、画面上部の読了プログレスバーを伸ばす。

            @param なし
            @return なし

            **/
            const onScroll = () => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                gsap.set(bar, { scaleX: max > 0 ? window.scrollY / max : 0 });
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            return () => window.removeEventListener('scroll', onScroll);
        },
        { scope: rootRef, dependencies: [activity.id] },
    );

    return (
        <article
            ref={rootRef}
            className="flex w-full max-w-[760px] flex-col gap-[clamp(28px,4vw,48px)]"
        >
            <PageWipe direction="horizontal" origin="right" />
            <Link
                data-in=""
                to="/activities"
                className="text-[13px] font-semibold tracking-[.06em] text-ink no-underline hover:text-accent"
            >
                ← 活動記録一覧
            </Link>
            <div className="flex flex-col gap-5">
                <div
                    data-in=""
                    className="flex items-center gap-3 text-xs font-semibold tracking-[.08em]"
                >
                    <time dateTime={activity.published_at} className="tabular-nums">
                        {formatDate(activity.published_at)}
                    </time>
                    {activity.category && (
                        <span className="tag tag-outline">{activity.category.name}</span>
                    )}
                </div>
                <h1
                    data-in=""
                    className="m-0 text-[clamp(30px,4.4vw,56px)] leading-[1.35] tracking-[-.02em]"
                >
                    {activity.title}
                </h1>
                {activity.description && (
                    <p data-in="" className="m-0 text-[17px] leading-[1.9] text-neutral-700">
                        {activity.description}
                    </p>
                )}
            </div>
            <div
                data-cover=""
                className="relative aspect-video overflow-hidden border-2 border-ink bg-surface"
            >
                <ActivityThumb
                    thumbnail={activity.thumbnail}
                    category={activity.category}
                    width={1520}
                    size="lg"
                />
            </div>
            <div
                data-in=""
                className="richtext"
                dangerouslySetInnerHTML={{ __html: activity.content }}
            />
            <nav
                aria-label="前後の記事"
                className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 border-t-2 border-ink pt-6"
            >
                {activity.newer && (
                    <NeighborLink
                        id={activity.newer.id}
                        title={activity.newer.title}
                        label="← 新しい記事"
                    />
                )}
                {activity.older && (
                    <NeighborLink
                        id={activity.older.id}
                        title={activity.older.title}
                        label="古い記事 →"
                    />
                )}
            </nav>
        </article>
    );
}

/**

前後の記事へのリンク。

@param props id（記事ID）、title（記事タイトル）、label（「← 新しい記事」などのラベル）
@return リンクのJSX

**/
function NeighborLink({ id, title, label }: { id: string; title: string; label: string }) {
    return (
        <Link
            to={`/activities/${id}`}
            className="flex flex-col gap-1.5 text-ink no-underline transition-colors hover:text-accent-700"
        >
            <span className="text-xs font-semibold tracking-[.12em] text-neutral-600">{label}</span>
            <span className="text-base leading-[1.5] font-bold">{title}</span>
        </Link>
    );
}
