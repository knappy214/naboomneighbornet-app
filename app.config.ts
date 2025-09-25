import { ConfigContext, ExpoConfig } from "expo/config";

const DEFAULT_API_BASE = "https://naboomneighbornet.net.za";
const DEFAULT_API_V2_BASE = "https://naboomneighbornet.net.za/api/v2";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Naboom ommunity Hub",
  slug: "naboom-community-hub",
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
    runtimeVersion: {
      policy: "appVersion"
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
    runtimeVersion: "1.0.0",
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
  updates: {
    url: "https://u.expo.dev/8185949e-7c8e-4a64-b0a1-b4a732a69b2d"
  },
  extra: {
    ...config.extra,
    eas: {
      projectId: "8185949e-7c8e-4a64-b0a1-b4a732a69b2d"
    },
    apiBase: process.env.EXPO_PUBLIC_API_BASE || DEFAULT_API_BASE,
    apiV2Base: process.env.EXPO_PUBLIC_API_V2_BASE || DEFAULT_API_V2_BASE,
    enableRelay: process.env.EXPO_PUBLIC_ENABLE_RELAY === '1',
    enableTracking: process.env.EXPO_PUBLIC_ENABLE_TRACKING === '1',
    brand: {
      light: { primary: "#422ad5", secondary: "#f43098", accent: "#00d3bb" },
      dark: { primary: "#1c4e80", secondary: "#7c909a", accent: "#ea6947" },
    },
  },
});
