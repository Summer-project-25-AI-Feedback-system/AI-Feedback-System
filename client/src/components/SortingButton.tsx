import { useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
interface FilterButtonProps {
  buttonText: string;
  items: string[];
  onSelect?: (value: string) => void;
}

export default function SortingButton({
  buttonText,
  items,
  onSelect,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (item: string) => {
    onSelect?.(item);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between border border-[#D9D9D9] px-4 py-3 rounded-full w-fit min-w-[95px] gap-2 h-[56px]"
      >
        <span className="text-xs sm:text-sm text-[#1E1E1E]">{buttonText}</span>
        <BiSolidDownArrow
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      {isOpen && (
        <ul className="absolute mt-2 w-full bg-white border border-[#D9D9D9] rounded-md shadow-md z-10">
          {items.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-[#1E1E1E]"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
