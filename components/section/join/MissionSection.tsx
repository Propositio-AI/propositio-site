import React from 'react'

const MissionSection = () => {
  return (
    <div id="mission" className="px-6 md:px-16 py-16 bg-gray-50">
      <h2 className="text-lg md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Mission</h2>
      <div className="flex flex-col items-center md:flex-row">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">私たちのミッション</h2>
          <p className="text-base md:text-xl text-muted-foreground">
            私たちは「可能性を全ての人に」届けることを目指しています。日本の若者が抱える「無力感」を、Aiの力によって変え、一人ひとりが自分の可能性に挑戦できる社会を実現します。
          </p>
        </div>
        <img src="/images/join.png" alt="join" className="w-full md:w-1/2 lg:w-2/5 mt-6 md:mt-0 md:ml-6" />
      </div>
    </div>
  )
}

export default MissionSection
