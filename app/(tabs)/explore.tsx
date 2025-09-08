import { Button, Layout } from '@ui-kitten/components';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native';
import { ThemedCard } from '../../src/ui/components/ThemedCard';
import { ThemedText } from '../../src/ui/components/ThemedText';

export default function TabTwoScreen() {
  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <ThemedText category="h4" style={{ marginBottom: 16 }}>Explore</ThemedText>
        
        <ThemedCard style={{ marginBottom: 16 }}>
          <ThemedText category="s1" style={{ marginBottom: 8 }}>File-based routing</ThemedText>
          <ThemedText category="p2" style={{ marginBottom: 8 }}>
            This app has two screens: app/(tabs)/index.tsx and app/(tabs)/explore.tsx
          </ThemedText>
          <ThemedText category="p2" style={{ marginBottom: 8 }}>
            The layout file in app/(tabs)/_layout.tsx sets up the tab navigator.
          </ThemedText>
          <Button size="small" appearance="outline">
            <ThemedText category="c1" variant="primary">Learn more</ThemedText>
          </Button>
        </ThemedCard>

        <ThemedCard style={{ marginBottom: 16 }}>
          <ThemedText category="s1" style={{ marginBottom: 8 }}>Android, iOS, and web support</ThemedText>
          <ThemedText category="p2">
            You can open this project on Android, iOS, and the web. To open the web version, press w in the terminal running this project.
          </ThemedText>
        </ThemedCard>

        <ThemedCard style={{ marginBottom: 16 }}>
          <ThemedText category="s1" style={{ marginBottom: 8 }}>Images</ThemedText>
          <ThemedText category="p2" style={{ marginBottom: 8 }}>
            For static images, you can use the @2x and @3x suffixes to provide files for different screen densities
          </ThemedText>
          <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center', marginBottom: 8 }} />
          <Button size="small" appearance="outline">
            <ThemedText category="c1" variant="primary">Learn more</ThemedText>
          </Button>
        </ThemedCard>

        <ThemedCard style={{ marginBottom: 16 }}>
          <ThemedText category="s1" style={{ marginBottom: 8 }}>Custom fonts</ThemedText>
          <ThemedText category="p2" style={{ marginBottom: 8 }}>
            Open app/_layout.tsx to see how to load custom fonts such as this one.
          </ThemedText>
          <ThemedText category="p2" style={{ fontFamily: 'SpaceMono', marginBottom: 8 }}>
            This is a custom font example.
          </ThemedText>
          <Button size="small" appearance="outline">
            <ThemedText category="c1" variant="primary">Learn more</ThemedText>
          </Button>
        </ThemedCard>

        <ThemedCard style={{ marginBottom: 16 }}>
          <ThemedText category="s1" style={{ marginBottom: 8 }}>Light and dark mode components</ThemedText>
          <ThemedText category="p2" style={{ marginBottom: 8 }}>
            This template has light and dark mode support with UI Kitten theming.
          </ThemedText>
          <Button size="small" appearance="outline">
            <ThemedText category="c1" variant="primary">Learn more</ThemedText>
          </Button>
        </ThemedCard>
      </ScrollView>
    </Layout>
  );
}

