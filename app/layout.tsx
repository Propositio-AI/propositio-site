import type { Metadata } from "next";
import { Noto_Sans_JP, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { Toaster } from "sonner";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Karynos | キャリアと学習を接続するAIプラットフォーム",
    template: "%s | Karynos",
  },
  description:
    "Karynosは、AIが生徒一人ひとりの夢と日々の学習を接続するキャリア学習プラットフォームです。Propositio AIが提供しています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-scroll-behavior="smooth"
      className={`${notoSansJp.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className={`${notoSansJp.className} min-h-full flex flex-col`}>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
