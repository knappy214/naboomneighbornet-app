// =========================
// src/context/AuthProvider.tsx
// =========================
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { queryClient } from '../lib/query'
import type { ProfileT } from '../lib/schemas'
import { api, Profile as ProfileApi } from '../lib/wagtailApi'

export interface AuthContextValue {
  authed: boolean
  loading: boolean
  user: ProfileT | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<ProfileT | null>(null)

  const hydrate = useCallback(async () => {
    console.log('🔄 AuthProvider: Starting hydration...')
    await api.ready
    console.log('🔑 AuthProvider: API ready, hasAuth:', api.hasAuth())
    
    if (!api.hasAuth()) {
      console.log('❌ AuthProvider: No auth token, setting user to null')
      setUser(null)
      setLoading(false)
      return
    }
    
    try {
      console.log('📡 AuthProvider: Fetching user profile...')
      const me = await ProfileApi.get({ fields: ['id', 'email', 'avatar_info', 'stats'] })
      console.log('✅ AuthProvider: Profile fetched successfully:', me)
      setUser(me)
    } catch (error) {
      console.error('❌ AuthProvider: Error fetching profile:', error)
      console.error('❌ AuthProvider: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: error instanceof Error && 'status' in error ? (error as any).status : 'Unknown',
        data: error instanceof Error && 'data' in error ? (error as any).data : 'Unknown'
      })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    hydrate()
    const off = api.addUnauthorizedListener(() => {
      setUser(null)
      queryClient.clear() // why: avoid stale private data after token loss
    })
    return () => off()
  }, [hydrate])

  const login = useCallback(async (email: string, password: string) => {
    await api.login(email, password)
    await hydrate()
    await queryClient.invalidateQueries({ queryKey: ['me'] })
  }, [hydrate])

  const logout = useCallback(async () => {
    await api.logout()
    queryClient.clear()
    setUser(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!api.hasAuth()) { setUser(null); return }
    try {
      const me = await ProfileApi.get({ fields: ['id', 'email', 'avatar_info', 'stats'] })
      setUser(me)
    } catch {}
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    authed: !!user,
    loading,
    user,
    login,
    logout,
    refreshProfile,
  }), [loading, user, login, logout, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}