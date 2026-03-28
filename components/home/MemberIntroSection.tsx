import Link from "next/link"
import { Button } from "@/components/ui/button"

const MemberIntroSection = () => {
  return (
    <div id="membersSection" className="container mx-auto py-16 px-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-600">Members</h2>
      <div className="flex flex-col sm:flex-row items-center">
        <img src="/images/memberIntro.png" alt="Member Introduction" className="w-full h-auto object-contain sm:w-1/2" />
        <div className="space-y-3">
          <h3 className="text-2xl font-bold">私たちは<br />学生中心のチームです</h3>
          <p className="text-gray-600">Propositio AIはすべての開発・運用を学生のみで行っています。</p>
          <div className="flex flex-col items-end">
            <Button asChild>
              <Link href="/members" className="">メンバーを見る</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberIntroSection
