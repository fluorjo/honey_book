'use client'
import { useState } from 'react';
import { ChatBubbleBottomCenterIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { formatToTimeAgo } from "@/lib/utils";
import { PostType } from './schema';
interface PostItemProps {
  post: PostType;
}
const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const description = post.description || "No description provided.";


  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-300">
      <h2 className="text-black text-lg font-semibold">{post.title}</h2>
      <p>{description}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(post.created_at.toString())}</span>
          <span>·</span>
          <span>조회 {post.views}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>
            <HandThumbUpIcon className="size-4" />
            {post._count.likes}
          </span>
          <span onClick={toggleComments}>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {post._count.comments}
          </span>
        </div>
      </div>
      {showComments && (
        <div>
          Here are the comments for {post.title}.
        </div>
      )}
    </div>
  );
};

export default PostItem;
