import { BiSearch } from "react-icons/bi";

export default function BasicSearchBar() {
  return (
    <div className="w-[360px] h-[56px] border border-[#D9D9D9] rounded-full flex items-center px-4">
      <input
        type="text"
        placeholder="Search by repository name or class"
        className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
      />
      <BiSearch></BiSearch>
    </div>
  )
}
