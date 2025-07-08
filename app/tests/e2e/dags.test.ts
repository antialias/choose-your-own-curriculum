import { describe, it, expect, vi, type Mock } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from '@/app/api/dags/route'
import { getServerSession } from 'next-auth'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('@/authOptions', () => ({ authOptions: {} }))
vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn().mockResolvedValue([{ id: '1' }]) })) })),
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn().mockResolvedValue([{ id: '1', userId: 'u1', topics: '[]', graph: 'g', dateCreated: new Date().toISOString() }]) })) }))
  }
}))

describe('dags API', () => {
  it('requires auth on POST', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null)
    const req = new NextRequest(new Request('http://localhost/api/dags', { method: 'POST', body: '{}' }))
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns dags for GET', async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } })
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.dags.length).toBe(1)
  })
})
