import { z } from 'zod'

const FileListType: typeof FileList =
  typeof FileList === 'undefined'
    ? (class DummyFileList extends Array<File> {}) as unknown as typeof FileList
    : FileList

export const uploadWorkFieldsSchema = z.object({
  studentId: z.string().min(1, 'studentIdRequired'),
  dateCompleted: z
    .preprocess((v) => (v ? new Date(String(v)) : undefined), z.date().optional()),
  note: z.string().optional(),
})

export const uploadWorkServerSchema = uploadWorkFieldsSchema
  .extend({
    file: z.instanceof(File).optional(),
  })
  .refine((v) => v.file instanceof File || (v.note && v.note.trim().length > 0), {
    message: 'fileRequired',
    path: ['file'],
  })

export const uploadWorkClientSchema = uploadWorkFieldsSchema
  .extend({
    file: z.instanceof(FileListType).optional(),
  })
  .refine((v) =>
    (v.file && (v.file as FileList).length > 0) || (v.note && v.note.trim().length > 0),
    { message: 'fileRequired', path: ['file'] }
  )

export type UploadWorkFields = z.infer<typeof uploadWorkFieldsSchema>
export type UploadWorkServer = z.infer<typeof uploadWorkServerSchema>
export type UploadWorkClient = z.infer<typeof uploadWorkClientSchema>
