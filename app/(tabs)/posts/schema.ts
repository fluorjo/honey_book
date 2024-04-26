import { z } from "zod";

export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  photo: z.string({
    required_error: "Photo is required",
  }),
});
export const commentSchema = z.object({
  commentText: z.string({
    required_error: "commentText is required",
  }),
});

export interface PostType {
  id: number;
  title: string;
  description: string;
  views: number;
  created_at: Date;
  _count: {
    likes: number;
    comments: number;
  };
  photo?: string;
}
export interface CommentType {
  id: number;
  commentText: string;
  created_at: Date;
  // _count: {
  //   likes: number;
  // };
}
