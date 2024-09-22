import { precacheAndRoute } from "workbox-precaching";
import { MessageWithGroupResponseDto } from "~/gen.ts";

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

// @ts-expect-error needed for pwa
self.addEventListener("push", (event: PushEvent) => {
  console.log(event);

  const payload: MessageWithGroupResponseDto = event.data ? JSON.parse(event.data.text()) : null;
  if (!payload) return;

  event.waitUntil(
    // @ts-expect-error needed for pwa
    self.registration.showNotification(payload.source.name, {
      body: payload,
    })
  );
})