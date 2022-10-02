import { createContext, ReactNode, useState } from "react";

type Playable = {
  url: string;
  title: string;
  startPos: number;
  maxDuration: number | null;
};

export type PlaylistContextValue = {
  queue: Playable[];
  setQueue: (queue: Playable[]) => void;

  advance: () => void;
  clear: () => void;
};

export const PlaylistContext = createContext<PlaylistContextValue>({
  queue: [],
  setQueue: () => undefined,
  advance: () => undefined,
  clear: () => undefined,
});

export function PlaylistContextProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Playable[]>([]);
    function advance() {
	console.log("Advanced!");
    setQueue((q) => q.slice(1));
  }
  function clear() {
    setQueue([]);
  }
  return (
    <PlaylistContext.Provider value={{ queue, setQueue, advance, clear }}>
      {children}
    </PlaylistContext.Provider>
  );
}

