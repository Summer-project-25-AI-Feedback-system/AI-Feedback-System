import { BiMenu, BiX } from 'react-icons/bi';

interface SidebarButtonProps {
  isOpen: boolean; 
  toggle: () => void;
}

export default function SidebarButton({ isOpen, toggle }: SidebarButtonProps) {
  return (
    <button
        className="md:hidden p-4 mt-8 w-fit ml-4 rounded-full bg-[#1D1B20] hover:opacity-90 text-white"
        onClick={toggle}
        aria-label="Toggle Sidebar"
        >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
    </button>
  )
}
