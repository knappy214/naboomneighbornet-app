# SPEC-EXP — Expo SDK 54 Community Hub Module (EN/AF)

## Purpose

Deliver a Community Hub experience inside the existing Expo application without disrupting the current working
structure. The module builds on Expo SDK 54, Expo Router 6, UI Kitten, Zustand, and Zod to provide a bilingual
(English/Afrikaans) social feed that integrates JWT authentication, real‑time WebSocket updates, and Expo push
notifications.

## Guiding Principles

- **Do not break current routes or providers.** All new code lives under `src/community` and `app/(hub)` while reusing
  shared utilities (query client, i18n helpers, security helpers).
- **Treat the module as feature‑flagged.** Feature entry points are wrapped in a configuration flag to allow staged rollouts
  without impacting existing screens.
- **Keep state domain‑driven.** Encapsulate hub data in dedicated Zustand slices, persisting via MMKV with versioned
  migrations.

## High-Level Flow

1. On launch, hydrate MMKV for auth token and preferred locale.
2. If authenticated, fetch channel list and establish WebSocket listeners per active channel.
3. Navigate to community hub tab/stack: channels list → channel threads → thread posts.
4. Push notification taps deep-link into `thread-[id]` while registering the device for notifications on login.

```
@startuml
start
:Launch -> read token & locale (MMKV);
if (logged in?) then (yes)
  :Fetch channels; connect WS;
  :Open channel -> list threads;
  :Open thread -> posts; reply;
else (no)
  :Login screen;
endif
:Notification tap -> deep link to thread;
stop
@enduml
```

## Navigation

- Create a new `(hub)` group under `app/` using Expo Router 6.
- Routes:
  - `app/(hub)/channels.tsx`
  - `app/(hub)/channel/[id].tsx`
  - `app/(hub)/thread/[id].tsx`
  - `app/(hub)/settings/notifications.tsx`
  - `app/(hub)/settings/language.tsx`
- Provide tab or stacked navigation via `_layout.tsx`, wiring headers and deep-link segments compatible with push
  notification payloads.

## State Management (Zustand + MMKV)

Located in `src/community/state/` with slices composed via Zustand middlewares (persist, immer).

| Slice     | State Shape                                                                 | Notes |
|-----------|------------------------------------------------------------------------------|-------|
| auth      | `{ accessToken, refreshToken, user, expiresAt }`                             | Persist to SecureStore via custom storage adapter; exposes login/refresh/logout actions. |
| channels  | `{ list, isLoading, joined, requested }`                                     | Cache last successful fetch with freshness timestamp. |
| threads   | `{ byChannel: Record<string, ThreadList>, cursors: Record<string, Cursor> }` | Support pagination and offline cache (last N threads). |
| posts     | `{ byThread: Record<string, PostList> }`                                     | Optimistic updates with rollback on failure. |
| prefs     | `{ notificationsEnabled, language, theme }`                                  | Persist language/notifications toggles; integrate with i18n. |

### Persistence Strategy

- Use `react-native-mmkv` via `zustand/middleware` with versioned migrations stored in `src/community/state/persist.ts`.
- Secure values (JWT tokens) via Expo SecureStore + bridging adapter for Zustand slice.

## Validation (Zod)

- Define schemas in `src/community/schemas/` to match backend DTOs.
- API wrapper uses `safeParse` to enforce type safety at boundaries; invalid payloads raise typed errors displayed via
  toast notifications.

## Networking

### REST Wrapper

- `src/community/api/client.ts` extends existing fetch helper to attach JWT headers, Accept-Language, and retry logic.
- Base URLs read from `EXPO_PUBLIC_API_BASE` and `EXPO_PUBLIC_API_V2_BASE` via `expo-constants`.
- Endpoints:
  - `GET /api/channels`
  - `GET /api/threads?channel=...&cursor=...`
  - `POST /api/posts`
  - `POST /api/alerts`
  - `POST /api/devices` (push registration)

### WebSockets

- Implement `src/community/realtime/channelSocket.ts` using `ws:///ws/channels/{id}/?token=<jwt>`.
- Features:
  - Exponential backoff (1s → 30s).
  - Heartbeat ping every 30s.
  - Auto-dispose on route blur/unfocus.
  - Batch incoming events before calling `setState` to reduce renders.

## Push Notifications

- Leverage `expo-notifications` to request permissions and obtain Expo push token.
- On login, register device token via `POST /api/devices`.
- Notification handler uses `Linking.openURL` to deep-link into `app/(hub)/thread/[id]`.
- Respect in-app notification preferences from the prefs slice.

## Internationalisation (EN/AF)

- Extend existing i18n setup by adding `src/i18n/en/community.json` and `src/i18n/af/community.json` bundles.
- Use `react-i18next` with `expo-localization` detection on first run; persist override in prefs slice.
- Settings screen toggles languages and forces re-render via context provider.

## UI Kitten Integration

- Build reusable components inside `src/community/ui/` aligning with Eva Design tokens already in `src/ui/themes.ts`.
- Support light/dark/system theme with accessible touch targets and responsive typography.
- Map DaisyUI brand colors to Eva theme overrides for visual consistency.

## Performance & Offline Strategy

- Use `@shopify/flash-list` for channel, thread, and post lists with sensible `estimatedItemSize`.
- Cache the last N (configurable) threads/posts per channel in MMKV, including freshness timestamps.
- Display offline banner when requests fail due to network issues; allow manual retry.
- Coalesce rapid post submissions client-side before sending to reduce API load.

## Error & UX Considerations

- Surface errors via toasts with retry buttons (e.g., UI Kitten `ToastService`).
- Implement optimistic posting: queue message locally, show pending state, revert on server failure.
- Sanitize any rich text before rendering to prevent XSS; default rendering is plain text.
- Guard admin-only actions by checking role claims within JWT.

## Security

- Store access/refresh tokens in SecureStore; ensure no logs include JWTs.
- Require biometric quick-unlock before sensitive mutations (e.g., posting alerts) using existing security helpers.
- Follow HTTPS-only endpoints and reject self-signed certificates outside dev builds.

## Offline & Background Enhancements

- Queue background sync for threads/posts when on Wi-Fi + charging using Expo Task Manager (optional/"Could" scope).
- Support background WebSocket reconnection strategies when the app returns to foreground.

## Implementation Milestones

| Milestone | Deliverable |
|-----------|-------------|
| M0 | Auth integration, i18n scaffold, UI Kitten theming hooks. |
| M1 | Channels list with WebSocket connection, FlashList integration. |
| M2 | Thread view, replies with optimistic posting and error handling. |
| M3 | Push notification registration and deep linking to threads. |
| M4 | Offline caching, performance tuning, and UX polish. |

## Observability & KPIs

- Cold start ≤ 2.5s (measure via Expo profiling).
- WebSocket reconnect success rate.
- Push notification delivery/open metrics (via backend dashboards).
- Offline cache hit rate vs live fetch.
- Language usage split EN vs AF.
- Crash-free sessions tracked via Sentry (existing instrumentation).

## Open Questions

- Confirm backend WebSocket authentication query parameters and payload shape.
- Align notification payload schema with deep-link routing segments.
- Determine MMKV data retention policy and cache invalidation intervals.
- Validate admin permissions/roles delivered within JWT claims.

## Next Steps

1. Create feature flag (e.g., `EXPO_PUBLIC_ENABLE_COMMUNITY_HUB`).
2. Scaffold `app/(hub)` routes and `src/community` folder with providers.
3. Implement Zustand slices with persistence and migrations.
4. Integrate API client and WebSocket utilities.
5. Build UI Kitten screens with i18n strings.
6. Wire push notifications, deep linking, and offline cache.
7. Add automated tests (unit + integration) covering reducers, API parsing, and navigation flows.
