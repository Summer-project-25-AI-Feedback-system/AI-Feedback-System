import type { SortOption } from "src/utils/sortingUtils";
import SortableHeader from "../../components/SortableHeader";

interface ListHeaderProps {
  type: "repo" | "submission" | "assignment" | "org";
  sortOrder?: SortOption;
  onSortChange?: (option: SortOption) => void;
}

export default function ListHeader({
  type,
  sortOrder,
  onSortChange,
}: ListHeaderProps) {
  if (type === "org") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <SortableHeader
          label="Organization name"
          currentSort={sortOrder}
          ascValue="A–Z"
          descValue="Z–A"
          onChange={onSortChange}
        />
        <p className="text-left">Description</p>
      </div>
    );
  }

  if (type === "assignment") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <SortableHeader
          label="Assignment name"
          currentSort={sortOrder}
          ascValue="A–Z"
          descValue="Z–A"
          onChange={onSortChange}
        />
        <SortableHeader
          label="Amount of Students"
          currentSort={sortOrder}
          ascValue="Amount of Students"
          descValue="Amount of Students (desc)"
          onChange={onSortChange}
          center
        />
        <SortableHeader
          label="Last updated"
          currentSort={sortOrder}
          ascValue="Oldest"
          descValue="Newest"
          onChange={onSortChange}
        />
      </div>
    );
  }

  if (type === "repo") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <SortableHeader
          label="Repository name"
          currentSort={sortOrder}
          ascValue="A–Z"
          descValue="Z–A"
          onChange={onSortChange}
        />
        <p className="text-center">Students</p>
        <SortableHeader
          label="Last updated"
          currentSort={sortOrder}
          ascValue="Oldest"
          descValue="Newest"
          onChange={onSortChange}
        />
      </div>
    );
  }

  if (type === "submission") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <p className="text-center">Student</p>
        <p className="text-center">Submission status</p>
        <p className="text-center">Grade</p>
      </div>
    );
  }
}
