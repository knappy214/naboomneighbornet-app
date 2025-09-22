// =========================
// src/components/AuthGate.tsx
// =========================
import { useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../../context/AuthProvider'

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authed, loading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Only redirect once when loading is complete and user is not authenticated
    if (!loading && !authed && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/(auth)/login')
    }
    
    // Reset redirect flag when user becomes authenticated
    if (authed) {
      hasRedirected.current = false
    }
  }, [authed, loading, router])

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }
  
  return <>{children}</>
}