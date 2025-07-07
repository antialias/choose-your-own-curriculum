import { z } from 'zod'

export const uploadWorkSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  studentId: z.string().min(1, 'Student ID is required'),
  dateCompleted: z
    .string()
    .optional()
    .or(z.literal('')),
})

export type UploadWorkFields = z.infer<typeof uploadWorkSchema>
