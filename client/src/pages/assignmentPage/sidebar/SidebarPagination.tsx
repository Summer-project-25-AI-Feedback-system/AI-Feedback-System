interface SidebarPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function SidebarPagination({ totalPages, currentPage, onPageChange }: SidebarPaginationProps) {
  return (
    <div className="mt-4 flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 rounded text-sm font-medium border ${
            currentPage === index + 1
              ? 'bg-black text-white'
              : 'bg-white text-black border-gray-300'
            }`}
            >
          {index + 1}
        </button>
      ))}
    </div>
  )
}
