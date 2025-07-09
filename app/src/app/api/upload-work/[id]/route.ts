import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { uploadedWork } from '@/db/schema';
import { deleteWorkEmbeddings } from '@/db/embeddings';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/authOptions';

const db = getDb();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const [row] = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.id, id));
  if (!row || row.userId !== userId) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  const type = req.nextUrl.searchParams.get('type');
  if (type === 'thumbnail') {
    if (!row.thumbnail) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    return new NextResponse(row.thumbnail, {
      status: 200,
      headers: {
        'Content-Type': row.thumbnailMimeType || 'image/png',
      },
    });
  }
  return new NextResponse(row.originalDocument, {
    status: 200,
    headers: {
      'Content-Type': row.originalMimeType || 'application/octet-stream',
      ...(row.originalFilename
        ? { 'Content-Disposition': `inline; filename="${row.originalFilename}"` }
        : {}),
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const [row] = await db
    .select({ userId: uploadedWork.userId })
    .from(uploadedWork)
    .where(eq(uploadedWork.id, id));
  if (!row || row.userId !== userId) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  await db.delete(uploadedWork).where(eq(uploadedWork.id, id));
  deleteWorkEmbeddings(id);
  return NextResponse.json({ ok: true });
}
