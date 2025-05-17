import { BiSearch } from "react-icons/bi";

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
      <BiSearch />
    </div>
  );
}
