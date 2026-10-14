import { useRef } from 'react';

import { gsap, isCoarsePointer, useGSAP } from '@/lib/gsap';

/**

マウスに追従する円形のカスタムカーソル（リング + ドット）。
リンク・ボタン・カードの上ではリングが拡大する。タッチ端末では表示しない。

@param なし
@return カーソルのJSX

**/
export function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const ring = ringRef.current;
        const dot = dotRef.current;
        if (!ring || !dot) return;
        if (isCoarsePointer()) {
            gsap.set([ring, dot], { display: 'none' });
            return;
        }
        gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
        const dx = gsap.quickTo(dot, 'x', { duration: 0.12 });
        const dy = gsap.quickTo(dot, 'y', { duration: 0.12 });
        const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
        const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
        let hovering = false;

        /**

        マウス位置へカーソルを移動し、操作可能な要素の上ではリングを拡大する。

        @param e マウス移動イベント
        @return なし

        **/
        const onMove = (e: MouseEvent) => {
            dx(e.clientX);
            dy(e.clientY);
            rx(e.clientX);
            ry(e.clientY);
            const over = e.target instanceof Element && !!e.target.closest('a, button, article');
            if (over !== hovering) {
                hovering = over;
                gsap.to(ring, {
                    scale: over ? 1.9 : 1,
                    backgroundColor: over ? 'rgba(14,17,22,0.05)' : 'rgba(14,17,22,0)',
                    duration: 0.35,
                    overwrite: 'auto',
                });
            }
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    });

    return (
        <>
            <div
                ref={ringRef}
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[200] size-11 rounded-full border border-ink"
            />
            <div
                ref={dotRef}
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[201] size-1.5 rounded-full bg-ink"
            />
        </>
    );
}
