import type { TaskResponse } from '@/api/generated/models';
import { TaskItem } from '@/components/task/TaskItem';

type TaskListProps = {
    tasks: TaskResponse[];
    onToggleDone: (task: TaskResponse) => void;
    onDelete: (task: TaskResponse) => void;
};

/**

タスクの配列をリスト表示するだけの純粋なUIコンポーネント。
1件も無い場合は空状態のメッセージを表示する。

@param props tasks（表示対象のタスク配列）、onToggleDone、onDelete（各行に渡すコールバック）
@return タスク一覧のJSX

**/
export function TaskList({ tasks, onToggleDone, onDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return <p className="text-muted-foreground">タスクはまだありません。</p>;
    }

    return (
        <ul>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleDone={onToggleDone}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
