import type { ContactStep } from '@/hooks/useContactForm';

const STEPS: { key: ContactStep; num: string; label: string }[] = [
    { key: 'input', num: '01', label: '入力' },
    { key: 'confirm', num: '02', label: '確認' },
    { key: 'done', num: '03', label: '完了' },
];

/**

お問い合わせの進行状況（入力 → 確認 → 完了）を示すリスト。現在の段階の右側の線が伸びる。

@param props step（現在の段階）
@return 進行状況のJSX

**/
export function ContactSteps({ step }: { step: ContactStep }) {
    const current = STEPS.findIndex((s) => s.key === step);
    return (
        <ol className="m-0 flex list-none flex-col border-t-2 border-ink p-0">
            {STEPS.map((s, i) => {
                const reached = i <= current;
                return (
                    <li
                        key={s.key}
                        aria-current={i === current ? 'step' : undefined}
                        className="flex items-center gap-4 border-b border-neutral-300 py-3.5"
                    >
                        <span
                            className={`text-xs font-semibold tracking-[.12em] tabular-nums ${reached ? 'text-ink' : 'text-neutral-400'}`}
                        >
                            {s.num}
                        </span>
                        <span
                            className={`text-base ${reached ? 'text-ink' : 'text-neutral-400'} ${i === current ? 'font-bold' : 'font-medium'}`}
                        >
                            {s.label}
                        </span>
                        <span
                            aria-hidden="true"
                            className="ml-auto h-0.5 bg-ink transition-[width] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                            style={{ width: i === current ? 64 : i < current ? 16 : 0 }}
                        />
                    </li>
                );
            })}
        </ol>
    );
}
