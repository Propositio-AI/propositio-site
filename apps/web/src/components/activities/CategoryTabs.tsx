import { cn } from '@/lib/utils';

import type { CategoryResponse } from '@repo/api-client';

type CategoryTabsProps = {
    categories: CategoryResponse[];
    /** 選択中のカテゴリID（nullは「すべて」） */
    selectedId: string | null;
    /** カテゴリが選ばれたときのコールバック（nullは「すべて」） */
    onSelect: (id: string | null) => void;
};

/**

活動記録をカテゴリで絞り込むためのボタン列（先頭は「すべて」）。

@param props categories（カテゴリ一覧）、selectedId（選択中のID）、onSelect（選択時のコールバック）
@return カテゴリボタン列のJSX

**/
export function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
    const tabs = [{ id: null, name: 'すべて' }, ...categories];
    return (
        <div role="group" aria-label="カテゴリで絞り込む" className="flex flex-wrap gap-1.5">
            {tabs.map((t) => {
                const selected = t.id === selectedId;
                return (
                    <button
                        key={t.id ?? 'all'}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onSelect(t.id)}
                        className={cn(
                            'cursor-pointer border border-ink px-3.5 py-2 text-[13px] leading-none font-semibold transition-colors hover:border-accent',
                            selected ? 'bg-ink text-paper' : 'bg-transparent text-ink',
                        )}
                    >
                        {t.name}
                    </button>
                );
            })}
        </div>
    );
}
