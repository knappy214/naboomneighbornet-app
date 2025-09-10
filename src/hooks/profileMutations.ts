// =========================
// src/hooks/profileMutations.ts
// =========================
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../lib/query'
import { Profile as ProfileApi } from '../lib/wagtailApi'

export function useProfileUpdateMutation() {
  return useMutation({
    mutationFn: (patch: Record<string, any>) => ProfileApi.patch(patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}

