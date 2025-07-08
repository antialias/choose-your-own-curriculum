import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { uploadedWork } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";

const db = getDb();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const [row] = await db
    .select()
    .from(uploadedWork)
    .where(eq(uploadedWork.id, id));
  if (!row || row.userId !== userId || !row.thumbnail) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return new NextResponse(row.thumbnail, {
    headers: {
      "Content-Type": row.thumbnailType || "image/png",
    },
  });
}
