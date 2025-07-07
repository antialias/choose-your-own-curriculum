'use client'
import * as stylex from '@stylexjs/stylex'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentFieldsSchema, StudentFields } from '@/forms/student'

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
})

interface Props {
  onSubmit: (data: StudentFields) => Promise<void>
  initial?: StudentFields
}

export function StudentForm({ onSubmit, initial }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFields>({
    resolver: zodResolver(studentFieldsSchema),
    defaultValues: initial,
  })

  return (
    <form {...stylex.props(styles.form)} onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <input placeholder="Email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        Save
      </button>
    </form>
  )
}
