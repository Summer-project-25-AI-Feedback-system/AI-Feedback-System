interface ListHeaderProps {
  type: "repo" | "submission" | "assignment" | "org";
}

export default function ListHeader({ type }: ListHeaderProps) {
  if (type === "org") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <p className="text-left">Organization</p>
        <p className="text-left">Description</p>
      </div>
    );
  }

  if (type === "assignment") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <p className="text-center">Assignment name</p>
        <p className="text-center">Students</p>
        <p className="text-center">Last updated</p>
      </div>
    );
  }

  if (type === "repo") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr_1fr] h-[40px] bg-[#EADDFF] px-4 gap-2 items-center text-sm font-medium border rounded border-b border-l border-r border-[#D9D9D9]">
        <div />
        <p className="text-left">Repository name</p>
        <p className="text-center">Students</p>
        <p className="text-left">Last updated</p>
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
