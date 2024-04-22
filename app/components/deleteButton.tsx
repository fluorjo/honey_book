"use client";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteButtonProps {
  itemId: number;  // itemId 혹은 commentId
  onDelete: (itemId: number) => void;  
}

export default function DeleteButton({ itemId, onDelete }: DeleteButtonProps) {

  const onClick = async () => {
    onDelete(itemId);
  };

  return (
    <button onClick={onClick} className="bg-transparent border-none">
      <TrashIcon className="size-5" />
    </button>
  );
}