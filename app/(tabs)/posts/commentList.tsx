import { useEffect, useState } from "react";
import { getComments } from "./actions";

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
    <div className="p-5 flex flex-col bg-green-400 border-[10px] border-black">
      {comments.map((comment) => (
        <p className='bg-slate-400' key={comment.id}>{comment.commentText}</p>
      ))}
    </div>
  );
}

export default CommentList;
