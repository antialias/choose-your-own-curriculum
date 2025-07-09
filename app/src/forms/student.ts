import { z } from 'zod'

export const studentFieldsSchema = z.object({
  name: z.string().min(1, 'nameRequired'),
  email: z
    .string()
    .email('invalidEmail')
    .optional()
    .or(z.literal('')),
})

export const studentServerSchema = studentFieldsSchema.extend({
  id: z.string().optional(),
})

export type StudentFields = z.infer<typeof studentFieldsSchema>
export type StudentServer = z.infer<typeof studentServerSchema>
