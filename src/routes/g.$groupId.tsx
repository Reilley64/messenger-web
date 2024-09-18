import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  useGroupRestControllerApiSuspenseQuery,
} from "~/hooks/useApiSuspenseQuery";
import { ArrowLeftIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { usePrivateKeyContext } from "~/components/PrivateKeyContext";
import { cn, decryptMessage, encryptMessage } from "~/lib/utils";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useGroupRestControllerApiMutation } from "~/hooks/useApiMutation";
import { useForm } from "@tanstack/react-form";
import { useAuthUserContext } from "~/components/AuthUserContext";
import { useAuthorizationContext } from "~/components/AuthorizationContext";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MessageResponseDto } from "~/api";

export const Route = createFileRoute("/g/$groupId")({
  component: () => <Group />,
});

function Group() {
  const {getAccessToken} = useAuthorizationContext();
  const {authUser} = useAuthUserContext();
  const { groupId } = Route.useParams();
  const {privateKeyBase64} = usePrivateKeyContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const messageStartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messageStartRef.current) {
      messageStartRef.current.scrollIntoView();
    }
  }, [messageStartRef.current]);

  const getGroupQuery = useGroupRestControllerApiSuspenseQuery({
    queryKey: ["getGroup", { groupId }],
    queryFn: async (api) => await api.getGroup({ groupId }),
  });

  const getGroupMessagesQuery = useGroupRestControllerApiSuspenseQuery({
    queryKey: ["getGroupMessages", { groupId }],
    queryFn: async (api) => {
      const messages = await api.getGroupMessages({ groupId });
      return await Promise.all(messages.map(async (message) => ({
        ...message,
        content: await decryptMessage(privateKeyBase64, message.content),
      })));
    },
  });

  useEffect(() => {
    if (getGroupMessagesQuery.data.length > 1
      && getGroupMessagesQuery.data[getGroupMessagesQuery.data.length - 1].source.id === authUser.id
      && messageStartRef.current) {
      messageStartRef.current.scrollIntoView();
    }
  }, [getGroupMessagesQuery.data]);

  const createMessagesMutation = useGroupRestControllerApiMutation({
    mutationFn: (api) => async (variables: { content: string }) => {
      return await api.createGroupMessage({
        groupId,
        body: {
          content: Object.fromEntries(await Promise.all(getGroupQuery.data.users.map(async (user) => [user.id, await encryptMessage(user.publicKey, variables.content)]))),
        },
      });
    },
    onSuccess: async (message) => {
      createMessageForm.reset();

      message = { ...message, content: await decryptMessage(privateKeyBase64, message.content) };

      void queryClient.setQueryData(["GroupRestControllerApi", "getGroupMessages", { groupId }], (oldData: Array<MessageResponseDto>) => {
        if (!oldData) return oldData;

        if (oldData.some((oldMessage) => oldMessage.id === message.id)) {
          return oldData.map((oldMessage) => {
            if (oldMessage.id !== message.id) return oldMessage;
            return { ...oldMessage, content: message.content };
          });
        }

        return {
          message,
          ...oldData,
        };
      });
    },
  });

  const createMessageForm = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({value}) => {
      createMessagesMutation.mutate(value);
    },
  });

  const [token, setToken] = useState<string>();

  useEffect(() => {
    async function loadToken() {
      setToken(await getAccessToken());
    }

    void loadToken();
  }, [token]);

  // useWebSocket(`ws://api.messenger.reilley.dev/ws/notifications?token=${token}`, {
  //   onMessage: async (event) => {
  //     const message = MessageResponseDtoFromJSON(JSON.parse(event.data));
  //     message.content = await decryptMessage(privateKeyBase64, message.content);
  //
  //     void queryClient.setQueryData(["GroupRestControllerApi", "getGroupMessages", { groupId }], (oldData: PagedModelMessageResponseDto) => {
  //       if (!oldData || !oldData.content) return oldData;
  //
  //       if (oldData.content.some((oldMessage) => oldMessage.id === message.id)) {
  //         return {
  //           ...oldData,
  //           content: oldData.content.map((oldMessage) => {
  //             if (oldMessage.id !== message.id) return oldMessage;
  //             return { ...oldMessage, content: message.content };
  //           }),
  //         };
  //       }
  //
  //       return {
  //         ...oldData,
  //         content: [
  //           message,
  //           ...oldData.content,
  //         ],
  //       };
  //     });
  //   },
  // });

  return (
    <div className="flex h-screen w-screen flex-col justify-center font-[Geist]">
      <div className="flex shrink-0 grow-0 basis-[64px] items-center space-x-3 px-6">
        <ArrowLeftIcon onClick={() => router.history.go(-1)}/>

        <h4 className="text-xl font-semibold tracking-tight">
          {getGroupQuery.data.name}
        </h4>
      </div>

      <div className="flex flex-grow flex-col-reverse overflow-y-scroll px-6">
        <div ref={messageStartRef}/>

        {getGroupMessagesQuery.data
          && getGroupMessagesQuery.data.map((message) => (
            <div
              key={message.id}
              className={cn("items-end flex gap-x-1.5 mb-3", message.source.id === authUser.id ? "flex-row-reverse" : "flex-row")}
            >
              {message.source.id !== authUser.id && (
                <Avatar>
                  <AvatarFallback>{message.source.name.split(" ").map((name) => name.charAt(0))}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "flex max-w-[75%] flex-col space-y-0.5 rounded-xl border p-3",
                  message.source.id === authUser.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary bg-background text-foreground"
                )}
              >
                <p>
                  {message.content}
                </p>
                <p className="text-xs text-muted-foreground">
                  {message.createdAt.getHours().toString().padStart(2, "0")}:{message.createdAt.getMinutes().toString().padStart(2, "0")}
                </p>
              </div>
            </div>
          ))}
      </div>

      <form
        className="flex shrink-0 grow-0 basis-[64px] items-center space-x-3 px-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void createMessageForm.handleSubmit();
        }}
      >
        <createMessageForm.Field
          name="content"
          children={(field) => (
            <Input
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Message"
              value={field.state.value}
            />
          )}
        />
      </form>
    </div>
  );
}
