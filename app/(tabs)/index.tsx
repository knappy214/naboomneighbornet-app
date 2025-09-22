import { Button, Layout, List, ListItem, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";

import { i18n } from "../../src/i18n";
import { useListQuery } from "../../src/hooks/useList";
import { PageSchema } from "../../src/lib/schemas";
import { useThemeCtx } from "../../src/ui/ThemeProvider";

export default function Home() {
  const { mode, isDark, currentTheme } = useThemeCtx();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useListQuery(
    ['pages', i18n.locale],
    '/pages/',
    PageSchema,
    { query: { locale: i18n.locale } }
  );
  const items = data?.items || [];
  const trackingEnabled = process.env.EXPO_PUBLIC_ENABLE_TRACKING === '1';

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Text category="h6" style={{ marginBottom: 16 }}>
        Theme Test: {mode} mode ({isDark ? 'dark' : 'light'}) - {currentTheme}
      </Text>

      {error && (
        <Text category="s2" status="warning" style={{ marginBottom: 16 }}>
          Failed to load pages
        </Text>
      )}

      {isLoading ? (
        <Text category="s1">Loading...</Text>
      ) : (
        <>
          <List
            data={items}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                description={item.meta?.locale}
              />
            )}
          />
          <Button
            style={{ marginTop: 16 }}
            onPress={() => refetch()}
            size="small"
          >
            Refresh
          </Button>
          {trackingEnabled && (
            <Button
              style={{ marginTop: 16 }}
              onPress={() => router.push('/(tabs)/tracker')}
              size="small"
              appearance="outline"
            >
              Open Vehicle Tracker
            </Button>
          )}
        </>
      )}
    </Layout>
  );
}
