interface HeaderProps {
  loggedIn: boolean;
  onClick: () => void;
}

export default function Header({ onClick, loggedIn }: HeaderProps) {
  const text = loggedIn ? "Logout" : "Login";

  return (
    <header className="top-0 left-0 w-full h-[99px] border-b border-[#D9D9D9] px-8 py-8 flex items-center justify-between">
      <div className="flex-shrink-0">
        {/* the logo needs to be added or deleted fully if it's not needed */}
        <img src="/favicon.ico" alt="Logo" className="h-full" />
      </div>
      <div className="flex items-center gap-6">
        <span className="text-lg text-[#1E1E1E]">Languages</span>
        <button
          onClick={onClick}
          className="bg-[#1D1B20] w-[148px] text-white text-lg px-4 py-2 rounded-full hover:opacity-90"
        >
          {text}
        </button>
      </div>
    </header>
  );
}
