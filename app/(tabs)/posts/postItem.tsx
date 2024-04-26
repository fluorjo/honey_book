"use client";
import LikeButton from "@/app/components/LikeButton";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
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
  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/likeStatus/post/${[post.id]}`,
    fetcher
  );
  const { data: userInfo } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/postUserInfo/${[post.id]}`,
    fetcher
  );
  const modalId = `modal_${post.id}`; 
  return (
    <div className="pb-5 mb-5  text-black flex flex-col gap-2 bg-primary px-3 rounded-md max-w-72">
      {/* 모달 */}
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{editedTitle}</h3>
          <p className="py-4">{editedDescription}</p>
          {post.photo ? (
            <div className="post_photo size-52">
              <Image
                className="object-cover"
                fill
                src={`${post.photo}/avatar`}
                alt={post.title}
              />
            </div>
          ) : null}
          <div>
            <CommentList postId={post.id} />
            <CommentForm postId={post.id} />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor={modalId}>
          Close
        </label>
      </div>
      {/* 모달 */}

      <div className="bg-transparent flex flex-row  relative top-4 justify-between">
        <div className=" overflow-hidden rounded-full  flex flex-row items-center space-x-1">
          {userInfo?.user.avatar ? (
            <Image
              src={userInfo.user.avatar}
              width={35}
              height={35}
              alt={userInfo.user.username || "User avatar"} // alt 값은 유저 이름이나 "User avatar"로 채우기
              className=""
            />
          ) : (
            <UserIcon className="size-[35px] rounded-full " />
          )}
          <span>{userInfo?.user.username}</span>
        </div>
        <div className="flex flex-row space-x-4">
          <label
            htmlFor={modalId}
            className=" icon-[entypo--popup] Icon_Button"
          ></label>
          {/* <span
            onClick={() => router.push(`/postModal/${post.id}`)}
            className="icon-[entypo--popup] Icon_Button"
          ></span> */}
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
      </div>

      {!isEditing ? (
        <h2 className="text-black text-lg font-semibold">{post.title}</h2>
      ) : (
        <textarea defaultValue={editedTitle} />
      )}
      {!isEditing ? (
        <>
          <p>{editedDescription}</p>
          {post.photo ? (
            <div className="post_photo size-52">
              <Image
                className="object-cover"
                fill
                src={`${post.photo}/avatar`}
                alt={post.title}
              />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <textarea
            className="bg-blue-200"
            defaultValue={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            // onBlur={handleEditPost}
          />
          <button className="btn btn-primary" onClick={handleEditPost}>
            Post
          </button>
        </>
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(post.created_at.toString())}</span>
          <span className="flex flex-row ">
            <EyeIcon className="Icon_Button mr-1" /> {post.views}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <LikeButton
            isLiked={data?.isLiked}
            likeCount={data?.likeCount}
            id={post.id}
            mutate={mutate}
            type={"post"}
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
          <CommentList postId={post.id} />
          <CommentForm postId={post.id} />
        </div>
      )}
    </div>
  );
}
