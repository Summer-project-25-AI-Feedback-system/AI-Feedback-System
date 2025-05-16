interface ListHeaderProps {
  type: "repo" | "submission" | "assignment";
}

export default function ListHeader({ type }: ListHeaderProps) {
  if (type === "assignment") {
    return (
      <div className="grid grid-cols-[40px_1fr_1fr_1fr_auto] text-xs sm:text-sm px-4 gap-4 font-bold border border-[#D9D9D9] bg-gray-100 h-[56px] items-center">
        <p className="col-span-5 text-center">Assignment Name</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[40px_1fr_1fr_1fr_auto] h-[40px] w-full bg-[#EADDFF] text-left items-center text-xs sm:text-sm md:text-base px-4 gap-2">
      <div></div>
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
      <div></div>
    </div>
  );
}
