"use server";

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId: postId },
    select: {
      id: true,
      commentText: true,
      created_at: true,
    },
  });
  return comments.map((comment) => ({
    ...comment,
    commentText: comment.commentText ?? "No description available",
  }));
}
export async function GET(
  _request: Request,
  { params }: { params: { postId: string } },
  response: Response
) {
  try {
    let comments = await db.comment.findMany({
      where: { postId: parseInt(params.postId) },
      select: {
        id: true,
        commentText: true,
        created_at: true,
      },
    });
    comments = comments.map((comment) => ({
      ...comment,
      commentText: comment.commentText ?? "No description available",
    }));
    return Response.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
