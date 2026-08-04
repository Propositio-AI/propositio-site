import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
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
        render(
            <MemoryRouter>
                <TaskItem task={task} onToggleDone={onToggleDone} onDelete={vi.fn()} />
            </MemoryRouter>,
        );

        await user.click(screen.getByRole('checkbox'));

        expect(onToggleDone).toHaveBeenCalledWith(task);
    });

    it('削除ボタン操作でonDeleteが呼ばれる', async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();
        render(
            <MemoryRouter>
                <TaskItem task={task} onToggleDone={vi.fn()} onDelete={onDelete} />
            </MemoryRouter>,
        );

        await user.click(screen.getByRole('button', { name: '洗濯を削除する' }));

        expect(onDelete).toHaveBeenCalledWith(task);
    });

    it('タイトルが詳細ページへのリンクになっている', () => {
        render(
            <MemoryRouter>
                <TaskItem task={task} onToggleDone={vi.fn()} onDelete={vi.fn()} />
            </MemoryRouter>,
        );

        expect(screen.getByRole('link', { name: '洗濯' })).toHaveAttribute(
            'href',
            `/todos/${task.id}`,
        );
    });
});
