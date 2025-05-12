import { useState } from 'react';
import { FaSync } from 'react-icons/fa';

interface RepoButtonProps {
  text: string;
}

export default function RepoButton({ text }: RepoButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);

    // todo: add refreshing functionality 
    setTimeout(() => {
      setIsSpinning(false); 
    }, 1000); 
  };

  return (
    <button onClick={handleClick} className="flex items-center justify-between px-4 py-3 h-[40px] rounded-full w-fit min-w-[95px] gap-2 bg-[#1D1B20] hover:opacity-90 text-white">
      <span className="text-xs sm:text-sm">{text}</span>
      <FaSync className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
    </button>
  )
}
