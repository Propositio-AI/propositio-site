import SocialLinks from "@/components/parts/SocialLinks";
import FooterLinks from "../parts/FooterLinks"

const Footer = () => {
  return (
    <div className="bg-gray-100 px-5 py-4 text-gray-600">
      <div className="container mx-auto text-xs md:text-sm ">
        <div className="sm:flex sm:justify-between sm:gap-4 py-7 border-b border-gray-300">
          <div className="mb-4 sm:mb-0">
            <h2 className="font-bold text-gray-900">Propositio AI</h2>
            <p className="mt-2 w-70">
              可能性を全ての人に。
              <br />
              学生と教育関係者のための革新的AIプロダクトを開発しています。
            </p>
          </div>
          <div>
            <FooterLinks />
          </div>
        </div>
        <div className="py-4 flex items-center justify-between">
          <div>
            <small className="text-xs sm:text-sm">&copy; 2024 Propositio AI. All rights reserved.</small>
          </div>
          <div>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
