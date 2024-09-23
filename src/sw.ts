import { precacheAndRoute } from "workbox-precaching";
import type { MessageWithGroupResponseDto } from "~/gen";

interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<unknown>): void;
}

interface PushEvent extends ExtendableEvent {
  data: PushMessageData;
}

interface PushMessageData {
  arrayBuffer(): ArrayBuffer;
  blob(): Blob;
  json(): unknown;
  text(): string;
}

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string, revision?: string }>
};

precacheAndRoute(self.__WB_MANIFEST);

async function decryptMessage(privateKeyBase64: string, messageBase64: string) {
  const privateKeyBinaryString = atob(privateKeyBase64!);
  const privateKeyBytes = new Uint8Array(privateKeyBinaryString.length);
  for (let i = 0; i < privateKeyBinaryString.length; i++) {
    privateKeyBytes[i] = privateKeyBinaryString.charCodeAt(i);
  }
  const privateKeyBuffer = privateKeyBytes.buffer as ArrayBuffer;
  const privateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["decrypt"],
  );
  const messageBinaryString = atob(messageBase64);
  const messageBytes = new Uint8Array(messageBinaryString.length);
  for (let i = 0; i < messageBytes.length; i++) {
    messageBytes[i] = messageBinaryString.charCodeAt(i);
  }
  const messageDecryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    messageBytes.buffer as ArrayBuffer,
  );
  return new TextDecoder("UTF-8").decode(messageDecryptedBuffer);
}

let privateKeyBase64: string | undefined;

// @ts-expect-error needed for pwa
self.addEventListener("message", async (event: MessageEvent) => {
  privateKeyBase64 = event.data;
});

// @ts-expect-error needed for pwa
self.addEventListener("push", async (event: PushEvent) => {
  if (!privateKeyBase64) return;

  const message = event.data ? event.data.json() as MessageWithGroupResponseDto : null;
  if (!message) return;

  const body = await decryptMessage(privateKeyBase64, message.content);

  event.waitUntil(
    // @ts-expect-error needed for pwa
    self.registration.showNotification(message.source.name, { body })
  );
})