import {
    Button,
    Card,
    Divider,
    Icon,
    IndexPath,
    Layout,
    Modal,
    Select,
    SelectItem,
    Spinner,
    Text,
    useTheme,
} from '@ui-kitten/components';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native';
import { panicApi } from '../api/panic';
import { useAuth } from '../context/AuthProvider';
import { useTranslation } from '../i18n';
import { useThemeCtx } from '../ui/ThemeProvider';

interface MenuAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => Promise<void>;
  status?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

export default function PanicMenuScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeCtx();
  const { logout } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Enhanced error handling with JWT refresh flow
  const handleApiError = async (error: unknown, actionName: string): Promise<void> => {
    console.log('Processing error:', error);
    
    if (error instanceof Error) {
      console.log('Error message:', error.message);
      
      // Handle 401 Unauthorized - try refresh first, then logout
      if (error.message.includes('401')) {
        console.log('🔄 [PANIC] 401 received, attempting token refresh...');
        
        try {
          // The wagtailApi already handles refresh automatically, but if we get here
          // it means refresh failed, so we need to logout and redirect to login
          console.log('❌ [PANIC] Token refresh failed, logging out and redirecting to login');
          await logout();
          
          // Show user-friendly message and redirect to login
          if (Platform.OS === 'web') {
            // Use browser alert for web platform
            const confirmed = window.confirm('Your session has expired. Please log in again.');
            if (confirmed) {
              router.push('/(auth)/login');
            }
          } else {
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please log in again.',
              [
                {
                  text: 'Login',
                  onPress: () => router.push('/(auth)/login'),
                  style: 'default'
                }
              ]
            );
          }
          return;
        } catch (logoutError) {
          console.error('❌ [PANIC] Logout failed:', logoutError);
        }
      }
      
      // Handle other errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message.includes('404')) {
        errorMessage = 'Service not found (404). The API endpoint may be misconfigured. Please contact support.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied. You do not have permission to perform this action.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      // Show error alert
      if (Platform.OS === 'web') {
        // Use browser alert for web platform
        window.alert(`${t('messages.error') || 'Error'}: ${errorMessage}`);
      } else {
        Alert.alert(
          t('messages.error') || 'Error',
          errorMessage,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } else {
      // Fallback for unknown errors
      const fallbackMessage = t('messages.networkError') || 'An unexpected error occurred. Please try again.';
      
      if (Platform.OS === 'web') {
        // Use browser alert for web platform
        window.alert(`${t('messages.error') || 'Error'}: ${fallbackMessage}`);
      } else {
        Alert.alert(
          t('messages.error') || 'Error',
          fallbackMessage,
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('messages.error'), t('messages.locationRequired'));
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(t('messages.error'), t('messages.locationRequired'));
      return null;
    }
  };

  // Menu actions
  const menuActions: MenuAction[] = [
    {
      id: 'submit-incident',
      title: t('panic.submitIncident'),
      description: t('panic.submitIncidentDesc'),
      icon: 'alert-circle-outline',
      status: 'danger',
      action: async () => {
        setLoading('submit-incident');
        try {
          const location = await getCurrentLocation();
          const incidentData = {
            lat: location?.latitude,
            lng: location?.longitude,
            description: 'Emergency situation reported via mobile app',
            source: 'expo',
            priority: 'medium' as const,
            context: {
              timestamp: new Date().toISOString(),
              app_version: '1.0.0',
            },
          };

          const response = await panicApi.submitIncident(incidentData);
          console.log('🔍 [PANIC] Incident submission response:', response);
          console.log('🔍 [PANIC] Response structure:', {
            hasReference: 'reference' in response,
            referenceValue: response.reference,
            responseKeys: Object.keys(response)
          });
          
          Alert.alert(
            t('messages.success'),
            `${t('messages.incidentSubmitted')}\nReference: ${response.reference}`
          );
        } catch (error) {
          console.error('Error submitting incident:', error);
          await handleApiError(error, 'submit-incident');
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'view-incidents',
      title: t('panic.viewIncidents'),
      description: t('panic.viewIncidentsDesc'),
      icon: 'list-outline',
      status: 'primary',
      action: async () => {
        setLoading('view-incidents');
        try {
          const response = await panicApi.getIncidents({ limit: 10 });
          const incidentCount = response.results.length;
          Alert.alert(
            t('panic.viewIncidents'),
            `${incidentCount} ${incidentCount === 1 ? 'incident' : 'incidents'} found`
          );
        } catch (error) {
          console.error('Error fetching incidents:', error);
          Alert.alert(t('messages.error'), t('messages.networkError'));
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'manage-contacts',
      title: t('panic.manageContacts'),
      description: t('panic.manageContactsDesc'),
      icon: 'people-outline',
      status: 'success',
      action: async () => {
        setLoading('manage-contacts');
        try {
          const contactsData = {
            client_id: 'demo-client-123',
            contacts: [
              {
                phone_number: '+27123456789',
                full_name: 'Emergency Contact 1',
                relationship: 'Family',
                priority: 1,
                is_active: true,
              },
            ],
          };

          const response = await panicApi.bulkUpsertContacts(contactsData);
          Alert.alert(
            t('messages.success'),
            `${t('messages.contactsUpdated')}\nCreated: ${response.created}, Updated: ${response.updated}`
          );
        } catch (error) {
          console.error('Error updating contacts:', error);
          Alert.alert(t('messages.error'), t('messages.contactsUpdatedError'));
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'register-push',
      title: t('panic.registerPush'),
      description: t('panic.registerPushDesc'),
      icon: 'bell-outline',
      status: 'info',
      action: async () => {
        setLoading('register-push');
        try {
          const pushData = {
            token: 'demo-push-token-123',
            client_id: 'demo-client-123',
            platform: 'ios' as const,
            app_version: '1.0.0',
          };

          await panicApi.registerPushToken(pushData);
          Alert.alert(t('messages.success'), t('messages.pushRegistered'));
        } catch (error) {
          console.error('Error registering push token:', error);
          Alert.alert(t('messages.error'), t('messages.pushRegisteredError'));
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'view-alerts',
      title: t('panic.viewAlerts'),
      description: t('panic.viewAlertsDesc'),
      icon: 'shield-outline',
      status: 'primary',
      action: async () => {
        setLoading('view-alerts');
        try {
          const response = await panicApi.getPatrolAlerts({ limit: 5 });
          const alertCount = response.results.length;
          Alert.alert(
            t('panic.viewAlerts'),
            `${alertCount} ${alertCount === 1 ? 'alert' : 'alerts'} found`
          );
        } catch (error) {
          console.error('Error fetching alerts:', error);
          Alert.alert(t('messages.error'), t('messages.networkError'));
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'view-responders',
      title: t('panic.viewResponders'),
      description: t('panic.viewRespondersDesc'),
      icon: 'person-outline',
      status: 'success',
      action: async () => {
        // Navigate to the new tabs screen instead of showing alert
        router.push('/panic-tabs' as any);
      },
    },
    {
      id: 'vehicle-tracking',
      title: t('panic.vehicleTracking'),
      description: t('panic.vehicleTrackingDesc'),
      icon: 'car-outline',
      status: 'info',
      action: async () => {
        setLoading('vehicle-tracking');
        try {
          const response = await panicApi.getLiveVehicles();
          console.log('🔍 [PANIC] Vehicles API Response:', response);
          console.log('🔍 [PANIC] Response structure:', {
            hasFeatures: 'features' in response,
            featuresType: typeof response.features,
            featuresLength: response.features?.length,
            responseKeys: Object.keys(response)
          });
          
          // Handle different response structures
          const vehicles = response.features || (response as any).data || response;
          const vehicleCount = Array.isArray(vehicles) ? vehicles.length : 0;
          
          console.log('🔍 [PANIC] Processed vehicles:', {
            vehicles,
            vehicleCount,
            isArray: Array.isArray(vehicles)
          });
          
          Alert.alert(
            t('panic.vehicleTracking'),
            `${vehicleCount} ${vehicleCount === 1 ? 'vehicle' : 'vehicles'} tracked`
          );
        } catch (error) {
          console.error('Error fetching vehicles:', error);
          await handleApiError(error, 'vehicle-tracking');
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'waypoints',
      title: t('panic.waypoints'),
      description: t('panic.waypointsDesc'),
      icon: 'map-outline',
      status: 'primary',
      action: async () => {
        setLoading('waypoints');
        try {
          const response = await panicApi.getWaypoints();
          const waypointCount = response.results.length;
          Alert.alert(
            t('panic.waypoints'),
            `${waypointCount} ${waypointCount === 1 ? 'waypoint' : 'waypoints'} available`
          );
        } catch (error) {
          console.error('Error fetching waypoints:', error);
          Alert.alert(t('messages.error'), t('messages.networkError'));
        } finally {
          setLoading(null);
        }
      },
    },
  ];

  const renderMenuButton = (action: MenuAction) => (
    <Card
      key={action.id}
      style={[
        styles.menuCard,
        { backgroundColor: theme[`color-${action.status || 'primary'}-100`] },
      ]}
    >
      <Layout style={styles.menuItem}>
        <Icon
          name={action.icon}
          style={[
            styles.menuIcon,
            { tintColor: theme[`color-${action.status || 'primary'}-500`] },
          ]}
        />
        <Layout style={styles.menuContent}>
          <Text category="h6" style={styles.menuTitle}>
            {action.title}
          </Text>
          <Text category="s2" appearance="hint" style={styles.menuDescription}>
            {action.description}
          </Text>
        </Layout>
        <Button
          size="small"
          status={action.status || 'primary'}
          onPress={action.action}
          disabled={loading === action.id}
          accessoryLeft={loading === action.id ? () => <Spinner size="small" /> : undefined}
        >
          {loading === action.id ? t('common.loading') : t('common.submit')}
        </Button>
      </Layout>
    </Card>
  );

  const themeOptions = [
    { key: 'light', title: t('common.light') },
    { key: 'dark', title: t('common.dark') },
    { key: 'system', title: t('common.system') },
  ];

  const languageOptions = [
    { key: 'en', title: 'English' },
    { key: 'af', title: 'Afrikaans' },
  ];

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Layout style={styles.header}>
          <Text category="h3" style={styles.title}>
            {t('panic.title')}
          </Text>
          <Text category="s1" appearance="hint" style={styles.subtitle}>
            {t('panic.subtitle')}
          </Text>
        </Layout>

        <Divider style={styles.divider} />

        {/* Settings Row */}
        <Layout style={styles.settingsRow}>
          <Button
            size="small"
            appearance="outline"
            onPress={() => setShowThemeModal(true)}
            accessoryLeft={(props) => <Icon {...(props || {})} name="color-palette-outline" />}
          >
            {t('common.theme')}: {t(`common.${mode}`)}
          </Button>
          <Button
            size="small"
            appearance="outline"
            onPress={() => setShowLanguageModal(true)}
            accessoryLeft={(props) => <Icon {...(props || {})} name="globe-outline" />}
          >
            {t('common.language')}
          </Button>
        </Layout>

        <Divider style={styles.divider} />

        {/* Menu Actions */}
        <Layout style={styles.menuContainer}>
          {menuActions.map(renderMenuButton)}
        </Layout>
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowThemeModal(false)}
      >
        <Card disabled={true} style={styles.modalCard}>
          <Text category="h6" style={styles.modalTitle}>
            {t('common.theme')}
          </Text>
          <Select
            selectedIndex={new IndexPath(themeOptions.findIndex(opt => opt.key === mode))}
            onSelect={(index) => {
              const indexPath = Array.isArray(index) ? index[0] : index;
              const selectedTheme = themeOptions[indexPath.row];
              if (selectedTheme.key === 'light') {
                toggleTheme();
              } else if (selectedTheme.key === 'dark') {
                toggleTheme();
              } else if (selectedTheme.key === 'system') {
                toggleTheme();
              }
              setShowThemeModal(false);
            }}
            value={t(`common.${mode}`)}
          >
            {themeOptions.map((option) => (
              <SelectItem key={option.key} title={option.title} />
            ))}
          </Select>
          <Button
            style={styles.modalButton}
            onPress={() => setShowThemeModal(false)}
          >
            {t('common.close')}
          </Button>
        </Card>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowLanguageModal(false)}
      >
        <Card disabled={true} style={styles.modalCard}>
          <Text category="h6" style={styles.modalTitle}>
            {t('common.language')}
          </Text>
          <Select
            selectedIndex={new IndexPath(0)}
            onSelect={(index) => {
              // This would need to be connected to the i18n system
              setShowLanguageModal(false);
            }}
            value="English"
          >
            {languageOptions.map((option) => (
              <SelectItem key={option.key} title={option.title} />
            ))}
          </Select>
          <Button
            style={styles.modalButton}
            onPress={() => setShowLanguageModal(false)}
          >
            {t('common.close')}
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  menuContainer: {
    gap: 12,
  },
  menuCard: {
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
    marginRight: 16,
  },
  menuTitle: {
    marginBottom: 4,
  },
  menuDescription: {
    lineHeight: 18,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    margin: 16,
    maxWidth: 300,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 16,
  },
});
