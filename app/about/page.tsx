import type { Metadata } from "next";
import SectionHeading from "@/components/parts/SectionHeading";
import {
  MissionVisionSection,
  WhyDreamSection,
  RealProblemSection,
  AnswerSection,
} from "@/components/section/about";

export const metadata: Metadata = {
  title: "About",
  description: "Karynosのミッション・ビジョンと、私たちが教育に向き合う理由を紹介します。",
};

const AboutPage = () => {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:px-10 md:pt-24">
        <SectionHeading
          className="animate-k-rise"
          as="h1"
          eyebrow="About Karynos"
          title="可能性を、すべての人に。"
          lead="生まれ持った環境や既存の教育システムに縛られることなく、全ての若者が自らの可能性を最大化できる。Karynosは、そんな土壌をつくります。"
        />
      </section>
      <MissionVisionSection />
      <WhyDreamSection />
      <RealProblemSection />
      <AnswerSection />
    </main>
  );
};

export default AboutPage;
