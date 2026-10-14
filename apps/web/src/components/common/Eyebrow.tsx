import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

type EyebrowProps = {
    /** ラベル（例: "01 — ABOUT"） */
    children: ReactNode;
    className?: string;
};

/**

セクション見出しの上に置く「短い横線 + 小さな英字ラベル」。

@param props children（ラベル）、className（追加のクラス）
@return アイブロウのJSX

**/
export function Eyebrow({ children, className }: EyebrowProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 text-xs font-semibold tracking-[.16em]',
                className,
            )}
        >
            <span className="inline-block h-px w-6 bg-ink" />
            <span>{children}</span>
        </div>
    );
}
