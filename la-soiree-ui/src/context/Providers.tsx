import { ReactNode } from "react";
import { ActiveWindowContextProvider } from "./ActiveWindowContext";
import { PlaylistContextProvider } from "./PlaylistContext";
import { SearchQueryContextProvider } from "./SearchQueryContext";
import { SearchResultsContextProvider } from "./SearchResultsContext";

type Props = {
  children: ReactNode;
};

export function Providers(props: Props) {
  return (
    <ActiveWindowContextProvider>
      <SearchResultsContextProvider>
        <SearchQueryContextProvider>
          <PlaylistContextProvider>{props.children}</PlaylistContextProvider>
        </SearchQueryContextProvider>
      </SearchResultsContextProvider>
    </ActiveWindowContextProvider>
  );
}
