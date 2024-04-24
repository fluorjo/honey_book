"use client";

import { dislikePost, likePost } from "@/app/(tabs)/posts/[id]/actions";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useOptimistic } from "react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
  mutate?: () => void;
}

export default function LikePostButton({
  isLiked,
  likeCount,
  postId,
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
    if (isLiked) {
      await dislikePost(postId);
      mutate?.();
    } else {
      await likePost(postId);
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
