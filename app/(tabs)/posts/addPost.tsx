"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { uploadPost } from "./actions";
import { PostType, postSchema } from "./schema";

export default function AddPost() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostType>({
    resolver: zodResolver(postSchema),

  });

  const onSubmit = handleSubmit(async (data: PostType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    const errors = await uploadPost(formData);
    if (errors) {
      // setError("")
    }
  });
  const onValid = async () => {
    await onSubmit();
  };
  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col bg-green-400"
    >
      <input {...register("title")} className="bg-blue-300"/>

      <textarea
        {...register("description")}
        className=" bg-blue-100 transition-height duration-300 ease-in-out h-24 focus:h-48 "
      >
        내용
      </textarea>
      <button type="submit">submit</button>
    </form>
  );
}