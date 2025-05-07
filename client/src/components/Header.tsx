export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-[99px] border-b border-[#D9D9D9] px-8 py-8 flex items-center justify-between bg-white">
      <div className="flex-shrink-0">
        { /* the logo needs to be added or deleted fully if it's not needed */ }
        <img src="/logo.svg" alt="Logo" className="h-full" />
      </div>
      <div className="flex items-center gap-6">
        <span className="text-lg text-[#1E1E1E]">Languages</span>
        <button className="bg-[#1D1B20] w-[148px] text-white text-lg px-4 py-2 rounded-full hover:opacity-90">Logout</button>
      </div>
    </header>
  )
}