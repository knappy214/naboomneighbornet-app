// =========================
// src/hooks/useVehicleTracking.ts
// =========================
import { useCallback, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'

import { TASK_VEHICLE_LOCATION, startVehicleTracking, stopVehicleTracking } from '../tasks/location'

type TrackingStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'error'

export function useVehicleTracking() {
  const [isTracking, setTracking] = useState(false)
  const [status, setStatus] = useState<TrackingStatus>('idle')
  const [lastPingAt, setLastPingAt] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const started = await Location.hasStartedLocationUpdatesAsync(TASK_VEHICLE_LOCATION)
        if (!cancelled) {
          setTracking(started)
          setStatus(started ? 'running' : 'idle')
        }
      } catch (err) {
        console.warn('Vehicle tracking bootstrap failed', err)
        if (!cancelled) setStatus('error')
      }
    }

    bootstrap()

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })

    const interval = setInterval(async () => {
      try {
        const loc = await Location.getLastKnownPositionAsync()
        if (!cancelled && loc?.timestamp) setLastPingAt(loc.timestamp)
      } catch (err) {
        console.warn('Failed to read last known position', err)
      }
    }, 15000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const start = useCallback(async () => {
    try {
      setStatus('starting')
      await startVehicleTracking()
      setTracking(true)
      setStatus('running')
    } catch (err) {
      console.warn('Failed to start vehicle tracking', err)
      setStatus('error')
      setTracking(false)
    }
  }, [])

  const stop = useCallback(async () => {
    try {
      setStatus('stopping')
      await stopVehicleTracking()
      setTracking(false)
      setStatus('idle')
    } catch (err) {
      console.warn('Failed to stop vehicle tracking', err)
      setStatus('error')
    }
  }, [])

  return { isTracking, status, lastPingAt, start, stop }
}
