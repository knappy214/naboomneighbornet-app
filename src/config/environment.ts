import Constants from 'expo-constants';

// Environment configuration
export const config = {
  // API Configuration
  // Base URL for Django view endpoints (e.g., /panic/api/...)
  apiBase: Constants.expoConfig?.extra?.apiBase || process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8000',
  // Base URL for Wagtail API endpoints (e.g., /api/v2/...)
  apiV2Base: Constants.expoConfig?.extra?.apiV2Base || process.env.EXPO_PUBLIC_API_V2_BASE || 'http://localhost:8000/api/v2',
  
  // Feature Flags
  enableRelay: Constants.expoConfig?.extra?.enableRelay || process.env.EXPO_PUBLIC_ENABLE_RELAY === '1' || false,
  enableTracking: Constants.expoConfig?.extra?.enableTracking || process.env.EXPO_PUBLIC_ENABLE_TRACKING === '1' || false,
  
  // Development
  isDevelopment: __DEV__,
  isWeb: typeof window !== 'undefined',
  
  // Platform specific
  platform: Constants.platform?.ios ? 'ios' : Constants.platform?.android ? 'android' : 'web',
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    apiBase: config.apiBase,
    apiV2Base: config.apiV2Base,
    enableRelay: config.enableRelay,
    enableTracking: config.enableTracking,
    platform: config.platform,
  });
}
