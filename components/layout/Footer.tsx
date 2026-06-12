import Link from "next/link";
import Logo from "@/components/parts/Logo";
import SocialLinks from "@/components/parts/SocialLinks";
import { FOOTER_PAGE_LINKS, FOOTER_CONNECT_LINKS, type NavLink } from "@/lib/navigation";

const LinkColumn = ({ heading, links }: { heading: string; links: NavLink[] }) => (
  <div>
    <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
      {heading}
    </p>
    <div className="flex flex-col gap-2.5">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-sm text-slate-300 no-underline transition-colors hover:text-white"
        >
          {label}
        </Link>
      ))}
    </div>
  </div>
);

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 pb-10 pt-16 sm:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:pt-20">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-[300px] text-sm leading-relaxed text-slate-400">
            キャリアと日々の学習を接続するAIプラットフォーム。生徒の“今”を、未来とつなぐ。
          </p>
        </div>
        <LinkColumn heading="Pages" links={FOOTER_PAGE_LINKS} />
        <LinkColumn heading="Connect" links={FOOTER_CONNECT_LINKS} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 md:px-10">
          <small className="text-[13px] text-slate-500">
            &copy; {new Date().getFullYear()} Propositio AI. All rights reserved.
          </small>
          <div className="flex items-center gap-4">
            <SocialLinks />
            <span className="hidden font-heading text-[13px] tracking-wide text-slate-500 sm:inline">
              Karynos by Propositio AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
