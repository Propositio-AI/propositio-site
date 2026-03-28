import Link from "next/link";

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-xs">
      {/* サービス */}
      <div className="mb-4">
        <h3 className="text-gray-900 font-bold mb-4">サービス</h3>
        <ul className="space-y-4">
          <li><Link href="" className="hover:text-black">Karynos</Link></li>
        </ul>
      </div>
      
      {/* コンテンツ */}
      <div className="mb-4">
        <h3 className="text-gray-900 font-bold mb-4">コンテンツ</h3>
        <ul className="space-y-4">
          <li><Link href="" className="hover:text-black">ブログ</Link></li>
          <li><Link href="" className="hover:text-black">参加募集</Link></li>
        </ul>
      </div>
    
      {/* 会社 */}
      <div className="mb-4">
        <h3 className="text-gray-900 font-bold mb-4">会社</h3>
        <ul className="space-y-4">
          <li><Link href="" className="hover:text-black">会社概要</Link></li>
          <li><Link href="" className="hover:text-black">お問い合わせ</Link></li>
        </ul>
      </div>
      
      {/* 法的情報 */}
      <div className="mb-4">
        <h3 className="text-gray-900 font-bold mb-4">法的情報</h3>
        <ul className="space-y-4">
          <li><Link href="" className="hover:text-black">利用規約</Link></li>
          <li><Link href="" className="hover:text-black">プライバシーポリシー</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default FooterLinks
