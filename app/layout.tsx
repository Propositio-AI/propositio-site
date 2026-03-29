import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Propositio AI",
  description: "Propositio AIのホームページです．",
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
      className={`${notoSansJp.variable} h-full antialiased`}
    >
      <body className={`${notoSansJp.className} min-h-full flex flex-col`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
