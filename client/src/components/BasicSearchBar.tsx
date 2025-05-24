import { BiSearch } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";

interface BasicSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BasicSearchBar({
  value,
  onChange,
}: BasicSearchBarProps) {
  return (
    <div className="w-[360px] h-[56px] border border-[#D9D9D9] rounded-full flex items-center px-4">
      <input
        type="text"
        placeholder="Search by repository name or class"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
      />
      {value ? (
        <button
          onClick={() => onChange("")}
          className="text-gray-500 hover:text-gray-700"
        >
          <RxCross1 size={18} />
        </button>
      ) : (
        <BiSearch className="text-gray-500" size={20} />
      )}
    </div>
  );
}
