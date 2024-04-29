"use client";
import { UserIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  deleteUserAvatar,
  editUser,
  getUploadAvatarUrl,
} from "../(auth)/login/userAction";
import { UserType, userSchema } from "../(auth)/schema";

interface ProfileAvatarProps {
  user: UserType;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showButtons, setShowButtons] = useState(true);
  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(userSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const {
      target: { files },
    } = event;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadAvatarUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "avatar",
        `${process.env.NEXT_PUBLIC_CLOUDFLARE_DELIVERY_URL}/${id}`
      );
    }
  };

  const resetPreview = () => {
    setPreview("");
  };

  const onSubmit = async (data: UserType) => {
    console.log("userdata", data);
    const formData = new FormData();
    formData.append("userName", data.userName);
    if (file) {
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "post",
        body: cloudflareForm,
      });
      if (response.status !== 200) {
        console.error("Image upload failed:", response.statusText);
        return; // 이미지 업로드 실패시 함수 종료
      }
      // 업로드 성공시, 이미지 URL을 폼 데이터에 추가
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
    }
    const updatedUserData = await editUser(user.id, {
      userName: data.userName,
      avatar: data.avatar,
    });

    if (updatedUserData) {
      console.log("Post uploaded successfully", updatedUserData);
      resetPreview();
    } else {
      console.log("Server-side Errors:", updatedUserData);
    }
  };

  return (
    <div className="group  min-w-[15rem] flex flex-col items-center space-y-2 ">
      <div>
        {preview ? (
          <img
            src={preview}
            alt={user.userName || "User avatar"}
            className="avatar_profile"
            onClick={toggleButtons}
          />
        ) : user.avatar ? (
          <img
            src={`${user.avatar}/width=500,height=500`}
            alt={user.userName || "User avatar"}
            className="avatar_profile"
            onClick={toggleButtons}
          />
        ) : (
          <div>
            <UserIcon className="avatar_profile" onClick={toggleButtons} />
          </div>
        )}
      </div>
      <div className="flex flex-row min-h-12 items-center p-0 m-0 ">
        {showButtons && (
          <>
            {/* 아바타 삭제 */}
            <button
              className="avatar_profile_button"
              onClick={() => deleteUserAvatar(user.id)}
            >
              아바타
              <br />
              삭제
            </button>
            <form onSubmit={handleSubmit(onSubmit)} className=" p-0 m-0">
              <div className="flex flex-row p-0 m-0 ">
                <label className="avatar_profile_button" htmlFor="avatar">
                  {/* 사진 선택 */}
                  사진
                  <br />
                  선택
                  <input
                    onChange={onImageChange}
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {/* 확인, 제출 버튼 */}
                {preview ? (
                  <button
                    className="avatar_profile_button"
                    disabled={!preview}
                    type="submit"
                  >
                    확인
                  </button>
                ) : null}
              </div>
            </form>
            {preview ? (
              <button
                className="avatar_profile_button "
                disabled={!preview}
                onClick={resetPreview}
              >
                이전<br />으로
              </button>
            ) : null}
          </>
        )}
      </div>
      <h1>{user.userName}</h1>
    </div>
  );
};

export default ProfileAvatar;
