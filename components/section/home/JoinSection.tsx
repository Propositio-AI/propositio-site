import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { MdOutlinePeople } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { FaRocket } from "react-icons/fa6";
import { FaArrowRightToBracket } from "react-icons/fa6";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const JoinSection = () => {
  return (
    <div id="join"
      className="py-16 px-6 md:px-15 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Join</h2>
      <Card className="relative mx-auto w-full max-w-2xl pt-0">
        <div className="pointer-events-none absolute inset-0 z-30 aspect-video" />
        <Image
          src="/images/join.png"
          alt="Event cover"
          width={600}
          height={400}
          className="relative z-20 w-full object-cover"
        />
        <CardHeader>
          <CardTitle className="md:text-2xl mb-1">「勉強の意味が分からない」を、AIで解決する。<br className="hidden md:block"/>学習と夢をつなぐ教育プラットフォームを、一緒につくろう。</CardTitle>
          <CardDescription className="md:text-xl">
            Prositio AIは、教育とキャリアの課題解決に情熱を持つ仲間を募集しています。学生企業ならではの挑戦と成長の機会があなたを待っています。
          </CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="md:text-base"><MdOutlinePeople className="w-5 h-5"/>チームワーク</Badge>
            <Badge variant="secondary" className="md:text-base"><FaRegLightbulb className="w-4 h-4" />革新的な挑戦</Badge>
            <Badge variant="secondary" className="md:text-base"><FaRocket className="w-4 h-4" />成長機会</Badge>
          </div>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full md:text-lg">
            <Link href="/join" className="flex items-center justify-center gap-2">参加募集ページへ<FaArrowRightToBracket /></Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default JoinSection
