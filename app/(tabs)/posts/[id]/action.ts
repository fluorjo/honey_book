"use server";

import { revalidateTag } from "next/cache";

export async function revalidateTest(postId: number) {
  "use server";
  revalidateTag(`comment-status-${postId}`);
}
