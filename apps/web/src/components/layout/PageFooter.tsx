import { Link } from 'react-router-dom';

type PageFooterProps = {
    /** 右側に並べるリンク */
    links: { to: string; label: string }[];
};

/**

下層ページ用の簡易フッター（コピーライト + リンク）。

@param props links（右側に並べるリンク）
@return フッターのJSX

**/
export function PageFooter({ links }: PageFooterProps) {
    return (
        <footer className="flex flex-wrap justify-between gap-4 border-t-2 border-ink px-gutter py-7 text-xs font-semibold tracking-[.06em] text-neutral-700">
            <span>© 2026 Propositio AI</span>
            <div className="flex gap-5">
                {links.map((l) => (
                    <Link key={l.to} to={l.to} className="text-ink no-underline hover:text-accent">
                        {l.label}
                    </Link>
                ))}
            </div>
        </footer>
    );
}
