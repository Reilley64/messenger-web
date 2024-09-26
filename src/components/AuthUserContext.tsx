import { createContext, PropsWithChildren, useContext } from "react";
import { rspc } from "~/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "~/components/Loading";
import { UserResponseDto } from "~/gen";
import { Label } from "~/components/ui/label.tsx";
import { Input } from "~/components/ui/input.tsx";
import { Button } from "~/components/ui/button.tsx";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { useAuthorizationContext } from "~/components/AuthorizationContext.tsx";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function AuthUserContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const { user } = useAuthorizationContext();
  const queryClient = useQueryClient();

  const getAuthUserQuery = rspc.useQuery(["auth.getAuthUser"], {
    retry: (failureCount, error) => failureCount < 3 && error.code !== 404,
  });

  const createUserMutation = rspc.useMutation("users.createUser", {
    onSuccess: (data) => queryClient.setQueryData(["auth.getAuthUser"], data),
  });

  const signInForm = useForm<SignUpFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async ({ value }) => {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: { name: "SHA-256" } },
        true,
        ["encrypt", "decrypt"],
      );

      const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)));

      const authUser = await createUserMutation.mutateAsync({ ...value, email: user.email!, publicKey: publicKeyBase64 });
      localStorage.setItem(`${authUser.id}.privateKeyBase64`, JSON.stringify(privateKeyBase64));
    },
  });

  if (getAuthUserQuery.isError && getAuthUserQuery.error.code === 404) {
    return (
      <div className="fixed inset-0 flex w-screen flex-col justify-center font-[Geist]">
        <form
          className="mx-auto flex w-full max-w-sm flex-col space-y-6 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void signInForm.handleSubmit();
          }}
        >
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-2xl font-semibold tracking-tight">
              Complete your profile
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <signInForm.Field
              name="firstName"
              children={(field) => (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={field.name}>First name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                  />
                </div>
              )}
            />

            <signInForm.Field
              name="lastName"
              children={(field) => (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={field.name}>Last name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value={field.state.value}
                  />
                </div>
              )}
            />
          </div>

          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </div>
    );
  }

  if (getAuthUserQuery.isSuccess) {
    return (
      <AuthUserContextValue.Provider value={{authUser: getAuthUserQuery.data}}>
        {children}
      </AuthUserContextValue.Provider>
    );
  }

  return <Loading/>;
}
