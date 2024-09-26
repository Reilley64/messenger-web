import { Outlet, createRootRoute } from "@tanstack/react-router";
import AuthorizationContextProvider, { useAuthorizationContext } from "~/components/AuthorizationContext";
import AuthUserContextProvider from "~/components/AuthUserContext";
import PrivateKeyContextProvider from "~/components/PrivateKeyContext";
import { createClient, WebsocketTransport } from "@rspc/client";
import { MessageResponseDto, MessageWithGroupResponseDto, Procedures } from "~/gen";
import { rspc } from "~/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import Loading from "~/components/Loading";

export const Route = createRootRoute({
  component: () => <Root />,
});

function RspcProvider(props: PropsWithChildren) {
  const { children } = props;

  const { user } = useAuthorizationContext();

  const [token, setToken] = useState<string>();

  useEffect(() => {
    async function getToken() {
      setToken(await user.getIdToken());
    }

    void getToken();
  }, [user.getIdToken]);

  const queryClient = useQueryClient();

  if (!token) {
    return <Loading />;
  }

  const client = createClient<Procedures>({
    transport: new WebsocketTransport(`${import.meta.env.VITE_API_BASE_URL}/rspc/ws?authorization=${token}`),
  });

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

  const queryClient = useQueryClient();

  rspc.useSubscription(["messages.subscribeToMessages"], {
    onData: (message) => {
      if (!message) return;

      void queryClient.setQueryData(["messages.getMessages", message.group.id], (oldData: Array<MessageWithGroupResponseDto>) => {
        if (!oldData) return oldData;

        const messageIndex = oldData.findIndex((m) => m.group.id === message.group.id);

        if (messageIndex != -1) {
          oldData[messageIndex] = message;
          return oldData;
        }

        return [
          message,
          ...oldData,
        ];
      });

      void queryClient.setQueryData(["groups.getGroupMessages", message.group.id], (oldData: Array<MessageResponseDto>) => {
        if (!oldData) return oldData;

        if (oldData.some((oldMessage) => oldMessage.idempotencyKey === message.idempotencyKey)) {
          return oldData.map((oldMessage) => {
            if (oldMessage.idempotencyKey !== message.idempotencyKey) return oldMessage;
            return { ...oldMessage, content: message.content };
          });
        }

        return [
          message,
          ...oldData,
        ];
      });
    },
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
