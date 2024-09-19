import { precacheAndRoute } from "workbox-precaching";

// @ts-expect-error needed for pwa
precacheAndRoute(self.__WB_MANIFEST);
