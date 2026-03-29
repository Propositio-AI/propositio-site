
const AboutSection = () => {
  return (
    <div
      id="aboutSection"
      className="py-16 px-6 mt-10 md:px-15">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">About</h2>
      <div className="container mx-auto md:flex md:justify-around mb-18">
        <div className="space-y-2 mb-10 md:mb-0 md:w-1/3">
          <h3 className="text-3xl md:text-6xl font-semibold mb-5">夢を夢で<br />終わらせない</h3>
          <p className="text-sm md:text-lg text-muted-foreground">AIの力で、すべての学生が自分の可能性を信じ、それを実現するための手段を得られる社会へ</p>
        </div>
        <img src="/images/history.png" alt="History" className="w-full h-auto object-contain md:w-3/7 md:pl-8" />
      </div>
      <div>
        <dl className="flex flex-col md:flex-row md:items-center md:justify-around">
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">団体名</dt>
            <dd className="text-3xl mb-6 md:mb-0">Propositio AI</dd>
          </div>
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">設立年月</dt>
            <dd className="text-3xl mb-6 md:mb-0">2024年11月</dd>
          </div>
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">事業内容</dt>
            <dd className="text-3xl mb-6 md:mb-0">EdTech事業</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default AboutSection
