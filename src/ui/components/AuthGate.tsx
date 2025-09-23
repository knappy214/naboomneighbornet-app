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
      console.log('🚪 AuthGate: Redirecting to login')
      router.replace('/(auth)/login')
    }
    
    // Reset redirect flag when user becomes authenticated
    if (authed) {
      hasRedirected.current = false
    }
  }, [authed, loading, router])

  // Show loading only when auth state is being determined
  if (loading) {
    console.log('⏳ AuthGate: Showing loading state')
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  // If not authenticated, allow the redirect to happen by returning null
  // This prevents the AuthGate from blocking the login screen
  if (!authed) {
    console.log('🚫 AuthGate: Not authenticated, allowing redirect')
    return null
  }
  
  console.log('✅ AuthGate: Authenticated, rendering children')
  return <>{children}</>
}