import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAuthUserQuery } from "~/hooks/useGetAuthUserQuery.ts";
import { useUserRestControllerApiMutation } from "~/hooks/useApiMutation.ts";
import { UserResponseDto } from "~/api";

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

  const getAuthUserQuery = useGetAuthUserQuery({
    retry: (failureCount, error) => failureCount < 3 && error.response.status !== 404,
  });

  const createUserMutation = useUserRestControllerApiMutation({
    mutationFn: (api) => async () => {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: { name: "SHA-256" } },
        true,
        ["encrypt", "decrypt"],
      );

      const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

      const user = await api.createUser({ userRequestDto: { publicKey: publicKeyBase64 } });
      localStorage.setItem(`${user.id}.privateKeyBase64`, JSON.stringify(privateKeyBase64));

      return user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["AuthRestControllerApi", "getAuthUser"], data);
    },
  });

  useEffect(() => {
    if (getAuthUserQuery.isError && getAuthUserQuery.error.response.status === 404 && !createUserMutation.isPending) {
      createUserMutation.mutate();
    }
  }, [
    getAuthUserQuery.isError,
    getAuthUserQuery.error?.response.status,
    createUserMutation.isPending,
  ]);

  if (getAuthUserQuery.isSuccess) {
    return (
      <AuthUserContextValue.Provider value={{ authUser: getAuthUserQuery.data }}>
        {children}
      </AuthUserContextValue.Provider>
    );
  }

  return "Loading...";
}
