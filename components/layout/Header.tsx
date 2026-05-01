'use client';
import { useState } from "react";
import Navigation from "../parts/Navigation";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="fixed top-0 left-0 w-full border-b border-gray-300 bg-white z-50">
        <div className="mx-auto flex items-stretch justify-between">
          <div className="flex items-center gap-3 py-2 md:py-4 ml-4 md:ml-8">
            <Image src="/logo.png" alt="Propositio AI Logo" width={45} height={20} className="w-14" />
            <h1 className="text-lg md:text-3xl font-extrabold">Propositio AI</h1>
          </div>
          {/* ハンバーガーボタン */}
          <Button variant="outline" size="icon" aria-label="Submit" className="md:hidden my-auto mr-4"
            onClick={() => setIsOpen(!isOpen)}>
            <RxHamburgerMenu />
          </Button>
          {/* PC用ナビゲーション */}
          <div className="hidden md:block">
            <Navigation />
          </div>
        </div>
        {/* モバイル用ナビゲーション */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden 
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <Navigation />
        </div>
      </header>
    </>
  )
}

export default Header
