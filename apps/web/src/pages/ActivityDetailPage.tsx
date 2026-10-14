import { Link, useParams } from 'react-router-dom';

import { ActivityArticle } from '@/components/activities/ActivityArticle';
import {
    ActivityDetailLayout,
    ActivityDetailMessage,
} from '@/components/activities/ActivityDetailLayout';
import { useActivity } from '@/hooks/useActivity';

/**

活動記録の詳細ページ（/activities/:id）。記事をHooksから受け取り、状態に応じた表示を選ぶ。

@param なし
@return 記事詳細ページのJSX

**/
export function ActivityDetailPage() {
    const { id = '' } = useParams();
    const { activity, isLoading, isNotFound, isError } = useActivity(id);

    return (
        <ActivityDetailLayout>
            {activity ? (
                <ActivityArticle key={activity.id} activity={activity} />
            ) : isLoading ? (
                <ActivityDetailMessage>
                    <p className="m-0 text-neutral-600">読み込み中…</p>
                </ActivityDetailMessage>
            ) : isError ? (
                <ActivityDetailMessage>
                    <p className="m-0">
                        {isNotFound
                            ? 'お探しの記事は見つかりませんでした。'
                            : '記事を読み込めませんでした。時間をおいて再度お試しください。'}
                    </p>
                    <Link className="btn btn-secondary self-start" to="/activities">
                        活動記録一覧へ →
                    </Link>
                </ActivityDetailMessage>
            ) : null}
        </ActivityDetailLayout>
    );
}
