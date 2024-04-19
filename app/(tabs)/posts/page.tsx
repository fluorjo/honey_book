import db from "@/lib/db";
// import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";
import AddPost from "./addPost";
import PostItem from "./postItem";

async function getInitialPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
  return posts.map((post) => ({
    ...post,
    description: post.description ?? "No description available",
  }));
}

export const metadata = {
  title: "Posts",
};

const getCachedPosts = nextCache(getInitialPosts, ["home-posts"],{tags:['all_posts_lists']});

export default async function Posts() {
  const initialPosts = await getCachedPosts();
  return (
    <>
      {/* // 위에 바로 포스팅할 수 있게 하고 뭐 버튼 클릭하면 집중 모드로 */}
      <AddPost />
      <div className="p-5 flex flex-col bg-red-400">
        {initialPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
