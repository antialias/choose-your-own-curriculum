import { z } from 'zod'

const FileListType: typeof FileList =
  typeof FileList === 'undefined'
    ? (class DummyFileList extends Array<File> {}) as unknown as typeof FileList
    : FileList

export const uploadWorkFieldsSchema = z.object({
  studentId: z.string().min(1, 'studentIdRequired'),
  dateCompleted: z
    .preprocess((v) => (v ? new Date(String(v)) : undefined), z.date().optional()),
})

export const uploadWorkServerSchema = uploadWorkFieldsSchema.extend({
  file: z.instanceof(File, { message: 'fileRequired' }),
})

export const uploadWorkClientSchema = uploadWorkFieldsSchema.extend({
  file: z
    .instanceof(FileListType)
    .refine((list) => list.length > 0, 'fileRequired'),
})

export type UploadWorkFields = z.infer<typeof uploadWorkFieldsSchema>
export type UploadWorkServer = z.infer<typeof uploadWorkServerSchema>
export type UploadWorkClient = z.infer<typeof uploadWorkClientSchema>
