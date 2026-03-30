import MemberCard from "@/components/parts/member/MemberCard"
import { Role } from "@/lib/types";

type Props ={
  roles: Role[];
};

const MemberCardList = ({ roles }: Props) => {
  return (
    <div className="w-full max-w-full">
      {roles.map((role) => (
        <div key={role.role} className="mb-10">
          <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{role.role}</h3>
          <p className="text-muted-foreground mb-4">{role.description}</p>
          <div className="flex max-w-full gap-4 overflow-x-auto overscroll-x-contain pb-2 md:flex-wrap md:gap-6 md:overflow-visible">
            {role.members.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MemberCardList
