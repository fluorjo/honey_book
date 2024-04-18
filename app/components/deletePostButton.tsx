"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deletePost } from "../(tabs)/posts/actions";

interface DeletePostButtonProps {
  postId: number;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const onClick = async () => {
    deletePost(postId);
  };
  return (
    <button onClick={onClick} className="bg-transparent border-none">
      <TrashIcon className="size-5" />
    </button>
  );
}
