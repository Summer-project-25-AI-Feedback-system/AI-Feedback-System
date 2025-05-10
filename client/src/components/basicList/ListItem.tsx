import ListButton from "./ListButton";
import type { RepoInfo } from "../../types/RepoInfo";

interface ListItemProps {
  repoInfo: RepoInfo;
}

export default function ListItem({ repoInfo }: ListItemProps) {
  return (
    <div className="grid grid-cols-[40px_2fr_1fr_1fr_auto] h-[56px] w-full max-w-[870px] items-center border-b border-l border-r border-[#D9D9D9] text-xs sm:text-sm px-4 gap-4">
      <img src={repoInfo.repoPicture} alt="repo" className="w-6 h-6" />
      <p>{repoInfo.name}</p>
      <p>{repoInfo.amountOfStudents}</p>
      <p>{repoInfo.timeOfLastUpdate}</p>
      <ListButton text="View Details" />
    </div>
  )
}
