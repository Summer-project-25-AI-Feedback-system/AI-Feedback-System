import { useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";

interface FilterButtonProps {
    buttonText: string;
    items: string[];
}

export default function FilterButton({ buttonText, items }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative inline-block">
        <button onClick={toggleDropdown} className="flex items-center justify-between border border-[#D9D9D9] px-4 py-3 h-[40px] rounded-full w-fit gap-2">
            <span className="text-sm text-[#1E1E1E] text-[16px]">{buttonText}</span>
            <BiSolidDownArrow className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}/>
        </button>
        {isOpen && (
            <ul className="absolute mt-2 w-full bg-white border border-[#D9D9D9] rounded-md shadow-md z-10">
                {items.map((item, index) => (
                    <li key={index} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#1E1E1E]"
                        onClick={() => { setIsOpen(false); }}> 
                        {item}
                    </li>
                ))}
            </ul>
        )}
    </div>  
  )
}
