"use client";
import DeleteButton from "@/app/components/deleteButton";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterIcon,
  EyeIcon,
  HandThumbUpIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { PencilSquareIcon as PencilSquareIconSolid } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePost, editPost } from "./actions";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import { PostType } from "./schema";
import useSWR from "swr";
import LikePostButton2 from "@/app/components/likePostButton2";

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

  // 캐싱이 되면 이것들도 정리해야 될지도.

  // useEffect(() => {
  //   revalidateTest(post.id);
  //   const fetchComments = async () => {
  //     const data = await getComments(post.id);
  //     setComments(data);
  //     console.log("ddd", data);
  //   };
  //   fetchComments();
  // }, [post.id]);

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

  return (
    <div className="pb-5 mb-5 border-b border-neutral-500 text-black flex flex-col gap-2 last:pb-0 last:border-b-0 bg-amber-100">
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
        <span
          onClick={() => router.push(`/postModal/${post.id}`)}
          className="icon-[entypo--popup] Icon_Button"
        ></span>
        <ArrowsPointingOutIcon
          onClick={() => router.push(`/postDetail/${post.id}`)}
          className="Icon_Button"
        />
        <div className="flex gap-4 items-center">
          <span>{formatToTimeAgo(post.created_at.toString())}</span>
          <span className="flex flex-row ">
            <EyeIcon className="Icon_Button mr-1" /> {post.views}
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <DeleteButton itemId={post.id} onDelete={deletePost} />
          {isEditing ? (
            <PencilSquareIconSolid
              className="Icon_Button"
              onClick={handleEditPost}
            />
          ) : (
            <PencilSquareIcon className="Icon_Button" onClick={onEdit} />
          )}

          {/* <span className='bg-slate-400 p-0 m-0'> */}
            <HandThumbUpIcon className="Icon_Button " />
            {post._count.likes}
          {/* </span> */}
          <LikePostButton2 isLiked={data?.isLiked} likeCount={data?.likeCount} postId={post.id} mutate={mutate} />
          {/* <span onClick={toggleComments}> */}
            <ChatBubbleBottomCenterIcon className="Icon_Button" />
            {post._count.comments}
          {/* </span> */}
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
