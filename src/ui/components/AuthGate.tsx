// =========================
// src/components/AuthGate.tsx
// =========================
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../../context/AuthProvider'


export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const { authed, loading } = useAuth()
const router = useRouter()


useEffect(() => {
if (!loading && !authed) router.replace('/(auth)/login')
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