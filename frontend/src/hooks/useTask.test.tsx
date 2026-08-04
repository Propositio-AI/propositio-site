import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTask } from '@/hooks/useTask';

import type { ReactNode } from 'react';

const mutateAsync = vi.fn().mockResolvedValue(undefined);

vi.mock('@/api/generated/tasks/tasks', () => ({
    getGetTaskTasksTaskIdGetQueryKey: (taskId: string) => ['tasks', taskId],
    getListTasksTasksGetQueryKey: () => ['tasks'],
    useGetTaskTasksTaskIdGet: () => ({
        data: { data: { id: '1', title: 'テストタスク', is_done: false } },
        isLoading: false,
        isError: false,
    }),
    useUpdateTaskTasksTaskIdPatch: () => ({ mutateAsync, isPending: false }),
    useDeleteTaskTasksTaskIdDelete: () => ({ mutateAsync, isPending: false }),
}));

function createWrapper() {
    const queryClient = new QueryClient();
    return function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
}

describe('useTask', () => {
    beforeEach(() => {
        mutateAsync.mockClear();
    });

    it('生成されたクエリからタスク1件を取り出す', () => {
        const { result } = renderHook(() => useTask('1'), { wrapper: createWrapper() });

        expect(result.current.task).toEqual({ id: '1', title: 'テストタスク', is_done: false });
        expect(result.current.isLoading).toBe(false);
    });

    it('updateTaskが生成されたミューテーションを対象IDで呼び出す', async () => {
        const { result } = renderHook(() => useTask('1'), { wrapper: createWrapper() });

        await result.current.updateTask({ is_done: true });

        await waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledWith({ taskId: '1', data: { is_done: true } });
        });
    });

    it('deleteTaskが生成されたミューテーションを対象IDで呼び出す', async () => {
        const { result } = renderHook(() => useTask('1'), { wrapper: createWrapper() });

        await result.current.deleteTask();

        await waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledWith({ taskId: '1' });
        });
    });
});
