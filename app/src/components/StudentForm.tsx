'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentSchema, StudentFields } from '@/forms/student'

export function StudentForm({ onSubmit }: { onSubmit: (data: StudentFields) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StudentFields>({
    resolver: zodResolver(studentSchema),
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input type="text" placeholder="Name" {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <input type="email" placeholder="Email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting}>Save</button>
    </form>
  )
}
