"use client";
import DeletePostButton from "@/app/components/deletePostButton";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { uploadComment } from "./CommentActions";
import { editPost, getComments } from "./actions";
import { CommentType, PostType, commentSchema } from "./schema";
interface PostItemProps {
  post: PostType;
}
interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}

export default function PostItem({ post }: PostItemProps) {
  const description = post.description || "No description provided.";

  //댓글 관련
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

  // 캐싱이 되면 이것들도 정리해야 될지도.
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments(post.id);
      setComments(data);
      console.log(data);
    };
    fetchComments();
  }, [post.id]);

  // 포스트 수정
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    post.description || "No description provided"
  );
  const [editedTitle, setEditedTitle] = useState(
    post.title || "No title provided"
  );
  const onEdit = () => {
    setIsEditing(true);
  };
  const handleEditPost = async () => {
    await editPost(post.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  // 코멘트 추가
  const onSubmitComment = async (commentData: CommentType) => {
    console.log("commentData", commentData);
    const formData = new FormData();
    formData.append("commentText", commentData.commentText);
    try {
      const errors = await uploadComment(formData);
      if (errors) {
        console.log("Server-side Errors:", errors);
        alert("Error submitting comment: " + JSON.stringify(errors));
      } else {
        console.log("Comment uploaded successfully");
        alert("Comment uploaded successfully!");

        // Navigate or refresh the form upon success
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert("Submission Error: " + error.message);
    }
  };

  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      {!isEditing ? (
        <h2 className="text-black text-lg font-semibold">{post.title}</h2>
      ) : (
        <textarea defaultValue={editedTitle} />
      )}
      {!isEditing ? (
        <p onDoubleClick={onEdit}>{editedDescription}</p>
      ) : (
        <textarea
          className="bg-blue-200"
          defaultValue={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onBlur={handleEditPost}
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(post.created_at.toString())}</span>
          <span>·</span>
          <span>조회 {post.views}</span>
        </div>
        <div className="flex gap-4 items-center">
          <DeletePostButton postId={post.id} />
          <PencilIcon className="size-5" onClick={onEdit} />
          <PencilSquareIcon className="size-5" onClick={handleEditPost} />
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
              <p key={comment.id}>{comment.commentText}</p>
            ))}
          </div>
          <form
            className="bg-blue-500"
            onSubmit={handleSubmit(onSubmitComment)}
          >
            <textarea
              className="bg-blue-200"
              placeholder="Comment this post"
              required
              {...register("commentText", { required: true })}
            />
            <input type="submit" value="Submit"></input>
            {errors.commentText && <p>{errors.commentText.message}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
