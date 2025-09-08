// =========================
// src/hooks/avatarMutations.ts
// =========================
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../lib/query'
import type { ProfileT } from '../lib/schemas'
import { Avatar as AvatarApi } from '../lib/wagtailApi'

type UploadVars = { uri: string; name?: string; type?: string }

function toFormData({ uri, name, type }: UploadVars) {
  const fd = new FormData()
  const filename = name || uri.split('/').pop() || 'avatar.jpg'
  const mime = type || inferMime(filename)
  // RN FormData file descriptor
  fd.append('avatar', { uri, name: filename, type: mime } as any)
  return fd
}

function inferMime(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'heic' || ext === 'heif') return 'image/heic'
  return 'image/jpeg'
}

export function useAvatarUploadMutation() {
  return useMutation({
    mutationFn: async (vars: UploadVars) => {
      const form = toFormData(vars)
      return AvatarApi.upload(form)
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ['me'] })
      const prev = queryClient.getQueryData<ProfileT>(['me'])
      if (prev) {
        const optimistic = { ...prev, avatar_info: { ...(prev as any).avatar_info, uri: vars.uri, __optimistic: true } }
        queryClient.setQueryData(['me'], optimistic)
      }
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['me'], ctx.prev)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useAvatarRemoveMutation() {
  return useMutation({
    mutationFn: () => AvatarApi.remove(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['me'] })
      const prev = queryClient.getQueryData<ProfileT>(['me'])
      if (prev) queryClient.setQueryData(['me'], { ...prev, avatar_info: null })
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['me'], ctx.prev)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}

export function useAvatarSetExistingMutation() {
  return useMutation({
    mutationFn: (vars: { image_id: number }) => AvatarApi.setExisting(vars.image_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}
