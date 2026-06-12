import SocialLinks from "@/components/parts/SocialLinks";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/navigation";

type NavigationForMobileProps = {
  onNavigate?: () => void;
  isOpen?: boolean;
};

const NavigationForMobile = ({ onNavigate, isOpen }: NavigationForMobileProps) => {
  const itemClass = (open?: boolean) =>
    `flex justify-between py-3 text-2xl font-bold font-heading transition-all duration-500
    ${open ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`;

  return (
    <nav className="mt-10 flex h-screen flex-col px-6">
      <div className="mb-20 flex flex-col">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={itemClass(isOpen)} onClick={onNavigate}>
            {label}
            <GoArrowRight />
          </Link>
        ))}
      </div>
      <div>
        <Link
          href="/contact"
          className={`mb-4 flex justify-between text-base transition-all duration-1000
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          onClick={onNavigate}
        >
          資料を請求する
        </Link>
        <div
          className={`mb-4 flex justify-between text-base transition-all duration-1000
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          <SocialLinks />
        </div>
      </div>
    </nav>
  );
};

export default NavigationForMobile;
