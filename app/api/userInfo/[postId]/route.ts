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
    const postUser = await db.post.findUnique({
      where: {
        id: parseInt(params.postId),
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
    return Response.json(postUser);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
