interface ListHeaderProps {
  type: "repo" | "submission" | "assignment";
}

export default function ListHeader({ type }: ListHeaderProps) {
  if (type === "assignment") {
    return (
      <div className="grid grid-cols-[1fr_1fr_1fr] h-[40px] w-full bg-[#EADDFF] text-left items-center text-xs sm:text-sm md:text-base px-4 gap-2">
        <p className="text-center">Assignment name</p>
        <p className="text-center">Students</p>
        <p className="text-center">Last updated</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] h-[40px] w-full bg-[#EADDFF] text-left items-center text-xs sm:text-sm md:text-base px-4 gap-2">
      {type === "repo" ? (
        <>
          <p className="text-center">Repository name</p>
          <p className="text-center">Students</p>
          <p className="text-center">Last updated</p>
        </>
      ) : (
        <>
          <p className="text-center">Student</p>
          <p className="text-center">Submission status</p>
          <p className="text-center">Grade</p>
        </>
      )}
    </div>
  );
}
