import { Link } from 'react-router-dom';

import { Eyebrow } from '@/components/common/Eyebrow';
import { PageFooter } from '@/components/layout/PageFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

/**

存在しないURLにアクセスしたときのページ。

@param なし
@return 404ページのJSX

**/
export function NotFoundPage() {
    return (
        <div className="inner-page flex min-h-screen flex-col bg-paper text-ink">
            <SiteHeader variant="page" />
            <main className="flex flex-1 flex-col gap-6 px-gutter py-[clamp(64px,9vw,120px)]">
                <Eyebrow>404 — NOT FOUND</Eyebrow>
                <h1 className="m-0 text-[clamp(44px,8vw,120px)] leading-[1.2] tracking-[-.05em]">
                    Not Found
                </h1>
                <p className="m-0 max-w-[28em] text-base leading-[1.9]">
                    お探しのページは見つかりませんでした。URLが変更されたか、削除された可能性があります。
                </p>
                <Link className="btn btn-secondary self-start" to="/">
                    トップへ戻る →
                </Link>
            </main>
            <PageFooter
                links={[
                    { to: '/', label: 'トップ' },
                    { to: '/activities', label: '活動記録' },
                ]}
            />
        </div>
    );
}
