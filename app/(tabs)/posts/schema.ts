import { z } from "zod";

export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
  photo: z.string().optional().nullable(),
});
export const postPhotoEditSchema = z.object({
  photo: z.string().optional().nullable(),
});
export const commentSchema = z.object({
  commentText: z.string({
    required_error: "commentText is required",
  }),
});
export const userSchema = z.object({
  userName: z.string({
    required_error: "userName is required!!!!!",
  }),
  avatar: z.string().optional().nullable(),
});

export interface PostType {
  id: number;
  title: string;
  description: string;
  views: number;
  created_at: Date;
  photo?: string | null;
  _count: {
    likes: number;
    comments: number;
  };
}
export interface UserType {
  id: number;
  userName: string;
  created_at: Date;
  avatar?: string | null;
}
export interface CommentType {
  id: number;
  commentText: string;
  created_at: Date;
  // _count: {
  //   likes: number;
  // };
}
