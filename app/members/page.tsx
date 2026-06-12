import type { Metadata } from "next";
import data from "@/data/membersData.json";
import { Role } from "@/lib/types";
import MemberCardList from "@/components/parts/member/MemberCardList";
import SectionHeading from "@/components/parts/SectionHeading";
import PillLink from "@/components/parts/PillLink";

export const metadata: Metadata = {
  title: "Member",
  description: "Karynosをつくる、Propositio AIのメンバーを紹介します。",
};

const MembersPage = () => {
  const roles: Role[] = data.roles;
  return (
    <main className="w-full">
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:px-10 md:pt-24">
        <SectionHeading
          className="animate-k-rise"
          as="h1"
          eyebrow="Member"
          title="教育の未来を、本気で変える人たち。"
          lead="「誰もが夢を持ち、自由に追いかけられる世界」を目指して。多様なバックグラウンドを持つメンバーが、教育現場の課題に向き合っています。"
        />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10 md:pb-32">
        <MemberCardList roles={roles} />
        <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center md:p-12">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900">
            あなたの席が、ここにあります。
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
            Karynosは一緒に教育の未来をつくる仲間を募集しています。
          </p>
          <PillLink href="/join" size="md" className="mt-6">
            採用情報を見る →
          </PillLink>
        </div>
      </section>
    </main>
  );
};

export default MembersPage;
