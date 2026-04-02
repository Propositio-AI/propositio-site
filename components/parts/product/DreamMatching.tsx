import { BsLightningCharge } from "react-icons/bs";
import { GoNorthStar } from "react-icons/go";
import { FaRegCompass } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { TextReveal } from "@/components/unlumen-ui/text-reveal";

const DreamMatching = () => {
  return (
    <div className="flex flex-col items-center py-6 md:py-10">
      <div className="bg-black backdrop-blur-xs inline-flex gap-1 text-white items-center border border-white rounded-2xl py-1 px-3 mb-3 shadow-[0_0_30px_1px_rgba(0,0,255,0.3)]">
        <BsLightningCharge className="w-4 h-4" />
        <span className="text-xs md:text-sm"><TextReveal as="span" text="Carrer Discovery Platform" startDelay={0} /></span>
      </div>
      <h3 className="text-center bg-linear-to-r from-blue-700 via-purple-500 to-pink-200 bg-clip-text text-transparent text-4xl md:text-6xl font-bold mb-5">
        Dream Matching
      </h3>
      <p className="text-center text-muted-foreground font-bold text-base md:text-lg shadow-[0_0_30px_1px_rgba(0,0,255,0.2)] rounded-xl py-0.5 px-1">
        <TextReveal as="span" text="将来の夢を、スワイプで見つける" startDelay={0.1} />
      </p>
      <div className="mx-3 py-1 px-3 mb-3 rounded-xl mt-5">
        <p className="text-center text-muted-foreground text-sm"><TextReveal as="span" text="マッチングアプリ感覚で500以上の職業から将来の夢を探せるサービス。" startDelay={0.2} /><br className="hidden md:block" /><TextReveal as="span" text="診断に押し付けられるのではなく、自分の興味から選べます。" startDelay={0.3} /></p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-10 mt-5">
        <div className="border border-gray-300 rounded-lg p-2 group hover:shadow-[0_0_30px_1px_rgba(0,0,255,0.4)] w-26 h-38 md:w-40 lg:w-50 lg:h-40 space-y-1 transition-transform duration-2000 hover:-translate-y-2">
          <GoNorthStar className="w-7 h-7 md:w-8 md:h-8 bg-black p-1 rounded-lg text-blue-400" />
          <h4 className="font-bold text-sm lg:text-xl"><TextReveal as="span" text="押し付けない" startDelay={0.2} /></h4>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base"><TextReveal as="span" text="診断結果に縛られない、自由な探索体験" startDelay={0.25} /></p>
        </div>
        <div className="border border-gray-300 rounded-lg p-2 group hover:shadow-[0_0_30px_1px_rgba(128,0,255,0.4)] w-26 h-38 md:w-40 lg:w-50 lg:h-40 space-y-1 transition-transform duration-2000 hover:-translate-y-2">
          <FaRegCompass className="w-7 h-7 md:w-8 md:h-8 bg-black p-1 rounded-lg text-purple-400" />
          <h4 className="font-bold text-sm lg:text-xl"><TextReveal as="span" text="500+の職業" startDelay={0.3} /></h4>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base"><TextReveal as="span" text="豊富なデータベースから、あなたの可能性を広げる" startDelay={0.35} /></p>
        </div>
        <div className="border border-gray-300 rounded-lg p-2 group hover:shadow-[0_0_30px_1px_rgba(255,0,225,0.4)] w-26 h-38 md:w-40 lg:w-50 lg:h-40 space-y-1 transition-transform duration-2000 hover:-translate-y-2">
          <FaRegHeart className="w-7 h-7 md:w-8 md:h-8 bg-black p-1.5 rounded-lg text-pink-400" />
          <h4 className="font-bold text-sm lg:text-xl"><TextReveal as="span" text="自分で選ぶ" startDelay={0.4} /></h4>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base"><TextReveal as="span" text="興味から始まる、主体的なキャリア選択" startDelay={0.45} /></p>
        </div>
      </div>
    </div>
  )
}

export default DreamMatching
