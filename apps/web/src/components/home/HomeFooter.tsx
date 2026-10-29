import { Link } from 'react-router-dom';

import { formatDate } from '@/lib/format';

const LINK_CLASS = 'text-ink no-underline transition-colors hover:text-accent';

/**

トップページ用のフッター（ロゴ・主要リンク・Instagram・コピーライト）。

@param props lastUpdatedAt（「最終更新」に表示する日時。ISO 8601形式。未取得なら非表示）
@return フッターのJSX

**/
export function HomeFooter({ lastUpdatedAt }: { lastUpdatedAt?: string }) {
    return (
        <footer className="flex flex-col gap-10 border-t border-divider px-gutter pt-[clamp(40px,5vw,64px)] pb-7">
            <div className="flex flex-wrap justify-between gap-8">
                <div className="flex items-center gap-4">
                    <img src="/images/brand/logo.png" alt="" className="size-12" />
                    <span className="text-[22px] font-extrabold tracking-[-.02em]">
                        Propositio AI
                    </span>
                </div>
                <div className="flex flex-wrap gap-7 text-sm font-semibold">
                    <Link to="/activities" className={LINK_CLASS}>
                        活動記録
                    </Link>
                    <Link to="/privacy" className={LINK_CLASS}>
                        プライバシーポリシー
                    </Link>
                    <a
                        href="https://www.instagram.com/propositio_ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={LINK_CLASS}
                    >
                        Instagram
                    </a>
                    <Link to="/contact" className={LINK_CLASS}>
                        お問い合わせ
                    </Link>
                </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4 text-xs font-semibold tracking-[.06em] text-neutral-700">
                <span>© 2026 Propositio AI</span>
                {lastUpdatedAt && <span>最終更新 {formatDate(lastUpdatedAt)}</span>}
            </div>
        </footer>
    );
}
