import { StudentForm } from '@/components/StudentForm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditStudentPage({ params }: any) {
  const id = params.id
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Edit Student</h1>
      <StudentForm onSubmit={async () => {}} />
      <p>ID: {id}</p>
    </div>
  )
}
