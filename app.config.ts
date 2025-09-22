import { ConfigContext, ExpoConfig } from "expo/config";

const DEFAULT_API_BASE = "https://naboomneighbornet.net.za/api";
const DEFAULT_API_V2_BASE = "https://naboomneighbornet.net.za/api/v2";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Naboom NeighborNet",
  slug: "naboomneighbornet-app",
  scheme: "naboom",
  version: config.version ?? "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    ...config.ios,
    bundleIdentifier: "com.naboom.app",
    supportsTablet: false,
    infoPlist: {
      ...(config.ios?.infoPlist ?? {}),
      NSLocationWhenInUseUsageDescription: "This app uses your location to assist community response.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "Background location enables patrol tracking.",
      UIBackgroundModes: ["location"],
    },
  },
  android: {
    ...config.android,
    package: "com.naboom.app",
    adaptiveIcon:
      config.android?.adaptiveIcon ?? {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    edgeToEdgeEnabled: true,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "FOREGROUND_SERVICE",
      "BLUETOOTH",
      "BLUETOOTH_ADMIN",
      "BLUETOOTH_CONNECT",
      "BLUETOOTH_SCAN",
    ],
    foregroundService: {
      notificationChannelName: "Location",
    },
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
    "expo-notifications",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    ...config.extra,
    apiBase: process.env.EXPO_PUBLIC_API_BASE || DEFAULT_API_BASE,
    apiV2Base: process.env.EXPO_PUBLIC_API_V2_BASE || DEFAULT_API_V2_BASE,
    enableRelay: process.env.EXPO_PUBLIC_ENABLE_RELAY === '1',
    enableTracking: process.env.EXPO_PUBLIC_ENABLE_TRACKING === '1',
    brand: {
      light: { primary: "#4b6bfb", secondary: "#047aff", accent: "#f97316" },
      dark: { primary: "#60a5fa", secondary: "#38bdf8", accent: "#fb923c" },
    },
  },
});
