import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { TaskResponse } from '@/api/generated/models';
import { TaskItem } from '@/components/task/TaskItem';

const task: TaskResponse = {
    id: '11111111-1111-1111-1111-111111111111',
    title: '洗濯',
    description: null,
    is_done: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
};

describe('TaskItem', () => {
    it('チェックボックス操作でonToggleDoneが呼ばれる', async () => {
        const user = userEvent.setup();
        const onToggleDone = vi.fn();
        render(<TaskItem task={task} onToggleDone={onToggleDone} onDelete={vi.fn()} />);

        await user.click(screen.getByRole('checkbox'));

        expect(onToggleDone).toHaveBeenCalledWith(task);
    });

    it('削除ボタン操作でonDeleteが呼ばれる', async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();
        render(<TaskItem task={task} onToggleDone={vi.fn()} onDelete={onDelete} />);

        await user.click(screen.getByRole('button', { name: '洗濯を削除する' }));

        expect(onDelete).toHaveBeenCalledWith(task);
    });
});
