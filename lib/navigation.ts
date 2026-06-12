export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "トップ" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/members", label: "Member" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_PAGE_LINKS: NavLink[] = [
  { href: "/", label: "トップ" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/members", label: "Member" },
];

export const FOOTER_CONNECT_LINKS: NavLink[] = [
  { href: "/join", label: "採用情報" },
  { href: "/contact", label: "お問い合わせ" },
];
