import Link from "next/link";
import { FaArrowRightToBracket } from "react-icons/fa6";
import Image from "next/image";


const JoinSection = () => {
  return (
    <div id="join"
      className="py-16 px-6 md:px-15 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Join</h2>

      <div className="grid md:grid-cols-2 gap-10 items-center md:px-16">
        <div>
          <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-3 md:mb-6">
            AI開発で、<br /><span className="text-green-500">「実力」と「実績」</span>を手に入れる
          </h3>
          <div className="relative w-full aspect-3/2 md:hidden mb-4">
            <Image
              src="/images/join.png"
              alt="Join Image"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            Propositio AIでは、LLMを活用したプロダクト開発を通して、実務レベルの開発経験とチーム開発力を身につけることができます。<br />
            就活で語れるガクチカや、エンジニアとしての実力を伸ばしたい人へ。
          </p>
          <div className="flex">
            <Link href="/join" className="ml-auto">
              <div className="flex items-center gap-4 pb-2 border-b-2 border-blue-500 w-max group group-hover:border-blue-600 transition-colors">
                <p className="font-medium">メリット・募集詳細を見る</p>
                <div className="bg-blue-500 text-white py-1.5 px-4 group-hover:bg-blue-600 group-hover:rounded transition-colors">
                  <FaArrowRightToBracket className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>

        </div>

        <div className="relative w-full aspect-3/2 hidden md:block">
          <Image
            src="/images/join.png"
            alt="Join Image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default JoinSection
