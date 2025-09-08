# Naboom NeighborNet – Expo App

A production‑ready Expo application aligned with the web app’s API patterns and brand system. It mirrors auth and profile flows, uses React Query for caching, supports biometric re‑authentication, and adopts the Community Security light/dark palettes.

---

## Highlights

* **Expo SDK 53 (stable)** with **Node ≥ 20**.
* **Auth**: JWT create/refresh, `Authorization: Bearer`, 401 auto‑refresh once.
* **Profile**: `GET/PATCH /users/me` with i18n via `Accept-Language` (`en` / `af-ZA`).
* **Content**: Wagtail `/api/v2/pages` listing for locale validation.
* **State**: React Query for data; optional Zustand for auth UI state.
* **Security**: Tokens in `expo-secure-store`; **biometric prompt** before sensitive mutations.
* **Branding**: UI Kitten themes derived from Community Security colors (Light/Dark) + triple theme switch (light/dark/system).

---

## Tech Stack

* **Expo SDK 53**, **React Native**, **TypeScript**
* **expo-router**, **@tanstack/react-query**, **expo-secure-store**, **expo-local-authentication**
* **@ui-kitten/components** (Eva Design System)
* **i18n-js**, **expo-localization**
* **Jest** (+ Testing Library) for unit tests

---

## Folder Structure

```
app/                     # expo-router routes
  (auth)/login.tsx
  (tabs)/index.tsx
  (tabs)/profile.tsx
  _layout.tsx
src/
  api/
    http.ts             # base fetch with Accept-Language
    auth.ts             # login/refresh/token storage
    authFetch.ts        # 401-aware fetch (silent refresh once)
    user.ts             # getProfile/updateProfile
    content.ts          # Wagtail v2 pages
    queryClient.ts
  queries/
    auth.ts             # useLogin mutation
    profile.ts          # useMe/useUpdateProfile
  i18n/
    index.ts            # i18n-js setup + helpers
  security/biometric.ts # biometric re-auth helper
  state/
    auth.ts             # (optional) Zustand store
  ui/
    theme-tokens.ts     # brand colors -> tokens
    themes.ts           # UI Kitten light/dark overrides
    ThemeProvider.tsx
```

---

## Environment

Set env per build profile (EAS or `.env` via `app.config.ts`).

* `EXPO_PUBLIC_API_BASE` – REST base (e.g. `https://api.example.com/api`)
* `EXPO_PUBLIC_API_V2_BASE` – Wagtail v2 (e.g. `https://api.example.com/api/v2`)

```json
// eas.json (excerpt)
{
  "build": {
    "development": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_BASE": "https://dev.api.naboomneighbornet.com/api",
        "EXPO_PUBLIC_API_V2_BASE": "https://dev.api.naboomneighbornet.com/api/v2"
      }
    },
    "staging": {
      "env": {
        "EXPO_PUBLIC_API_BASE": "https://staging.api.naboomneighbornet.com/api",
        "EXPO_PUBLIC_API_V2_BASE": "https://staging.api.naboomneighbornet.com/api/v2"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_BASE": "https://api.naboomneighbornet.com/api",
        "EXPO_PUBLIC_API_V2_BASE": "https://api.naboomneighbornet.com/api/v2"
      }
    }
  }
}
```

---

## API Contracts (align with backend)

* `POST /auth/jwt/create` → `{ access, refresh }`
* `POST /auth/jwt/refresh` → `{ access }`
* `GET  /users/me` → `UserProfile`
* `PATCH /users/me` → `UserProfile`
* `GET  /api/v2/pages/?locale=en|af&...` → `{ items: Page[] }`

> Adjust paths/fields if your Django/Wagtail backend differs.

Headers applied automatically:

* `Authorization: Bearer <token>` (when available)
* `Accept-Language: en` or `af-ZA` (from i18n)

401 handling:

* On 401, one refresh attempt is made using the stored `refresh` token; on failure, tokens are cleared.

---

## Install & Run

```bash
# Prereqs: Node >= 20, Xcode 15+/Android Studio Iguana+
# Create app (if starting fresh)
npx create-expo-app@latest neighbornet-app
cd neighbornet-app

# Packages
npx expo install expo-secure-store expo-localization expo-local-authentication
npm i @tanstack/react-query @ui-kitten/components @eva-design/eva @ui-kitten/eva-icons i18n-js zustand
npx expo install react-native-svg

# Dev
npx expo start
```

---

## Biometric Re‑Auth

* Uses `expo-local-authentication`.
* Gate sensitive actions (e.g., profile save, logout, password change):

```ts
const ok = await requireBiometric("Authenticate to save profile");
if (!ok) return; // user canceled or failed
```

Behavior:

* If hardware/biometrics unavailable → proceed (configurable).
* If user cancels → abort the action.

---

## React Query Usage

* `useMe()` fetches and caches the current user under key `['me']`.
* `useUpdateProfile()` mutates user fields and invalidates `['me']`.
* `useLogin()` logs in and invalidates `['me']` to refresh UI.

> Default options: `staleTime: 30s`, `gcTime: 5m`, `retry: 1` on queries, `0` on mutations.

---

## Theming & i18n

* Theme overrides map brand tokens to UI Kitten primary/info/warning.
* Theme switcher: **light ↔ dark ↔ system**.
* i18n locales: `en`, `af` with fallback; `Accept-Language` set accordingly.

---

## Tests

```bash
npm i -D jest ts-jest @types/jest jest-fetch-mock whatwg-fetch \
  @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks

npm test
```

Unit tests cover:

* 401 refresh flow in `authFetch`
* Token persistence in `auth.login`
* `Authorization` propagation in `user.getProfile`

---

## Coding Standards

* TypeScript everywhere; `strict` mode recommended.
* Functional components; hooks for data & side effects.
* No direct `fetch` in screens; use API helpers + React Query.
* Secrets/tokens only in **SecureStore** (never AsyncStorage).
* Follow the project’s Cursor rule at `.cursor/rules/expo.mdc`.

---

## Troubleshooting

* **401 loops**: verify refresh endpoint and token names.
* **Locale not changing**: confirm `Accept-Language` header and Wagtail locales.
* **Biometric prompt missing**: ensure device supports biometrics and is enrolled.
* **Android build issues**: clear Gradle cache or rebuild Development Build.

---

## License

Proprietary (internal). Update as needed.
