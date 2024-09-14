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
      const page = await api.getLatestMessages();
      return {
        ...page,
        content: await Promise.all(page.content!.map(async (message) => ({
          ...message,
          content: await decryptMessage(privateKeyBase64, message.content),
        }))),
      };
    },
  });

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-2xl font-semibold tracking-tight">
        Chats
      </h3>

      <div className="space-y-3">
        {getLatestMessagesQuery.data.content!.map((message) => (
          <Link key={message.id} to={`/g/${message.user.id}`}>
            <h4 className="text-lg font-semibold tracking-tight">
              {message.user.name}
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
