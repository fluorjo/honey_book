"use server";

import getSession from "@/lib/session";
import { PrismaClient } from "@prisma/client";
export async function GET(
  _request: Request,
  { params }: { params: { commentId: string } },
  response: Response
) {
  const session = await getSession();
  const db = new PrismaClient();

  try {
    const commentUser = await db.comment.findUnique({
      where: {
        id: parseInt(params.commentId),
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return Response.json(commentUser);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
