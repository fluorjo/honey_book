'use client'
import { UserIcon } from "@heroicons/react/24/solid";

interface ProfileAvatarProps {
  user: {
    username?: string;
    avatar?: string|null;
  };
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
  return (
    <div className="avatar">
      <div className="w-24 rounded-full cursor-pointer hover:brightness-110">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username || "User avatar"}
            className=""
          />
        ) : (
          <div>
            <UserIcon className="rounded-full bg-[#c3c3c3] fill-white" />
          </div>
        )}
      </div>
      <h1>{user.username}</h1>
    </div>
  );
};

export default ProfileAvatar;
