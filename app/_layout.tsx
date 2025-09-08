import * as eva from "@eva-design/eva";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { queryClient } from "../src/api/queryClient";
import { ThemeProvider } from "../src/ui/ThemeProvider";

// Simple theme context so any route can toggle theme
// const ThemeCtx = createContext<{ isDark: boolean; toggle: () => void }>({ isDark: false, toggle: () => {} });
// export const useThemeToggle = () => useContext(ThemeProvider.themeCtx);

export default function RootLayout() {
  const [isDark, setIsDark] = useState(false);
  const theme = useMemo(() => (isDark ? eva.dark : eva.light), [isDark]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <ThemeProvider>
          <StatusBar style={isDark ? "light" : "dark"} />
          <QueryClientProvider client={queryClient}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </QueryClientProvider>
        </ThemeProvider>
      </ApplicationProvider>
    </>
  );
}
