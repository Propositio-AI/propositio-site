import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TaskForm } from '@/components/task/TaskForm';

describe('TaskForm', () => {
    it('入力したタイトルでonSubmitを呼び、入力欄をクリアする', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<TaskForm onSubmit={onSubmit} isSubmitting={false} />);

        const input = screen.getByLabelText('新しいタスクのタイトル');
        await user.type(input, '牛乳を買う');
        await user.click(screen.getByRole('button', { name: '追加' }));

        expect(onSubmit).toHaveBeenCalledWith('牛乳を買う');
        expect(input).toHaveValue('');
    });

    it('空文字のときはonSubmitを呼ばない', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<TaskForm onSubmit={onSubmit} isSubmitting={false} />);

        await user.click(screen.getByRole('button', { name: '追加' }));

        expect(onSubmit).not.toHaveBeenCalled();
    });
});
