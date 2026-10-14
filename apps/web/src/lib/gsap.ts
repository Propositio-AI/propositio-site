import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/_';

/**

ユーザーがOSの設定で「視差効果を減らす」を有効にしているかを判定する。

@param なし
@return 動きを減らすべきならtrue

**/
export function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**

マウスなどの精密なポインターが無い（タッチ端末）かを判定する。

@param なし
@return タッチ主体の端末ならtrue

**/
export function isCoarsePointer(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
}

/**

要素のテキストを、ランダムな文字から左から順に本来の文字へ確定させるアニメーションを再生する。

@param el 対象の要素、duration 再生時間（秒）、pool ランダム表示に使う文字の集合
@return 再生中のTween

**/
export function scrambleText(
    el: HTMLElement,
    duration = 1.1,
    pool = SCRAMBLE_POOL,
): gsap.core.Tween {
    const final = el.dataset.final ?? el.textContent ?? '';
    el.dataset.final = final;
    const chars = Array.from(final);
    const state = { p: 0 };
    return gsap.to(state, {
        p: 1,
        duration,
        ease: 'none',
        onUpdate: () => {
            const n = Math.floor(state.p * chars.length);
            const rest = chars
                .slice(n)
                .map((c) => (c === ' ' ? ' ' : pool[Math.floor(Math.random() * pool.length)]))
                .join('');
            el.textContent = chars.slice(0, n).join('') + rest;
        },
        onComplete: () => {
            el.textContent = final;
        },
    });
}

export { gsap, ScrollTrigger, useGSAP };
