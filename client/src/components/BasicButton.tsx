interface BasicButtonProps {
  text: string;
}

export default function BasicButton({ text }: BasicButtonProps) {
  return (
    <button className="flex items-center justify-between border border-[#D9D9D9] px-4 py-3 h-[40px] rounded-full w-fit min-w-[95px] gap-2 bg-[#1D1B20] text-white">
      <span className="text-xs sm:text-sm">{text}</span>
    </button>
  )
}
