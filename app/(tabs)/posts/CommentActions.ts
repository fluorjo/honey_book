"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { error } from "console";
import { revalidateTag } from "next/cache";
import { commentSchema } from "./schema";

export async function uploadComment(formData: FormData) {
  console.log("commentupload ");
  const data = {
    commentText: formData.get("commentText"),
    postId: formData.get("postId"),
  };
  const result = commentSchema.safeParse(data);
  const postIdValue = data.postId ? data.postId.toString() : null;
  const postId = postIdValue ? parseInt(postIdValue, 10) : null;
  if (postId === null || isNaN(postId)) {
    console.error("Invalid postId, it must be a number and not null");
    console.log("postId", postId);
    return { error: "Invalid postId provided" };
  }
  if (!result.success) {
    console.log("commentupload error", error);
    return result.error.flatten();
  } else {
    const session = await getSession();

    if (session.id) {
      const comment = await db.comment.create({
        data: {
          commentText: result.data.commentText,
          user: {
            connect: {
              id: session.id,
            },
          },
          post: {
            connect: {
              id: postId!,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidateTag(`comment`);
      console.log("comment", comment);
    }
  }
}
export async function likeComment(commentId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        commentId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${commentId}`);
  } catch (e) {}
}

export async function dislikeComment(commentId: number) {
  try {
    const session = await getSession();
    const like = await db.like.findFirst({
      where: {
        commentId: commentId,
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
      revalidateTag(`like-status-${commentId}`);
    } else {
      console.log("좋아요를 찾을 수 없음: 삭제할 대상이 없습니다.");
    }
  } catch (e) {}
}

// export async function deletePost(postId: number) {
//   try {
//     const session = await getSession();
//     if (!session || !session.id) {
//       throw new Error("Authentication required");
//     }

//     const post = await db.post.findUnique({
//       where: { id: postId },
//     });

//     if (!post) {
//       throw new Error("Post not found");
//     }

//     if (post.userId !== session.id) {
//       throw new Error("Unauthorized to delete this post");
//     }

//     await db.post.delete({
//       where: { id: postId },
//     });
//     revalidateAllpost();
//   } catch (e) {
//     console.log(e);
//   }
// }
// // 포스트 수정

// export async function editPost(
//   postId: number,
//   data: { title?: string; commentText?: string }
// ) {
//   try {
//     const session = await getSession();
//     if (!session || !session.id) {
//       throw new Error("Authentication required");
//     }

//     const post = await db.post.findUnique({
//       where: { id: postId },
//     });

//     if (!post) {
//       throw new Error("Post not found");
//     }

//     if (post.userId !== session.id) {
//       throw new Error("Unauthorized to edit this post");
//     }

//     // 업데이트 진행
//     const updatedPost = await db.post.update({
//       where: { id: postId },
//       data: {
//         title: data.title,
//         commentText: data.commentText,
//       },
//     });
//     console.log("editpost", post);
//     console.log("updatedPost", updatedPost);
//     revalidateAllpost();
//     return updatedPost;
//   } catch (e) {
//     console.log("eerr", e);
//     throw e; // It's generally a good idea to rethrow the error after logging it
//   }
// }

// export async function getComments(postId: number) {
//   const comments = await db.comment.findMany({
//     where: { postId: postId },
//     select: {
//       id: true,
//       commentText: true,
//       created_at: true,
//     },
//   });
//   return comments.map((comment) => ({
//     ...comment,
//     commentText: comment.commentText ?? "No commentText available",
//   }));
// }
