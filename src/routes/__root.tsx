import { Outlet, createRootRoute } from "@tanstack/react-router";
import AuthorizationContextProvider, { useAuthorizationContext } from "~/components/AuthorizationContext";
import AuthUserContextProvider from "~/components/AuthUserContext.tsx";
import PrivateKeyContextProvider from "~/components/PrivateKeyContext.tsx";
import { createClient, FetchTransport } from "@rspc/client";
import { Procedures } from "~/gen.ts";
import { rspc } from "~/lib/utils.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, PropsWithChildren } from "react";

export const Route = createRootRoute({
  component: () => <Root />,
});

function RspcProvider(props: PropsWithChildren) {
  const { children } = props;

  const { getAccessToken } = useAuthorizationContext();

  const queryClient = useQueryClient();

  const client = createClient<Procedures>({
    transport: new FetchTransport("https://api.messenger.reilley.dev", async (input, init) => {
      const accessToken = await getAccessToken();

      if (accessToken) {
        return fetch(input, { ...init, headers: { ...init?.headers, "Authorization": `Bearer ${accessToken}` } });
      }

      return fetch(input, init);
    }),
  });


  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <Fragment>
        {children}
      </Fragment>
    </rspc.Provider>
  )
}

function Root() {
  return (
    <AuthorizationContextProvider>
      <RspcProvider>
        <AuthUserContextProvider>
          <PrivateKeyContextProvider>
            <Outlet />
          </PrivateKeyContextProvider>
        </AuthUserContextProvider>
      </RspcProvider>
    </AuthorizationContextProvider>
  );
}
