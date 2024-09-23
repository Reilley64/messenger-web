import { createFileRoute, Link } from "@tanstack/react-router";
import { decryptMessage, rspc } from "~/lib/utils";
import { UserIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuthUserContext } from "~/components/AuthUserContext";
import Loading from "~/components/Loading";
import { useQuery } from "@tanstack/react-query";
import { usePrivateKeyContext } from "~/components/PrivateKeyContext.tsx";

export const Route = createFileRoute("/")({
  component: () => <Home />,
});

function Home() {
  const { authUser } = useAuthUserContext();
  const { privateKeyBase64 } = usePrivateKeyContext();

  const getLatestMessagesQuery = rspc.useQuery(["messages.getMessages"]);
  const getLatestMessagesDecryptedQuery = useQuery({
    queryKey: ["getLatestMessagesDecrypted"],
    queryFn: async () => {
      return await Promise.all(getLatestMessagesQuery.data.map(async (message) => ({
        ...message,
        content: await decryptMessage(privateKeyBase64, message.content),
      })));
    },
    enabled: getLatestMessagesQuery.isSuccess,
  });

  if (getLatestMessagesDecryptedQuery.isSuccess) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">
            Chats
          </h3>

          <Link to="/settings">
            <Button size="icon" variant="ghost">
              <UserIcon/>
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {getLatestMessagesDecryptedQuery.data.map((message) => (
            <Link key={message.id} to={`/g/${message.group.id}`}>
              <h4 className="text-lg font-semibold tracking-tight">
                {message.group.name.replace(authUser.name, "").replace(", ", "")}
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

  return <Loading />;
}
