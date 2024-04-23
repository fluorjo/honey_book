'use client'
import { XMarkIcon } from "@heroicons/react/24/solid";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button className="absolute right-5 top-5 text-neutral-200" onClick={handleBack}>
      <XMarkIcon className="size-10" />
    </button>
  );
};

export default BackButton;
