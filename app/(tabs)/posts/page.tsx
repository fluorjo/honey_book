import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
// import Link from "next/link";
import AddPost from "./addPost";
import PostItem from "./postItem";

async function getPosts() {
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
  return posts.map(post => ({
    ...post,
    description: post.description ?? "No description available"
  }));
}

export const metadata = {
  title: "Posts",
};

export default async function Posts() {
  const posts = await getPosts();
  return (
    <>
      {/* // 위에 바로 포스팅할 수 있게 하고 뭐 버튼 클릭하면 집중 모드로 */}
      <AddPost />
      <div className="p-5 flex flex-col bg-red-400">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
