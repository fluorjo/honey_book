import { z } from "zod";

export const postSchema = z.object({
  title: z.string({
    required_error: "Title is required!!!!!",
  }),
  description: z.string({
    required_error: "Description is required",
  }),
});

export type ProductType = z.infer<typeof postSchema>;
