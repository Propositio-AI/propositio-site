import type { TaskResponse } from '@/api/generated/models';
import { TaskForm } from '@/components/task/TaskForm';
import { TaskList } from '@/components/task/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';

/**

タスク管理ページ。useTasksフックから状態と操作関数を取得し、
UIコンポーネント（TaskForm, TaskList）へpropsとして渡すだけの composition 層。
業務ロジックやAPI呼び出しは一切持たない。

@param なし
@return タスク管理ページのJSX

**/
export function TasksPage() {
    const { tasks, isLoading, isError, createTask, isCreating, updateTask, deleteTask } =
        useTasks();

    const handleToggleDone = (task: TaskResponse) => {
        void updateTask(task.id, { is_done: !task.is_done });
    };

    const handleDelete = (task: TaskResponse) => {
        void deleteTask(task.id);
    };

    const handleCreate = (title: string) => {
        void createTask({ title });
    };

    return (
        <main className="mx-auto max-w-2xl p-8">
            <Card>
                <CardHeader>
                    <CardTitle>タスク</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <TaskForm onSubmit={handleCreate} isSubmitting={isCreating} />
                    {isLoading && <p className="text-muted-foreground">読み込み中...</p>}
                    {isError && <p className="text-destructive">タスクの取得に失敗しました。</p>}
                    {!isLoading && !isError && (
                        <TaskList
                            tasks={tasks}
                            onToggleDone={handleToggleDone}
                            onDelete={handleDelete}
                        />
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
