interface BasicButtonProps {
  text: string;
  onClick: () => void;
}

export default function BasicButton({ text, onClick }: BasicButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center border border-[#D9D9D9] px-6 py-3 h-[40px] rounded-full w-[220px] gap-2 bg-[#1D1B20] hover:opacity-90 text-white"
    >
      <span className="text-xs sm:text-sm text-center">{text}</span>
    </button>
  );
}
