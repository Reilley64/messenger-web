import { createFileRoute, Link } from "@tanstack/react-router";
import { usePrivateKeyContext } from "~/components/PrivateKeyContext";
import { useMessageRestControllerApiSuspenseQuery } from "~/hooks/useApiSuspenseQuery";
import { decryptMessage } from "~/lib/utils.ts";

export const Route = createFileRoute("/")({
  component: () => <Home />,
});

function Home() {
  const { privateKeyBase64 } = usePrivateKeyContext();

  const getLatestMessagesQuery = useMessageRestControllerApiSuspenseQuery({
    queryKey: ["getLatestMessages"],
    queryFn: async (api) => {
      const messages = await api.getMessages();
      return await Promise.all(messages.map(async (message) => ({
        ...message,
        content: await decryptMessage(privateKeyBase64, message.content),
      })));
    },
  });

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-2xl font-semibold tracking-tight">
        Chats
      </h3>

      <div className="space-y-3">
        {getLatestMessagesQuery.data.map((message) => (
          <Link key={message.id} to={`/g/${message.group.id}`}>
            <h4 className="text-lg font-semibold tracking-tight">
              {message.source.name}
            </h4>
            <p className="text-muted-foreground">
              {message.content}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
