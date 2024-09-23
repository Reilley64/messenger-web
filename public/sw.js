import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import * as event from "workbox-core/_private.js";

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

async function decryptMessage(privateKeyBase64, messageBase64) {
  const privateKeyBinaryString = atob(privateKeyBase64);
  const privateKeyBytes = new Uint8Array(privateKeyBinaryString.length);
  for (let i = 0; i < privateKeyBinaryString.length; i++) {
    privateKeyBytes[i] = privateKeyBinaryString.charCodeAt(i);
  }
  const privateKeyBuffer = privateKeyBytes.buffer;
  const privateKey = await self.crypto.subtle.importKey(
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
  const messageDecryptedBuffer = await self.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    messageBytes.buffer,
  );
  return new TextDecoder("UTF-8").decode(messageDecryptedBuffer);
}

let privateKeyBase64;

self.addEventListener("message", (event) => {
  privateKeyBase64 = event.data;
});

self.addEventListener("push", (event) => {
  if (!privateKeyBase64) return;

  const message = event.data ? event.data.json() : null;
  if (!message) return;

  decryptMessage(privateKeyBase64, message.content)
    .then((body) => {
      event.waitUntil(
        self.registration.showNotification(message.source.name, {
          body,
          data: {
            url: `https://messenger.reilley.dev/g/${message.group.id}`,
          },
          image: `https://messenger-userprofilepicturesbucket-in7dlolpfv8y.s3.amazonaws.com/u/${message.source.id}`,
          tag: message.id,
        })
      );
    })
    .catch((error) => console.error(error));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
