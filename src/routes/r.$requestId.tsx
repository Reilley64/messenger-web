import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { rspc } from "~/lib/utils";
import { MessageRequestResponseDto } from "~/gen";
import Loading from "~/components/Loading.tsx";

export const Route = createFileRoute("/r/$requestId")({
  component: () => <Request />,
});

function Request() {
  const { requestId } = Route.useParams();
  const queryClient = useQueryClient();

  const getMessageRequestQuery = rspc.useQuery(["messageRequests.getMessageRequest", requestId]);

  const approveMessageRequestMutation = rspc.useMutation("messageRequests.approveMessageRequest", {
    onMutate: () => void queryClient.setQueryData(["MessageRequestController.getMessageRequest", requestId], (oldData: MessageRequestResponseDto) => {
      oldData.approvedAt = new Date().toISOString();
      return oldData;
    }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["messageRequests.getMessageRequest", requestId] }),
  });

  if (getMessageRequestQuery.isSuccess) {
    return (
      <div className="fixed inset-0 flex w-screen flex-col justify-center font-[Geist]">
        <Button disabled={!!getMessageRequestQuery.data.approvedAt}
                onClick={() => approveMessageRequestMutation.mutate(getMessageRequestQuery.data.id)}>
          {getMessageRequestQuery.data.approvedAt ? "Message request approved" : "Approve message request"}
        </Button>
      </div>
    );
  }

  return <Loading />;
}
