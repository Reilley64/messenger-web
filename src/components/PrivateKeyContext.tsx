import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext } from "react";
import useLocalStorageState from "~/hooks/useLocalStorageState";
import { useAuthUserContext } from "~/components/AuthUserContext.tsx";

type PrivateKeyContextValue = {
  privateKeyBase64: string;
  setPrivateKeyBase64: Dispatch<SetStateAction<string | undefined>>;
}

const PrivateKeyContext = createContext<PrivateKeyContextValue | undefined>(undefined);

export function usePrivateKeyContext() {
  const context = useContext(PrivateKeyContext);
  if (!context) {
    throw new Error("useAuthorizationContext must be used within a AuthorizationContextProvider");
  }
  return context;
}

export default function PrivateKeyContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const { authUser } = useAuthUserContext();

  const [privateKeyBase64, setPrivateKeyBase64] = useLocalStorageState<string | undefined>(`${authUser.id}.privateKeyBase64`, undefined);

  if (!privateKeyBase64) {
    return "No private key";
  }

  return (
    <PrivateKeyContext.Provider value={{ privateKeyBase64, setPrivateKeyBase64 }}>
      {children}
    </PrivateKeyContext.Provider>
  );
}
