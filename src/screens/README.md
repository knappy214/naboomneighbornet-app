# Panic Menu Screen

This screen provides a comprehensive interface for interacting with the PANIC API endpoints as documented in `Docs/PANIC.md`.

## Features

### API Integration
- **Submit Panic Incident**: Report emergency situations with location data
- **View Incidents**: Check status of submitted reports
- **Manage Emergency Contacts**: Sync emergency contact information
- **Register Push Notifications**: Enable push notifications for updates
- **View Patrol Alerts**: See recent patrol alerts and waypoints
- **View Responders**: Check available emergency responders
- **Vehicle Tracking**: Monitor patrol vehicle positions
- **Patrol Waypoints**: View patrol checkpoint locations
- **Relay Data Submission**: Submit offline relay data

### Theming
- **OKLCH Color Tokens**: Uses the exact OKLCH color specifications from the project rules
- **Light/Dark/System Themes**: Triple theme switcher with secure storage persistence
- **UI Kitten Integration**: Properly themed components using Eva Design System

### Internationalization
- **English/Afrikaans Support**: Complete translation coverage
- **Dynamic Language Switching**: Real-time language updates
- **Contextual Translations**: All UI elements properly translated

## Usage

The Panic Menu is accessible via the main tab navigation. Each button triggers the corresponding API call with appropriate error handling and user feedback.

## API Endpoints Used

- `POST /panic/api/submit/` - Submit incidents
- `POST /panic/api/contacts/bulk_upsert` - Manage contacts
- `POST /panic/api/push/register` - Register push tokens
- `GET /panic/api/incidents/` - List incidents
- `GET /panic/api/alerts/` - List patrol alerts
- `GET /panic/api/responders/` - List responders
- `GET /panic/api/waypoints/` - List waypoints
- `GET /panic/api/vehicle/live` - Live vehicle positions
- `GET /panic/api/vehicle/tracks` - Vehicle tracking data
- `POST /panic/api/relay_submit` - Submit relay data

## Error Handling

All API calls include comprehensive error handling with user-friendly messages in both English and Afrikaans.

## Location Services

The incident submission feature automatically requests and uses the device's current location when available.
