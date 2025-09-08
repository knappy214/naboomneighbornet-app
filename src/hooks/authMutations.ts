// =========================
// src/hooks/authMutations.ts
// =========================
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../lib/query'
import { api, Profile as ProfileApi } from '../lib/wagtailApi'


export function useLoginMutation() {
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      await api.login(vars.email, vars.password)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (vars: { old_password: string; new_password: string }) =>
      ProfileApi.changePassword(vars),
  })
}