import { useState } from 'react';

import type { TaskResponse } from '@/api/generated/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TaskDetailFormProps = {
    task: TaskResponse;
    onSave: (title: string, description: string) => void;
    onToggleDone: () => void;
    onDelete: () => void;
    isSaving: boolean;
};

/**

タスク1件の詳細を表示・編集する純粋なUIコンポーネント。
タイトル・説明の編集、完了切り替え、削除の操作はすべて親から渡されたコールバックに委譲する。

@param props task（表示・編集対象のタスク）、onSave（保存時のコールバック）、onToggleDone（完了切り替え時のコールバック）、onDelete（削除時のコールバック）、isSaving（保存中フラグ）
@return タスク詳細フォームのJSX

**/
export function TaskDetailForm({
    task,
    onSave,
    onToggleDone,
    onDelete,
    isSaving,
}: TaskDetailFormProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? '');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (title.trim() === '') return;
        onSave(title, description);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={task.is_done}
                    onChange={onToggleDone}
                    aria-label="完了にする"
                    className="size-4"
                />
                <span className="text-muted-foreground text-sm">
                    {task.is_done ? '完了' : '未完了'}
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-title">タイトル</Label>
                <Input
                    id="task-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-description">説明</Label>
                <textarea
                    id="task-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="flex justify-between gap-2">
                <Button type="button" variant="destructive" onClick={onDelete}>
                    削除
                </Button>
                <Button type="submit" disabled={isSaving}>
                    保存
                </Button>
            </div>
        </form>
    );
}
