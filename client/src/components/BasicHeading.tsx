interface BasicHeadingProps {
    heading: string;
    styling?: string;
}

export default function BasicHeading({ heading, styling = "" }: BasicHeadingProps) {
  return (
    <h1 className={`text-[29px] font-bold ${styling}`}>{heading}</h1>
  )
}