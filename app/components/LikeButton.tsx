"use client";

import { dislikePost, likePost } from "@/app/(tabs)/posts/[id]/actions";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useOptimistic } from "react";
import { dislikeComment, likeComment } from "../(tabs)/posts/CommentActions";
interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  id: number;
  type: "post" | "comment"; // 포스트 또는 코멘트 구분
  mutate?: () => void;
}

export default function LikeButton({
  isLiked,
  likeCount,
  id,
  type,
  mutate,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState, payload) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );
  const onClick = async () => {
    reducerFn(undefined);
    if (state.isLiked) {
      // Type에 따라 적절한 함수 호출
      if (type === 'post') {
        await dislikePost(id);
      } else {
        await dislikeComment(id);
      }
      mutate?.();
    } else {
      if (type === 'post') {
        await likePost(id);
      } else {
        await likeComment(id);
      }
      mutate?.();
    }
  };
  return (
    <button
      onClick={onClick}
      className={`bg-transparent border-0 flex flex-row`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="Icon_Button" />
      ) : (
        <OutlineHandThumbUpIcon className="Icon_Button" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span> {state.likeCount}</span>
      )}
    </button>
  );
}
