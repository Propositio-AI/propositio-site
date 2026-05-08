import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoHomeOutline } from "react-icons/io5";

const AboutPage = () => {
  return (
    <main className="bg-white text-slate-900 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 mt-30">
        <div className="max-w-6xl mx-auto px-3 md:px-6 py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="font-semibold mb-4 tracking-wide">Propositio AI</p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
              誰もが夢を持ち、
              <br />
              自由に追いかけられる世界へ。
            </h1>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Solution */}
      <section id="mission" className="max-w-6xl mx-auto px-3 md:px-6 py-20 mb-10 md:mb-20">
        <div className="max-w-4xl mx-auto grid gap-8">
          <div className="p-3 bg-white">
            <h2 className="text-2xl font-black mb-2">Mission（私たちの理念）</h2>
            <p className="text-lg font-extrabold">「可能性を全ての人に」</p>
            <p className="mt-3 text-slate-700 leading-relaxed">
              生まれ持った環境や、既存の教育システムに縛られることなく、全ての若者が自らの可能性を最大化できる土壌を作ります。
            </p>
          </div>

          <div className="p-3 bg-white">
            <h3 className="text-2xl font-black mb-2">Vision（実現したい世界）</h3>
            <p className="text-slate-700 leading-relaxed">「誰もが夢を持ち、自由に追いかけられる世界」</p>
          </div>

          <div className="p-3 bg-white">
            <h4 className="text-lg font-semibold mb-2">なぜ「夢」が必要なのか？</h4>
            <p className="text-slate-600 leading-relaxed">
              夢とは、自分の可能性を具体的な「力」に変えるための「北極星」であり、人生という航海における「GPS」です。夢があることで、日々の学習は目的に向けた投資へと変わります。
            </p>
          </div>
          <div className="p-3 bg-white">
            <h4 className="text-lg font-semibold mb-2">Karynos</h4>
            <p className="text-slate-700 leading-relaxed">Karynosは「進路の方向性と日々の学習を接続するAIプラットフォーム」です。</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-3 bg-white transition">
                <h5 className="font-bold mb-2 text-green-600">① Dream Matching（仮の進路設定）</h5>
                <p className="text-slate-600">
                  AIとの対話を通じて、生徒の興味・関心をもとに「仮の進路」を設定します。これにより生徒は目的を持って学習に向き合えます。
                </p>
              </div>

              <div className="p-3 bg-white transition">
                <h5 className="font-bold mb-2 text-blue-600">② Dream Action（検証と理解）</h5>
                <p className="text-slate-600">
                  設定した進路に対してAIとの対話や探索を通じて理解を深め、その進路が納得できるか検証する機会を提供します。
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 md:px-6 bg-white">
          <h4 className="text-lg font-semibold mb-2">提供価値（学校向け）</h4>
          <p className="text-slate-600 leading-relaxed">
            進路に関する思考と日々の学習を接続し、生徒が自分の学びに意味を見出しやすい環境を提供します。AIは各生徒の興味・学習履歴・進路方向を組み合わせた提案を行います。
          </p>
        </div>
      </section>
      <div className="flex justify-end my-10 md:my-15 px-4 md:px-6">
        <Button variant="outline" asChild>
          <Link href="/#members">ホームに戻る<IoHomeOutline /></Link>
        </Button>
      </div>
    </main>
  )
}

export default AboutPage