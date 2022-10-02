import { ReactNode } from "react";
import { ActiveWindowContextProvider } from "./ActiveWindowContext";
import { PlaylistContextProvider } from "./PlaylistContext";
import { SearchResultsContextProvider } from "./SearchResultsContext";

type Props = {
  children: ReactNode;
};

export function Providers(props: Props) {
  return (
    <ActiveWindowContextProvider>
      <SearchResultsContextProvider>
        <PlaylistContextProvider>{props.children}</PlaylistContextProvider>
      </SearchResultsContextProvider>
    </ActiveWindowContextProvider>
  );
}
