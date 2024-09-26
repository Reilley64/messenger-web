import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import z from "zod";
import { auth } from "~/lib/firebase";
import { signInWithEmailAndPassword, User } from "firebase/auth";

type AuthorizationContextValue = {
  user: User;
  // logout: () => void;
}

const AuthorizationContext = createContext<AuthorizationContextValue | undefined>(undefined);

export function useAuthorizationContext() {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error("useAuthorizationContext must be used within a AuthorizationContextProvider");
  }
  return context;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function AuthorizationContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const [user, setUser] = useState<User>();

  const signInMutation = useMutation({
    mutationFn: async (variables: { email: string, password: string }) => {
      return await signInWithEmailAndPassword(auth, variables.email, variables.password);
    },
    onSuccess: async (data) => {
      setUser(data.user);
    },
  });

  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      void signInMutation.mutate(value);
    },
  });

  if (!user) {
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
              Login
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <signInForm.Field
              name="email"
              children={(field) => (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    autoComplete="email"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    value={field.state.value}
                  />
                </div>
              )}
            />

            <signInForm.Field
              name="password"
              children={(field) => (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    autoComplete="current-password"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
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

  return (
    <AuthorizationContext.Provider value={{ user }}>
      {children}
    </AuthorizationContext.Provider>
  );
}
