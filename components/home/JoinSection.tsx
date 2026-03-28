import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MdOutlinePeople } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { FaRocket } from "react-icons/fa6";
import { FaArrowRightToBracket } from "react-icons/fa6";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const JoinSection = () => {
  return (
    <div id="aboutSection"
      className="py-16 px-6 sm:px-15">
      <h2 className="text-lg sm:text-xl font-bold text-gray-600 mb-6">Join</h2>
      <Card className="relative mx-auto w-full max-w-xl pt-0">
        <div className="absolute inset-0 z-30 aspect-video" />
        <img
          src="/images/join.png"
          alt="Event cover"
          className="relative z-20 w-full object-cover"
        />
        <CardHeader>
          <CardTitle>一緒に未来を創りませんか?</CardTitle>
          <CardDescription>
            Prositio AIは、教育とキャリアの課題解決に情熱を持つ仲間を募集しています。学生企業ならではの挑戦と成長の機会があなたを待っています。
          </CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary"><MdOutlinePeople />チームワーク</Badge>
            <Badge variant="secondary"><FaRegLightbulb />革新的な挑戦</Badge>
            <Badge variant="secondary"><FaRocket />成長機会</Badge>
          </div>
        </CardHeader>
        <CardFooter>
          <Button className="w-full">参加募集ページへ<FaArrowRightToBracket /></Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default JoinSection
