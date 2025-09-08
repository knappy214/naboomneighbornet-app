import * as eva from "@eva-design/eva";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { queryClient } from "../src/api/queryClient";
import { ThemeProvider, useThemeCtx } from "../src/ui/ThemeProvider";

function AppContent() {
  const { isDark } = useThemeCtx();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </QueryClientProvider>
    </>
  );
}

function ThemedApp() {
  const { theme } = useThemeCtx();
  
  return (
    <ApplicationProvider {...eva} theme={theme}>
      <AppContent />
    </ApplicationProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </>
  );
}
