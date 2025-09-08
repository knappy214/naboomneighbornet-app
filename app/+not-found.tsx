import { Button, Layout } from '@ui-kitten/components';
import { Link, Stack } from 'expo-router';
import { ThemedText } from '../src/ui/components/ThemedText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ThemedText category="h4" style={{ marginBottom: 16 }}>This screen does not exist.</ThemedText>
        <Button>
          <Link href="/">
            <ThemedText category="s1" variant="primary">Go to home screen!</ThemedText>
          </Link>
        </Button>
      </Layout>
    </>
  );
}
