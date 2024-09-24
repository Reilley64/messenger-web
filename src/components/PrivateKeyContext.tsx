import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect } from "react";
import { useAuthUserContext } from "~/components/AuthUserContext";
import useLocalStorageState from "~/hooks/useLocalStorageState";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useForm } from "@tanstack/react-form";
import z from "zod";

type PrivateKeyContextValue = {
  privateKeyBase64: string;
  setPrivateKeyBase64: Dispatch<SetStateAction<string | undefined>>;
}

const PrivateKeyContext = createContext<PrivateKeyContextValue | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const uploadPrivateKeySchema = z.object({
  privateKey: z.instanceof(File),
});

type UploadPrivateKeyFormValues = z.infer<typeof uploadPrivateKeySchema>;

export function usePrivateKeyContext() {
  const context = useContext(PrivateKeyContext);
  if (!context) {
    throw new Error("useAuthorizationContext must be used within a AuthorizationContextProvider");
  }
  return context;
}

export default function PrivateKeyContextProvider(props: PropsWithChildren) {
  const { children } = props;

  const { authUser } = useAuthUserContext();

  const [privateKeyBase64, setPrivateKeyBase64] = useLocalStorageState<string | undefined>(`${authUser.id}.privateKeyBase64`, undefined);

  useEffect(() => {
    async function sendPrivateKeyBase64ToServiceWorker() {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) return;
      registration.active.postMessage(privateKeyBase64);
    }

    if (privateKeyBase64) void sendPrivateKeyBase64ToServiceWorker();
  }, [privateKeyBase64]);

  const uploadPrivateKeyForm = useForm<UploadPrivateKeyFormValues>({
    onSubmit: async ({ value }) => {
      const reader = new FileReader();
      reader.onload = (e) => setPrivateKeyBase64(e.target!.result as string);
      reader.readAsText(value.privateKey);
    },
  });

  if (!privateKeyBase64) {
    return (
      <div className="fixed inset-0 flex w-screen flex-col justify-center font-[Geist]">
        <form
          className="mx-auto flex w-full max-w-sm flex-col space-y-6 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void uploadPrivateKeyForm.handleSubmit();
          }}
        >
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-2xl font-semibold tracking-tight">
              Upload your Private Key
            </h3>
            <p className="text-sm text-muted-foreground">
              Securely upload your private key to use on this device
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <uploadPrivateKeyForm.Field
              name="privateKey"
              children={(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      field.handleChange(e.target.files[0]);
                    }
                  }}
                  type="file"
                />
              )}
            />
          </div>

          <Button className="w-full" type="submit">
            Upload key
          </Button>
        </form>
      </div>
    );
  }

  return (
    <PrivateKeyContext.Provider value={{ privateKeyBase64, setPrivateKeyBase64 }}>
      {children}
    </PrivateKeyContext.Provider>
  );
}
