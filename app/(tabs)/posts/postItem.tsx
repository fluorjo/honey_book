"use client";
import LikePostButtonForList from "@/app/components/LikePostButtonForList";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import DropdownMenu from "../../components/dropDown";
import { deletePost, editPost } from "./actions";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import { PostType } from "./schema";
interface PostItemProps {
  post: PostType;
}
interface Comment {
  id: number;
  commentText: string;
  created_at: Date;
}

export default function PostItem({ post }: PostItemProps) {
  const description = post.description || "No description provided.";

  //댓글 관련
  const [showComments, setShowComments] = useState(true);
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // 포스트 수정
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    post.description || "No description provided"
  );
  const [editedTitle, setEditedTitle] = useState(
    post.title || "No title provided"
  );
  const onEdit = () => {
    setIsEditing(true);
  };
  const handleEditPost = async () => {
    await editPost(post.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  // 코멘트 추가
  const router = useRouter();
  // 좋아요
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR(`api/likeStatus/${[post.id]}`, fetcher);
  const { data: userInfo } = useSWR(`api/userInfo/${[post.id]}`, fetcher);

  // const getCachedPostUserInfo = nextCache(getPostUserInfo, ["post-userInfo"], {
  //   tags: ["post-userInfo"],
  // });
  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-100">
      <span>{userInfo?.user.username}</span>
      <div className="bg-transparent flex flex-row justify-end relative top-4">
        <span
          onClick={() => router.push(`/postModal/${post.id}`)}
          className="icon-[entypo--popup] Icon_Button"
        ></span>
        <ArrowsPointingOutIcon
          onClick={() => router.push(`/postDetail/${post.id}`)}
          className="Icon_Button"
        />
        <DropdownMenu
          post={post}
          deletePost={deletePost}
          isEditing={isEditing}
          handleEditPost={handleEditPost}
          onEdit={onEdit}
        />
      </div>

      {!isEditing ? (
        <h2 className="text-black text-lg font-semibold">{post.title}</h2>
      ) : (
        <textarea defaultValue={editedTitle} />
      )}
      {!isEditing ? (
        // 더블 클릭을 그냥 페이지 상세로.
        <p onDoubleClick={onEdit}>{editedDescription}</p>
      ) : (
        <textarea
          className="bg-blue-200"
          defaultValue={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onBlur={handleEditPost}
        />
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(post.created_at.toString())}</span>
          <span className="flex flex-row ">
            <EyeIcon className="Icon_Button mr-1" /> {post.views}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <LikePostButtonForList
            isLiked={data?.isLiked}
            likeCount={data?.likeCount}
            postId={post.id}
            mutate={mutate}
          />
          <span
            onClick={toggleComments}
            className="bg-transparent border-0 flex flex-row"
          >
            <ChatBubbleBottomCenterIcon className="Icon_Button" />
            {post._count.comments}
          </span>
        </div>
      </div>
      {showComments && (
        <div>
          {/* <div className="p-5 flex flex-col bg-red-400">
            {comments.map((comment) => (
              <p key={comment.id}>{comment.commentText}</p>
            ))}
          </div> */}
          <CommentList postId={post.id} />
          <CommentForm postId={post.id} />
        </div>
      )}
    </div>
  );
}
