import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { TaskResponse } from '@/api/generated/models';
import { Button } from '@/components/ui/button';

type TaskItemProps = {
    task: TaskResponse;
    onToggleDone: (task: TaskResponse) => void;
    onDelete: (task: TaskResponse) => void;
};

/**

タスク1件を表示する純粋なUIコンポーネント。
完了チェックボックスと削除ボタンの操作はすべて親から渡されたコールバックに委譲する。

@param props task（表示対象のタスク）、onToggleDone（完了切り替え時のコールバック）、onDelete（削除時のコールバック）
@return タスク1行分のJSX

**/
export function TaskItem({ task, onToggleDone, onDelete }: TaskItemProps) {
    return (
        <li className="flex items-center gap-3 border-b border-border py-2 last:border-0">
            <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => onToggleDone(task)}
                aria-label={`${task.title}を完了にする`}
                className="size-4"
            />
            <Link
                to={`/todos/${task.id}`}
                className={
                    task.is_done
                        ? 'flex-1 text-muted-foreground line-through hover:underline'
                        : 'flex-1 hover:underline'
                }
            >
                {task.title}
            </Link>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`${task.title}を削除する`}
                onClick={() => onDelete(task)}
            >
                <Trash2 className="size-4" />
            </Button>
        </li>
    );
}
