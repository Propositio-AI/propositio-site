import { useQueryClient } from '@tanstack/react-query';

import type { TaskResponse, TaskUpdate } from '@/api/generated/models';
import {
    getGetTaskTasksTaskIdGetQueryKey,
    getListTasksTasksGetQueryKey,
    useDeleteTaskTasksTaskIdDelete,
    useGetTaskTasksTaskIdGet,
    useUpdateTaskTasksTaskIdPatch,
} from '@/api/generated/tasks/tasks';

/**

タスク1件の取得・更新・削除を扱うカスタムフック。詳細ページで使用する。
orvalが生成したTanStack Query Hooksをラップし、更新・削除の成功時に
このタスクの詳細クエリと一覧クエリの両方を自動的に再検証する。

@param taskId 対象のタスクID
@return タスクの状態と、更新・削除を行う関数群

**/
export function useTask(taskId: string) {
    const queryClient = useQueryClient();
    const detailQueryKey = getGetTaskTasksTaskIdGetQueryKey(taskId);
    const listQueryKey = getListTasksTasksGetQueryKey();

    const detailQuery = useGetTaskTasksTaskIdGet(taskId);

    const invalidate = () => {
        void queryClient.invalidateQueries({ queryKey: detailQueryKey });
        void queryClient.invalidateQueries({ queryKey: listQueryKey });
    };

    const updateMutation = useUpdateTaskTasksTaskIdPatch({
        mutation: { onSuccess: invalidate },
    });
    const deleteMutation = useDeleteTaskTasksTaskIdDelete({
        mutation: { onSuccess: invalidate },
    });

    // customFetchは非2xxレスポンスで例外を投げるため、data.dataは実行時には常に成功時の型（TaskResponse）になる。
    // orvalが生成する型はエンドポイントに定義された422など全ステータスの共用体になるため、ここで絞り込む。
    const task = detailQuery.data?.data as TaskResponse | undefined;

    return {
        task,
        isLoading: detailQuery.isLoading,
        isError: detailQuery.isError,
        updateTask: (data: TaskUpdate) => updateMutation.mutateAsync({ taskId, data }),
        isUpdating: updateMutation.isPending,
        deleteTask: () => deleteMutation.mutateAsync({ taskId }),
        isDeleting: deleteMutation.isPending,
    };
}
