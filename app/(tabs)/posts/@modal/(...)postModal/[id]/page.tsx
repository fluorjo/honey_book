import db from "@/lib/db";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";
import { getComments } from "../../../actions";
import CommentItem from "../../../commentItem";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            // avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 1,
});

// 댓글

function getCachedPostComments(postId: number) {
  const commentCachedOperation = nextCache(getComments, ["post-comments"], {
    tags: [`comment`],
  });
  return commentCachedOperation(postId);
}

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const comments = await getCachedPostComments(id);
  return (
    <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
      <h2 className="text-lg font-semibold bg-blue-200">{post.title}</h2>
      <p className="mb-5 bg-blue-400">{post.description}</p>
      <div className="p-5 flex flex-col bg-red-400">
        {comments &&
          comments.map((comment: any) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
      </div>
      {/* 버튼만 따로 다른 파일로 분리시키기 */}
      <button className="absolute right-5 top-5 text-neutral-200">
        <XMarkIcon className="size-10" />
      </button>
      {/* <div className="max-w-screen-sm h-1/2  flex justify-center w-full">
        <div className="aspect-square  bg-neutral-700 text-neutral-200  rounded-md flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
      </div> */}
    </div>
  );
}
