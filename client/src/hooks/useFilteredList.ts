import { useMemo } from "react";

export function useFilteredList<T>(
  list: T[],
  searchTerm: string,
  predicate: (item: T, searchTerm: string) => boolean
): T[] {
  return useMemo(() => {
    return list.filter((item) => predicate(item, searchTerm));
  }, [list, searchTerm, predicate]);
}
