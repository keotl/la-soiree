import { createContext, ReactNode, useState } from "react";

export type ActiveWindowContextValue = {
  activeWindow: string;
  setActiveWindow: (windowName: string) => void;
};

export const ActiveWindowContext = createContext<ActiveWindowContextValue>({
  activeWindow: "",
  setActiveWindow: () => undefined,
});

export function ActiveWindowContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeWindow, setActiveWindow] = useState("");
  return (
    <ActiveWindowContext.Provider value={{ activeWindow, setActiveWindow }}>
      {children}
    </ActiveWindowContext.Provider>
  );
}
