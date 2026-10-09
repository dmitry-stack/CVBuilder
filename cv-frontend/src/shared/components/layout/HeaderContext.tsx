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
  entityId: string | null;
  setUserName: (name: string | null, entityId?: string | null) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  userName: null,
  entityId: null,
  setUserName: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null);
  const [entityId, setEntityIdState] = useState<string | null>(null);

  const setUserName = (name: string | null, newEntityId?: string | null) => {
    setUserNameState(name);
    setEntityIdState(newEntityId !== undefined ? newEntityId : null);
  };

  return (
    <HeaderContext.Provider value={{ userName, entityId, setUserName }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  return useContext(HeaderContext);
}

export function HeaderSync({
  userName,
  entityId,
}: {
  userName?: string | null;
  entityId?: string | null;
}) {
  const { setUserName } = useHeaderContext();

  useEffect(() => {
    if (userName !== undefined) {
      setUserName(userName ?? null, entityId ?? null);
    }
  }, [userName, entityId, setUserName]);

  return null;
}
