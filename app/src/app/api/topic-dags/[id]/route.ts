import { NextResponse } from 'next/server'
import { db } from '@/db'
import { topicDags } from '@/db/schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/authOptions'
import { eq, and } from 'drizzle-orm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: Request, context: any) {
  const { params } = context as { params: { id: string } }
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const [row] = await db
    .select()
    .from(topicDags)
    .where(and(eq(topicDags.userId, userId), eq(topicDags.id, params.id)))
  if (!row) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json({ dag: row })
}
