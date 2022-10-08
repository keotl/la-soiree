import { createContext, ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";

type SearchQueryContextType = {
  query: string;
  setQuery: (q: string) => void;
};

export const SearchQueryContext = createContext<SearchQueryContextType>({
  query: "",
  setQuery: () => undefined,
});

export function SearchQueryContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [query, setQuery] = useState<string>(
    new URLSearchParams(window.location.search).get("q") || ""
  );
  return (
    <SearchQueryContext.Provider
      value={{
        query,
        setQuery,
      }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
}
