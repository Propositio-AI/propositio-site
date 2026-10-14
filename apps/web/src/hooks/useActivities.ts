import {
    useListActivitiesActivitiesGet,
    useListCategoriesCategoriesGet,
    type listActivitiesActivitiesGetResponse200,
    type listCategoriesCategoriesGetResponse200,
} from '@repo/api-client';
import { keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';

/** 一覧で1回に表示・追加する件数 */
export const ACTIVITIES_PAGE_SIZE = 6;

/**

活動記録の一覧（カテゴリ絞り込み・「もっと見る」による追加読み込み）を扱うカスタムフック。
カテゴリや件数を切り替えても前回の結果を表示し続け、取得完了時に差し替える。

@param なし
@return 記事一覧・カテゴリ一覧・選択中のカテゴリと、絞り込み・追加読み込みの関数

**/
export function useActivities() {
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [limit, setLimit] = useState(ACTIVITIES_PAGE_SIZE);

    const listQuery = useListActivitiesActivitiesGet<listActivitiesActivitiesGetResponse200>(
        { limit, category: categoryId ?? undefined },
        { query: { placeholderData: keepPreviousData } },
    );
    const categoriesQuery =
        useListCategoriesCategoriesGet<listCategoriesCategoriesGetResponse200>();

    const activities = listQuery.data?.data.contents ?? [];
    const totalCount = listQuery.data?.data.total_count ?? 0;

    return {
        /** 表示中の記事（公開日の新しい順） */
        activities,
        /** 絞り込み条件に一致する記事の総数 */
        totalCount,
        /** カテゴリ一覧 */
        categories: categoriesQuery.data?.data ?? [],
        /** 選択中のカテゴリID（nullはすべて） */
        categoryId,
        /** まだ表示していない記事があるか */
        hasMore: activities.length < totalCount,
        /** 初回の取得中か */
        isLoading: listQuery.isLoading,
        /** 取得に失敗したか */
        isError: listQuery.isError,
        /** カテゴリを切り替え、表示件数を最初の件数に戻す */
        selectCategory: (id: string | null) => {
            setCategoryId(id);
            setLimit(ACTIVITIES_PAGE_SIZE);
        },
        /** 表示件数を1ページ分増やす */
        loadMore: () => setLimit((n) => n + ACTIVITIES_PAGE_SIZE),
    };
}
