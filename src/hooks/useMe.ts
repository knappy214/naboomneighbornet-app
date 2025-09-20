// =========================
// src/hooks/useMe.ts
// =========================
import { useQuery } from '@tanstack/react-query'
import { ProfileSchema, type ProfileT } from '../lib/schemas'
import { api, Profile as ProfileApi } from '../lib/wagtailApi'

export function useMeQuery(enabled = true) {
  return useQuery<ProfileT>({
    queryKey: ['me'],
    enabled: enabled && api.hasAuth(),
    queryFn: async () => {
      console.log('🔍 useMeQuery: Fetching user data...')
      try {
        const data = await ProfileApi.get({ fields: ['id', 'email', 'avatar_info', 'stats', 'first_name', 'last_name', 'phone'] })
        console.log('✅ useMeQuery: Raw data received:', data)
        
        // Handle Wagtail list format - extract first item
        let profileData = data
        if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
          console.log('📋 useMeQuery: Detected Wagtail list format, extracting first item')
          if (data.items.length === 0) {
            throw new Error('No user profile found')
          }
          profileData = data.items[0]
          console.log('✅ useMeQuery: Extracted profile data:', profileData)
        }
        
        const parsed = ProfileSchema.parse(profileData)
        console.log('✅ useMeQuery: Parsed data:', parsed)
        return parsed
      } catch (error) {
        console.error('❌ useMeQuery: Error fetching user data:', error)
        console.error('❌ useMeQuery: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: error instanceof Error && 'status' in error ? (error as any).status : 'Unknown',
          data: error instanceof Error && 'data' in error ? (error as any).data : 'Unknown'
        })
        throw error
      }
    }
  })
}
