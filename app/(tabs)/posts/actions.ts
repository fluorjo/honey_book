"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

import { postSchema } from "./schema";

export async function uploadPost(formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = postSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/posts/`);
      //redirect("/products")
    }
  }
}

export async function getComments(postId:number) {
  const comments = await db.comment.findMany({
    where: { postId: postId },
    select: {
      id: true,
      payload: true,
      created_at: true,
    },
  });
  return comments.map(comment => ({
    ...comment,
    payload: comment.payload ?? "No description available",
  }));
}