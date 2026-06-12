import MemberCard from "@/components/parts/member/MemberCard";
import { Role } from "@/lib/types";

type Props = {
  roles: Role[];
};

const MemberCardList = ({ roles }: Props) => {
  return (
    <div className="w-full space-y-14">
      {roles.map((role) => (
        <div key={role.role}>
          <h2 className="font-heading text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
            {role.role}
          </h2>
          <p className="mt-1.5 text-[15px] text-slate-500">{role.description}</p>
          <div className="mt-6 flex max-w-full gap-5 overflow-x-auto overscroll-x-contain pb-2 md:grid md:grid-cols-3 md:gap-7 md:overflow-visible">
            {role.members.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberCardList;
