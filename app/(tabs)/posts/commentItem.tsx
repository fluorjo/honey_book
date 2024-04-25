"use client";
import LikeButton from "@/app/components/LikeButton";
import DeleteButton from "@/app/components/deleteButton";
import { formatToTimeAgo } from "@/lib/utils";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  PencilSquareIcon as PencilSquareIconSolid,
  UserIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
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

  const fetcher = (url: any) => fetch(url).then((res) => res.json());

  const { data: userInfo } = useSWR(
    `api/commentUserInfo/${[comment.id]}`,
    fetcher
  );
  const { data: likeStatus, mutate: likeStatusMutate } = useSWR(
    `api/likeStatus/comment/${[comment.id]}`,
    fetcher
  );

  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      {!isEditing ? (
        <p>{editedCommentText}</p>
      ) : (
        <textarea
          className="bg-blue-200"
          defaultValue={editedCommentText}
          onChange={(e) => setEditedCommentText(e.target.value)}
          // onBlur={handleEditComment}
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <div className=" overflow-hidden rounded-full  flex flex-row items-center space-x-1">
          {userInfo?.user.avatar !== null ? (
            <Image
              src={userInfo?.user.avatar}
              width={35}
              height={35}
              alt={userInfo?.user.username}
              className="bg-slate-300"
            />
          ) : (
            <UserIcon className="size-[35px] rounded-full bg-slate-300" />
          )}
          <span>{userInfo?.user.username}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(comment.created_at.toString())}</span>
        </div>
        <div className="flex gap-4 items-center">
          <DeleteButton itemId={comment.id} onDelete={onDelete} />
          {!isEditing ? (
            <PencilSquareIcon className="Icon_Button" onClick={onEdit} />
          ) : (
            <PencilSquareIconSolid
              className="Icon_Button"
              onClick={handleEditComment}
            />
          )}

          <span>
            {/* <HandThumbUpIcon className="Icon_Button" /> */}
            {/* {comment._count.likes} */}
            <LikeButton
              isLiked={likeStatus?.isLiked}
              likeCount={likeStatus?.likeCount}
              id={comment.id}
              mutate={likeStatusMutate}
              type={"comment"}
            />
          </span>
          {/* <span onClick={toggleComments}>
            <ChatBubbleBottomCenterIcon className="size-4" />
          </span> */}
        </div>
      </div>
    </div>
  );
}
