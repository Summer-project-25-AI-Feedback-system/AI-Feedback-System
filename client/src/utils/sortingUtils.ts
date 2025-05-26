export type SortOption =
  | "Newest"
  | "Oldest"
  | "A–Z"
  | "Z–A"
  | "Amount of Students"
  | "Amount of Students (desc)";

interface WithUpdatedAt {
  updatedAt: string;
}

interface WithAmountOfStudents {
  amountOfStudents: number;
}

function hasUpdatedAt(obj: unknown): obj is WithUpdatedAt {
  return typeof obj === "object" && obj !== null && "updatedAt" in obj;
}

function hasAmountOfStudents(obj: unknown): obj is WithAmountOfStudents {
  return typeof obj === "object" && obj !== null && "amountOfStudents" in obj;
}

export function sortData<T extends { name: string }>(
  data: T[],
  sortOrder: SortOption
): T[] {
  const sorted = [...data];

  switch (sortOrder) {
    case "A–Z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "Z–A":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case "Newest":
      return sorted.sort((a, b) =>
        hasUpdatedAt(a) && hasUpdatedAt(b)
          ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          : 0
      );

    case "Oldest":
      return sorted.sort((a, b) =>
        hasUpdatedAt(a) && hasUpdatedAt(b)
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : 0
      );

    case "Amount of Students":
      return sorted.sort((a, b) =>
        hasAmountOfStudents(a) && hasAmountOfStudents(b)
          ? a.amountOfStudents - b.amountOfStudents
          : 0
      );

    case "Amount of Students (desc)":
      return sorted.sort((a, b) =>
        hasAmountOfStudents(a) && hasAmountOfStudents(b)
          ? b.amountOfStudents - a.amountOfStudents
          : 0
      );

    default:
      return sorted;
  }
}
