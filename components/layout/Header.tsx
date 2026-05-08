'use client';
import { useEffect, useState } from "react";
import Navigation from "../parts/Navigation";
import NavigationForMobile from "../parts/NavigationForMobile";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";

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
    <>
      <header className="fixed top-0 left-0 w-full border-b border-gray-300 bg-white z-50">
        <div className="relative">
          <div className="mx-auto flex items-stretch justify-between">
            <div className="flex items-center gap-1 md:gap-3 py-2 md:py-4 ml-4 md:ml-8">
              <Image src="/logo.png" alt="Propositio AI Logo" width={45} height={20} className="w-14" />
              <h1 className="text-xl md:text-3xl font-extrabold">Propositio AI</h1>
            </div>
            {/* ハンバーガーボタン */}
            <Button variant="outline" size="icon" aria-label="Submit" className="relative z-50 md:hidden my-auto mr-4 w-10 h-10"
              onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <RxCross1 /> : <RxHamburgerMenu />}
            </Button>
            {/* PC用ナビゲーション */}
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>
          {/* モバイル用ナビゲーション */}
          <div
            className={`absolute left-0 top-full w-full bg-white md:hidden transition-all duration-300 ease-in-out
            ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <NavigationForMobile isOpen={isOpen} onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
