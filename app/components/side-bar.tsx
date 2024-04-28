"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"; // 화살표 아이콘 임포트
import { useState } from "react";

interface SideBarProps {
  children: React.ReactNode;
}

export default function SideBar({ children }: SideBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative min-h-screen flex">
      {/* 사이드바 */}
      <div
        className={`fixed top-0 bottom-0 z-40 ${
          isOpen ? "w-40" : "w-0"
        } bg-primary transition-width duration-300 overflow-hidden`}
      >
        <ul className="menu p-4 overflow-y-auto text-base-content">
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Profile</a>
          </li>
        </ul>
      </div>

      <div className="drawer-content flex flex-col items-center justify-center flex-1">
        {children}
      </div>

      <button
        onClick={toggleDrawer}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 border-none bg-transparent shadow-none"
        style={{ transform: `translateX(${isOpen ? "10rem" : "0px"})` }}
      >
        {isOpen ? (
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        ) : (
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        )}
      </button>
    </div>
  );
}
