import data from "@/data/membersData.json";
import { Role } from "@/lib/types";
import MemberCardList from "@/components/parts/member/MemberCardList";
import ToHomePageButton from "@/components/parts/ToHomePageButton";

const MembersPage = () => {
  const roles: Role[] = data.roles;
  return (
    <main className="mt-30 md:mt-40 w-full py-16 px-6 md:px-15">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-3">メンバー紹介</h2>
        <p className="text-muted-foreground">Propositio AI では、大学生を中心に、多様なバックグラウンドを持つメンバーが集まっています。<br className="hidden md:block" />ほとんどのメンバーが初心者からのスタートですが、互いに学び合いながら挑戦を続けています。</p>
      </div>
      <MemberCardList roles={roles} />
      <ToHomePageButton />
    </main>
  )
}

export default MembersPage
