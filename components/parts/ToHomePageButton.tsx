import { Button } from "../ui/button"
import { IoHomeOutline } from "react-icons/io5";

const ToHomePageButton = () => {
  return (
    <div className="md:px-20 mt-16 mb-5 flex justify-end">
      <Button variant="outline" asChild>
        <a href="/">ホームに戻る<IoHomeOutline /></a>
      </Button>
    </div>
  )
}

export default ToHomePageButton
