import { TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled, TbHexagonNumber4Filled } from "react-icons/tb";
const MeritSection = () => {
  return (
    <div id="merit" className="px-6 md:px-16 py-16 bg-gray-50">
      <h2 className="text-lg md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Merit</h2>
      <div className="mx-auto w-full max-w-5xl py-15 px-4 md:px-10 border border-gray-200 rounded-lg bg-white text-center">
        <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">参加するメリット</h3>
        <p className="text-muted-foreground">Propositio AIで得られる4つの価値</p>

        <div className="text-left space-y-2 md:space-y-4 mt-6">
          <div className="flex items-center gap-2">
          <TbHexagonNumber1Filled className="w-7 h-7 md:w-9 md:h-9"/>
          <h4 className="text-xl md:text-3xl font-bold">最先端のAI開発スキル</h4>
          </div>
          <p className="md:text-lg text-muted-foreground">　大規模言語モデル（LLM）を活用したプロダクト開発を通して、AIの実践的なスキルを習得できます。設計から実装、改善までを一貫して関わることで、現場で求められる開発力を養うことができます。</p>
        </div>

        <div className="text-left space-y-2 md:space-y-4 mt-10">
          <div className="flex items-center gap-2">
          <TbHexagonNumber2Filled className="w-7 h-7 md:w-9 md:h-9"/>
          <h4 className="text-xl md:text-3xl font-bold">実務レベルの開発経験とチーム開発力</h4>
          </div>
          <p className="md:text-lg text-muted-foreground">　インターンに近い環境で、実際のプロダクト開発に携わることができます。学生主体のチームであるため、一人ひとりが裁量を、持って開発に取り組めるのも特徴です。チームでの開発を通して、設計力や問題解決力に加え、コミュニケーション力や主体力も磨くことができます。「作って終わり」ではない開発経験を得られます。</p>
        </div>

        <div className="text-left space-y-2 md:space-y-4 mt-10">
          <div className="flex items-center gap-2">
          <TbHexagonNumber3Filled className="w-7 h-7 md:w-9 md:h-9"/>
          <h4 className="text-xl md:text-3xl font-bold">就活で評価される実績・ガクチカの創出</h4>
          </div>
          <p className="md:text-lg text-muted-foreground">　実際のプロダクト開発やチームでの取り組みを通して、具体的に語れる経験を積むことができます。「何をしたか」だけでなく、「どのように課題を解決したか」まで説明できるため、就職活動において強いアピールポイントになります。</p>
        </div>
        
        <div className="text-left space-y-2 md:space-y-4 mt-10">
          <div className="flex items-center gap-2">
          <TbHexagonNumber4Filled className="w-7 h-7 md:w-9 md:h-9"/>
          <h4 className="text-xl md:text-3xl font-bold">挑戦と成長を加速させる実線環境</h4>
          </div>
          <p className="md:text-lg text-muted-foreground">　授業では与えられた課題に取り組むことが多い一方で、Propositio AIでは、自ら課題を見付け、解決まで主体的に取り組む経験ができます。同じ志を持つ仲間と切磋琢磨しながら、スピード感のある開発に挑戦し、試行錯誤を重ねていく中で成長していきます。知識の習得にとどまらず、「実際に価値を生み出す力」を養える環境です。</p>
        </div>
      </div>
    </div>
  )
}

export default MeritSection
