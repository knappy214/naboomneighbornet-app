import {
  Avatar,
  Button,
  Card,
  Divider,
  Icon,
  Layout,
  List,
  Spinner,
  Tab,
  TabView,
  Text,
  useTheme
} from '@ui-kitten/components';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { panicApi, type PatrolAlert as ApiPatrolAlert, type Responder as ApiResponder, type IncidentResponse } from '../api/panic';
import { useAuth } from '../context/AuthProvider';
import { useTranslation } from '../i18n';

// Local types for UI components
interface Vehicle {
  id: string;
  name: string;
  lastPosition?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    speedKph?: number;
    headingDeg?: number;
  };
  isActive: boolean;
  lastPing?: string;
}

export default function PanicTabsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { logout } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [data, setData] = useState<{
    responders: ApiResponder[];
    vehicles: Vehicle[];
    incidents: IncidentResponse[];
    alerts: ApiPatrolAlert[];
  }>({
    responders: [],
    vehicles: [],
    incidents: [],
    alerts: [],
  });

  // Enhanced error handling with JWT refresh flow
  const handleApiError = async (error: unknown, actionName: string): Promise<void> => {
    console.log('Processing error:', error);
    
    if (error instanceof Error) {
      console.log('Error message:', error.message);
      
      // Handle 401 Unauthorized - try refresh first, then logout
      if (error.message.includes('401')) {
        console.log('🔄 [PANIC TABS] 401 received, attempting token refresh...');
        
        try {
          console.log('❌ [PANIC TABS] Token refresh failed, logging out and redirecting to login');
          await logout();
          
          // Show user-friendly message and redirect to login
          if (Platform.OS === 'web') {
            const confirmed = window.confirm('Your session has expired. Please log in again.');
            if (confirmed) {
              router.push('/(auth)/login');
            }
          } else {
            // Use native Alert for mobile
            const { Alert } = require('react-native');
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
          console.error('❌ [PANIC TABS] Logout failed:', logoutError);
        }
      }
      
      // Handle other errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message.includes('404')) {
        errorMessage = 'Service not found (404). The API endpoint may be misconfigured.';
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
        window.alert(`${t('messages.error') || 'Error'}: ${errorMessage}`);
      } else {
        const { Alert } = require('react-native');
        Alert.alert(
          t('messages.error') || 'Error',
          errorMessage,
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
  };

  // Load data for each tab
  const loadResponders = async () => {
    setLoading(prev => ({ ...prev, responders: true }));
    try {
      const response = await panicApi.getResponders();
      console.log('🔍 [PANIC TABS] Responders loaded:', response);
      setData(prev => ({ ...prev, responders: response.results }));
    } catch (error) {
      console.error('Error loading responders:', error);
      await handleApiError(error, 'load-responders');
    } finally {
      setLoading(prev => ({ ...prev, responders: false }));
    }
  };

  const loadVehicles = async () => {
    setLoading(prev => ({ ...prev, vehicles: true }));
    try {
      const response = await panicApi.getLiveVehicles();
      console.log('🔍 [PANIC TABS] Vehicles loaded:', response);
      setData(prev => ({ ...prev, vehicles: response.features || [] }));
    } catch (error) {
      console.error('Error loading vehicles:', error);
      await handleApiError(error, 'load-vehicles');
    } finally {
      setLoading(prev => ({ ...prev, vehicles: false }));
    }
  };

  const loadIncidents = async () => {
    setLoading(prev => ({ ...prev, incidents: true }));
    try {
      const response = await panicApi.getIncidents();
      console.log('🔍 [PANIC TABS] Incidents loaded:', response);
      setData(prev => ({ ...prev, incidents: response.results || [] }));
    } catch (error) {
      console.error('Error loading incidents:', error);
      await handleApiError(error, 'load-incidents');
    } finally {
      setLoading(prev => ({ ...prev, incidents: false }));
    }
  };

  const loadAlerts = async () => {
    setLoading(prev => ({ ...prev, alerts: true }));
    try {
      const response = await panicApi.getPatrolAlerts();
      console.log('🔍 [PANIC TABS] Alerts loaded:', response);
      setData(prev => ({ ...prev, alerts: response.results || [] }));
    } catch (error) {
      console.error('Error loading alerts:', error);
      await handleApiError(error, 'load-alerts');
    } finally {
      setLoading(prev => ({ ...prev, alerts: false }));
    }
  };

  // Load data when tab changes
  useEffect(() => {
    switch (selectedIndex) {
      case 0:
        if (data.responders.length === 0) loadResponders();
        break;
      case 1:
        if (data.vehicles.length === 0) loadVehicles();
        break;
      case 2:
        if (data.incidents.length === 0) loadIncidents();
        break;
      case 3:
        if (data.alerts.length === 0) loadAlerts();
        break;
    }
  }, [selectedIndex]);

  // Render responder item
  const renderResponderItem = ({ item }: { item: ApiResponder }) => {
    console.log('🔍 [PANIC TABS] Rendering responder item:', {
      id: item.id,
      name: item.name,
      province: item.province,
      phone_number: item.phone_number,
      is_active: item.is_active
    });
    
    // Safely extract and validate text values
    const fullName = (item.name || '').trim() || 'Unknown Name';
    const responderType = 'Responder'; // API doesn't have responder_type, use generic
    const province = (item.province || '').trim() || 'Unknown Province';
    const phoneNumber = (item.phone_number || '').trim();
    
    return (
      <Card style={styles.listItem} status="basic">
        <Layout style={styles.itemHeader}>
          <Avatar
            source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random` }}
            size="medium"
          />
          <Layout style={styles.itemContent}>
            <Text category="h6">{fullName}</Text>
            <Text category="c1" appearance="hint">
              {responderType && province ? `${responderType} • ${province}` : responderType || province || 'Unknown Details'}
            </Text>
            {phoneNumber && (
              <Text category="c2" appearance="hint">
                📞 {phoneNumber}
              </Text>
            )}
          </Layout>
          <Button
            size="tiny"
            status={item.is_active ? 'success' : 'basic'}
            onPress={() => {
              // Handle contact responder
              console.log('Contact responder:', item.id);
            }}
          >
            Contact
          </Button>
        </Layout>
      </Card>
    );
  };

  // Render vehicle item
  const renderVehicleItem = ({ item }: { item: Vehicle }) => {
    const vehicleName = (item.name || '').trim() || 'Unknown Vehicle';
    const lastPosition = item.lastPosition?.timestamp;
    const lastPing = item.lastPing;
    
    return (
      <Card style={styles.listItem} status="basic">
        <Layout style={styles.itemHeader}>
          <Icon name="car-outline" width={32} height={32} fill={theme['color-primary-500']} />
          <Layout style={styles.itemContent}>
            <Text category="h6">{vehicleName}</Text>
            <Text category="c1" appearance="hint">
              Status: {item.isActive ? 'Active' : 'Inactive'}
            </Text>
            {lastPosition && (
              <Text category="c2" appearance="hint">
                📍 Last seen: {new Date(lastPosition).toLocaleString()}
              </Text>
            )}
            {lastPing && (
              <Text category="c2" appearance="hint">
                🕐 Last ping: {new Date(lastPing).toLocaleString()}
              </Text>
            )}
          </Layout>
          <Button
            size="tiny"
            status="info"
            onPress={() => {
              // Handle view vehicle details
              console.log('View vehicle:', item.id);
            }}
          >
            Track
          </Button>
        </Layout>
      </Card>
    );
  };

  // Render incident item
  const renderIncidentItem = ({ item }: { item: IncidentResponse }) => {
    const summary = (item.description || '').trim() || 'No Description';
    const type = 'Incident'; // API doesn't have type, use generic
    const priority = (item.priority || '').trim() || 'unknown';
    const status = (item.status || '').trim() || 'unknown';
    const reference = (item.reference || '').trim();
    
    return (
      <Card style={styles.listItem} status="basic">
        <Layout style={styles.itemHeader}>
          <Icon 
            name="alert-circle-outline" 
            width={32} 
            height={32} 
            fill={getPriorityColor(priority, theme)} 
          />
          <Layout style={styles.itemContent}>
            <Text category="h6">{summary}</Text>
            <Text category="c1" appearance="hint">
              {type && priority && status ? `${type} • ${priority.toUpperCase()} • ${status.toUpperCase()}` : type || priority || status || 'Unknown Details'}
            </Text>
            <Text category="c2" appearance="hint">
              📅 {item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown Date'}
            </Text>
            {reference && (
              <Text category="c2" appearance="hint">
                🔗 Ref: {reference}
              </Text>
            )}
          </Layout>
          <Button
            size="tiny"
            status={getStatusColor(status)}
            onPress={() => {
              // Handle view incident details
              console.log('View incident:', item.id);
            }}
          >
            View
          </Button>
        </Layout>
      </Card>
    );
  };

  // Render alert item
  const renderAlertItem = ({ item }: { item: ApiPatrolAlert }) => {
    const message = (item.details || '').trim() || 'No Details';
    const status = 'open'; // API doesn't have status, assume open
    const acknowledgedAt = undefined; // API doesn't have acknowledgedAt
    
    return (
      <Card style={styles.listItem} status="basic">
        <Layout style={styles.itemHeader}>
          <Icon 
            name="shield-outline" 
            width={32} 
            height={32} 
            fill={getAlertStatusColor(status, theme)} 
          />
          <Layout style={styles.itemContent}>
            <Text category="h6">{message}</Text>
            <Text category="c1" appearance="hint">
              Status: {status ? status.toUpperCase() : 'UNKNOWN'}
            </Text>
            <Text category="c2" appearance="hint">
              📅 Created: {item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown Date'}
            </Text>
            {acknowledgedAt && (
              <Text category="c2" appearance="hint">
                ✅ Acknowledged: {new Date(acknowledgedAt).toLocaleString()}
              </Text>
            )}
          </Layout>
          <Button
            size="tiny"
            status={getStatusColor(status)}
            onPress={() => {
              // Handle acknowledge alert
              console.log('Acknowledge alert:', item.id);
            }}
          >
            {status === 'open' ? 'Acknowledge' : 'View'}
          </Button>
        </Layout>
      </Card>
    );
  };

  // Helper functions for colors
  const getPriorityColor = (priority: string, theme: any) => {
    if (!priority) return theme['color-basic-500'];
    switch (priority.toLowerCase()) {
      case 'critical': return theme['color-danger-500'];
      case 'high': return theme['color-warning-500'];
      case 'medium': return theme['color-info-500'];
      case 'low': return theme['color-success-500'];
      default: return theme['color-basic-500'];
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'basic';
    switch (status.toLowerCase()) {
      case 'open': return 'danger';
      case 'acknowledged': return 'warning';
      case 'resolved': return 'success';
      case 'cancelled': return 'basic';
      default: return 'basic';
    }
  };

  const getAlertStatusColor = (status: string, theme: any) => {
    if (!status) return theme['color-basic-500'];
    switch (status.toLowerCase()) {
      case 'open': return theme['color-danger-500'];
      case 'acknowledged': return theme['color-warning-500'];
      case 'resolved': return theme['color-success-500'];
      default: return theme['color-basic-500'];
    }
  };

  return (
    <Layout style={styles.container}>
      <TabView
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        style={styles.tabView}
      >
        <Tab title="Responders">
          <ScrollView style={styles.tabContent}>
            <Layout style={styles.tabHeader}>
              <Text category="h5">Emergency Responders</Text>
              <Button
                size="small"
                status="primary"
                onPress={loadResponders}
                disabled={loading.responders}
                accessoryLeft={loading.responders ? () => <Spinner size="small" /> : undefined}
              >
                {loading.responders ? 'Loading...' : 'Refresh'}
              </Button>
            </Layout>
            <List
              data={data.responders}
              renderItem={renderResponderItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={Divider}
              style={styles.list}
            />
          </ScrollView>
        </Tab>

        <Tab title="Vehicles">
          <ScrollView style={styles.tabContent}>
            <Layout style={styles.tabHeader}>
              <Text category="h5">Live Vehicle Tracking</Text>
              <Button
                size="small"
                status="primary"
                onPress={loadVehicles}
                disabled={loading.vehicles}
                accessoryLeft={loading.vehicles ? () => <Spinner size="small" /> : undefined}
              >
                {loading.vehicles ? 'Loading...' : 'Refresh'}
              </Button>
            </Layout>
            <List
              data={data.vehicles}
              renderItem={renderVehicleItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={Divider}
              style={styles.list}
            />
          </ScrollView>
        </Tab>

        <Tab title="Incidents">
          <ScrollView style={styles.tabContent}>
            <Layout style={styles.tabHeader}>
              <Text category="h5">Recent Incidents</Text>
              <Button
                size="small"
                status="primary"
                onPress={loadIncidents}
                disabled={loading.incidents}
                accessoryLeft={loading.incidents ? () => <Spinner size="small" /> : undefined}
              >
                {loading.incidents ? 'Loading...' : 'Refresh'}
              </Button>
            </Layout>
            <List
              data={data.incidents}
              renderItem={renderIncidentItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={Divider}
              style={styles.list}
            />
          </ScrollView>
        </Tab>

        <Tab title="Alerts">
          <ScrollView style={styles.tabContent}>
            <Layout style={styles.tabHeader}>
              <Text category="h5">Patrol Alerts</Text>
              <Button
                size="small"
                status="primary"
                onPress={loadAlerts}
                disabled={loading.alerts}
                accessoryLeft={loading.alerts ? () => <Spinner size="small" /> : undefined}
              >
                {loading.alerts ? 'Loading...' : 'Refresh'}
              </Button>
            </Layout>
            <List
              data={data.alerts}
              renderItem={renderAlertItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={Divider}
              style={styles.list}
            />
          </ScrollView>
        </Tab>
      </TabView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listItem: {
    marginVertical: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
});
