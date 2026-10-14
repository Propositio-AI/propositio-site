import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

/** 下層ページのヘッダーで現在地として強調するナビ項目 */
export type HeaderCurrent = 'activities' | 'privacy' | 'contact';

type SiteHeaderProps = {
    /** home: トップページ（固定表示・ページ内アンカー） / page: 下層ページ（sticky・ページリンク） */
    variant: 'home' | 'page';
    /** 下層ページで現在地として強調する項目 */
    current?: HeaderCurrent;
};

const HOME_ANCHORS = [
    { href: '#about', label: 'About' },
    { href: '#scenes', label: 'Scenes' },
    { href: '#mission', label: 'Mission' },
    { href: '#principles', label: 'Principles' },
    { href: '#activities', label: 'Activities' },
];

const PAGE_LINKS: { to: string; label: string; key?: HeaderCurrent }[] = [
    { to: '/', label: 'Top' },
    { to: '/activities', label: 'Activities', key: 'activities' },
    { to: '/privacy', label: 'Privacy', key: 'privacy' },
];

const NAV_LINK_CLASS = 'text-ink no-underline transition-colors hover:text-accent';

/**

サイト共通のヘッダー。ロゴ、ナビゲーション、お問い合わせボタンを持つ。
トップページではページ内のセクションへのアンカー、下層ページでは各ページへのリンクを表示する。
狭い画面ではナビゲーションを隠し、ロゴとお問い合わせボタンだけにする（各ページへのリンクはフッターにある）。

@param props variant（トップ用か下層用か）、current（下層ページで強調する現在地）
@return ヘッダーのJSX

**/
export function SiteHeader({ variant, current }: SiteHeaderProps) {
    const isHome = variant === 'home';
    return (
        <header
            data-header=""
            className={cn(
                'top-0 z-50 flex items-center justify-between gap-5 border-b-2 border-ink bg-white/88 px-gutter py-3 backdrop-blur-[10px]',
                isHome ? 'fixed right-0 left-0' : 'sticky',
            )}
        >
            {isHome ? (
                <a href="#top" className="flex shrink-0 items-center gap-2.5 text-ink no-underline">
                    <Brand />
                </a>
            ) : (
                <Link to="/" className="flex shrink-0 items-center gap-2.5 text-ink no-underline">
                    <Brand />
                </Link>
            )}
            <nav
                aria-label="メインナビゲーション"
                className="hidden min-w-0 flex-nowrap gap-[clamp(12px,2vw,32px)] overflow-x-auto text-[13px] font-semibold tracking-[.04em] whitespace-nowrap md:flex"
            >
                {isHome
                    ? HOME_ANCHORS.map((a) => (
                          <a key={a.href} href={a.href} className={NAV_LINK_CLASS}>
                              {a.label}
                          </a>
                      ))
                    : PAGE_LINKS.map((l) => (
                          <Link
                              key={l.to}
                              to={l.to}
                              aria-current={l.key && l.key === current ? 'page' : undefined}
                              className={cn(
                                  NAV_LINK_CLASS,
                                  l.key && l.key === current && 'text-accent',
                              )}
                          >
                              {l.label}
                          </Link>
                      ))}
            </nav>
            {current === 'contact' ? (
                <span className="btn btn-primary pointer-events-none">お問い合わせ</span>
            ) : (
                <Link className="btn btn-primary" to="/contact" data-magnetic="">
                    お問い合わせ →
                </Link>
            )}
        </header>
    );
}

/**

ロゴ画像・組織名・事業名を横に並べたブランド表示。

@param なし
@return ブランド表示のJSX

**/
function Brand() {
    return (
        <>
            <img src="/images/brand/logo.png" alt="" className="size-[34px]" />
            <span className="text-[19px] font-extrabold tracking-[-.02em] whitespace-nowrap">
                Propositio AI
            </span>
            <span className="hidden border-l border-neutral-300 pl-2.5 text-xs font-semibold tracking-[.08em] whitespace-nowrap text-neutral-600 sm:inline">
                Karynos
            </span>
        </>
    );
}
