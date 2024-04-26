import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon as PencilSquareIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import DeleteButton from "./deleteButton";
interface Comment {
  id: number;
}

interface DropdownMenuProps {
  comment: Comment;
  deleteComment: (commentId: number) => void;
  isEditing: boolean;
  handleEditComment: () => void;
  onEdit: () => void;
}

export default function DropdownBottomMenu({
  comment,
  deleteComment,
  isEditing,
  handleEditComment,
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
      className={`dropdown dropdown-top dropdown-end${
        isOpen ? "dropdown-open" : ""
      }   flex justify-end h-5 top-0 pr-4 `}
    >
      <div
        tabIndex={0}
        role="button"
        className="btn m-0 p-0 h-5 min-h-0 bg-transparent  border-none shadow-none"
        onMouseDown={toggleDropdown}
      >
        <span className="icon-[uil--ellipsis-v]" ></span>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-0 shadow bg-base-100 rounded-box top-4 ${
          isOpen ? "" : "hidden"
        } `}
      >
        <li>
          <a onClick={closeDropdown} className="">
            <DeleteButton itemId={comment.id} onDelete={deleteComment} />
          </a>
        </li>
        <li>
          <a onClick={closeDropdown}>
            {isEditing ? (
              <PencilSquareIconSolid
                className="Icon_Button"
                onClick={handleEditComment}
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
