'use client'
import { css } from '@/styled-system/css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadWorkClientSchema, UploadWorkClient } from '@/forms/uploadWork'

export function UploadForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadWorkClient>({ resolver: zodResolver(uploadWorkClientSchema) })

  const onSubmit = async (data: UploadWorkClient) => {
    const formData = new FormData()
    formData.append('file', data.file[0])
    if (data.dateCompleted) {
      formData.append('dateCompleted', data.dateCompleted.toISOString())
    }
    formData.append('studentId', data.studentId)
    await fetch('/api/upload-work', { method: 'POST', body: formData })
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={css({ display: 'flex', flexDir: 'column', gap: '2', padding: '4' })}
    >
      <input type="file" {...register('file')} />
      {errors.file && <span>{errors.file.message}</span>}
      <input type="date" {...register('dateCompleted')} />
      <input type="text" placeholder="Student ID" {...register('studentId')} />
      {errors.studentId && <span>{errors.studentId.message}</span>}
      <button type="submit" disabled={isSubmitting}>Upload</button>
    </form>
  )
}
