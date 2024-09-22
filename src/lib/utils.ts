import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createReactQueryHooks } from "@rspc/react-query";
import { Procedures } from "~/gen.ts";

export const rspc = createReactQueryHooks<Procedures>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function arrayBufferToBase64Url(buffer: ArrayBuffer) {
  return arrayBufferToBase64(buffer)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function encryptMessage(publicKeyBase64: string, message: string) {
  const binaryString = atob(publicKeyBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const publicKeyBuffer = bytes.buffer as ArrayBuffer;
  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    new TextEncoder().encode(message),
  );
  return btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));
}

export async function decryptMessage(privateKeyBase64: string, messageBase64: string) {
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

