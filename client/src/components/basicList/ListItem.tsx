import type { RepoInfo } from "../../types/RepoInfo";

interface ListItemProps {
  repoInfo: RepoInfo;
  onClick?: () => void;
}

export default function ListItem({ repoInfo, onClick }: ListItemProps) {
  return (
    <div onClick={onClick} className="grid grid-cols-[40px_1fr_1fr_1fr_auto] h-[56px] w-full items-center border-b border-l border-r border-[#D9D9D9] text-xs sm:text-sm px-4 gap-4 hover:bg-gray-100 cursor-pointer">
      <img src={repoInfo.repoPicture} alt="repo" className="w-6 h-6" />
      <p className="text-center">{repoInfo.name}</p>
      <p className="text-center">{repoInfo.amountOfStudents}</p>
      <p className="text-center">{repoInfo.timeOfLastUpdate}</p>
    </div>
  )
}
