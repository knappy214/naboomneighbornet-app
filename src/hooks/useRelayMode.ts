// =========================
// src/hooks/useRelayMode.ts
// =========================
import { useEffect, useRef, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as Location from 'expo-location'

import { NearbyRelay, RelayFrame, supportedPlatform } from '../lib/relay'

async function getClientId() {
  const existing = await SecureStore.getItemAsync('client_id')
  if (existing) return existing

  const fallback = `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
  const generated = typeof globalThis.crypto?.randomUUID === 'function' ? globalThis.crypto.randomUUID() : fallback
  await SecureStore.setItemAsync('client_id', generated)
  return generated
}

export function useRelayMode(enabled: boolean) {
  const [active, setActive] = useState(false)
  const stopping = useRef(false)

  useEffect(() => {
    let cancelled = false

    if (!enabled || supportedPlatform() === 'unsupported') {
      setActive(false)
      return () => {}
    }

    async function start() {
      try {
        const clientId = await getClientId()
        const perm = await Location.requestForegroundPermissionsAsync()
        if (perm.status !== 'granted') throw new Error('Foreground location permission denied')

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        const frame: RelayFrame = {
          clientId: clientId.slice(0, 16),
          nonce: Math.floor(Math.random() * 65535),
          lat: loc?.coords.latitude,
          lng: loc?.coords.longitude,
          accuracy: loc?.coords.accuracy ?? undefined,
        }

        await NearbyRelay.startAdvertising(frame)
        await NearbyRelay.startScanning()
        if (!cancelled) setActive(true)
      } catch (err) {
        console.warn('Failed to enable relay mode', err)
        if (!cancelled) setActive(false)
      }
    }

    async function stop() {
      stopping.current = true
      try {
        await NearbyRelay.stopScanning()
        await NearbyRelay.stopAdvertising()
      } catch (err) {
        console.warn('Failed to stop relay mode', err)
      } finally {
        if (!cancelled) setActive(false)
        stopping.current = false
      }
    }

    start()

    return () => {
      cancelled = true
      if (!stopping.current) {
        stop()
      }
    }
  }, [enabled])

  return { active }
}
