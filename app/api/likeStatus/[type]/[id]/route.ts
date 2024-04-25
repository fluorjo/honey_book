"use server";

import getSession from "@/lib/session";
import { PrismaClient } from "@prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: { id: string, type: string }  },
  response: Response
) {
  const session = await getSession();
  const db = new PrismaClient();

  try {
    // id와 type을 통해 댓글인지 포스트인지 구분
    const { id, type } = params;
    const whereClause =
      type === "post" ? { postId: parseInt(id) } : { commentId: parseInt(id) };

    const isLiked = await db.like.findFirst({
      where: {
        ...whereClause,
        userId: session.id,
      },
    });
    const likeCount = await db.like.count({
      where: whereClause,
    });
    return Response.json({
      ok: true,
      likeCount,
      isLiked: Boolean(isLiked),
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return response.json();
  }
}
