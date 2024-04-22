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
  // const [comments, setComments] = useState<Comment[]>([]);
  // useEffect(() => {
  //   async function fetchComments() {
  //     const loadedComments = await getComments(postId);
  //     setComments(loadedComments);
  //   }
  //   fetchComments();
  // }, [postId]);
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data: comments, mutate } = useSWR(`api/comments/${postId}`, fetcher);

  // function getCachedPostComments(postId: number) {
  //   const commentCachedOperation = nextCache(comments, ["post-comments"], {
  //     tags: [`comments-${postId}`],
  //   });
  //   return commentCachedOperation(postId);
  // }
  // const newComments=getCachedPostComments(postId)

  // 그냥 코멘트 아이템이랑 코멘트 추가 파일을 싹 다 합쳐버리면 편한 거 같은데.
  return (
    <div className="p-5 flex flex-col bg-green-400 border-[10px] border-black">
      {comments &&
        comments.map((comment: any) => (
          <CommentItem key={comment.id} comment={comment} mutate={mutate} />
        ))}
    </div>
  );
}

export default CommentList;
