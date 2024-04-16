import { z } from "zod";

export const postSchema = z.object({
  id: z.number(),  // or z.string() depending on your database ID type
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  description: z.string({
    required_error: "Description is required",
  }), 
  views: z.number(),
  created_at: z.date(),  // Assuming 'created_at' is a Date object
  _count: z.object({
    comments: z.number(),
    likes: z.number(),
  })
});
export const commentSchema = z.object({
  id: z.number(),  // or z.string() depending on your database ID type
  payload: z.string({
    required_error: "Description is required",
  }), 
  created_at: z.date(),  // Assuming 'created_at' is a Date object
  _count: z.object({
    likes: z.number(),
  })
});

export type PostType = z.infer<typeof postSchema>;
export type CommentType = z.infer<typeof commentSchema>;
