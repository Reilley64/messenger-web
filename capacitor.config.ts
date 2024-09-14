import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.reilley.messenger.web",
  appName: "messenger-web",
  webDir: "dist",
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;
