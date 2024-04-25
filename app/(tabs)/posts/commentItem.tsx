"use client";
import DeleteButton from "@/app/components/deleteButton";
import { formatToTimeAgo } from "@/lib/utils";
import {
  HandThumbUpIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { deleteComment, editComment } from "./actions";
import { CommentType } from "./schema";

interface CommentItemProps {
  comment: CommentType;
  mutate?: () => void;
}
interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}

export default function CommentItem({ comment, mutate }: CommentItemProps) {
  // 포스트 수정
  const [isEditing, setIsEditing] = useState(false);
  const [editedCommentText, setEditedCommentText] = useState(
    comment.commentText || "No description provided"
  );

  const onEdit = () => {
    setIsEditing(true);
  };
  const handleEditComment = async () => {
    await editComment(comment.id, {
      commentText: editedCommentText,
    });
    setIsEditing(false);
  };
  const onDelete = async (itemId: number) => {
    await deleteComment(itemId);
    mutate?.();
  };
  // 코멘트 추가

  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      {isEditing ? 
        <textarea
          className="bg-blue-200"
          defaultValue={editedCommentText}
          onChange={(e) => setEditedCommentText(e.target.value)}
          // onBlur={handleEditComment}
        />
      :null}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(comment.created_at.toString())}</span>
        </div>
        <div className="flex gap-4 items-center">
          <DeleteButton itemId={comment.id} onDelete={onDelete} />
          <PencilIcon className="Icon_Button" onClick={onEdit} />
          {/* 편집 모드일 때 = 제출 버튼은 검게 칠해진 걸로. */}
          <PencilSquareIcon
            className="Icon_Button"
            onClick={handleEditComment}
          />
          <span>
            <HandThumbUpIcon className="Icon_Button" />
            {/* {comment._count.likes} */}
          </span>
          {/* <span onClick={toggleComments}>
            <ChatBubbleBottomCenterIcon className="size-4" />
          </span> */}
        </div>
      </div>
    </div>
  );
}
