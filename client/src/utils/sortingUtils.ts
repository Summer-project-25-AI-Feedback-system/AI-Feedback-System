export type SortOption =
  | "Newest"
  | "Oldest"
  | "A–Z"
  | "Z–A"
  | "Amount of Students";

export function sortData<
  T extends { updatedAt: string; name: string; amountOfStudents: number }
>(data: T[], sortOrder: SortOption): T[] {
  return [...data].sort((a, b) => {
    switch (sortOrder) {
      case "Newest":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "Oldest":
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      case "A–Z":
        return a.name.localeCompare(b.name);
      case "Z–A":
        return b.name.localeCompare(a.name);
      case "Amount of Students":
        return (b.amountOfStudents ?? 0) - (a.amountOfStudents ?? 0);
      default:
        return 0;
    }
  });
}
