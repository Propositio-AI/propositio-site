import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { TaskResponse } from '@/api/generated/models';
import { TaskDetailForm } from '@/components/task/TaskDetailForm';

const task: TaskResponse = {
    id: '11111111-1111-1111-1111-111111111111',
    title: '洗濯',
    description: '部屋干し',
    is_done: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
};

describe('TaskDetailForm', () => {
    it('タイトル・説明を編集して保存するとonSaveが呼ばれる', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();
        render(
            <TaskDetailForm
                task={task}
                onSave={onSave}
                onToggleDone={vi.fn()}
                onDelete={vi.fn()}
                isSaving={false}
            />,
        );

        const titleInput = screen.getByLabelText('タイトル');
        await user.clear(titleInput);
        await user.type(titleInput, '洗濯物を畳む');
        await user.click(screen.getByRole('button', { name: '保存' }));

        expect(onSave).toHaveBeenCalledWith('洗濯物を畳む', '部屋干し');
    });

    it('チェックボックス操作でonToggleDoneが呼ばれる', async () => {
        const user = userEvent.setup();
        const onToggleDone = vi.fn();
        render(
            <TaskDetailForm
                task={task}
                onSave={vi.fn()}
                onToggleDone={onToggleDone}
                onDelete={vi.fn()}
                isSaving={false}
            />,
        );

        await user.click(screen.getByRole('checkbox'));

        expect(onToggleDone).toHaveBeenCalled();
    });

    it('削除ボタン操作でonDeleteが呼ばれる', async () => {
        const user = userEvent.setup();
        const onDelete = vi.fn();
        render(
            <TaskDetailForm
                task={task}
                onSave={vi.fn()}
                onToggleDone={vi.fn()}
                onDelete={onDelete}
                isSaving={false}
            />,
        );

        await user.click(screen.getByRole('button', { name: '削除' }));

        expect(onDelete).toHaveBeenCalled();
    });
});
