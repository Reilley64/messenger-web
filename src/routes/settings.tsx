import { createFileRoute, Link } from '@tanstack/react-router'
import { BellPlus, ChevronLeftIcon, FileKeyIcon, LogOutIcon, ShareIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { usePrivateKeyContext } from "~/components/PrivateKeyContext";
import { useAuthorizationContext } from "~/components/AuthorizationContext";
import { arrayBufferToBase64Url, rspc, urlB64ToUint8Array } from "~/lib/utils";
import { useAuthUserContext } from "~/components/AuthUserContext";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: () => <Settings />,
});

function Settings() {
  const { logout } = useAuthorizationContext();
  const { authUser } = useAuthUserContext();
  const { privateKeyBase64 } = usePrivateKeyContext();

  const createUserPushSubscriptionMutation = rspc.useMutation("userPushSubscriptions.createUserPushSubscription");

  async function enableNotifications() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          const pushPublicKey = import.meta.env.VITE_PUSH_PUBLIC_KEY;
          subscription = await registration.pushManager.subscribe({
            applicationServerKey: urlB64ToUint8Array(pushPublicKey),
            userVisibleOnly: true,
          });
        }

        await createUserPushSubscriptionMutation.mutateAsync({
          endpoint: subscription.endpoint,
          p256dh: arrayBufferToBase64Url(subscription.getKey("p256dh")!),
          auth: arrayBufferToBase64Url(subscription.getKey("auth")!),
        });
      }
    } catch (error) {
      toast.error(JSON.stringify(error))
    }
  }

  async function shareProfile() {
    await await window.navigator.clipboard.writeText(`https://messenger.reilley.dev/u/${authUser.id}`);
  }

  function exportPrivateKey() {
    const blob = new Blob([privateKeyBase64], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "messenger.privatekey";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between px-4 pt-6">
        <Link to="/">
          <Button size="icon" variant="ghost">
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center space-y-3 px-6">
        <Avatar className="h-[92px] w-[92px] text-2xl">
          <AvatarFallback>{authUser.name.split(" ").map((name) => name.charAt(0))}</AvatarFallback>
        </Avatar>

        <h4 className="text-xl font-semibold tracking-tight">
          {authUser.name}
        </h4>
      </div>

      <div className="flex flex-col">
        <Button className="justify-start rounded-none" onClick={() => enableNotifications()} variant="ghost">
          <BellPlus className="mr-2 h-4 w-4" /> Enable notifications
        </Button>

        <Button className="justify-start rounded-none" onClick={() => shareProfile()} variant="ghost">
          <ShareIcon className="mr-2 h-4 w-4" /> Share profile
        </Button>

        <Button className="justify-start rounded-none" onClick={() => exportPrivateKey()} variant="ghost">
          <FileKeyIcon className="mr-2 h-4 w-4" /> Export private key
        </Button>

        <Button className="justify-start rounded-none" onClick={() => logout()} variant="ghost">
          <LogOutIcon className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
