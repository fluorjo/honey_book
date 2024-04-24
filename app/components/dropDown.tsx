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
    <div
      className={`dropdown ${
        isOpen ? "dropdown-open" : ""
      } dropdown-end  flex justify-end h-5 top-6 pr-4`}
    >
      <div
        tabIndex={0}
        role="button"
        className="btn m-0 p-0 min-h-0 bg-transparent"
        onMouseDown={toggleDropdown}
      >
        <span className="icon-[uil--bars] Icon_Button"></span>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-0 shadow bg-base-100 rounded-box top-6 ${
          isOpen ? "" : "hidden"
        } `}
      >
        <li>
          <a onClick={closeDropdown} className=''>
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
