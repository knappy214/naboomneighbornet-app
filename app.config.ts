import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  expo: {
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
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Fallbacks if EXPO_PUBLIC_* are not set
      apiBase: process.env.EXPO_PUBLIC_API_BASE || "https://dev.example.com/api",
      apiV2Base: process.env.EXPO_PUBLIC_API_V2_BASE || "https://dev.example.com/api/v2",
      brand: {
        light: { primary: "#4b6bfb", secondary: "#047aff", accent: "#f97316" },
        dark: { primary: "#60a5fa", secondary: "#38bdf8", accent: "#fb923c" }
      }
    }
  }
});
