import { useQueryClient } from '@tanstack/react-query';

import type { TaskCreate, TaskUpdate } from '@/api/generated/models';
import {
    getListTasksTasksGetQueryKey,
    useCreateTaskTasksPost,
    useDeleteTaskTasksTaskIdDelete,
    useListTasksTasksGet,
    useUpdateTaskTasksTaskIdPatch,
} from '@/api/generated/tasks/tasks';

/**

タスク一覧の取得・作成・更新・削除をまとめて扱うカスタムフック。
orvalが生成したTanStack Query Hooksをラップし、更新系操作の成功時に
一覧クエリを自動的に再検証する。UIコンポーネントはこのフックのみに依存する。

@param なし
@return タスク一覧の状態と、作成・更新・削除を行う関数群

**/
export function useTasks() {
    const queryClient = useQueryClient();
    const queryKey = getListTasksTasksGetQueryKey();

    const listQuery = useListTasksTasksGet();

    const invalidateList = () => {
        void queryClient.invalidateQueries({ queryKey });
    };

    const createMutation = useCreateTaskTasksPost({
        mutation: { onSuccess: invalidateList },
    });
    const updateMutation = useUpdateTaskTasksTaskIdPatch({
        mutation: { onSuccess: invalidateList },
    });
    const deleteMutation = useDeleteTaskTasksTaskIdDelete({
        mutation: { onSuccess: invalidateList },
    });

    return {
        tasks: listQuery.data?.data ?? [],
        isLoading: listQuery.isLoading,
        isError: listQuery.isError,
        createTask: (data: TaskCreate) => createMutation.mutateAsync({ data }),
        isCreating: createMutation.isPending,
        updateTask: (taskId: string, data: TaskUpdate) =>
            updateMutation.mutateAsync({ taskId, data }),
        deleteTask: (taskId: string) => deleteMutation.mutateAsync({ taskId }),
    };
}
