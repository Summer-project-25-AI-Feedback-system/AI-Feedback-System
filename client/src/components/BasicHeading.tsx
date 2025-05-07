interface BasicHeadingProps {
    heading: string;
  }

export default function BasicHeading({ heading }: BasicHeadingProps) {
  return (
    <h1 className="text-[29px] font-bold">{heading}</h1>
  )
}
