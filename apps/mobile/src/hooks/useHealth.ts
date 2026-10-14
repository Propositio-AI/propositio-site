import { useHealthHealthGet } from '@repo/api-client';

export type HealthState = 'loading' | 'ok' | 'error';

/**

バックエンドのヘルスチェック（GET /health）の状態を扱うカスタムフック。
@repo/api-clientが生成したTanStack Query Hooksをラップし、
UIが表示に使う「接続状態」と「再確認」関数だけを返す。UIコンポーネントはこのフックの戻り値のみに依存する。

@param なし
@return state（loading / ok / error のいずれか）、message（APIが返したステータス文字列またはエラーメッセージ）、isRefreshing（再確認中かどうか）、refresh（ヘルスチェックを再実行する関数）

**/
export function useHealth() {
    const healthQuery = useHealthHealthGet({ query: { retry: false } });

    let state: HealthState = 'loading';
    let message: string | null = null;
    if (healthQuery.isError) {
        state = 'error';
        message = healthQuery.error instanceof Error ? healthQuery.error.message : null;
    } else if (healthQuery.data) {
        state = healthQuery.data.data.status === 'ok' ? 'ok' : 'error';
        message = healthQuery.data.data.status;
    }

    return {
        state,
        message,
        isRefreshing: healthQuery.isRefetching,
        refresh: () => void healthQuery.refetch(),
    };
}
