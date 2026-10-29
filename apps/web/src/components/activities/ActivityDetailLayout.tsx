import { PageFooter } from '@/components/layout/PageFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

import type { ReactNode } from 'react';

/**

記事詳細ページの枠（読了プログレスバー・ヘッダー・中央寄せの本文領域・フッター）。

@param props children（本文領域に表示する内容。記事本文、または読み込み中・エラーの表示）
@return 記事詳細ページの枠のJSX

**/
export function ActivityDetailLayout({ children }: { children: ReactNode }) {
    return (
        <div className="inner-page relative flex min-h-screen flex-col overflow-x-clip bg-paper text-ink">
            <div
                data-progress=""
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-[60] h-0.5 bg-accent"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
            />
            <SiteHeader variant="page" current="activities" />
            <main className="flex flex-1 flex-col items-center px-gutter pt-[clamp(48px,7vw,96px)] pb-[clamp(64px,8vw,120px)]">
                {children}
            </main>
            <PageFooter
                links={[
                    { to: '/', label: 'トップ' },
                    { to: '/privacy', label: 'プライバシーポリシー' },
                ]}
            />
        </div>
    );
}

/**

記事詳細ページの読み込み中・エラー時に本文領域へ表示するメッセージ。

@param props children（メッセージ）
@return メッセージのJSX

**/
export function ActivityDetailMessage({ children }: { children: ReactNode }) {
    return (
        <div className="soft-panel flex w-full max-w-[840px] flex-col gap-6 text-base leading-[1.9]">
            {children}
        </div>
    );
}
