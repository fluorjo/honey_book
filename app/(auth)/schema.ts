import { z } from "zod";

export const userSchema = z.object({
  userName: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
});

export interface UserType {
  id: number;
  userName: string;
  created_at: Date;
  avatar?: string | null;
}
