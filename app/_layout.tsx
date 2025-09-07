import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { queryClient } from "../src/api/queryClient";
import { ThemeProvider } from "../src/ui/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
