import { Button, Card, Layout } from '@ui-kitten/components';
import React, { Component, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from '../../i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const { t } = useTranslation();

  const handleReload = () => {
    // Reload the app
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <Layout style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>⚠️ {t('messages.error')}</Text>
        <Text style={styles.message}>
          {t('messages.serverError')}
        </Text>
        {__DEV__ && error && (
          <Text style={styles.errorDetails}>
            {error.message}
          </Text>
        )}
        <Button
          style={styles.button}
          onPress={handleReload}
          status="primary"
        >
          {t('common.retry')}
        </Button>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  button: {
    marginTop: 16,
  },
});
