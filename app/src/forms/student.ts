import { z } from 'zod'

export const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional(),
})

export type StudentFields = z.infer<typeof studentSchema>
