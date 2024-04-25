"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { uploadComment } from "./CommentActions";
import { CommentType, commentSchema } from "./schema";

interface CommentFormProps {
  postId: number;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
  });
  const onSubmitComment = async (commentData: CommentType) => {
    console.log("commentData", commentData);
    const formData = new FormData();
    formData.append("commentText", commentData.commentText);
    formData.append("postId", postId.toString());
    try {
      const errors = await uploadComment(formData);
      if (errors) {
        console.log("Server-side Errors:", errors);
        alert("Error submitting comment: " + JSON.stringify(errors));
      } else {
        console.log("Comment uploaded successfully");
        // alert("Comment uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert("Submission Error: " + error.message);
    }
    location.reload();
  };

  return (
    <form className="flex flex-row items-center justify-evenly" onSubmit={handleSubmit(onSubmitComment)}>
      <textarea
        className="textarea textarea-bordered"
        placeholder="Comment this post"
        required
        {...register("commentText")}
      />
      <button className="btn btn-primary">Post</button>

      {errors.commentText && <p>{errors.commentText.message}</p>}
    </form>
  );
};

export default CommentForm;
