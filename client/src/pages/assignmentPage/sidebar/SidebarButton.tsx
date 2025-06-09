import { BiMenu, BiX } from 'react-icons/bi';

interface SidebarButtonProps {
  isOpen: boolean; 
  toggle: () => void;
}

export default function SidebarButton({ isOpen, toggle }: SidebarButtonProps) {
  return (
    <button
        className="md:hidden p-4"
        onClick={toggle}
        aria-label="Toggle Sidebar"
        >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
    </button>
  )
}
