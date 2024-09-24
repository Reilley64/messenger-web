import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useAuthUserContext } from "~/components/AuthUserContext";
import { rspc } from "~/lib/utils";
import Loading from "~/components/Loading.tsx";

export const Route = createFileRoute("/u/$userId")({
  component: () => <User />,
});

function User() {
  const { authUser } = useAuthUserContext();
  const { userId } = Route.useParams();

  const getUserQuery = rspc.useQuery(["users.getUser", userId]);
  const createMessageRequestMutation = rspc.useMutation("messageRequests.createMessageRequest");

  if (getUserQuery.isSuccess) {
    return (
      <div className="fixed inset-0 flex w-screen flex-col justify-center font-[Geist]">
        {getUserQuery.data.id !== authUser.id && (
          <Button onClick={() => createMessageRequestMutation.mutate({destinationId: getUserQuery.data.id})}>
            Send message request
          </Button>
        )}
      </div>
    );
  }

  return <Loading />;
}
