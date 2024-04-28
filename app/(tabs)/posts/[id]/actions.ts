"use server";

import { revalidateTag } from "next/cache";

export async function revalidateTest(postId: number) {
  "use server";
  revalidateTag(`comment-status-${postId}`);
}

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function likePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  try {
    const session = await getSession();
    const like = await db.like.findFirst({
      where: {
        postId: postId,
        userId: session.id,
      },
      select: {
        id: true,
      },
    });
    if (like) {
      await db.like.delete({
        where: {
          id: like.id,
        },
      });
      revalidateTag(`like-status-${postId}`);
    } else {
      console.log("좋아요를 찾을 수 없음: 삭제할 대상이 없습니다.");
    }
  } catch (e) {}
}
export async function deletePostPhoto(postId: number) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Authentication required");
    }

    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("post not found");
    }

    if (post.userId !== session.id) {
      throw new Error("Unauthorized to delete this photo");
    }

    // 업데이트 진행
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        photo: null,
      },
    });
    console.log("editpost", post);
    console.log("updatedPost", updatedPost);
    return updatedPost;
  } catch (e) {
    console.log("eerr", e);
    throw e; // It's generally a good idea to rethrow the error after logging it
  } finally {
    // revalidateUser();
  }
}
