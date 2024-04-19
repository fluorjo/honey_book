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

    const isTitleChanged = data.title !== undefined && data.title !== post.title;
    const isDescriptionChanged = data.description !== undefined && data.description !== post.description;

    if (!isTitleChanged && !isDescriptionChanged) {
      console.log("No changes detected.");
      return post; // 변경 사항 없음, 기존 포스트 반환
    }

    // 업데이트 진행
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        title: isTitleChanged ? data.title : post.title,
        description: isDescriptionChanged ? data.description : post.description,
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
