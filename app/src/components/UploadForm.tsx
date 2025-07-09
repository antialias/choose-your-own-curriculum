'use client'
import { css } from '@/styled-system/css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { uploadWorkClientSchema, UploadWorkClient } from '@/forms/uploadWork'
import { useEffect, useState } from 'react'

interface Props {
  onUploadStart?: () => void
  onSuccess?: () => void
  onError?: () => void
}

export function UploadForm({ onUploadStart, onSuccess, onError }: Props) {
  const [students, setStudents] = useState<{ id: string; name: string }[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/students')
      if (res.ok) {
        const data = (await res.json()) as { students: { id: string; name: string }[] }
        setStudents(data.students)
      }
    }
    load()
  }, [])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadWorkClient>({ resolver: zodResolver(uploadWorkClientSchema) })

  const onSubmit = async (data: UploadWorkClient) => {
    onUploadStart?.()
    const formData = new FormData()
    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0])
    }
    if (data.note) formData.append('note', data.note)
    if (data.dateCompleted) {
      formData.append('dateCompleted', data.dateCompleted.toISOString())
    }
    formData.append('studentId', data.studentId)
    try {
      const res = await fetch('/api/upload-work', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('upload failed')
      onSuccess?.()
      reset()
    } catch {
      onError?.()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={css({ display: 'flex', flexDir: 'column', gap: '2', padding: '4' })}
    >
      <input type="file" data-testid="file" {...register('file')} />
      <textarea placeholder={t('note')} {...register('note')} />
      {errors.file && <span>{t(errors.file.message || '')}</span>}
      <input type="date" {...register('dateCompleted')} />
      <select {...register('studentId')} defaultValue="">
        <option value="" disabled>
          {t('selectStudent')}
        </option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      {errors.studentId && <span>{t(errors.studentId.message || '')}</span>}
      <button type="submit" disabled={isSubmitting}>{t('upload')}</button>
    </form>
  )
}
