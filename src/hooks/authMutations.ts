// =========================
// src/hooks/authMutations.ts
// =========================
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/query';
import { api, Profile as ProfileApi } from '../lib/wagtailApi';


export function useLoginMutation() {
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      console.log('🔐 Login: Attempting login with:', vars.email)
      try {
        const result = await api.login(vars.email, vars.password)
        console.log('✅ Login: Success, tokens received:', !!result.access)
        return result
      } catch (error) {
        console.error('❌ Login: Error during login:', error)
        console.error('❌ Login: Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: error instanceof Error && 'status' in error ? (error as any).status : 'Unknown',
          data: error instanceof Error && 'data' in error ? (error as any).data : 'Unknown'
        })
        throw error
      }
    },
    onSuccess: async (data) => {
      console.log('🎉 Login: Login successful, invalidating queries')
      await queryClient.invalidateQueries({ queryKey: ['me'] })
    },
    onError: (error) => {
      console.error('❌ Login: Mutation error:', error)
    }
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (vars: { old_password: string; new_password: string }) =>
      ProfileApi.changePassword(vars),
  })
}