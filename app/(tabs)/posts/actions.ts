"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { error } from "console";
import { revalidateTag } from "next/cache";
import { postSchema } from "./schema";
const revalidateAllpost = async () => {
  "use server";
  revalidateTag("all_posts_lists");
};
export async function uploadPost(formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };
  const result = postSchema.safeParse(data);
  if (!result.success) {
    console.log("error", error);
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
      revalidateAllpost();
      // redirect(`/posts/`);
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
    revalidateAllpost();
  } catch (e) {
    console.log(e);
  }
}
// 포스트 수정

export async function editPost(
  postId: number,
  data: { title?: string; description?: string }
) {
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
      throw new Error("Unauthorized to edit this post");
    }

    // 업데이트 진행
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        description: data.description,
      },
    });
    console.log("editpost", post);
    console.log("updatedPost", updatedPost);
    revalidateAllpost();
    return updatedPost;
  } catch (e) {
    console.log("eerr", e);
    throw e; // It's generally a good idea to rethrow the error after logging it
  }
}
// comment
export async function getComments(postId: number) {
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
export async function deleteComment(commentId: number) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Authentication required");
    }

    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Post not found");
    }

    if (comment.userId !== session.id) {
      throw new Error("Unauthorized to delete this comment");
    }

    await db.post.delete({
      where: { id: commentId },
    });
    revalidateAllpost();
  } catch (e) {
    console.log(e);
  }
}
