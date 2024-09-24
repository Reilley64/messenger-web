import { Outlet, createRootRoute } from "@tanstack/react-router";
import AuthorizationContextProvider, { useAuthorizationContext } from "~/components/AuthorizationContext";
import AuthUserContextProvider from "~/components/AuthUserContext";
import PrivateKeyContextProvider from "~/components/PrivateKeyContext";
import { createClient, WebsocketTransport } from "@rspc/client";
import { Procedures } from "~/gen";
import { rspc } from "~/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import Loading from "~/components/Loading";

export const Route = createRootRoute({
  component: () => <Root />,
});

function RspcProvider(props: PropsWithChildren) {
  const { children } = props;

  const { getAccessToken } = useAuthorizationContext();

  const [token, setToken] = useState<string>();

  useEffect(() => {
    async function getToken() {
      setToken(await getAccessToken());
    }

    void getToken();
  }, [getAccessToken]);

  const queryClient = useQueryClient();

  const client = createClient<Procedures>({
    transport: new WebsocketTransport(`${import.meta.env.VITE_API_BASE_URL}/rspc/ws?authorization=${token}`)
  });

  if (!token) {
    return <Loading />;
  }

  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <Fragment>
        {children}
      </Fragment>
    </rspc.Provider>
  )
}

function SubscriptionMessages(props: PropsWithChildren) {
  const { children } = props;

  rspc.useSubscription(["messages.subscribeToMessages"], {
    onData: (data) => console.log(data),
  });

  return (
    <Fragment>
      {children}
    </Fragment>
  );
}

function Root() {
  return (
    <AuthorizationContextProvider>
      <RspcProvider>
          <AuthUserContextProvider>
            <PrivateKeyContextProvider>
              <SubscriptionMessages>
                <Outlet />
              </SubscriptionMessages>
            </PrivateKeyContextProvider>
          </AuthUserContextProvider>
      </RspcProvider>
    </AuthorizationContextProvider>
  );
}
