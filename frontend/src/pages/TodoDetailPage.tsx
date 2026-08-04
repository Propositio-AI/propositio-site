import { Link, useNavigate, useParams } from 'react-router-dom';

import { TaskDetailForm } from '@/components/task/TaskDetailForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTask } from '@/hooks/useTask';

/**

タスク詳細ページ。useTaskフックから状態と操作関数を取得し、
TaskDetailFormへpropsとして渡すだけの composition 層。
業務ロジックやAPI呼び出しは一切持たない。

@param なし
@return タスク詳細ページのJSX

**/
export function TodoDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { task, isLoading, isError, updateTask, isUpdating, deleteTask } = useTask(id ?? '');

    const handleSave = (title: string, description: string) => {
        void updateTask({ title, description });
    };

    const handleToggleDone = () => {
        if (!task) return;
        void updateTask({ is_done: !task.is_done });
    };

    const handleDelete = () => {
        void deleteTask().then(() => navigate('/'));
    };

    return (
        <main className="mx-auto max-w-2xl p-8">
            <Link
                to="/"
                className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
            >
                ← タスク一覧に戻る
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>タスク詳細</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading && <p className="text-muted-foreground">読み込み中...</p>}
                    {isError && <p className="text-destructive">タスクの取得に失敗しました。</p>}
                    {task && (
                        <TaskDetailForm
                            task={task}
                            onSave={handleSave}
                            onToggleDone={handleToggleDone}
                            onDelete={handleDelete}
                            isSaving={isUpdating}
                        />
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
