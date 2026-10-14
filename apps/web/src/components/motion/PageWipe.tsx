import { cn } from '@/lib/utils';

/** ワイプの向き。vertical: 上下2段が縦に縮む / horizontal: 左右2列が横に縮む */
export type WipeDirection = 'vertical' | 'horizontal';

type PageWipeProps = {
    direction: WipeDirection;
    /** 縮む基準点（transform-origin） */
    origin: 'top' | 'bottom' | 'right';
    /** 2枚のパネルの並び。trueならインク色が先 */
    inkFirst?: boolean;
};

/**

ページ表示時に画面を覆い、2枚のパネルが順に縮んで本文を見せる遷移演出のパネル。
アニメーション自体は usePageIntro が [data-wipe] / [data-wp] を対象に再生する。

@param props direction（縮む向き）、origin（縮む基準点）、inkFirst（インク色のパネルを先にするか）
@return ワイプ用パネルのJSX

**/
export function PageWipe({ direction, origin, inkFirst = false }: PageWipeProps) {
    const panels = inkFirst ? ['bg-ink', 'bg-surface'] : ['bg-surface', 'bg-ink'];
    return (
        <div
            data-wipe=""
            aria-hidden="true"
            className={cn(
                'pointer-events-none fixed inset-0 z-[100] flex',
                direction === 'vertical' ? 'flex-col' : 'flex-row',
            )}
        >
            {panels.map((bg) => (
                <div
                    key={bg}
                    data-wp=""
                    className={cn('flex-1', bg)}
                    style={{ transformOrigin: origin }}
                />
            ))}
        </div>
    );
}
