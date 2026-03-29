import { TbPointFilled } from "react-icons/tb";

export default function HeroSection() {

  return (
    <div 
      id="heroSection"
      className="flex flex-col items-center text-center bg-cover bg-center w-full"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
        paddingTop: '120px',
        paddingBottom: '80px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div className="backdrop-blur-xs inline-flex text-white items-center border border-white rounded-2xl py-1 px-3 mb-3">
        <TbPointFilled className="w-4 h-4" />
        <span className="text-xs md:text-sm lg:text-lg">学生企業が届けるAI</span>
      </div>
      <h1 className="text-white text-3xl md:text-6xl font-semibold">
        可能性を
        <br />
        <span className="text-white">すべての人に</span>
      </h1>
      <p className="text-xs md:text-base text-white mt-4 max-w-2xl">
        Propositio AIは、学生と教育関係者のための革新的AIプロダクトを開発しています。学びとキャリアの未来を、テクノロジーで切り拓きます。
      </p>
    </div>
  )
}
