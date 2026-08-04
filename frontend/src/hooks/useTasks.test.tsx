import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTasks } from '@/hooks/useTasks';

import type { ReactNode } from 'react';

const mutateAsync = vi.fn().mockResolvedValue(undefined);

vi.mock('@/api/generated/tasks/tasks', () => ({
    getListTasksTasksGetQueryKey: () => ['tasks'],
    useListTasksTasksGet: () => ({
        data: { data: [{ id: '1', title: 'テストタスク', is_done: false }] },
        isLoading: false,
        isError: false,
    }),
    useCreateTaskTasksPost: () => ({ mutateAsync, isPending: false }),
    useUpdateTaskTasksTaskIdPatch: () => ({ mutateAsync, isPending: false }),
    useDeleteTaskTasksTaskIdDelete: () => ({ mutateAsync, isPending: false }),
}));

function createWrapper() {
    const queryClient = new QueryClient();
    return function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
}

describe('useTasks', () => {
    it('生成されたクエリからタスク一覧を取り出す', () => {
        const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

        expect(result.current.tasks).toEqual([{ id: '1', title: 'テストタスク', is_done: false }]);
        expect(result.current.isLoading).toBe(false);
    });

    it('createTaskが生成されたミューテーションを呼び出す', async () => {
        const { result } = renderHook(() => useTasks(), { wrapper: createWrapper() });

        await result.current.createTask({ title: '新しいタスク' });

        await waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledWith({ data: { title: '新しいタスク' } });
        });
    });
});
