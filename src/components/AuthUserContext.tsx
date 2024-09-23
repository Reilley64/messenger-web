import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { rspc } from "~/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "~/components/Loading";
import { UserResponseDto } from "~/gen";

type AuthUserContextValue = {
  authUser: UserResponseDto;
}

const AuthUserContextValue = createContext<AuthUserContextValue | undefined>(undefined);

export function useAuthUserContext() {
  const context = useContext(AuthUserContextValue);
  if (!context) {
    throw new Error("useAuthorizationContext must be used within a AuthorizationContextProvider");
  }
  return context;
}

export default function AuthUserContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const queryClient = useQueryClient();

  const getAuthUserQuery = rspc.useQuery(["auth.getAuthUser"], {
    retry: (failureCount, error) => failureCount < 3 && error.code !== 404,
  });

  const createUserMutation = rspc.useMutation("users.createUser", {
    onSuccess: (data) => queryClient.setQueryData(["getAuthUser"], data),
  });

  useEffect(() => {
    async function createUser() {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: { name: "SHA-256" } },
        true,
        ["encrypt", "decrypt"],
      );

      const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

      const user = await createUserMutation.mutateAsync({ publicKey: publicKeyBase64 });
      localStorage.setItem(`${user.id}.privateKeyBase64`, JSON.stringify(privateKeyBase64));
    }

    if (getAuthUserQuery.isError && getAuthUserQuery.error.code === 404 && !createUserMutation.isSuccess && !createUserMutation.isPending) {
      void createUser()
    }
  }, [
    getAuthUserQuery.isError,
    getAuthUserQuery.error?.code,
    createUserMutation.isSuccess,
    createUserMutation.isPending,
  ]);

  if (getAuthUserQuery.isSuccess) {
    return (
      <AuthUserContextValue.Provider value={{ authUser: getAuthUserQuery.data }}>
        {children}
      </AuthUserContextValue.Provider>
    );
  }

  return <Loading />;
}
