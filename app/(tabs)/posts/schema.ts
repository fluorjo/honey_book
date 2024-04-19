import { z } from "zod";

export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  description: z.string({
    required_error: "Description is required",
  }),

});
export const commentSchema = z.object({
  id: z.number(), // or z.string() depending on your database ID type
  payload: z.string({
    required_error: "Description is required",
  }),
  created_at: z.date(), // Assuming 'created_at' is a Date object
  _count: z.object({
    likes: z.number(),
  }),
});

export interface PostType {
  id: number;
  title: string;
  description: string;
  views: number;
  created_at: Date;
  _count: {
    comments: number;
    likes: number;
  };
}
export interface CommentType {
  id: number;
  title: string;
  description: string;
  views: number;
  created_at: Date;
  _count: {
    comments: number;
    likes: number;
  };
}
