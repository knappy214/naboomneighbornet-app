import { Button, Layout, Text } from "@ui-kitten/components";
import { Stack } from "expo-router";
import { i18n } from "../../src/i18n";
import { useThemeCtx } from "../../src/ui/ThemeProvider";

export default function TabsLayout() {
  const { mode, setMode } = useThemeCtx();
  function cycleTheme() { setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light"); }
  function switchLocale() { i18n.locale = i18n.locale === "en" ? "af" : "en"; }
  return (
    <>
      <Stack screenOptions={{ header: () => (
        <Layout style={{ padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text category="s1">NeighborNet ({i18n.locale})</Text>
          <Layout style={{ flexDirection: "row", gap: 8 }}>
            <Button size="small" onPress={switchLocale}>Locale</Button>
            <Button size="small" appearance="outline" onPress={cycleTheme}>{mode}</Button>
          </Layout>
        </Layout>
      ) }} />
    </>
  );
}
