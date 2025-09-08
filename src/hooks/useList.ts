// =========================
// src/hooks/useList.ts
// =========================
import { QueryKey, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { makeWagtailListSchema, type WagtailList } from '../lib/schemas';
import { api } from '../lib/wagtailApi';

export function useListQuery<T extends z.ZodTypeAny>(
  key: QueryKey,
  path: string,
  itemSchema: T,
  opts?: { query?: Record<string, any>; enabled?: boolean }
) {
  const { query, enabled = true } = opts || {}
  return useQuery<WagtailList<z.infer<T>>>({
    queryKey: Array.isArray(key) ? key : [key],
    enabled,
    queryFn: async () => {
      const data = await api.get<any>(path, { query })
      return makeWagtailListSchema(itemSchema).parse(data)
    },
  })
}
