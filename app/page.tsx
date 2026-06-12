import {
  HeroSection,
  ProblemSection,
  EvidenceSection,
  SolutionSection,
  ValueSection,
  CtaSection,
} from "@/components/section/home";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <ProblemSection />
      <EvidenceSection />
      <SolutionSection />
      <ValueSection />
      <CtaSection />
    </main>
  );
}
