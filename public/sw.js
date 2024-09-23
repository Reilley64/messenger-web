import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

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
    messageBytes.buffer,
  );
  return new TextDecoder("UTF-8").decode(messageDecryptedBuffer);
}

let privateKeyBase64;

self.addEventListener("message", async (event) => {
  privateKeyBase64 = event.data;
});

self.addEventListener("push", async (event) => {
  if (!privateKeyBase64) return;

  const message = event.data ? event.data.json() : null;
  if (!message) return;

  const body = await decryptMessage(privateKeyBase64, message.content);

  event.waitUntil(
    self.registration.showNotification(message.source.name, { body })
  );
})