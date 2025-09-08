import { Layout } from "@ui-kitten/components";
import { Stack } from "expo-router";
import { i18n } from "../../src/i18n";
import { useThemeCtx } from "../../src/ui/ThemeProvider";
import { PerformanceOptimizedLayout } from "../../src/ui/components/PerformanceOptimizedLayout";
import { ThemedButton } from "../../src/ui/components/ThemedButton";
import { ThemedText } from "../../src/ui/components/ThemedText";

export default function TabsLayout() {
  const { mode, setMode } = useThemeCtx();
  
  function cycleTheme() { 
    setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light"); 
  }
  
  function switchLocale() { 
    i18n.setLocale(i18n.locale === "en" ? "af" : "en"); 
  }
  
  return (
    <>
      <Stack screenOptions={{ 
        header: () => (
          <PerformanceOptimizedLayout style={{ 
            padding: 12, 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between" 
          }}>
            <ThemedText category="s1" variant="primary">
              NeighborNet ({i18n.locale})
            </ThemedText>
            <Layout style={{ flexDirection: "row", gap: 8 }}>
              <ThemedButton 
                size="small" 
                variant="secondary"
                onPress={switchLocale}
              >
                Locale
              </ThemedButton>
              <ThemedButton 
                size="small" 
                variant="primary"
                appearance="outline" 
                onPress={cycleTheme}
              >
                {mode}
              </ThemedButton>
            </Layout>
          </PerformanceOptimizedLayout>
        ),
      }} />
    </>
  );
}
