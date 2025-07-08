'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import {
  studentFieldsSchema,
  StudentFields,
} from '@/forms/student'

interface Props {
  student?: { id: string; name: string; email: string | null }
  onSuccess?: () => void
}

export function StudentForm({ student, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFields>({
    resolver: zodResolver(studentFieldsSchema),
    defaultValues: {
      name: student?.name ?? '',
      email: student?.email ?? undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: StudentFields) => {
      const res = await fetch(
        student ? `/api/students/${student.id}` : '/api/students',
        {
          method: student ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )
      if (!res.ok) throw new Error('Request failed')
    },
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const onSubmit = async (data: StudentFields) => {
    await mutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input placeholder="Name" {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <input placeholder="Email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting || mutation.isPending}>
        {student ? 'Save' : 'Add'}
      </button>
    </form>
  )
}
