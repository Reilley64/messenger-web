import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";
import useCookieState from "~/hooks/useCookieState";
import { useMutation } from "@tanstack/react-query";
import {
  AuthFlowType, ChallengeNameType, CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { useForm } from "@tanstack/react-form";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import z from "zod";

type AuthorizationContextValue = {
  getAccessToken: () => Promise<string | undefined>;
  logout: () => void;
}

const AuthorizationContext = createContext<AuthorizationContextValue | undefined>(undefined);

export function useAuthorizationContext() {
  const context = useContext(AuthorizationContext);
  if (!context) {
    throw new Error("useAuthorizationContext must be used within a AuthorizationContextProvider");
  }
  return context;
}

const client = new CognitoIdentityProviderClient({
  region: "us-east-1",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initiateAuthSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type InitiateAuthFormValues = z.infer<typeof initiateAuthSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const respondToAuthSchema = z.object({
  password: z.string(),
});

type RespondToAuthFormValues = z.infer<typeof respondToAuthSchema>;

export default function AuthorizationContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const [authentication, setAuthentication] = useState<{ accessToken: string; expiresAt: Date }>();
  const [refreshToken, setRefreshToken] = useCookieState<string | undefined>("refreshToken", undefined);

  const initiateAuthMutation = useMutation({
    mutationFn: (variables: { authFlow: AuthFlowType, authParameters: Record<string, string> }) => {
      const command = new InitiateAuthCommand({
        AuthFlow: variables.authFlow,
        AuthParameters: variables.authParameters,
        ClientId: "6keh4oovqmki0f50mtqk462s7p",
      });
      return client.send(command);
    },
    onSuccess: async (data) => {
      if (!data.AuthenticationResult) return;

      if (!data.AuthenticationResult.AccessToken || !data.AuthenticationResult.ExpiresIn) return;
      setAuthentication({
        accessToken: data.AuthenticationResult.AccessToken,
        expiresAt: new Date(new Date().getTime() + data.AuthenticationResult.ExpiresIn),
      });

      if (!data.AuthenticationResult.RefreshToken) return;
      await setRefreshToken(data.AuthenticationResult.RefreshToken);
    },
  });

  const initiateAuthForm = useForm<InitiateAuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      initiateAuthMutation.mutate({ authFlow: AuthFlowType.USER_PASSWORD_AUTH, authParameters: { USERNAME: value.email, PASSWORD: value.password } });
    },
  });

  const respondToAuthChallengeMutation = useMutation({
    mutationFn: (variables: RespondToAuthFormValues) => {
      const command = new RespondToAuthChallengeCommand({
        ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
        ChallengeResponses: {
          USERNAME: initiateAuthMutation.variables!.authParameters.USERNAME,
          NEW_PASSWORD: variables.password,
        },
        ClientId: "6keh4oovqmki0f50mtqk462s7p",
        Session: initiateAuthMutation.data!.Session,
      });
      return client.send(command);
    },
    onSuccess: async (data) => {
      if (!data.AuthenticationResult) return;

      if (!data.AuthenticationResult.AccessToken || !data.AuthenticationResult.ExpiresIn) return;
      setAuthentication({
        accessToken: data.AuthenticationResult.AccessToken,
        expiresAt: new Date(new Date().getTime() + data.AuthenticationResult.ExpiresIn),
      });

      if (!data.AuthenticationResult.RefreshToken) return;
      await setRefreshToken(data.AuthenticationResult.RefreshToken);
    },
    onError: () => {
      void setRefreshToken("");
    },
  });

  const respondToAuthChallengeForm = useForm<RespondToAuthFormValues>({
    defaultValues: {
      password: "",
    },
    onSubmit: async ({ value }) => {
      respondToAuthChallengeMutation.mutate(value);
    },
  });

  const getAccessToken = useCallback(async () => {
    if (!authentication && !refreshToken) return undefined;

    if (!authentication || new Date() >= authentication.expiresAt) {
      if (!refreshToken) return undefined;
      const refreshAuthResponse = await initiateAuthMutation.mutateAsync({
        authFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        authParameters: { REFRESH_TOKEN: refreshToken },
      });
      if (!refreshAuthResponse.AuthenticationResult) return;
      return refreshAuthResponse.AuthenticationResult.AccessToken;
    }

    return authentication.accessToken;
  }, [authentication, refreshToken]);

  const logout = useCallback(() => {
    setAuthentication(undefined);
    setRefreshToken(undefined);
  }, [setAuthentication, setRefreshToken])

  if (!authentication && !refreshToken) {
    if (initiateAuthMutation.isSuccess && initiateAuthMutation.data.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
      return (
        <div className="flex h-[calc(100dvh)] w-screen flex-col justify-center font-[Geist]">
          <form
            className="mx-auto flex w-full max-w-sm flex-col space-y-6 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void respondToAuthChallengeForm.handleSubmit();
            }}
          >
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-2xl font-semibold tracking-tight">
                New password required
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your new password below to update your credentials
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <respondToAuthChallengeForm.Field
                name="password"
                children={(field) => (
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
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
              Submit
            </Button>
          </form>
        </div>
      );
    }

    return (
      <div className="flex h-[calc(100dvh)] w-screen flex-col justify-center font-[Geist]">
        <form
          className="mx-auto flex w-full max-w-sm flex-col space-y-6 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void initiateAuthForm.handleSubmit();
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
            <initiateAuthForm.Field
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

            <initiateAuthForm.Field
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
    <AuthorizationContext.Provider value={{ getAccessToken, logout }}>
      {children}
    </AuthorizationContext.Provider>
  );
}
