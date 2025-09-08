// =========================
// src/context/QueryProvider.tsx
// =========================
import { QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { queryClient } from '../lib/query'
import { api } from '../lib/wagtailApi'

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const off = api.addUnauthorizedListener(() => {
      // why: guarantee cache reflects auth state immediately
      queryClient.clear()
    })
    return () => off()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
