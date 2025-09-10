// =========================
// src/lib/schemas.ts
// =========================
import { z } from 'zod'

export const ProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  avatar_info: z.any().nullable().optional(),
  stats: z.any().nullable().optional(),
}).passthrough()

export type ProfileT = z.infer<typeof ProfileSchema>

// ---- Wagtail v2 list shapes ----
export const WagtailMetaSchema = z.object({
  total_count: z.number().optional(),
  next: z.string().url().nullable().optional(),
  previous: z.string().url().nullable().optional(),
}).passthrough()

export const makeWagtailListSchema = <T extends z.ZodTypeAny>(item: T) => z.object({
  meta: WagtailMetaSchema,
  items: z.array(item),
})

export type WagtailList<T> = {
  meta: z.infer<typeof WagtailMetaSchema>
  items: T[]
}

// Basic Wagtail page shape used in examples
export const PageSchema = z.object({
  id: z.number(),
  title: z.string(),
  meta: z.object({ locale: z.string() }).passthrough(),
}).passthrough()

export type PageT = z.infer<typeof PageSchema>

