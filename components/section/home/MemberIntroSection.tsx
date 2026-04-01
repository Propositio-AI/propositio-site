import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaArrowRightToBracket } from "react-icons/fa6";


const MemberIntroSection = () => {
  return (
    <div id="members" className=" py-16 px-6 md:px-15 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Members</h2>
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="w-full sm:w-1/2">
          <Image
            src="/images/memberIntro.png"
            alt="Member Introduction"
            width={900}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="space-y-3 sm:w-1/2">
          <h3 className="text-3xl md:text-5xl font-bold">私たちは<br />学生中心のチームです</h3>
          <p className="text-base md:text-lg text-muted-foreground">Propositio AIは、企画から運用までを全て学生のみで担うチームです。メンバーが主体的に協力しながらプロダクト成長に取り組み、情報系に限らず、多様なバックグラウンドのメンバーが活躍しています。</p>
          <div className="flex flex-col items-end">
            <Button asChild>
              <Link href="/members" className="">メンバーを見る<FaArrowRightToBracket /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberIntroSection
