"use client";
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
  const onSubmit = async (data: PostType) => {
    console.log("data", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
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
  console.log("Validation Errors22:", errors);
  // const onValid = async () => {
  //   console.log('dd')
  //   await onSubmit();
  // };
  return (
    <form
      // onSubmit={handleSubmit(onValid)}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-[450px] min-w-[200px]"
    >
      <input {...register("title")} className="input input-bordered" />
      <textarea
        {...register("description")}
        className=" textarea textarea-bordered transition-height duration-300 ease-in-out h-24 
        "
        //focus:h-48 해서 크게 하면 버튼 누르려 할 때 다시 줄어든다. 고쳐야 함.
        
      />
      <button type="submit" value="Submit" className="btn btn-primary">Post</button>
    </form>
  );
}
