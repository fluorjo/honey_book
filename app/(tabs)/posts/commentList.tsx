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
// export async function getInitialComments(postId: number) {
//   const comments = await db.comment.findMany({
//     where: { postId: postId },
//     select: {
//       id: true,
//       commentText: true,
//       created_at: true,
//       _count: {
//         select: {
//           likes: true,
//         },
//       },
//     },
//   });
//   return comments.map((comment) => ({
//     ...comment,
//     commentText: comment.commentText ?? "No description available",
//   }));
// }
// function getCachedPostComments(postId: number) {
//   const commentCachedOperation = nextCache(getInitialComments, ["post-comments"], {
//     tags: [`comments-${postId}`],
//   });
//   return commentCachedOperation(postId);
// }

async function CommentList({ postId }: CommentListProps) {
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

  return (
    <div className="p-5 flex flex-col bg-green-400 border-[10px] border-black">
      {comments &&
        comments.map((comment: any) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
    </div>
  );
}

export default CommentList;
