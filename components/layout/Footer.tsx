import SocialLinks from "@/components/parts/SocialLinks";
import FooterLinks from "../parts/FooterLinks"

const Footer = () => {
  return (
    <div className="bg-gray-100 py-4 text-gray-600">
      <div className="container mx-auto text-sm ">
        <div className="flex justify-between py-7 border-b border-gray-300">
          <div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Propositio AI</h2>
            </div>
            <p className="mt-2 w-80">
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
            <small className="text-sm">&copy; 2024 Propositio AI. All rights reserved.</small>
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
