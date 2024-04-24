import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon as PencilSquareIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import DeleteButton from "./deleteButton";
interface Post {
    id: number;
  }
  
  interface DropdownMenuProps {
    post: Post;
    deletePost: (postId: number) => void; 
    isEditing: boolean;
    handleEditPost: () => void; 
    onEdit: () => void; 
  }
  
export default function DropdownMenu({
  post,
  deletePost,
  isEditing,
  handleEditPost,
  onEdit,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className={`dropdown ${isOpen ? "dropdown-open" : ""} dropdown-end`}>
      <div
        tabIndex={0}
        role="button"
        className="btn m-1"
        onMouseDown={toggleDropdown}
      >
        <span className="icon-[uil--bars]"></span>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <li>
          <a onClick={closeDropdown}>
            <DeleteButton itemId={post.id} onDelete={deletePost} />
          </a>
        </li>
        <li>
          <a onClick={closeDropdown}>
            {isEditing ? (
              <PencilSquareIconSolid
                className="Icon_Button"
                onClick={handleEditPost}
              />
            ) : (
              <PencilSquareIcon className="Icon_Button" onClick={onEdit} />
            )}
          </a>
        </li>
      </ul>
    </div>
  );
}
