import { HeroSection, AboutSection, KarynosIntroSection, MemberIntroSection, JoinSection, BlogSection } from '@/components/section/home';
export default function Home() {
  return (
  <main className="w-full">
    <HeroSection/>
    <KarynosIntroSection />
    <AboutSection />
    <BlogSection />
    <MemberIntroSection />
    <JoinSection />
  </main>
  );
}
