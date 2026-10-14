import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import type { WipeDirection } from './PageWipe';
import type { RefObject } from 'react';

type PageIntroOptions = {
    /** PageWipeの向き（縮むときのscale軸を決める） */
    direction: WipeDirection;
    /** 見出しの入り方。chars: [data-title]内の[data-char]が下から / fade: [data-title]がフェードイン */
    title?: 'chars' | 'fade' | 'none';
    /** 追加で順に表示する要素のセレクタ */
    extra?: string;
    /** 演出の完了時に呼ばれる */
    onComplete?: () => void;
};

/**

下層ページ共通の入場演出（ワイプ → 見出し → [data-in]要素の順に表示）を再生するUI用フック。
「視差効果を減らす」設定の場合はワイプを即座に消し、演出を省略する。

@param rootRef 演出の対象範囲となるルート要素、options 演出の設定
@return なし

**/
export function usePageIntro(rootRef: RefObject<HTMLElement | null>, options: PageIntroOptions) {
    const { direction, title = 'chars', extra, onComplete } = options;

    useGSAP(
        () => {
            if (prefersReducedMotion()) {
                gsap.set('[data-wipe]', { display: 'none' });
                onComplete?.();
                return;
            }
            const scale = direction === 'vertical' ? { scaleY: 0 } : { scaleX: 0 };
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete });
            tl.to('[data-wp]', { ...scale, duration: 1, stagger: 0.1, ease: 'expo.inOut' }).set(
                '[data-wipe]',
                { display: 'none' },
            );
            if (title === 'chars') {
                tl.from(
                    '[data-title] [data-char]',
                    { yPercent: 110, rotate: 8, duration: 1.3, stagger: 0.05 },
                    '<-0.3',
                );
            } else if (title === 'fade') {
                tl.from('[data-title]', { yPercent: 60, opacity: 0, duration: 1.2 }, '<-0.3');
            }
            tl.from(
                '[data-in]',
                { y: 40, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' },
                title === 'none' ? '<-0.3' : '<0.2',
            );
            if (extra) {
                tl.from(
                    extra,
                    {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.06,
                        clearProps: 'transform,opacity',
                    },
                    '<0.1',
                );
            }
        },
        { scope: rootRef },
    );
}
