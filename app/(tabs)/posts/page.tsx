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
    orderBy: {
      created_at: 'desc', 
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

const getCachedPosts = nextCache(getInitialPosts, ["home-posts"], {
  tags: ["all_posts_lists"],
  revalidate: 1,
});

export default async function Posts() {
  const initialPosts = await getCachedPosts();
  return (
    <>
      <AddPost />
      <div className="p-5 flex flex-col ">
        {initialPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
