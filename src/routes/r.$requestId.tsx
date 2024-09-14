import { createFileRoute } from "@tanstack/react-router";
import {
  useMessageRequestRestControllerApiMutation,
} from "~/hooks/useApiMutation.ts";
import {
  useMessageRequestRestControllerApiSuspenseQuery,
} from "~/hooks/useApiSuspenseQuery.ts";
import { Button } from "~/components/ui/button.tsx";
import { useQueryClient } from "@tanstack/react-query";
import type { MessageRequest } from "~/api";

export const Route = createFileRoute("/r/$requestId")({
  component: () => <Request />,
});

function Request() {
  const { requestId } = Route.useParams();
  const queryClient = useQueryClient();

  const getMessageRequestQuery = useMessageRequestRestControllerApiSuspenseQuery({
    queryKey: ["getMessageRequest", { requestId }],
    queryFn: async (api) => await api.getMessageRequest({ messageRequestId: requestId }),
  });

  const approveMessageRequestMutation = useMessageRequestRestControllerApiMutation({
    mutationFn: (api) => async () => await api.approveMessageRequest({ messageRequestId: requestId }),
    onMutate: () => void queryClient.setQueryData(["MessageRequestRestControllerApi", "getMessageRequest", { requestId }], (oldData: MessageRequest) => {
      oldData.approvedAt = new Date();
      return oldData;
    }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["MessageRequestRestControllerApi", "getMessageRequest", { requestId }] }),
  });

  return (
    <div className="flex h-screen w-screen flex-col justify-center font-[Geist]">
      <Button disabled={!!getMessageRequestQuery.data.approvedAt} onClick={() => approveMessageRequestMutation.mutate()}>
        {getMessageRequestQuery.data.approvedAt ? "Message request approved" : "Approve message request"}
      </Button>
    </div>
  );
}
