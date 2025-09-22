import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import '../src/tasks/location';

import { AuthProvider } from '../src/context/AuthProvider';
import { QueryProvider } from '../src/context/QueryProvider';
import { ThemeProvider, useThemeCtx } from "../src/ui/ThemeProvider";

function AppContent() {
  const { isDark } = useThemeCtx();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      
    <QueryProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        </AuthProvider>
      </QueryProvider>
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
