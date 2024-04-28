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
import { UserIcon } from "@heroicons/react/24/solid";
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
            avatar: true,
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
    <div className="p-5 text-black border-solid border-primary shadow-md w-full flex items-center flex-col">
      <div className="flex items-center gap-2 mb-2  w-full ">
        <div className=" overflow-hidden rounded-full  flex flex-row items-center space-x-1 bg-white border-solid border-base-300 border-2">
          {post.user.avatar ? (
            <Image
              src={`${post.user.avatar}/avatar`}
              width={120}
              height={120}
              alt={post.user.username || "User avatar"}
              className=""
            />
          ) : (
            <UserIcon className="size-[120px] rounded-full " />
          )}
        </div>
        <div className="">
          <span className="text-2xl font-semibold">{post.user.username}</span>
          <div className="text-lg">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <div className=" w-[90%] flex flex-col card shadow-xl pb-8">
        <div className="card-body text-start ">
          <h2 className="text-xl font-bold ">{post.title}</h2>
          <p className="mb-5 text-lg">{post.description}</p>
          {post.photo ? (
            <figure className="rounded-md">
              <img
                className=" object-cover size-80 "
                src={`${post.photo}/public`}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </figure>
          ) : null}
        </div>

        <div className="flex flex-col gap-5 items-start  mx-8">
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
          </div>

          <details className="collapse bg-transparent ">
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
