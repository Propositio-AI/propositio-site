import Navigation from "../parts/Navigation";

const Header = () => {
  return (
    <>
      <header className="container mx-auto flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Propositio AI Logo" className="h-7" />
          <h1 className="text-2xl font-bold">Propositio AI</h1>
        </div>
        <Navigation />
      </header>
    </>
  )
}

export default Header
