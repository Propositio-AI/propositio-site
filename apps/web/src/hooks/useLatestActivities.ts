import {
    useListActivitiesActivitiesGet,
    type listActivitiesActivitiesGetResponse200,
} from '@repo/api-client';

/**

トップページに表示する最新の活動記録（3件）を取得するカスタムフック。

@param なし
@return 最新の記事一覧と取得状態

**/
export function useLatestActivities() {
    const query = useListActivitiesActivitiesGet<listActivitiesActivitiesGetResponse200>({
        limit: 3,
    });
    return {
        /** 最新の記事（新しい順・最大3件） */
        activities: query.data?.data.contents ?? [],
        /** 取得中か */
        isLoading: query.isLoading,
        /** 取得に失敗したか */
        isError: query.isError,
    };
}
