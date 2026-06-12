import type { Metadata } from "next";
import SectionHeading from "@/components/parts/SectionHeading";
import {
  ValuesSection,
  PositionsSection,
  ApplicationFormSection,
} from "@/components/section/join";

export const metadata: Metadata = {
  title: "Join",
  description: "Karynosを共につくる仲間を募集しています。",
};

const JoinPage = () => {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:px-10 md:pt-24">
        <SectionHeading
          className="animate-k-rise"
          as="h1"
          eyebrow="Join Us"
          title={
            <>
              「やらされる学び」を、
              <br />
              終わらせにいく。
            </>
          }
          lead="教育を、テクノロジーで本気で変える。Karynosは、生徒の“今”と未来をつなぐプロダクトを共につくる仲間を探しています。"
        />
      </section>
      <ValuesSection />
      <PositionsSection />
      <div id="application" className="pb-24 md:pb-32">
        <ApplicationFormSection />
      </div>
    </main>
  );
};

export default JoinPage;
