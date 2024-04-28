"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { error } from "console";
import { revalidateTag } from "next/cache";
import { postSchema } from "./schema";
export const revalidateAllpost = async () => {
  "use server";
  revalidateTag("all_posts_lists");
};
export async function uploadPost(formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    photo: formData.get("photo"),
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
          photo: result.data.photo,
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
    }
  }
}

// 사진 업로드
export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return {
    ...data,
    uploadType: "default",
  };
}

export async function getUploadUrlForEdit() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return {
    ...data,
    uploadType: "edit",
  };
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
  data: { title?: string; description?: string; photo?: string | null }
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
        photo: data.photo,
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
// 유저명을 가져와야 되는데.
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

export async function deleteComment(
  commentId: number
  // onSuccess: () => void
) {
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

    await db.comment.delete({
      where: { id: commentId },
    });
    revalidateTag(`comment`);
    // onSuccess();
  } catch (e) {
    console.log("eeeerrrrr");
    console.log(e);
  }
}

export async function editComment(
  commentId: number,
  data: { commentText?: string }
) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Authentication required");
    }

    const comment = await db.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== session.id) {
      throw new Error("Unauthorized to edit this comment");
    }

    // 업데이트 진행
    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: {
        commentText: data.commentText,
      },
    });
    console.log("editcomment", comment);
    console.log("updatedComment", updatedComment);
    // revalidateAllComment();
    return updatedComment;
  } catch (e) {
    console.log("eerr", e);
    throw e; // It's generally a good idea to rethrow the error after logging it
  }
}
