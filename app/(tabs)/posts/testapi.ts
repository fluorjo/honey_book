"use server";

import db from "@/lib/db";
import { unstable_cache as nextCache } from "next/cache";


export async function getCachedPostComments(postId: number) {
  const commentCachedOperation = nextCache(
    getInitialComments,
    ["post-comments"],
    {
      tags: [`comment-${postId}`],
      revalidate: 1,
    }
  );
  return commentCachedOperation(postId);
}
