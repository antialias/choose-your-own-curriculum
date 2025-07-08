import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { uploadedWork } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";

const db = getDb();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const [work] = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.id, id));
  if (!work || work.userId !== userId || !work.thumbnail) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return new NextResponse(work.thumbnail, {
    headers: { "Content-Type": "image/png" },
  });
}
