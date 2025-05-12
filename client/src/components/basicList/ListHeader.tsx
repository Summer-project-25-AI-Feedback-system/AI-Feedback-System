interface ListHeaderProps {
  type: "repo" | "submission";
}

export default function ListHeader({ type }: ListHeaderProps) {
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
  )
}
