"use client";
import DeleteButton from "@/app/components/deleteButton";
import { formatToTimeAgo } from "@/lib/utils";
import { HandThumbUpIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { deleteComment } from "./actions";
import { CommentType } from "./schema";
interface CommentItemProps {
  comment: CommentType;
}
interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}

export default function CommentItem({ comment }: CommentItemProps) {
  // const commentText = comment.commentText || "No description provided.";

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
  const [editedCommentText, setEditedCommentText] = useState(
    comment.commentText || "No description provided"
  );

  const onEdit = () => {
    setIsEditing(true);
  };
  // const handleEditComment = async () => {
  //   await editComment(comment.id, {
  //     commentText: editedCommentText,
  //   });
  //   setIsEditing(false);
  // };

  // 코멘트 추가

  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      {!isEditing ? (
        // 더블 클릭을 그냥 페이지 상세로.
        <p onDoubleClick={onEdit}>{editedCommentText}</p>
      ) : (
        <textarea
          className="bg-blue-200"
          defaultValue={editedCommentText}
          onChange={(e) => setEditedCommentText(e.target.value)}
          // onBlur={handleEditComment}
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(comment.created_at.toString())}</span>
        </div>
        <div className="flex gap-4 items-center">
          <DeleteButton itemId={comment.id} onDelete={deleteComment} />
          <PencilIcon className="size-5" onClick={onEdit} />
          {/* <PencilSquareIcon className="size-5" onClick={handleEditComment} /> */}
          <span>
            <HandThumbUpIcon className="size-4" />
            {comment._count.likes}
          </span>
          {/* <span onClick={toggleComments}>
            <ChatBubbleBottomCenterIcon className="size-4" />
          </span> */}
        </div>
      </div>
    </div>
  );
}