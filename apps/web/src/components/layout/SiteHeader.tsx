import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import './SiteHeader.css';

/** 下層ページのヘッダーで現在地として強調するナビ項目 */
export type HeaderCurrent = 'activities' | 'privacy' | 'contact';

type SiteHeaderProps = {
    /** home: トップページ（固定表示・ページ内アンカー） / page: 下層ページ（sticky・ページリンク） */
    variant: 'home' | 'page';
    /** 下層ページで現在地として強調する項目 */
    current?: HeaderCurrent;
};

const HOME_ANCHORS = [
    { href: '#questions', label: '自分への問い' },
    { href: '#issue', label: '向き合う課題' },
    { href: '#dialogue', label: '対話の研究' },
    { href: '#work', label: '現在の活動' },
    { href: '#about', label: 'Karynosについて' },
];

const PAGE_LINKS: { to: string; label: string; key?: HeaderCurrent }[] = [
    { to: '/', label: 'トップ' },
    { to: '/activities', label: '活動記録', key: 'activities' },
    { to: '/privacy', label: 'プライバシー', key: 'privacy' },
];

const NAV_LINK_CLASS = 'text-ink no-underline transition-colors hover:text-accent';

/**

サイト共通のヘッダー。ロゴ、ナビゲーション、お問い合わせボタンを持つ。
トップページではページ内のセクションへのアンカー、下層ページでは各ページへのリンクを表示する。
狭い画面では開閉できるメニューから各セクション・ページへ移動する。

@param props variant（トップ用か下層用か）、current（下層ページで強調する現在地）
@return ヘッダーのJSX

**/
export function SiteHeader({ variant, current }: SiteHeaderProps) {
    const isHome = variant === 'home';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    return (
        <header
            data-header=""
            data-variant={variant}
            onKeyDown={(event) => {
                if (event.key === 'Escape' && menuOpen) {
                    setMenuOpen(false);
                    menuButton.current?.focus();
                }
            }}
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
                className="hidden min-w-0 flex-nowrap gap-[clamp(12px,2vw,32px)] text-[13px] font-semibold tracking-[.04em] whitespace-nowrap xl:flex"
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
            <div className="flex items-center gap-2">
                {current === 'contact' ? (
                    <span className="btn btn-primary pointer-events-none hidden sm:inline-flex">
                        お問い合わせ
                    </span>
                ) : (
                    <Link
                        className="btn btn-primary hidden min-h-11 sm:inline-flex"
                        to="/contact"
                        data-magnetic=""
                    >
                        お問い合わせ →
                    </Link>
                )}
                <button
                    ref={menuButton}
                    type="button"
                    aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex size-11 cursor-pointer items-center justify-center border border-divider transition-colors hover:bg-surface xl:hidden"
                >
                    <span className="menu-icon" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </span>
                </button>
            </div>
            <nav
                id="mobile-navigation"
                aria-label="モバイルナビゲーション"
                aria-hidden={!menuOpen}
                inert={!menuOpen}
                data-open={menuOpen}
                className="site-mobile-menu absolute inset-x-0 top-full border-b-2 border-ink bg-paper"
            >
                <div className="menu-clip">
                    <div className="menu-content px-gutter py-4">
                        {isHome
                            ? HOME_ANCHORS.map((item) => (
                                  <a
                                      key={item.href}
                                      href={item.href}
                                      onClick={() => setMenuOpen(false)}
                                      className="block border-b border-neutral-200 py-4 text-sm font-semibold transition-colors hover:text-accent"
                                  >
                                      {item.label}
                                  </a>
                              ))
                            : PAGE_LINKS.map((item) => (
                                  <Link
                                      key={item.to}
                                      to={item.to}
                                      onClick={() => setMenuOpen(false)}
                                      aria-current={item.key === current ? 'page' : undefined}
                                      className="block border-b border-neutral-200 py-4 text-sm font-semibold transition-colors hover:text-accent"
                                  >
                                      {item.label}
                                  </Link>
                              ))}
                        {isHome && (
                            <Link
                                to="/activities"
                                onClick={() => setMenuOpen(false)}
                                className="block py-4 text-sm font-semibold transition-colors hover:text-accent"
                            >
                                活動記録
                            </Link>
                        )}
                        <Link
                            to="/contact"
                            onClick={() => setMenuOpen(false)}
                            aria-current={current === 'contact' ? 'page' : undefined}
                            className="block py-4 text-sm font-semibold text-accent sm:hidden"
                        >
                            お問い合わせ →
                        </Link>
                    </div>
                </div>
            </nav>
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
                Karynos
            </span>
            <span className="hidden border-l border-neutral-300 pl-2.5 text-xs font-semibold tracking-[.08em] whitespace-nowrap text-neutral-600 sm:inline">
                Propositio AI
            </span>
        </>
    );
}
