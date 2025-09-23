import { Ionicons } from "@expo/vector-icons";
import { Layout } from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { i18n } from "../../src/i18n";
import { LanguageToggle, ThemeToggle } from "../../src/ui/components";
import { PerformanceOptimizedLayout } from "../../src/ui/components/PerformanceOptimizedLayout";
import { ThemedText } from "../../src/ui/components/ThemedText";

export default function TabsLayout() {
  
  return (
    <Tabs
        screenOptions={{
          header: () => (
            <PerformanceOptimizedLayout style={{ 
              padding: 12, 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}>
              <ThemedText category="s1" variant="primary">
                Naboom NeighborNet ({i18n.locale})
              </ThemedText>
              <Layout style={{ flexDirection: "row", gap: 8 }}>
                <LanguageToggle size="small" appearance="outline" />
                <ThemeToggle size="small" appearance="outline" />
              </Layout>
            </PerformanceOptimizedLayout>
          ),
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="panic" 
          options={{ 
            title: "Panic",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="warning" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="tracker" 
          options={{ 
            title: "Tracker",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="location" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="explore" 
          options={{ 
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }} 
        />
      </Tabs>
  );
}
