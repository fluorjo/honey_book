"use server";

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/server";

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
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query || !req.query.postId) {
    res.status(400).json({ message: "postId is required" });
    return;
}

const postIdParam = Array.isArray(req.query.postId) ? req.query.postId[0] : req.query.postId;
const postId = parseInt(postIdParam);

if (isNaN(postId)) {
  res.status(400).json({ message: "Invalid postId" });
  return;
}

  try {
    let comments = await db.comment.findMany({
      where: { postId: parseInt(postId+"") },
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
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the comments." });
  }
}
