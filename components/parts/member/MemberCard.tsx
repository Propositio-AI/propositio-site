import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Member } from "@/lib/types" 

type Props = {
  member: Member;
};

const MemberCard = ({ member }: Props) => {
  return (
    <Card className="relative w-64 shrink-0 overflow-hidden pt-0 border border-gray-300">
      <div className="p-4 pb-0">
        <img
          src={`${member.image}`}
          alt={member.name}
          className="relative z-20 aspect-video h-40 w-full rounded-md object-cover"
        />
      </div>
      <CardHeader className="w-full">
        <div className="mb-3 flex items-center gap-4">
          <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
          <Badge variant="secondary">{member.position}</Badge>
        </div>
        <CardDescription>
          <dl>
            <dt>学年</dt>
            <dd className="text-base text-black font-medium mb-2">{member.grade}</dd>
            <dt>趣味</dt>
            <dd className="text-base text-black font-medium mb-2">{member.hobby}</dd>
            <dt>コメント</dt>
            <dd className="text-base text-black font-medium mb-2">{member.comment}</dd>
          </dl>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default MemberCard
