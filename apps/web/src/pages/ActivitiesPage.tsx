import { ActivitiesIndex } from '@/components/activities/ActivitiesIndex';
import { useActivities } from '@/hooks/useActivities';

/**

活動記録一覧ページ（/activities）。一覧の状態をHooksから受け取り、UIへ渡す。

@param なし
@return 活動記録一覧ページのJSX

**/
export function ActivitiesPage() {
    const {
        activities,
        categories,
        categoryId,
        totalCount,
        hasMore,
        isLoading,
        isError,
        selectCategory,
        loadMore,
    } = useActivities();
    return (
        <ActivitiesIndex
            activities={activities}
            categories={categories}
            categoryId={categoryId}
            totalCount={totalCount}
            hasMore={hasMore}
            isLoading={isLoading}
            isError={isError}
            onSelectCategory={selectCategory}
            onLoadMore={loadMore}
        />
    );
}
