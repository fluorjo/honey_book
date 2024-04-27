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
            {/* 크기 확 커지지 않게 클래스 관리 잘 하고 클래스들 통일하던가 해야겠다.  */}
          {preview ? (
            <div>
              <img
                src={preview}
                alt={user.userName || "User avatar"}
                className=""
              />
     
            </div>
          ) : user.avatar ? (
            <img
              src={`${user.avatar}/width=500,height=500`}
              alt={user.userName || "User avatar"}
              className=""
            />
          ) : (
            <div>
              <UserIcon className="rounded-full bg-[#c3c3c3] fill-white" />
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
