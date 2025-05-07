import { FaGithub } from 'react-icons/fa';

export default function LoginButton() {
  return (
    <button className="flex items-center bg-[#1D1B20] gap-3 px-16 py-5 hover:opacity-90 text-white text-lg rounded-full">
      <FaGithub className="w-6 h-6" />
      <span>Sign In With GitHub</span>
    </button> 
  )
}
