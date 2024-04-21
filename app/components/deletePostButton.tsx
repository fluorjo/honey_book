"use client";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteButtonProps {
  postId: number;  // postId 혹은 commentId
  onDelete: (postId: number) => void;  // 삭제 로직을 처리할 함수
}

export default function DeleteButton({ postId, onDelete }: DeleteButtonProps) {

  const onClick = async () => {
    onDelete(postId);
  };

  return (
    <button onClick={onClick} className="bg-transparent border-none">
      <TrashIcon className="size-5" />
    </button>
  );
}