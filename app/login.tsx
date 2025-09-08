// =========================
// src/app/login.tsx
// =========================
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../src/context/AuthProvider'

export default function LoginScreen() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      router.replace('/(tabs)')
    } catch (e: any) {
      Alert.alert('Login failed', e?.message || 'Please check your credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TouchableOpacity onPress={onSubmit} disabled={submitting} style={{ backgroundColor: '#111827', padding: 14, borderRadius: 8, alignItems: 'center' }}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Sign in</Text>}
      </TouchableOpacity>
    </View>
  )
}