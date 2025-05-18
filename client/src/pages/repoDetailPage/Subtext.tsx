interface SubtextProps {
  text: string;
}

export default function Subtext({ text }: SubtextProps) {
  return (
    <div>
        <p className="text-[16px]">{text}</p>
    </div>
  )
}
