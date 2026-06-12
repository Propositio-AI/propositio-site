'use client';
import { useEffect, useState } from "react";
import Navigation from "../parts/Navigation";
import NavigationForMobile from "../parts/NavigationForMobile";
import Logo from "../parts/Logo";
import PillLink from "../parts/PillLink";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { body, documentElement } = document;

    if (isOpen) {
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
      documentElement.style.overflow = "";
    }

    return () => {
      body.style.overflow = "";
      documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/5 bg-gray-100/80 backdrop-blur-md backdrop-saturate-150">
      <div className="relative">
        <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between gap-6 px-5 md:px-10">
          <Logo />
          {/* PC用ナビゲーション */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Navigation />
            <PillLink href="/contact" size="md" className="shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)]">
              資料を請求
            </PillLink>
          </div>
          {/* ハンバーガーボタン */}
          <Button
            variant="outline"
            size="icon"
            aria-label="メニューを開閉"
            className="relative z-50 size-10 rounded-xl md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <RxCross1 /> : <RxHamburgerMenu />}
          </Button>
        </div>
        {/* モバイル用ナビゲーション */}
        <div
          className={`absolute left-0 top-full w-full bg-gray-100 md:hidden transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
          <NavigationForMobile isOpen={isOpen} onNavigate={() => setIsOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;
