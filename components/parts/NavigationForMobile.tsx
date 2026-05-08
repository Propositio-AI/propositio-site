import SocialLinks from "@/components/parts/SocialLinks";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";

type NavigationForMobileProps = {
  onNavigate?: () => void;
  isOpen?: boolean;
};

const NavigationForMobile = ({ onNavigate, isOpen }: NavigationForMobileProps) => {
  return (
    <nav className="h-screen flex flex-col mt-10 px-6">
      <div className="flex flex-col mb-20">
        <Link
          href="/#products"
          className={`
            flex justify-between text-2xl font-bold py-3
            transition-all duration-500
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}
          onClick={onNavigate}
        >
          Products
          <GoArrowRight />
        </Link>
        <Link
          href="/#about"
          className={`
            flex justify-between text-2xl font-bold py-3
            transition-all duration-500
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}
          onClick={onNavigate}
        >
          About
          <GoArrowRight />
        </Link>
        <Link
          href="/#blog"
          className={`
            flex justify-between text-2xl font-bold py-3
            transition-all duration-500
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}
          onClick={onNavigate}
        >
          Blog
          <GoArrowRight />
        </Link>
        <Link
          href="/#members"
          className={`
            flex justify-between text-2xl font-bold py-3
            transition-all duration-500
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}
          onClick={onNavigate}
        >
          Members
          <GoArrowRight />
        </Link>
        <Link
          href="/#join"
          className={`
            flex justify-between text-2xl font-bold py-3
            transition-all duration-500
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}
          onClick={onNavigate}
        >
          Join
          <GoArrowRight />
        </Link>
      </div>
      <div>
        <Link
          href="/contact"
          className={`
            flex justify-between text-base mb-4
            transition-all duration-1000
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}
          onClick={onNavigate}
        >
          お問い合わせ
        </Link>
        <div
          className={`
            flex justify-between text-base mb-4
            transition-all duration-1000
            ${isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
            }
          `}>
          <SocialLinks />
        </div>
      </div>
    </nav>
  )
}

export default NavigationForMobile
