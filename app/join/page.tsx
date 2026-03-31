import { TopSection, MissionSection, PositionSection, MeritSection, ApplicationFormSection } from "@/components/section/join";
import type { Metadata } from "next";
import ToHomePageButton from "@/components/parts/ToHomePageButton";

export const metadata: Metadata = {
  title: "参加募集",
  description: "Propositio AIのメンバー募集ページです。",
};

const JoinPage = () => {
  return (
    <main className="mt-30 md:mt-40 w-full">
      <TopSection />
      <MissionSection />
      <PositionSection />
      <MeritSection />
      <ApplicationFormSection />
      <ToHomePageButton />
    </main>
  )
}

export default JoinPage
