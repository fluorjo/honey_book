"use client";
import { UserIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { editUser, getUploadAvatarUrl } from "../(auth)/login/userAction";
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
    try {
      const errors = await editUser(user.id, {
        userName: data.userName,
        avatar: data.avatar,
      });
      if (errors) {
        console.log("Server-side Errors:", errors);
      } else {
        console.log("Post uploaded successfully");
        // Navigate or refresh the form upon success
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };
  const resetPreview = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setPreview("");
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
            <button className="avatar_profile_button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 36 36"
                className=" p-0 m-0"
              >
                <path
                  fill="#000000"
                  d="M6 9v22a2.93 2.93 0 0 0 2.86 3h18.23A2.93 2.93 0 0 0 30 31V9Zm9 20h-2V14h2Zm8 0h-2V14h2Z"
                  className="clr-i-solid clr-i-solid-path-1"
                />
                <path
                  fill="#000000"
                  d="M30.73 5H23V4a2 2 0 0 0-2-2h-6.2A2 2 0 0 0 13 4v1H5a1 1 0 1 0 0 2h25.73a1 1 0 0 0 0-2"
                  className="clr-i-solid clr-i-solid-path-2"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </button>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className=" p-0 m-0"
            >
              <div className="flex flex-row p-0 m-0 ">
                <label
                  className="p-0 m-0 flex items-center  "
                  htmlFor="avatar"
                >
                  {/* 사진 선택 */}
                  <button className="avatar_profile_button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 36 36"
                    >
                      <path
                        fill="#000000"
                        d="M32 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3M6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27Zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18Z"
                        className="clr-i-solid clr-i-solid-path-1"
                      />
                      <path fill="none" d="M0 0h36v36H0z" />
                    </svg>
                  </button>
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
                <button className="avatar_profile_button" disabled={!preview}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="#000000"
                      d="M13.72 27.69L3.29 17.27a1 1 0 0 1 1.41-1.41l9 9L31.29 7.29A1 1 0 0 1 32.7 8.7Z"
                      className="clr-i-outline clr-i-outline-path-1"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                </button>
              </div>
            </form>
            <button
              className="avatar_profile_button "
              disabled={!preview}
              onClick={resetPreview}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 36 36"
              >
                <path
                  fill="#000000"
                  d="M24 4.22a1 1 0 0 0-1.41 1.42l5.56 5.49h-13A11 11 0 0 0 10.07 32a1 1 0 0 0 .93-1.82a9 9 0 0 1-5-8a9.08 9.08 0 0 1 9.13-9h13l-5.54 5.48A1 1 0 0 0 24 20l8-7.91Z"
                  className="clr-i-outline clr-i-outline-path-1"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </button>
          </>
        )}
      </div>
      <h1>{user.userName}</h1>
    </div>
  );
};

export default ProfileAvatar;
