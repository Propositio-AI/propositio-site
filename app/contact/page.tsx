import type { Metadata } from "next";
import ToHomePageButton from "@/components/parts/ToHomePageButton";
import ContactForm from "@/components/parts/contact/ContactForm";
import ContactInfo from "@/components/parts/contact/ContactInfo";
import FAQ from "@/components/parts/contact/FAQ";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Propositio AIのお問い合わせページです。",
};

const ContactPage = () => {
  return (
    <main className="mt-30 md:mt-40 w-full px-4 md:px-15">
      <div className="text-center px-6 md:px-15 border-b border-gray-200 pb-10 mb-10">
        <h1 className="font-bold text-2xl md:text-5xl mb-2 md:mb-4">お問い合わせ</h1>
        <p className="text-muted-foreground text-sm md:text-base">ご質問、ご相談などございましたら、お気軽にお問い合わせください。</p>
      </div>
      <div className="flex flex-col gap-4 md:flex-row-reverse">
        <div className="w-full md:w-1/2">
          <ContactForm />
        </div>
        <div className="w-full p-4 space-y-4 md:w-1/2 md:px-10">
          <ContactInfo />
          <FAQ />
        </div>
      </div>

      <ToHomePageButton />
    </main>
  )
}

export default ContactPage
