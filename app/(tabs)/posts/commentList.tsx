'use client'
import useSWR from "swr";
import CommentItem from "./commentItem";

interface CommentListProps {
  postId: number;
}

interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}

 function CommentList({ postId }: CommentListProps) {

  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data: comments, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comments/${postId}`, fetcher);

  return (
    <div className="p-0 m-0 flex flex-col border-solid border-t-base-300 border-x-0 border-b-0 pt-4 ">
      {comments &&
        comments.map((comment: any) => (
          <CommentItem key={comment.id} comment={comment} mutate={mutate} />
        ))}
    </div>
  );
}

export default CommentList;
