'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { css } from '@/styled-system/css'
import { uploadWorkSchema, UploadWorkFields } from '@/validations/uploadWork'

export function UploadForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UploadWorkFields>({
    resolver: zodResolver(uploadWorkSchema),
  })

  const onSubmit = async (data: UploadWorkFields) => {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.dateCompleted) formData.append('dateCompleted', data.dateCompleted)
    formData.append('studentId', data.studentId)
    await fetch('/api/upload-work', { method: 'POST', body: formData })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css({ display: 'flex', flexDir: 'column', gap: '2', padding: '4' })}>
      <input type="file" {...register('file')} />
      {errors.file && <span>{errors.file.message}</span>}
      <input type="date" {...register('dateCompleted')} />
      <input type="text" placeholder="Student ID" {...register('studentId')} />
      {errors.studentId && <span>{errors.studentId.message}</span>}
      <button type="submit">Upload</button>
    </form>
  )
}
