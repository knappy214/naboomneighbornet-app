// =========================
// src/lib/relay.ts
// =========================
import { NativeModules, Platform } from 'react-native'

export type RelayFrame = {
  clientId: string
  nonce: number
  lat?: number
  lng?: number
  accuracy?: number
  priority?: 0 | 1
}

export interface NearbyRelayModule {
  startAdvertising(frame: RelayFrame): Promise<void>
  stopAdvertising(): Promise<void>
  startScanning(): Promise<void>
  stopScanning(): Promise<void>
}

const LINKING_ERROR = 'NearbyRelay native module not linked. Build with a Dev Client.'
const Native: Partial<NearbyRelayModule> = NativeModules.NearbyRelay || {}

export const NearbyRelay: NearbyRelayModule = {
  async startAdvertising(frame) {
    if (!Native.startAdvertising) throw new Error(LINKING_ERROR)
    return Native.startAdvertising(frame)
  },
  async stopAdvertising() {
    if (!Native.stopAdvertising) return
    return Native.stopAdvertising()
  },
  async startScanning() {
    if (!Native.startScanning) throw new Error(LINKING_ERROR)
    return Native.startScanning()
  },
  async stopScanning() {
    if (!Native.stopScanning) return
    return Native.stopScanning()
  },
}

export function supportedPlatform(): 'android' | 'ios' | 'unsupported' {
  if (Platform.OS === 'android' || Platform.OS === 'ios') return Platform.OS
  return 'unsupported'
}
