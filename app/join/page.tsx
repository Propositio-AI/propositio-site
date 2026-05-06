import { TopSection, MissionSection, PositionSection, MeritSection, ApplicationFormSection } from "@/components/section/join";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoHomeOutline } from "react-icons/io5";

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
      <div className="flex justify-end my-10 md:my-15 px-4 md:px-16">
        <Button variant="outline" asChild>
          <Link href="/#join">ホームに戻る<IoHomeOutline /></Link>
        </Button>
      </div>  
    </main>
  )
}

export default JoinPage
