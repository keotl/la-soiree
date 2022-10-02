import { createContext, ReactNode, useState } from "react";
import { EpisodeSegment, searchSegments } from "../api";

export type SearchResultsContextValue = {
  segments: EpisodeSegment[];
  searchSegmentsByText: (query: string) => void;
};

export const SearchResultsContext = createContext<SearchResultsContextValue>({
  segments: [],
  searchSegmentsByText: () => undefined,
});

export function SearchResultsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [segments, setSegments] = useState<EpisodeSegment[]>([]);
  function searchSegmentsByText(query: string) {
    return searchSegments(query).then(setSegments);
  }

  return (
    <SearchResultsContext.Provider value={{ segments, searchSegmentsByText }}>
      {children}
    </SearchResultsContext.Provider>
  );
}
