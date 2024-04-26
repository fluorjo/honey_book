import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/outline";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";
import { getComments } from "../../(tabs)/posts/actions";
// import LikeButton from "../../components/like-button";
import LikeButton from "@/app/components/LikeButton";

import CommentItem from "@/app/(tabs)/posts/commentItem";
import Image from "next/image";
import CommentForm from "../../(tabs)/posts/commentForm";

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

async function getLikeStatus(postId: number) {
  const session = await getSession();
  const isLiked = await db.like.findFirst({
    where: {
      postId,
      userId: session.id!,
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

function getCachedLikeStatus(postId: number) {
  const cachedOperation = nextCache(getLikeStatus, ["post-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId);
}

// 댓글

function getCachedPostComments(postId: number) {
  const commentCachedOperation = nextCache(getComments, ["post-comments"], {
    tags: [`comment`],
  });
  return commentCachedOperation(postId);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  const comments = await getCachedPostComments(id);

  return (
    <div className="p-5 text-black">
      <div className="flex items-center gap-2 mb-2">
        {/* <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        /> */}
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      {post.photo ? (
        <div className="post_photo">
          <Image
            className="object-cover "
            fill
            src={`${post.photo}/width=500,height=500`}
            alt={post.title}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="Icon_Button" />
          <span>조회 {post.views}</span>
          <LikeButton
            isLiked={isLiked}
            likeCount={likeCount}
            id={id}
            type={"post"}
          />
        </div>
        <div>
          {/* <div className="p-5 flex flex-col bg-red-400 w-[800px]">
            {comments &&
              comments.map((comment: any) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
          </div> */}
          <details className="collapse bg-transparent">
            <summary className="collapse-title text-sm font-medium w-2">
              Show Comment
            </summary>
            <div className="collapse-content w-72">
              {comments &&
                comments.map((comment: any) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
          </details>
          <CommentForm postId={id} />
        </div>
      </div>
    </div>
  );
}
