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
      const data = await ProfileApi.get({ fields: ['id', 'email', 'avatar_info', 'stats', 'first_name', 'last_name', 'phone'] })
      return ProfileSchema.parse(data)
    },
  })
}
