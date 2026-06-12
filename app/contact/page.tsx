import type { Metadata } from "next";
import ContactForm from "@/components/parts/contact/ContactForm";
import ContactInfo from "@/components/parts/contact/ContactInfo";
import FAQ from "@/components/parts/contact/FAQ";
import SectionHeading from "@/components/parts/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Karynosの資料請求・導入のご相談・取材のお問い合わせはこちらから。",
};

const ContactPage = () => {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div>
            <SectionHeading
              className="animate-k-rise"
              as="h1"
              eyebrow="Contact"
              title="まずは、お気軽に。"
              lead="資料請求・導入のご相談・取材など、どんなことでもお問い合わせください。学校現場での活用に合わせて、丁寧にご案内します。"
            />
            <div className="mt-10">
              <ContactInfo />
            </div>
            <div className="mt-10">
              <FAQ />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
