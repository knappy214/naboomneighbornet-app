import { Button, Layout, List, ListItem, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { listPages } from "../../src/api/content";
import { i18n } from "../../src/i18n";
import { useThemeCtx } from "../../src/ui/ThemeProvider";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode, isDark, currentTheme } = useThemeCtx();
  
  async function load() { 
    try {
      setLoading(true);
      setError(null);
      const result = await listPages(i18n.locale as "en" | "af");
      setItems(result.items || []);
    } catch (err) {
      console.log("API not available, using mock data");
      setError("API not available - showing mock data");
      // Mock data for development
      setItems([
        { id: "1", title: "Welcome to NeighborNet", meta: { locale: i18n.locale } },
        { id: "2", title: "Community Safety", meta: { locale: i18n.locale } },
        { id: "3", title: "Emergency Contacts", meta: { locale: i18n.locale } },
        { id: "4", title: "Local Resources", meta: { locale: i18n.locale } },
      ]);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { load(); }, []);
  
  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Text category="h6" style={{ marginBottom: 16 }}>
        Theme Test: {mode} mode ({isDark ? 'dark' : 'light'}) - {currentTheme}
      </Text>
      
      {error && (
        <Text category="s2" status="warning" style={{ marginBottom: 16 }}>
          {error}
        </Text>
      )}
      
      {loading ? (
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
            onPress={load}
            size="small"
          >
            Refresh
          </Button>
        </>
      )}
    </Layout>
  );
}
