"use client";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { editPost } from "../(tabs)/posts/actions";

interface EditPostButtonProps {
  postId: number;
  data: { title?: string; description?: string };
}

export default function EditPostButton(
  { postId, data }: EditPostButtonProps
  ) {
  const onClick = async () => {
    try {
      await editPost(postId, data);
    } catch (error) {
      console.error("Failed to edit post:", error);
    }
  };

  return (
    <button onClick={onClick} className="bg-transparent border-none">
      <PencilSquareIcon className="Icon_Button" />
    </button>
  );
}
