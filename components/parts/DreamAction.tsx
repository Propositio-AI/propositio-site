import { BsLightningCharge } from "react-icons/bs";
import { FaProjectDiagram } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TextReveal } from "@/components/unlumen-ui/text-reveal";

const DreamAction = () => {
  return (
    <div className="flex flex-col items-center py-6 md:py-10">
      <div className="bg-black backdrop-blur-xs inline-flex gap-1 text-white items-center border border-white rounded-2xl py-1 px-3 mb-3 shadow-[0_0_30px_1px_rgba(255,0,0,0.3)]">
        <BsLightningCharge className="w-4 h-4" />
        <span className="text-xs md:text-sm"><TextReveal as="span" text="Career Realization Platform" startDelay={0} /></span>
      </div>
      <h3 className="text-center bg-linear-to-r from-red-600 via-purple-500 to-pink-200 bg-clip-text text-transparent text-4xl md:text-6xl font-bold mb-4">
        Dream Action
      </h3>
      <p className="text-center text-muted-foreground text-base md:text-lg shadow-[0_0_30px_1px_rgba(255,0,0,0.2)] rounded-xl py-0.5 px-1">
        <TextReveal as="span" text="見つけた夢を、現実に" startDelay={0.1} />
      </p>
      <div className="mx-3 py-1 px-3 mb-3 rounded-xl mt-5">
        <p className="text-center text-muted-foreground text-sm"><TextReveal as="span" text="見つけた夢に対して、具体的なアクションプランを提案。" startDelay={0.2} /><br className="hidden md:block" /><TextReveal as="span" text="段階的なステップで、あなたの夢実現をサポートします。" startDelay={0.3} /></p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-10 mt-5">
        <div className="border border-gray-300 rounded-lg p-2 group hover:shadow-[0_0_30px_1px_rgba(255,0,0,0.4)] w-26 h-38 md:w-40 lg:w-50 lg:h-40 space-y-1 transition-transform duration-2000 hover:-translate-y-2">
          <FaProjectDiagram className="w-7 h-7 md:w-8 md:h-8 bg-black p-1 rounded-lg text-red-400" />
          <h4 className="font-bold text-sm lg:text-xl"><TextReveal as="span" text="行動計画" startDelay={0.4} /></h4>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base"><TextReveal as="span" text="夢実現に必要な、ステップバイステップの行動計画" startDelay={0.45} /></p>
        </div>
        <div className="border border-gray-300 rounded-lg p-2 group hover:shadow-[0_0_30px_1px_rgba(200,0,255,0.6)] w-26 h-38 md:w-40 lg:w-50 lg:h-40 space-y-1 transition-transform duration-2000 hover:-translate-y-2">
          <FaBook className="w-7 h-7 md:w-8 md:h-8 bg-black p-1.5 rounded-lg text-purple-400" />
          <h4 className="font-bold text-sm lg:text-xl"><TextReveal as="span" text="学習リソース" startDelay={0.5} /></h4>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base"><TextReveal as="span" text="目標達成に必要な知識やスキルを、体系的に提供" startDelay={0.55} /></p>
        </div>
        <div className="border border-gray-300 rounded-lg p-2 group hover:shadow-[0_0_30px_1px_rgba(255,0,255,0.4)] w-26 h-38 md:w-40 lg:w-50 lg:h-40 space-y-1 transition-transform duration-2000 hover:-translate-y-2">
          <FaRegCalendarCheck className="w-7 h-7 md:w-8 md:h-8 bg-black p-1.5 rounded-lg text-pink-400" />
          <h4 className="font-bold text-sm lg:text-xl"><TextReveal as="span" text="進捗管理" startDelay={0.6} /></h4>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base"><TextReveal as="span" text="あなたの成長過程を追跡し、達成を応援" startDelay={0.65} /></p>
        </div>
      </div>
    </div>
  )
}

export default DreamAction
