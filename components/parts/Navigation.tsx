import Link from "next/link"

const Navigation = () => {
  return (
    <nav className="flex flex-col md:flex-row h-full items-stretch">
      <Link
        href="/#products"
        className="c-btn slide flex h-full md:w-30 min-h-10 items-center px-6 text-base md:text-lg justify-center"
      >
        Products
      </Link>
      <Link
        href="/#about"
        className="c-btn slide flex h-full md:w-30 min-h-10 items-center px-6 text-base md:text-lg justify-center"
      >
        About
      </Link>
      <Link
        href="/#blog"
        className="c-btn slide flex h-full md:w-30 min-h-10 items-center px-6 text-base md:text-lg justify-center"
      >
        Blog
      </Link>
      <Link
        href="/#members"
        className="c-btn slide flex h-full md:w-30 min-h-10 items-center px-6 text-base md:text-lg justify-center"
      >
        Members
      </Link>
      <Link
        href="/#join"
        className="c-btn slide flex h-full md:w-30 min-h-10 items-center px-6 text-base md:text-lg justify-center"
      >
        Join
      </Link>
      <Link
        href="/contact"
        className="bg-blue-500 text-white hover:bg-blue-600 flex h-full md:w-30 min-h-10 items-center px-6 text-base md:text-lg justify-center"
      >
        Contact
      </Link>
    </nav>
  )
}

export default Navigation
