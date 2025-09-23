// =========================
// src/screens/TrackerScreen.tsx
// =========================
import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { useRelayMode } from '../hooks/useRelayMode'
import { useVehicleTracking } from '../hooks/useVehicleTracking'

function Pill({ label }: { label: string }) {
  return (
    <Text
      style={{
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        marginLeft: 8,
        fontWeight: '600',
      }}
    >
      {label}
    </Text>
  )
}

const relayEnabled = process.env.EXPO_PUBLIC_ENABLE_RELAY === '1'

export default function TrackerScreen() {
  const { isTracking, status, lastPingAt, start, stop } = useVehicleTracking()
  const { active: relayActive } = useRelayMode(relayEnabled && isTracking)

  const lastPingLabel = lastPingAt ? new Date(lastPingAt).toLocaleTimeString() : '—'

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Vehicle Tracker</Text>
      <Text>Keep this on during patrol to update the command centre with your location.</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>Status: {status}</Text>
        <Pill label={isTracking ? 'ON DUTY' : 'OFF DUTY'} />
      </View>

      <Text>Last ping: {lastPingLabel}</Text>

      {relayEnabled && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>Relay mode</Text>
          <Pill label={relayActive ? 'ACTIVE' : 'STANDBY'} />
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        {!isTracking ? (
          <Pressable
            onPress={start}
            style={{ backgroundColor: '#0ea5e9', padding: 14, borderRadius: 10 }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Start Tracking</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={stop}
            style={{ backgroundColor: '#ef4444', padding: 14, borderRadius: 10 }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Stop Tracking</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
