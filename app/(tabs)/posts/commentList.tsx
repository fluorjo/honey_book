import { useEffect, useState } from "react";
import { getComments } from "./actions";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

interface CommentListProps {
  postId: number;
}

interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}
  
async function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    async function fetchComments() {
      const loadedComments = await getComments(postId);
      setComments(loadedComments);
    }
    fetchComments();
  }, [postId]);

  return (
    <div className="p-5 flex flex-col bg-red-400">
      {comments.map((comment) => (
        <p key={comment.id}>{comment.commentText}</p>
      ))}
    </div>
  );
}

export default CommentList;
