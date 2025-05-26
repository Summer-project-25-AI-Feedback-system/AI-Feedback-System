import type { SortOption } from "src/utils/sortingUtils";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";

export default function SortableHeader({
  label,
  currentSort,
  ascValue,
  descValue,
  onChange,
  center,
}: {
  label: string;
  currentSort: SortOption | undefined;
  ascValue: SortOption;
  descValue: SortOption;
  onChange?: (option: SortOption) => void;
  center?: boolean;
}) {
  const isAsc = currentSort === ascValue;
  const isDesc = currentSort === descValue;
  const isActive = isAsc || isDesc;

  return (
    <button
      onClick={() => {
        if (!onChange) return;
        onChange(isAsc ? descValue : ascValue);
      }}
      className={`flex items-center gap-1 ${center ? "justify-center" : ""}`}
    >
      {label}
      {isActive ? (
        isAsc ? (
          <IoIosArrowUp />
        ) : (
          <IoIosArrowDown />
        )
      ) : (
        <FaMinus className="text-gray-400" />
      )}
    </button>
  );
}
