# Development Guide

## Panic Menu Implementation

This project includes a comprehensive Panic Menu implementation with the following features:

### ✅ **Completed Features**

1. **Complete i18n Support** - English and Afrikaans translations
2. **OKLCH Theme System** - Using exact color tokens from project rules
3. **Panic API Integration** - All endpoints from PANIC.md documentation
4. **Theme Toggle** - Light/Dark/System with secure storage
5. **Language Toggle** - Real-time language switching
6. **Error Handling** - Comprehensive error boundaries and user feedback
7. **Location Services** - Automatic location detection for incidents

### 🚀 **Getting Started**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run start
   ```

3. **Access the App**
   - Web: http://localhost:8081
   - Mobile: Use Expo Go app to scan QR code

### 🎨 **Theme System**

The app uses OKLCH color tokens as specified in the project rules:

- **Light Theme**: Clean, agricultural color palette
- **Dark Theme**: Optimized for low-light conditions
- **System Theme**: Follows device preference

### 🌐 **Internationalization**

- **English**: Complete translation coverage
- **Afrikaans**: Full translation support
- **Dynamic Switching**: Real-time language updates

### 📱 **Panic Menu Features**

The Panic Menu (`/panic` tab) provides access to all PANIC API endpoints:

- **Submit Incident**: Report emergencies with location
- **View Incidents**: Check incident status
- **Manage Contacts**: Sync emergency contacts
- **Register Push**: Enable notifications
- **View Alerts**: See patrol alerts
- **View Responders**: Check available responders
- **Vehicle Tracking**: Monitor patrol vehicles
- **Waypoints**: View patrol checkpoints
- **Relay Data**: Submit offline data

### 🔧 **Configuration**

Environment variables can be set in `.env`:

```env
EXPO_PUBLIC_API_BASE=http://localhost:8000
EXPO_PUBLIC_API_V2_BASE=http://localhost:8000/api/v2
EXPO_PUBLIC_ENABLE_RELAY=1
EXPO_PUBLIC_ENABLE_TRACKING=1
```

### 🐛 **Troubleshooting**

**Metro Symbolication Errors**: These are development-only issues and don't affect functionality. The metro config has been updated to minimize these.

**Expo Notifications Warning**: This is expected on web platforms and doesn't affect mobile functionality.

**API Connection**: Ensure your backend API is running on the configured URL.

### 📁 **Project Structure**

```
src/
├── api/           # API service functions
├── config/        # Environment configuration
├── i18n/          # Internationalization
├── screens/       # Screen components
├── ui/            # UI components and theming
└── context/       # React context providers
```

### 🎯 **Next Steps**

1. Connect to your actual PANIC API backend
2. Implement authentication flow
3. Add real-time updates via SSE
4. Test on physical devices
5. Deploy to app stores

The Panic Menu is now fully functional and ready for integration with your backend API!
