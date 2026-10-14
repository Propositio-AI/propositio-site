import { Link } from 'react-router-dom';

import { formatDate } from '@/lib/format';

import { ActivityThumb } from './ActivityThumb';

import type { ActivitySummary } from '@repo/api-client';

type ActivityCardProps = {
    activity: ActivitySummary;
    /** 見出しのレベル（一覧ページではh2、トップページではh3） */
    headingLevel?: 'h2' | 'h3';
    /** 概要文を表示するか */
    showDescription?: boolean;
};

/**

活動記録1件のカード（サムネイル・日付・カテゴリ・タイトル）。記事詳細ページへのリンク。

@param props activity（表示する記事）、headingLevel（見出しレベル）、showDescription（概要文を表示するか）
@return 記事カードのJSX

**/
export function ActivityCard({
    activity,
    headingLevel = 'h3',
    showDescription = false,
}: ActivityCardProps) {
    const Heading = headingLevel;
    return (
        <Link
            data-card=""
            to={`/activities/${activity.id}`}
            className="group flex flex-col gap-4 text-ink no-underline transition-colors hover:text-accent-700"
        >
            <div className="relative aspect-[16/10] overflow-hidden border-2 border-ink bg-surface">
                <ActivityThumb
                    thumbnail={activity.thumbnail}
                    category={activity.category}
                    width={960}
                    zoomOnHover
                />
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold tracking-[.08em]">
                <time dateTime={activity.published_at} className="tabular-nums">
                    {formatDate(activity.published_at)}
                </time>
                {activity.category && (
                    <span className="tag tag-outline">{activity.category.name}</span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <Heading className="m-0 text-[clamp(18px,1.5vw,22px)] leading-[1.5] tracking-[-.01em]">
                    {activity.title}
                </Heading>
                {showDescription && (
                    <p className="m-0 line-clamp-2 text-sm leading-[1.8] text-neutral-700">
                        {activity.description}
                    </p>
                )}
            </div>
        </Link>
    );
}
