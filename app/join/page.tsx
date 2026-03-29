import { TopSection, MissionSection, PositionSection, MeritSection, JoinFormSection } from "@/components/section/join";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "参加募集",
  description: "Propositio AIのメンバー募集ページです。",
};

const joinPage = () => {
  return (
    <main className="mt-30 md:mt-40 w-full">
      <TopSection />
      <MissionSection />
      <PositionSection />
      <MeritSection />
      <JoinFormSection />
    </main>
  )
}

export default joinPage
