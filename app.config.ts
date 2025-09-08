import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "NeighborNet",
  slug: "neighbornet",
  scheme: "neighbornet",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.immunothreat.neighbornet",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    ["expo-secure-store", { configureAndroidBackup: true }],
    "expo-localization",
    "expo-local-authentication",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // Fallbacks if EXPO_PUBLIC_* are not set
    apiBase: process.env.EXPO_PUBLIC_API_BASE || "https://jsonplaceholder.typicode.com",
    apiV2Base: process.env.EXPO_PUBLIC_API_V2_BASE || "https://jsonplaceholder.typicode.com",
    brand: {
      light: { primary: "#4b6bfb", secondary: "#047aff", accent: "#f97316" },
      dark: { primary: "#60a5fa", secondary: "#38bdf8", accent: "#fb923c" }
    }
  }
});
