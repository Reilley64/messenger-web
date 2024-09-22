import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { usePrivateKeyContext } from "~/components/PrivateKeyContext";
import { cn, decryptMessage, encryptMessage, rspc } from "~/lib/utils";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useForm } from "@tanstack/react-form";
import { useAuthUserContext } from "~/components/AuthUserContext";
import { useAuthorizationContext } from "~/components/AuthorizationContext";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { v4 as uuid } from "uuid";
import Loading from "~/components/Loading";
import { MessageResponseDto } from "~/gen.ts";

export const Route = createFileRoute("/g/$groupId")({
  component: () => <Group />,
});

function Group() {
  const { getAccessToken } = useAuthorizationContext();
  const { authUser } = useAuthUserContext();
  const { groupId } = Route.useParams();
  const { privateKeyBase64 } = usePrivateKeyContext();
  const queryClient = useQueryClient();

  const messageStartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messageStartRef.current) {
      messageStartRef.current.scrollIntoView();
    }
  }, [messageStartRef.current]);

  const getGroupQuery = rspc.useQuery(["GroupController.getGroup", groupId]);
  const getGroupMessagesQuery = rspc.useQuery(["GroupController.getGroupMessages", groupId]);
  const getGroupMessagesDecryptedQuery = useQuery({
    queryKey: ["getGroupMessagesDecrypted", getGroupMessagesQuery.data],
    queryFn: async () => {
      return await Promise.all(getGroupMessagesQuery.data.map(async (message) => ({
        ...message,
        content: await decryptMessage(privateKeyBase64, message.content),
      })));
    },
    enabled: getGroupMessagesQuery.isSuccess,
  });

  useEffect(() => {
    if (getGroupMessagesDecryptedQuery.isSuccess
      && getGroupMessagesDecryptedQuery.data.length > 1
      && getGroupMessagesDecryptedQuery.data[getGroupMessagesDecryptedQuery.data.length - 1].source.id === authUser.id
      && messageStartRef.current) {
      messageStartRef.current.scrollIntoView();
    }
  }, [getGroupMessagesDecryptedQuery.isSuccess, getGroupMessagesDecryptedQuery.data]);

  const createGroupMessageMutation = rspc.useMutation("GroupController.createGroupMessage", {
    onMutate: async ([, messageRequest]) => {
      createMessageForm.reset();

      const message: Omit<MessageResponseDto, "id"> = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: authUser,
        content: messageRequest.content[authUser.id],
        idempotencyKey: messageRequest.idempotencyKey
      };

      void queryClient.setQueryData(["GroupRestControllerApi", "getGroupMessages", { groupId }], (oldData: Array<MessageResponseDto>) => {
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
    onSuccess: (_data, [groupId]) => queryClient.invalidateQueries({ queryKey: ["GroupController.getGroupMessages", groupId] }),
  });

  const createMessageForm = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: async ({ value }) => {
      createGroupMessageMutation.mutate([
        getGroupQuery.data.id,
        {
          content: Object.fromEntries(await Promise.all(getGroupQuery.data.users.map(async (user) => [user.id, await encryptMessage(user.publicKey, value.content)]))),
          idempotencyKey: uuid(),
        },
      ]);
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

  if (getGroupMessagesDecryptedQuery.isSuccess) {
    return (
      <div className="flex h-screen w-screen flex-col justify-center font-[Geist]">
        <div className="flex shrink-0 grow-0 basis-[64px] items-center space-x-3 px-4">
          <Link to="/">
            <Button size="icon" variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>

          <h4 className="text-xl font-semibold tracking-tight">
            {getGroupQuery.data.name}
          </h4>
        </div>

        <div className="flex flex-grow flex-col-reverse overflow-y-scroll px-6">
          <div ref={messageStartRef}/>

          {getGroupMessagesDecryptedQuery.data
            && getGroupMessagesDecryptedQuery.data.map((message) => (
              <div
                key={message.idempotencyKey}
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
                    {message.createdAt}
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

  return <Loading />;
}
