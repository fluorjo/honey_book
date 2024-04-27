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
    if (!files) {
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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="p-0 m-0 flex items-center" htmlFor="avatar">
        <div className="w-24 rounded-full cursor-pointer hover:brightness-110">
          {/* 크기 확 커지지 않게 클래스 관리 잘 하고 클래스들 통일하던가 해야겠다.  
            
            프리뷰 수정/삭제/제출. 삭제는 뭐 setpreview를 다시 비우면 되겠지.
            */}
          {preview ? (
            <div>
              <img
                src={preview}
                alt={user.userName || "User avatar"}
                className="avatar_profile"
              />
              <button className="btn-primary btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button className="btn-primary btn-circle btn-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 1024 1024"
                  className="h-6 w-6"
                >
                  <path
                    fill="#4c4c4c"
                    d="M512 128a384 384 0 1 0 0 768a384 384 0 0 0 0-768m0-64a448 448 0 1 1 0 896a448 448 0 0 1 0-896"
                  />
                  <path
                    fill="#4c4c4c"
                    d="M640 288q64 0 64 64t-64 64t-64-64t64-64M214.656 790.656l-45.312-45.312l185.664-185.6a96 96 0 0 1 123.712-10.24l138.24 98.688a32 32 0 0 0 39.872-2.176L906.688 422.4l42.624 47.744L699.52 693.696a96 96 0 0 1-119.808 6.592l-138.24-98.752a32 32 0 0 0-41.152 3.456l-185.664 185.6z"
                  />
                </svg>
              </button>
              <button className="btn btn-circle btn-outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                >
                  <path
                    fill="none"
                    stroke="#4c4c4c"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 11L11 17L21 7"
                  />
                </svg>
              </button>
            </div>
          ) : user.avatar ? (
            <img
              src={`${user.avatar}/width=500,height=500`}
              alt={user.userName || "User avatar"}
              className="avatar_profile"
            />
          ) : (
            <div>
              <UserIcon className="avatar_profile bg-[#c3c3c3] fill-white" />
            </div>
          )}
        </div>
        <input
          onChange={onImageChange}
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          className="hidden"
        />
      </label>

      <h1>{user.userName}</h1>
    </form>
  );
};

export default ProfileAvatar;
