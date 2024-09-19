import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeftIcon, FileKeyIcon, ShareIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useGetAuthUserSuspenseQuery } from "~/hooks/useGetAuthUserSuspenseQuery";
import { usePrivateKeyContext } from "~/components/PrivateKeyContext.tsx";

export const Route = createFileRoute("/settings")({
  component: () => <Settings />,
});

function Settings() {
  const { privateKeyBase64 } = usePrivateKeyContext();

  const authUser = useGetAuthUserSuspenseQuery();

  async function shareProfile() {
    await window.navigator.clipboard.writeText(`https://messenger.reilley.dev/u/${authUser.data.id}`);
  }

  async function exportPrivateKey() {
    const blob = new Blob([privateKeyBase64], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "passkey.txt";
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
          <AvatarFallback>{authUser.data.name.split(" ").map((name) => name.charAt(0))}</AvatarFallback>
        </Avatar>

        <h4 className="text-xl font-semibold tracking-tight">
          {authUser.data.name}
        </h4>
      </div>

      <div className="flex flex-col">
        <Button className="justify-start rounded-none" onClick={() => shareProfile()} variant="ghost">
          <ShareIcon className="mr-2 h-4 w-4" /> Share profile
        </Button>

        <Button className="justify-start rounded-none" onClick={() => exportPrivateKey()} variant="ghost">
          <FileKeyIcon className="mr-2 h-4 w-4" /> Export private key
        </Button>
      </div>
    </div>
  );
}
