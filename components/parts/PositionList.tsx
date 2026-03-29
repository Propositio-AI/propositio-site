import { HiMiniCodeBracketSquare } from "react-icons/hi2";
import { IoMdCheckboxOutline } from "react-icons/io";
import { FaRegLightbulb } from "react-icons/fa";
import { FaPalette } from "react-icons/fa";
import { IoMdMegaphone } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";


const PositionList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        {/* エンジニア */}
        <div className="space-y-1 mb-3">
          <HiMiniCodeBracketSquare className="w-10 h-10" />
          <h4 className="text-2xl font-bold">エンジニア</h4>
          <p className="text-muted-foreground">AIモデルの開発やWebアプリケーションの構築を通じて、学生たちの学習を支援するプロダクトを開発します。</p>
        </div>
        <div className="space-y-1 border-b border-gray-300 pb-3">
          <h4 className="font-bold">期待されるスキル・コミット</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />Python、TypeScript等の基礎知識</li>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />継続的な学習姿勢</li>
          </ul>
        </div>
        <div className="space-y-1 my-2">
          <h4 className="font-bold">活動を通じて成長できるスキル</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />フルスタック開発スキル</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />機械学習の実践的理解</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />スタートアップでの開発経験</li>
          </ul>
        </div>
      </div>

      {/* デザイナー */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-1 mb-3">
          <FaPalette className="w-10 h-10" />
          <h4 className="text-2xl font-bold">デザイナー</h4>
          <p className="text-muted-foreground">ユーザー中心のUIデザインとUXリサーチを通じて、学生ユーザーに寄り添うプロダクトを創造します。</p>
        </div>
        <div className="space-y-1 border-b border-gray-300 pb-3">
          <h4 className="font-bold">期待されるスキル・コミット</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />Figma等のデザインツール経験</li>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />ユーザー視点でのデザイン思考</li>
          </ul>
        </div>
        <div className="space-y-1 my-2">
          <h4 className="font-bold">活動を通じて成長できるスキル</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />UIUXデザイン実践スキル</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />ユーザーリサーチ手法</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />デザインシステムの構築経験</li>
          </ul>
        </div>
      </div>

      {/* マーケティング */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-1 mb-3">
          <IoMdMegaphone className="w-10 h-10" />
          <h4 className="text-2xl font-bold">マーケティング</h4>
          <p className="text-muted-foreground">プロダクト認知の拡大とユーザー獲得戦略を立案・実行し、Propositio AIを学生に届けます。</p>
        </div>
        <div className="space-y-1 border-b border-gray-300 pb-3">
          <h4 className="font-bold">期待されるスキル・コミット</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />SNS・コンテンツマーケティング経験</li>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />ユーザー行動分析への関心</li>
          </ul>
        </div>
        <div className="space-y-1 my-2">
          <h4 className="font-bold">活動を通じて成長できるスキル</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />グロースハック戦略</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />データドリブンな意思決定</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />スタートアップマーケティング実務</li>
          </ul>
        </div>
      </div>

      {/* ビジネス */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-1 mb-3">
          <IoBusiness className="w-10 h-10" />
          <h4 className="text-2xl font-bold">ビジネス</h4>
          <p className="text-muted-foreground">事業戦略の立案からパートナーシップ構築まで、Propositio AIの成長を多面的に推進します。</p>
        </div>
        <div className="space-y-1 border-b border-gray-300 pb-3">
          <h4 className="font-bold">期待されるスキル・コミット</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />営業・交渉スキル</li>
            <li className="flex items-center text-muted-foreground gap-1"><IoMdCheckboxOutline />戦略思考と実行力</li>
          </ul>
        </div>
        <div className="space-y-1 my-2">
          <h4 className="font-bold">活動を通じて成長できるスキル</h4>
          <ul>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />事業開発・営業スキル</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />ステークホルダー管理</li>
            <li className="flex items-center text-muted-foreground gap-1"><FaRegLightbulb />経営視点でのビジネス理解</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PositionList
