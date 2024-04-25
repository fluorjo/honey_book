"use server";

import getSession from "@/lib/session";
import { PrismaClient } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: { postId: string } },
  response: Response
) {
  const session = await getSession();
  const db = new PrismaClient();

  try {
    const isLiked = await db.like.findUnique({
      where: {
        id: {
          postId: parseInt(params.postId),
          userId: session.id!,
        },
      },
    });
    const likeCount = await db.like.count({
      where: {
        postId: parseInt(params.postId),
      },
    });
    return Response.json({
      ok: true,
      likeCount,
      isLiked: Boolean(isLiked),
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
