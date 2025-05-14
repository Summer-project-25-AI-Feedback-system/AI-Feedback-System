interface ListButtonProps {
  text: string;
}

export default function ListButton({ text }: ListButtonProps) {
  return (
    <button className="h-8 px-4 text-xs sm:text-sm bg-[#1D1B20] text-white rounded-full w-fit min-w-[100px]">
        {text}
    </button>
  )
}
