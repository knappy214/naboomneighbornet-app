// src/lib/wagtailApi.ts
// Expo-ready, minimal-dependency Wagtail API v2 client with JWT auth, auto-refresh,
// SecureStore persistence, single-flight refresh locking, and query helpers.
//
// Dependencies:
//   - expo-secure-store
//   - expo-localization
//
// Env vars (Expo):
//   EXPO_PUBLIC_API_BASE    => e.g. https://naboomneighbornet.net.za (for Django view endpoints)
//   EXPO_PUBLIC_API_V2_BASE => e.g. https://naboomneighbornet.net.za/api/v2 (for Wagtail API endpoints)

import * as Localization from 'expo-localization'
import * as SecureStore from 'expo-secure-store'

/** Minimal "why" note: Use in-memory + SecureStore to avoid slow disk reads on every request. */
const TOKEN_KEYS = {
  access: 'auth.accessToken',
  refresh: 'auth.refreshToken',
} as const

// Normalize base URLs early.
const RAW_API_BASE = (process.env.EXPO_PUBLIC_API_BASE || '').trim()
const RAW_API_V2_BASE = (process.env.EXPO_PUBLIC_API_V2_BASE || '').trim()

function trimSlashes(s: string): string {
  return s.replace(/\/+$/g, '')
}

function ensureBase(url: string | undefined, fallback: string): string {
  if (url && /^https?:\/\//i.test(url)) return trimSlashes(url)
  return trimSlashes(fallback)
}

const API_BASE = ensureBase(RAW_API_BASE, 'https://naboomneighbornet.net.za')
const API_V2_BASE = ensureBase(RAW_API_V2_BASE, 'https://naboomneighbornet.net.za/api/v2')

// Language header: match Vue app behavior: 'af-ZA' when locale starts with 'af', else 'en'
function languageHeader(): string {
  const lang = (Localization.getLocales?.()[0]?.languageCode || 'en').toLowerCase()
  return lang.startsWith('af') ? 'af-ZA' : 'en'
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  /** override base; default v2 for data routes */
  baseURL?: string
  /** query params as object */
  query?: Record<string, string | number | boolean | undefined | null>
  /** body object or FormData */
  body?: any
  /** extra headers */
  headers?: Record<string, string>
  /** abort signal */
  signal?: AbortSignal
  /** request timeout ms */
  timeoutMs?: number
  /** whether to try refresh flow on 401 */
  retryOn401?: boolean
}

export interface JwtPair {
  access: string
  refresh: string
}

class ApiError extends Error {
  status: number
  data: any
  constructor(status: number, data: any, message?: string) {
    super(message || `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/** Simple query-string builder */
function buildQS(params?: RequestOptions['query']): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    usp.append(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ''
}

function joinUrl(base: string, path: string): string {
  const b = trimSlashes(base)
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

/**
 * TokenStore handles both memory and secure persistence.
 */
class TokenStore {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  async initFromStorage(): Promise<void> {
    try {
      const [a, r] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEYS.access),
        SecureStore.getItemAsync(TOKEN_KEYS.refresh),
      ])
      this.accessToken = a || null
      this.refreshToken = r || null
    } catch {
      // SecureStore not available in web environment
      this.accessToken = null
      this.refreshToken = null
    }
  }

  getAccess(): string | null { return this.accessToken }
  getRefresh(): string | null { return this.refreshToken }

  async setTokens(tokens: Partial<JwtPair>): Promise<void> {
    if (typeof tokens.access === 'string') {
      this.accessToken = tokens.access
      try {
        await SecureStore.setItemAsync(TOKEN_KEYS.access, tokens.access)
      } catch {
        // SecureStore not available in web environment, store in memory only
        console.log('SecureStore not available, storing tokens in memory only')
      }
    }
    if (typeof tokens.refresh === 'string') {
      this.refreshToken = tokens.refresh
      try {
        await SecureStore.setItemAsync(TOKEN_KEYS.refresh, tokens.refresh)
      } catch {
        // SecureStore not available in web environment, store in memory only
        console.log('SecureStore not available, storing tokens in memory only')
      }
    }
  }

  async clear(): Promise<void> {
    this.accessToken = null
    this.refreshToken = null
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEYS.access),
        SecureStore.deleteItemAsync(TOKEN_KEYS.refresh),
      ])
    } catch {
      // SecureStore not available in web environment, just clear memory
      console.log('SecureStore not available, cleared tokens from memory only')
    }
  }
}

/**
 * WagtailApi: lightweight fetch client with JWT + auto-refresh.
 */
class WagtailApi {
  private tokens = new TokenStore()
  private refreshing: Promise<string | null> | null = null // single-flight lock
  private unauthorized = new Set<() => void>()

  ready: Promise<void>

  constructor(private readonly apiBase = API_BASE, private readonly apiV2Base = API_V2_BASE) {
    this.ready = this.tokens.initFromStorage()
  }

  /** Subscribe to global unauthorized events */
  addUnauthorizedListener(fn: () => void): () => void {
    this.unauthorized.add(fn)
    return () => this.unauthorized.delete(fn)
  }
  private emitUnauthorized() {
    for (const fn of this.unauthorized) {
      try { fn() } catch {}
    }
  }

  /** Quick check for an access token */
  hasAuth(): boolean { return !!this.tokens.getAccess() }

  /** ---- Auth ---- */
  async login(email: string, password: string): Promise<JwtPair> {
    const url = joinUrl(this.apiBase, '/auth/jwt/create/')
    const res = await this.rawFetch('POST', url, { email, password })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      throw new ApiError(res.status, errorData, errorData?.detail || 'Login failed')
    }
    
    const { access, refresh } = (await res.json()) as JwtPair
    await this.tokens.setTokens({ access, refresh })
    return { access, refresh }
  }

  private async mockLogin(email: string, password: string): Promise<JwtPair> {
    // Simple mock authentication for development
    if (email === 'test@example.com' && password === 'password') {
      const mockTokens = {
        access: 'mock-access-token-' + Date.now(),
        refresh: 'mock-refresh-token-' + Date.now()
      }
      await this.tokens.setTokens(mockTokens)
      return mockTokens
    }
    throw new ApiError(401, null, 'Invalid credentials (mock auth)')
  }

  async logout(): Promise<void> {
    await this.tokens.clear()
  }

  get<T>(path: string, opts?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('GET', path, opts)
  }
  post<T>(path: string, body?: any, opts?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('POST', path, { ...opts, body })
  }
  put<T>(path: string, body?: any, opts?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('PUT', path, { ...opts, body })
  }
  patch<T>(path: string, body?: any, opts?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('PATCH', path, { ...opts, body })
  }
  delete<T>(path: string, opts?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('DELETE', path, opts)
  }

  async request<T>(method: HttpMethod, path: string, opts: RequestOptions = {}): Promise<T> {
    await this.ready

    const base = trimSlashes(opts.baseURL || this.apiV2Base)
    const url = joinUrl(base, path) + buildQS(opts.query)

    console.log(`🌐 API Request: ${method} ${url}`)
    const res = await this.authorizedFetch(method, url, opts)
    console.log(`📡 API Response: ${res.status} ${res.statusText}`)

    if (res.status === 401 && (opts.retryOn401 ?? true)) {
      console.log('🔄 API: 401 received, attempting token refresh...')
      const refreshed = await this.tryRefreshAccess()
      if (refreshed) {
        console.log('✅ API: Token refreshed, retrying request...')
        const retry = await this.authorizedFetch(method, url, { ...opts, retryOn401: false })
        console.log(`📡 API Retry Response: ${retry.status} ${retry.statusText}`)
        return this.handleJson<T>(retry)
      }
      // At this point auth is invalid; reset and notify.
      console.log('❌ API: Token refresh failed, clearing tokens and emitting unauthorized')
      await this.tokens.clear()
      this.emitUnauthorized()
      throw new ApiError(401, null, 'Unauthorized')
    }

    return this.handleJson<T>(res)
  }

  private async authorizedFetch(method: HttpMethod, url: string, opts: RequestOptions): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Accept-Language': languageHeader(),
      ...(opts.headers || {}),
    }

    const token = this.tokens.getAccess()
    if (token) headers.Authorization = `Bearer ${token}`

    let body: BodyInit | undefined
    if (opts.body instanceof FormData) {
      body = opts.body
    } else if (opts.body !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(opts.body)
    }

    return this.fetchWithTimeout(url, { method, headers, body, signal: opts.signal }, opts.timeoutMs)
  }

  private async handleJson<T>(res: Response): Promise<T> {
    const isJson = (res.headers.get('content-type') || '').includes('application/json')
    const data = isJson ? await res.json().catch(() => null) : null
    if (!res.ok) throw new ApiError(res.status, data, data?.detail || data?.message)
    return (data as T) ?? (undefined as unknown as T)
  }

  private async tryRefreshAccess(): Promise<string | null> {
    const refresh = this.tokens.getRefresh()
    if (!refresh) return null

    if (!this.refreshing) {
      this.refreshing = (async () => {
        try {
          const url = joinUrl(this.apiBase, '/auth/jwt/refresh/')
          const res = await this.rawFetch('POST', url, { refresh })
          if (!res.ok) return null
          const json = (await res.json()) as { access?: string }
          if (!json.access) return null
          await this.tokens.setTokens({ access: json.access })
          return json.access
        } catch {
          await this.tokens.clear()
          return null
        } finally {
          this.refreshing = null
        }
      })()
    }

    return this.refreshing
  }

  private rawFetch(method: HttpMethod, url: string, body?: any, timeoutMs = 15000): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Accept-Language': languageHeader(),
      'Content-Type': 'application/json',
    }
    const init: RequestInit = { method, headers, body: body ? JSON.stringify(body) : undefined }
    return this.fetchWithTimeout(url, init, timeoutMs)
  }

  private async fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 20000): Promise<Response> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      return await fetch(url, { ...init, signal: init.signal ?? controller.signal })
    } finally {
      clearTimeout(id)
    }
  }
}

/** Convenience helpers to mirror your Vue calls */
export interface PaginationParams {
  limit?: number
  offset?: number
}
export interface FieldsParam { fields?: string | string[] }
export interface SearchParam { search?: string }
export interface OrderingParam { ordering?: string }

function fieldsQuery(fields?: string | string[]): Record<string, string> | undefined {
  if (!fields) return undefined
  const value = Array.isArray(fields) ? fields.join(',') : fields
  return { fields: value }
}

export const api = new WagtailApi()

// ---- Example endpoint wrappers (adjust to your schema) ----
export const Profile = {
  /** GET /user-profiles/?fields=...  */
  async get(opts: PaginationParams & FieldsParam = {}) {
    return api.get<any>('/user-profiles/', {
      query: { ...fieldsQuery(opts.fields), limit: opts.limit, offset: opts.offset },
    })
  },
  /** PATCH /user-profiles/ */
  async patch(data: Record<string, any>) {
    return api.patch<any>('/user-profiles/', data)
  },
  /** POST /user-profile/change-password/ */
  async changePassword(data: { old_password: string; new_password: string }) {
    return api.post<any>('/user-profile/change-password/', data)
  },
}

export const Groups = {
  list() { return api.get<any>('/user-groups/') },
  roles() { return api.get<any>('/user-roles/') },
  join(data: { group_id: number }) { return api.post<any>('/user-profiles/join-group/', data) },
  leave(data: { group_id: number }) { return api.post<any>('/user-profiles/leave-group/', data) },
}

export const Avatar = {
  upload(form: FormData) {
    return api.post<any>('/user-profiles/avatar/upload/', form)
  },
  remove() {
    return api.delete<any>('/user-profiles/avatar/delete/')
  },
  setExisting(image_id: number) {
    return api.post<any>('/user-profiles/avatar/set-existing/', { image_id })
  },
}

// ---- Usage docs (inline for quick copy): ----
/**
import { api, Profile } from '@/lib/wagtailApi'

await api.login(email, password)
const me = await Profile.get({ fields: ['stats', 'avatar_info'] })
await api.logout()
*/