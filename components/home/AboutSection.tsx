
const AboutSection = () => {
  return (
    <div
      id="aboutSection"
      className="container mx-auto py-16 px-4">
      <div className="sm:flex sm:justify-around mb-15">
        <div className="space-y-2 mb-10 sm:mb-0 sm:w-1/3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-600">About</h2>
          <h3 className="text-3xl sm:text-4xl font-semibold">夢を夢で<br />終わらせない</h3>
          <p className="text-sm sm:text-base text-gray-600">AIの力で、すべての学生が自分の可能性を信じ、それを実現するための手段を得られる社会へ</p>
        </div>
        <img src="/images/history.png" alt="History" className="w-full h-auto object-contain sm:w-3/7 sm:pl-8" />
      </div>
      <div>
        <dl className="flex items-center justify-between md:justify-around">
          <div className="text-center font-bold">
            <dt className="text-sm sm:text-lg text-gray-600 mb-1">団体名</dt>
            <dd className="text-lg sm:text-2xl">Propositio AI</dd>
          </div>
          <div className="text-center font-bold">
            <dt className="text-sm sm:text-lg text-gray-600 mb-1">設立年月</dt>
            <dd className="text-lg sm:text-2xl">2024年11月</dd>
          </div>
          <div className="text-center font-bold">
            <dt className="text-sm sm:text-lg text-gray-600 mb-1">事業内容</dt>
            <dd className="text-lg sm:text-2xl">EdTech事業</dd>
          </div>
        </dl>
      </div>


    </div>
  )
}

export default AboutSection
