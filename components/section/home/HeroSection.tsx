import { TbPointFilled } from "react-icons/tb";
import { TextReveal } from "@/components/unlumen-ui/text-reveal";

export default function HeroSection() {

  return (
    <div 
      id="heroSection"
      className="flex flex-col items-center text-center bg-cover bg-center w-full"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
        paddingTop: '100px',
        paddingBottom: '60px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <div className="backdrop-blur-xs inline-flex text-white items-center border border-white rounded-2xl py-1 px-3 mb-3">
        <TbPointFilled className="w-4 h-4" />
        <TextReveal as="span" text="学生企業が届けるAI" className="text-xs md:text-sm lg:text-lg" startDelay={1} />
      </div>
      <h1 className="text-white text-3xl md:text-6xl font-semibold">
        <TextReveal text="可能性を" startDelay={0.2} duration={0.5} />
        <TextReveal text="すべての人に" startDelay={0.8} duration={0.5} />
      </h1>
      <p className="text-xs md:text-base text-white mt-2 max-w-2xl">
        <TextReveal as="span" text="Propositio AIは、 学生と教育関係者のための革新的AIプロダクトを開発しています。学びとキャリアの未来を、テクノロジーで切り拓きます。" startDelay={1} />
      </p>
    </div>
  )
}
