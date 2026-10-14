import { cn } from '@/lib/utils';

import type { CategoryResponse, ThumbnailResponse } from '@repo/api-client';

type ActivityThumbProps = {
    thumbnail: ThumbnailResponse | null | undefined;
    category: CategoryResponse | null | undefined;
    /** 描画する画像の幅（microCMSの画像APIで縮小して取得する） */
    width: number;
    /** 画像が無い場合に表示するカテゴリ名の文字サイズ */
    size?: 'md' | 'lg';
    /** 親要素のホバーで画像を拡大するか（親に group クラスが必要） */
    zoomOnHover?: boolean;
};

/**

活動記録のサムネイル。画像が無い場合はカテゴリ名を大きく薄く表示する。

@param props thumbnail（画像）、category（カテゴリ）、width（取得幅）、size（代替表示の文字サイズ）、zoomOnHover（ホバー拡大）
@return サムネイルのJSX（親の枠いっぱいに広がる）

**/
export function ActivityThumb({
    thumbnail,
    category,
    width,
    size = 'md',
    zoomOnHover,
}: ActivityThumbProps) {
    return (
        <div
            className={cn(
                'absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)]',
                zoomOnHover && 'group-hover:scale-[1.06]',
            )}
        >
            {thumbnail ? (
                <img
                    src={`${thumbnail.url}?w=${width}&fm=webp`}
                    alt=""
                    loading="lazy"
                    width={thumbnail.width ?? undefined}
                    height={thumbnail.height ?? undefined}
                    className="size-full object-cover"
                />
            ) : (
                <div
                    aria-hidden="true"
                    className={cn(
                        'absolute inset-0 flex items-end font-bold tracking-[-.02em] text-neutral-300',
                        size === 'lg'
                            ? 'p-6 text-[clamp(36px,5vw,72px)]'
                            : 'p-[18px] text-[clamp(28px,3vw,44px)]',
                    )}
                >
                    {category?.name}
                </div>
            )}
        </div>
    );
}
