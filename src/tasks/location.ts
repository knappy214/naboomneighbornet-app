// =========================
// src/tasks/location.ts
// =========================
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'

export const TASK_VEHICLE_LOCATION = 'vehicle-location-updates'

type LocationTaskData = {
  locations?: Location.LocationObject[]
}

TaskManager.defineTask(TASK_VEHICLE_LOCATION, async ({ data, error }) => {
  if (error) {
    console.warn('Vehicle location task error', error)
    return
  }

  const { locations } = (data as LocationTaskData | undefined) ?? {}
  if (!locations || locations.length === 0) return

  const latest = locations[locations.length - 1]
  const apiBase = process.env.EXPO_PUBLIC_API_BASE
  if (!apiBase) return

  try {
    await fetch(`${apiBase}/panic/api/vehicle/ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vehicle-Token': process.env.EXPO_PUBLIC_VEHICLE_TOKEN || '',
      },
      body: JSON.stringify({
        lat: latest.coords.latitude,
        lng: latest.coords.longitude,
        ts: Date.now() / 1000,
        speed_kph: typeof latest.coords.speed === 'number' ? latest.coords.speed * 3.6 : undefined,
        heading_deg: typeof latest.coords.heading === 'number' ? latest.coords.heading : undefined,
      }),
    })
  } catch (err) {
    console.warn('Vehicle location ping failed', err)
  }
})

export async function startVehicleTracking() {
  const foreground = await Location.requestForegroundPermissionsAsync()
  if (foreground.status !== 'granted') throw new Error('Foreground location permission denied')

  const background = await Location.requestBackgroundPermissionsAsync()
  if (background.status !== 'granted') throw new Error('Background location permission denied')

  await Location.startLocationUpdatesAsync(TASK_VEHICLE_LOCATION, {
    accuracy: Location.Accuracy.Balanced,
    foregroundService: {
      notificationTitle: 'Patrol tracking',
      notificationBody: 'Sharing location for emergency response',
    },
    timeInterval: 15000,
    distanceInterval: 10,
    showsBackgroundLocationIndicator: true,
    pausesUpdatesAutomatically: false,
  })
}

export async function stopVehicleTracking() {
  const started = await Location.hasStartedLocationUpdatesAsync(TASK_VEHICLE_LOCATION)
  if (started) {
    await Location.stopLocationUpdatesAsync(TASK_VEHICLE_LOCATION)
  }
}
