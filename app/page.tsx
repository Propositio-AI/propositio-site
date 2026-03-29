import { HeroSection, AboutSection, KarynosIntroSection, MemberIntroSection, JoinSection } from '@/components/section/home';
export default function Home() {
  return (
  <main className="w-full">
    <HeroSection/>
    <AboutSection />
    <KarynosIntroSection />
    <MemberIntroSection />
    <JoinSection />
  </main>
  );
}
