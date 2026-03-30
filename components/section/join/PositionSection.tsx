import PositionList from "@/components/parts/PositionList";
const PositionSection = () => {
  return (
    <div id="position" className="px-6 md:px-16 py-16">
      <h2 className="text-lg md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Position</h2>
      <div className="flex flex-col items-center">
        <div className="text-center">
          <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-6">募集ポジション</h3>
          <p className="text-sm md:text-lg text-muted-foreground mb-6">あなたのスキルと情熱を生かせるポジションを探してください</p>
        </div>
        <div>
          <PositionList />
        </div>
      </div>
    </div>
  )
}

export default PositionSection
