import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

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
  return posts;
}

export const metadata = {
  title: "Posts",
};

export default async function Posts() {
  const posts = await getPosts();
  return (
    <>
      {/* // 위에 바로 포스팅할 수 있게 하고 뭐 버튼 클릭하면 집중 모드로 */}
      <form action="" className="flex flex-col bg-green-400">
        <textarea className="bg-blue-300">제목</textarea>
        <textarea className=" bg-blue-100 transition-height duration-300 ease-in-out h-24 focus:h-48 ">내용</textarea>
      </form>
      <div className="p-5 flex flex-col bg-red-400">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
          >
            <h2 className="text-white text-lg font-semibold">{post.title}</h2>
            <p>{post.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4 items-center">
                <span>{formatToTimeAgo(post.created_at.toString())}</span>
                <span>·</span>
                <span>조회 {post.views}</span>
              </div>
              <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
                <span>
                  <HandThumbUpIcon className="size-4" />
                  {post._count.likes}
                </span>
                <span>
                  <ChatBubbleBottomCenterIcon className="size-4" />
                  {post._count.comments}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
