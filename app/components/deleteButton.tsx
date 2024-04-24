"use client";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteButtonProps {
  itemId: number; // itemId 혹은 commentId
  onDelete: (itemId: number) => void;
}

export default function DeleteButton({ itemId, onDelete }: DeleteButtonProps) {
  const onClick = async () => {
    onDelete(itemId);
  };

  return (
    <button onClick={onClick} className="Icon_Button border-none p-0 bg-transparent">
      <TrashIcon className="Icon_Button" />
    </button>
  );
}
