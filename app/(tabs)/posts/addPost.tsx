"use client";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getUploadUrl, uploadPost } from "./actions";
import { PostType, postSchema } from "./schema";

export default function AddPost() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostType>({
    resolver: zodResolver(postSchema),
  });
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const { success, result, uploadType } = await getUploadUrl();

    if (success && uploadType === "default") {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `${process.env.NEXT_PUBLIC_CLOUDFLARE_DELIVERY_URL}/${id}`
      );
    }
  };
  const onSubmit = async (data: PostType) => {
    console.log("data", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (file) {
      // 파일이 있을 경우에만 업로드 URL로 파일을 전송
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
      if (data.photo) {
        formData.append("photo", data.photo);
      }
    }
    try {
      const errors = await uploadPost(formData);
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
  // console.log("Validation Errors22:", errors);
  // const onValid = async () => {
  //   console.log('dd')
  //   await onSubmit();
  // };
  return (
    <form
      // onSubmit={handleSubmit(onValid)}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col md:w-96 space-y-2  w-44  "
    >
      <textarea
        {...register("title")}
        className="textarea textarea-primary min-h-8 h-8"
        placeholder="Title"
      />
      <textarea
        {...register("description")}
        className=" textarea textarea-primary textarea-bordered transition-height duration-300 ease-in-out h-24 
        "
        placeholder="description"
      />
      {preview === "" ? null : (
        <div
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {" "}
        </div>
      )}
      <div className="bg-base-100 h-8 flex items-center p-2 rounded-md  border-primary border-solid ">
        <label className="p-0 m-0 flex items-center" htmlFor="photo">
          <PhotoIcon className="Icon_Button size-7 " />
        </label>
      </div>

      <input
        onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        accept="image/*"
        className="hidden"
      />
      <button type="submit" value="Submit" className="btn btn-primary">
        Post
      </button>
    </form>
  );
}
