import db from "@/lib/db";
import { unstable_cache as nextCache } from "next/cache";
import { useEffect, useState } from "react";
import { getComments } from "./actions";
import CommentItem from "./commentItem";

interface CommentListProps {
  postId: number;
}

interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}
export async function getInitialComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId: postId },
    select: {
      id: true,
      commentText: true,
      created_at: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  return comments.map((comment) => ({
    ...comment,
    commentText: comment.commentText ?? "No description available",
  }));
}
function getCachedPostComments(postId: number) {
  const commentCachedOperation = nextCache(getInitialComments, ["post-comments"], {
    tags: [`comments-${postId}`],
  });
  return commentCachedOperation(postId);
}

async function CommentList({ postId }: CommentListProps) {
  // const [comments, setComments] = useState<Comment[]>([]);
  // useEffect(() => {
  //   async function fetchComments() {
  //     const loadedComments = await getComments(postId);
  //     setComments(loadedComments);
  //   }
  //   fetchComments();
  // }, [postId]);
  const comments = await getInitialComments(postId);

  return (
    <div className="p-5 flex flex-col bg-green-400 border-[10px] border-black">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
        // <p className='bg-slate-400' key={comment.id}>{comment.commentText}</p>
      ))}
    </div>
  );
}

export default CommentList;
