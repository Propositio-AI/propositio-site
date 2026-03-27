import { TbPointFilled } from "react-icons/tb";

export default function HeroSection() {
  return (
    <div className="bg-[url('/images/hero.jpg')] bg-cover bg-center flex flex-col items-center text-center py-10 px-4">
      <div className="backdrop-blur-xs inline-flex text-white items-center border border-white rounded-2xl py-1 px-3 mb-3">
        <TbPointFilled className="w-4 h-4" />
        <p className="text-xs md:text-sm lg:text-lg">学生企業が届けるAI</p>
      </div>
      <h1 className="text-white text-3xl md:text-4xl font-semibold">
        可能性を
        <br />
        <span className="text-white">すべての人に</span>
      </h1>
      <p className="text-xs text-white mt-4 max-w-2xl">
        Propositio AIは、学生と教育関係者のための革新的AIプロダクトを開発しています。学びとキャリアの未来を、テクノロジーで切り拓きます。
      </p>
    </div>
  )
}
