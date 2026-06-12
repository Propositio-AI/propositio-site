import Image from "next/image";
import { Member } from "@/lib/types";

type Props = {
  member: Member;
};

const MemberCard = ({ member }: Props) => {
  return (
    <div className="w-64 shrink-0 overflow-hidden rounded-3xl border border-slate-100 bg-white md:w-full md:shrink">
      <div className="h-44 overflow-hidden bg-placeholder">
        <Image
          src={member.image}
          alt={member.name}
          width={600}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-7">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">
          {member.position}
        </span>
        <h3 className="mt-2 font-heading text-[21px] font-extrabold tracking-tight text-slate-900">
          {member.name}
        </h3>
        <dl className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-500">
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-slate-400">学年</dt>
            <dd>{member.grade}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-slate-400">趣味</dt>
            <dd>{member.hobby}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-slate-400">一言</dt>
            <dd>{member.comment}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default MemberCard;
