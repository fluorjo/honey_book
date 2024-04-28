"use client";
import LikeButton from "@/app/components/LikeButton";
import DropdownBottomMenu from "@/app/components/dropDownBottom";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commentUserInfo/${[
      comment.id,
    ]}`,
    fetcher
  );
  const { data: likeStatus, mutate: likeStatusMutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/likeStatus/comment/${[
      comment.id,
    ]}`,
    fetcher
  );

  // 택스트 펼침, 접음

  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  return (
    <div className="mb-3 text-black flex flex-col gap-2  bg-base-100 max-w-full p-2 rounded-md  ">
      <div className="flex flex-row">
        {" "}
        <div className=" overflow-hidden  flex flex-col  items-center mr-3 justify-center">
          {userInfo?.user.avatar ? (
            <Image
              src={`${userInfo.user.avatar}/avatar`}
              width={50}
              height={50}
              alt={userInfo.user.username || "User avatar"}
              className=""
            />
          ) : (
            <UserIcon className="size-[50px] rounded-full " />
          )}
        </div>
        {!isEditing ? (
          <div
            className={`text-overflow ${
              expanded ? "expanded" : ""
            } max-w-[75%]  bg-base-300 mx-1 py-1 rounded-md indent-[-10px] pl-4 pr-4 `}
            onClick={toggleExpand}
          >
            {userInfo?.user.username}
            <br />
            {editedCommentText}
          </div>
        ) : (
          <div className=" w-full p-0 m-0 flex flex-col">
            <textarea
              className={`textarea textarea-primary ${
                expanded ? "expanded" : ""
              } rounded-md `}
              defaultValue={editedCommentText}
              onChange={(e) => setEditedCommentText(e.target.value)}
              // onBlur={handleEditComment}
            />
            <button
              className="btn btn-primary min-h-5 h-8 my-2"
              onClick={handleEditComment}
              disabled={!editedCommentText.trim()}
            >
              Post
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-start text-sm space-x-2 ">
        <span>{formatToTimeAgo(comment.created_at.toString())}</span>
        <div className="flex gap-4 items-center">
          <span>
            <LikeButton
              isLiked={likeStatus?.isLiked}
              likeCount={likeStatus?.likeCount}
              id={comment.id}
              mutate={likeStatusMutate}
              type={"comment"}
            />
          </span>
          <DropdownBottomMenu
            comment={comment}
            deleteComment={onDelete}
            isEditing={isEditing}
            handleEditComment={handleEditComment}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
}
