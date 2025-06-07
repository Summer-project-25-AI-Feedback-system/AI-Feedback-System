interface ProgressBarProps {
  progress: number; // 0 to 100
}

export default function ProgressBar({ progress }: ProgressBarProps) {

  // commonted out for now, would normally give more colours
  /*let bgColor = "bg-red-500";
  if (progress >= 70) {
    bgColor = "bg-green-500";
  } else if (progress >= 40) {
    bgColor = "bg-yellow-400";
  }*/

  let bgColor = "bg-black"

  return (
     <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`${bgColor} h-full transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
