import {
    ApiRequestError,
    useGetActivityActivitiesContentIdGet,
    type getActivityActivitiesContentIdGetResponse200,
} from '@repo/api-client';

/**

活動記録1件（本文・前後の記事を含む）を取得するカスタムフック。

@param contentId 取得したい記事のID（microCMS上のコンテンツID）
@return 記事詳細と取得状態（存在しない場合の判定を含む）

**/
export function useActivity(contentId: string) {
    const query =
        useGetActivityActivitiesContentIdGet<getActivityActivitiesContentIdGetResponse200>(
            contentId,
            { query: { enabled: Boolean(contentId), retry: false } },
        );
    const error = query.error as unknown;
    return {
        /** 記事詳細。未取得・取得失敗の場合はundefined */
        activity: query.data?.data,
        /** 取得中か */
        isLoading: query.isLoading,
        /** 記事が存在しないか */
        isNotFound:
            error instanceof ApiRequestError && (error.status === 404 || error.status === 422),
        /** 取得に失敗したか（存在しない場合を含む） */
        isError: query.isError,
    };
}
