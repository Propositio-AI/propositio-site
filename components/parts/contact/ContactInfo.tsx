import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePlace } from "react-icons/md";

const ContactInfo = () => {
  return (
    <div className="space-y-3 pb-3 md:border-b md:border-gray-300">
      <div className="flex gap-1">
        <div>
          <MdOutlineEmail  className="mt-1 w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold">メール</h4>
          <p className="text-xs md:text-sm text-muted-foreground">info@propositio.com</p>
        </div>
      </div>
      <div className="flex gap-1">
        <div>
          <MdOutlinePlace className="mt-1 w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold">住所</h4>
          <p className="text-xs md:text-sm text-muted-foreground">〒610-0394<br />京田辺市多々羅都谷1-3<br />同志社ローム記念館 RM208</p>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
