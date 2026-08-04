import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TaskFormProps = {
    onSubmit: (title: string) => void;
    isSubmitting: boolean;
};

/**

新規タスクのタイトルを入力して送信するだけの純粋なUIコンポーネント。
状態管理はフォーム入力値のみに限定し、送信ロジックは呼び出し元に委譲する。

@param props onSubmit（送信時に呼ばれるコールバック）、isSubmitting（送信中フラグ）
@return タスク作成フォームのJSX

**/
export function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
    const [title, setTitle] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (title.trim() === '') return;
        onSubmit(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="新しいタスクを入力"
                aria-label="新しいタスクのタイトル"
            />
            <Button type="submit" disabled={isSubmitting}>
                追加
            </Button>
        </form>
    );
}
