import { useRef, type ReactNode } from 'react';

import { CustomCursor } from '@/components/motion/CustomCursor';

import { useHomeMotion } from './useHomeMotion';

/**

トップページのルート。子のセクションをまとめ、ページ全体のモーションとカスタムカーソルを適用する。

@param props children（トップページの各セクション）
@return トップページのルート要素のJSX

**/
export function HomeScene({ children }: { children: ReactNode }) {
    const rootRef = useRef<HTMLDivElement>(null);
    useHomeMotion(rootRef);
    return (
        <div ref={rootRef} className="relative overflow-x-clip bg-paper text-ink">
            {children}
            <CustomCursor />
        </div>
    );
}
