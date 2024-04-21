"use client";
import DeleteCommentButton from "@/app/components/deleteCommentButton";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { deleteComment, editComment } from "./actions";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import { CommentType, CommentType } from "./schema";
import DeleteButton from "@/app/components/deleteCommentButton";
interface CommentItemProps {
  comment: CommentType;
}
interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const description = comment.description || "No description provided.";

  //댓글 관련
  const [showComments, setShowComments] = useState(true);
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // 캐싱이 되면 이것들도 정리해야 될지도.

  // useEffect(() => {
  //   revalidateTest(comment.id);
  //   const fetchComments = async () => {
  //     const data = await getComments(comment.id);
  //     setComments(data);
  //     console.log("ddd", data);
  //   };
  //   fetchComments();
  // }, [comment.id]);

  // 포스트 수정
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    comment.description || "No description provided"
  );
  const [editedTitle, setEditedTitle] = useState(
    comment.title || "No title provided"
  );
  const onEdit = () => {
    setIsEditing(true);
  };
  const handleEditComment = async () => {
    await editComment(comment.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  // 코멘트 추가

  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      {!isEditing ? (
        <h2 className="text-black text-lg font-semibold">{comment.title}</h2>
      ) : (
        <textarea defaultValue={editedTitle} />
      )}
      {!isEditing ? (
        // 더블 클릭을 그냥 페이지 상세로.
        <p onDoubleClick={onEdit}>{editedDescription}</p>
      ) : (
        <textarea
          className="bg-blue-200"
          defaultValue={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onBlur={handleEditComment}
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(comment.created_at.toString())}</span>
          <span>·</span>
          <span>조회 {comment.views}</span>
        </div>
        <div className="flex gap-4 items-center">
          <DeleteButton commentId={comment.id}onDelete={deleteComment} />
          <PencilIcon className="size-5" onClick={onEdit} />
          <PencilSquareIcon className="size-5" onClick={handleEditComment} />
          <span>
            <HandThumbUpIcon className="size-4" />
            {comment._count.likes}
          </span>
          <span onClick={toggleComments}>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {comment._count.comments}
          </span>
        </div>
      </div>
      {showComments && (
        <div>
          {/* <div className="p-5 flex flex-col bg-red-400">
            {comments.map((comment) => (
              <p key={comment.id}>{comment.commentText}</p>
            ))}
          </div> */}
          <CommentList commentId={comment.id} />
          <CommentForm commentId={comment.id} />
        </div>
      )}
    </div>
  );
}
