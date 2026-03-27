'use client';
import { useState } from "react";
import Navigation from "../parts/Navigation";
import { Button } from "@/components/ui/button";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="border-b border-gray-300 bg-white p-2 relative z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Propositio AI Logo" className="h-7" />
            <h1 className="text-sm sm:text-lg md:text-xl font-bold">Propositio AI</h1>
          </div>
          {/* ハンバーガーボタン */}
          <Button variant="outline" size="icon" aria-label="Submit" className="md:hidden"
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

      {/* オーバーレイ */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  )
}

export default Header
