interface SubtextProps {
  text: string | undefined;
}

export default function Subtext({ text }: SubtextProps) {
  return (
    <div>
        <p className="text-[16px]">{text}</p>
    </div>
  )
}
