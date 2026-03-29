import { MdOutlinePeople } from "react-icons/md";

const TopSection = () => {
  return (
    <div  id="topSection"
      className="px-6 md:px-15 text-center mb-20">
      <div className="backdrop-blur-xs inline-flex text-black items-center border border-gray-400 rounded-2xl py-1 px-3 mb-4 md:mb-6">
        <MdOutlinePeople className="w-5 h-5" />
        <span className="text-xs md:text-base font-bold">メンバー募集中</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">ともに未来を創る仲間を<br />募集しています</h2>
      <p className="text-base md:text-xl text-muted-foreground">
        Propositio AIは、教育とキャリアの課題解決に情熱を持つ学生メンバーを募集しています。
      </p>
    </div>
  )
}

export default TopSection
