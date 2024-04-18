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
export async function deletePost(postId: number) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Authentication required");
    }

    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== session.id) {
      throw new Error("Unauthorized to delete this post");
    }

    await db.post.delete({
      where: { id: postId },
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId: postId },
    select: {
      id: true,
      payload: true,
      created_at: true,
    },
  });
  return comments.map((comment) => ({
    ...comment,
    payload: comment.payload ?? "No description available",
  }));
}
