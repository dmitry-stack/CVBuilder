"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface HeaderContextType {
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  userName: null,
  setUserName: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <HeaderContext.Provider value={{ userName, setUserName }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  return useContext(HeaderContext);
}

export function HeaderSync({ userName }: { userName: string }) {
  const { setUserName } = useHeaderContext();

  useEffect(() => {
    setUserName(userName);
    return () => setUserName(null);
  }, [userName, setUserName]);

  return null;
}
