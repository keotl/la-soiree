import { ReactNode } from "react";
import { ActiveWindowContextProvider } from "./ActiveWindowContext";
import { SearchResultsContextProvider } from "./SearchResultsContext";

type Props = {
  children: ReactNode;
};

export function Providers(props: Props) {
  return (
    <ActiveWindowContextProvider>
      <SearchResultsContextProvider>
        {props.children}
      </SearchResultsContextProvider>
    </ActiveWindowContextProvider>
  );
}
