"use client";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { deletePost, getComments } from "./actions";
import { CommentType, PostType, commentSchema } from "./schema";
interface PostItemProps {
  post: PostType;
}
interface Comment {
  id: number;
  payload: string;
  created_at: Date;
}

export default function PostItem({ post }: PostItemProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
  });
  const [showComments, setShowComments] = useState(true);

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments(post.id);
      setComments(data);
      console.log(data);
    };
    fetchComments();
  }, [post.id]);

  const description = post.description || "No description provided.";

  // delete Post
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const handleDelete = async () => {
    try {
      const session = await getSession();
      if (!session || !session.id) {
        setError("Authentication required");
        return;
      }

      // 추가적으로 포스트 삭제 후 UI를 갱신하는 로직 필요
    } catch (err: any) {
      setError(err.message || "Failed to delete the post.");
    }
  };
  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      <h2 className="text-black text-lg font-semibold">{post.title}</h2>
      <p>{description}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(post.created_at.toString())}</span>
          <span>·</span>
          <span>조회 {post.views}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span onClick={handleDelete}>
            <TrashIcon className="size-4" />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
          </span>
          <PencilSquareIcon className="size-4" />
          <span>
            <HandThumbUpIcon className="size-4" />
            {post._count.likes}
          </span>
          <span onClick={toggleComments}>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {post._count.comments}
          </span>
        </div>
      </div>
      {showComments && (
        <div>
          <div className="p-5 flex flex-col bg-red-400">
            {comments.map((comment) => (
              <p key={comment.id}>{comment.payload}</p>
            ))}
          </div>
          <form className="bg-blue-500">
            <textarea
              className="bg-blue-200"
              name="description"
              placeholder="Comment this post"
              required
            />
            <button className="bg-orange-400 w-full">Comment!</button>
          </form>
        </div>
      )}
    </div>
  );
}
