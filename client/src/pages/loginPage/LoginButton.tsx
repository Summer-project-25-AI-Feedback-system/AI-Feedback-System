import { FaGithub } from 'react-icons/fa';

interface LoginButtonProps {
  onClick: () => void;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center bg-[#1D1B20] gap-3 px-16 py-5 hover:opacity-90 text-white text-lg rounded-full">
      <FaGithub className="w-6 h-6" />
      <span>Sign In With GitHub</span>
    </button> 
  )
}
