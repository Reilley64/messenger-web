import { createFileRoute } from "@tanstack/react-router";
import {
  useMessageRequestRestControllerApiMutation,
} from "~/hooks/useApiMutation.ts";
import { useUserRestControllerApiSuspenseQuery } from "~/hooks/useApiSuspenseQuery.ts";
import { Button } from "~/components/ui/button.tsx";
import { useAuthUserContext } from "~/components/AuthUserContext.tsx";

export const Route = createFileRoute("/u/$userId")({
  component: () => <User />,
});

function User() {
  const { authUser } = useAuthUserContext();
  const { userId } = Route.useParams();

  const getUserQuery = useUserRestControllerApiSuspenseQuery({
    queryKey: ["getUser", { userId }],
    queryFn: async (api) => await api.getUser({ userId }),
  });

  const createMessageRequestMutation = useMessageRequestRestControllerApiMutation({
    mutationFn: (api) => async () => await api.createMessageRequest({
      body: {
        destinationId: getUserQuery.data.id,
      },
    }),
  });

  return (
    <div className="flex h-screen w-screen flex-col justify-center font-[Geist]">
      {getUserQuery.data.id !== authUser.id && (
        <Button onClick={() => createMessageRequestMutation.mutate()}>
          Send message request
        </Button>
      )}
    </div>
  );
}
