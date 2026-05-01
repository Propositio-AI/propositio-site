import Link from "next/link"

const Navigation = () => {
  return (
    <nav className="flex flex-col md:flex-row h-full items-stretch">
      <Link
        href="/#products"
        className="c-btn slide flex h-full min-h-10 items-center px-6 text-base md:text-lg"
      >
        Products
      </Link>
      <Link
        href="/#about"
        className="c-btn slide flex h-full min-h-10 items-center px-6 text-base md:text-lg"
      >
        About
      </Link>
      <Link
        href="/#blog"
        className="c-btn slide flex h-full min-h-10 items-center px-6 text-base md:text-lg"
      >
        Blog
      </Link>
      <Link
        href="/#members"
        className="c-btn slide flex h-full min-h-10 items-center px-6 text-base md:text-lg"
      >
        Members
      </Link>
      <Link
        href="/#join"
        className="c-btn slide flex h-full min-h-10 items-center px-6 text-base md:text-lg"
      >
        Join
      </Link>
      <Link
        href="/contact"
        className="bg-blue-500 text-white hover:bg-blue-600 flex h-full min-h-10 items-center px-6 text-base md:text-lg"
      >
        Contact
      </Link>
    </nav>
  )
}

export default Navigation
