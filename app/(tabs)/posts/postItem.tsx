"use client";
import LikeButton from "@/app/components/LikeButton";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ArrowsPointingOutIcon,
  ChatBubbleBottomCenterIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import DropdownMenu from "../../components/dropDown";
import { deletePostPhoto } from "./[id]/actions";
import {
  deletePost,
  editPost,
  getUploadUrlForEdit,
  revalidateAllpost,
} from "./actions";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
import { PostType, postPhotoEditSchema } from "./schema";

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
  const [showComments, setShowComments] = useState(false);
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
    revalidateAllpost();
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

  //사진 수정 관련
  const [photoeditpreview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostType>({
    resolver: zodResolver(postPhotoEditSchema),
  });

  const onImageChangeForEdit = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const {
      target: { files },
    } = event;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result, uploadType } = await getUploadUrlForEdit();

    if (success && uploadType === "edit") {
      console.log("result", result);
      const { id, uploadURL } = result;
      console.log("result", result);
      console.log("uploadTypeforeddittt", uploadType);
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `${process.env.NEXT_PUBLIC_CLOUDFLARE_DELIVERY_URL}/${id}`
      );
    }
  };
  const resetPreview = () => {
    setPreview("");
  };

  const onSubmitEditedPhoto = async (data: PostType) => {
    console.log("data", data);
    const formData = new FormData();

    if (file) {
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "post",
        body: cloudflareForm,
      });
      if (response.status !== 200) {
        console.error("Image upload failed:", response.statusText);
        return;
      }
      if (data.photo) {
        formData.append("photo", data.photo);
      }
    }
    const updatedPostPhoto = await editPost(post.id, {
      photo: data.photo,
    });
    if (updatedPostPhoto) {
      console.log("Post uploaded successfully", updatedPostPhoto);
      resetPreview();
    } else {
      console.log("Server-side Errors:", updatedPostPhoto);
    }
  };
  return (
    <div className="pb-5 mb-5  text-black flex flex-col gap-2  px-3 rounded-md  border-solid border-primary shadow-md md:w-96 ">
      {/* 모달 */}

      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className=" overflow-hidden rounded-full  flex flex-row items-center space-x-1">
            {userInfo?.user.avatar ? (
              <Image
                src={`${userInfo.user.avatar}/avatar`}
                width={90}
                height={90}
                alt={userInfo.user.username || "User avatar"}
                className="overflow-hidden rounded-full  flex flex-row items-center space-x-1 bg-white border-solid border-base-300 border-2 "
              />
            ) : (
              <UserIcon className="size-[90px] rounded-full " />
            )}
            <span className="text-xl font-bold">{userInfo?.user.username}</span>
          </div>
          <div className="flex gap-4 items-center mt-2">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
            <span className="flex flex-row ">
              <EyeIcon className="Icon_Button mr-1" /> {post.views}
            </span>
          </div>
          <h2 className="text-lg font-bold">{editedTitle}</h2>
          <p className="py-4">{editedDescription}</p>
          {post.photo ? (
            <div className="post_photo size-52">
              <Image
                className="object-cover"
                fill
                src={`${post.photo}/width=500,height=500`}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

      <div className="bg-transparent flex flex-row  relative top-4 justify-between ">
        <div className=" overflow-hidden rounded-full  flex flex-row items-center  ">
          {userInfo?.user.avatar ? (
            <Image
              src={`${userInfo.user.avatar}/avatar`}
              width={60}
              height={60}
              alt={userInfo.user.username || "User avatar"}
              className="rounded-full border-solid border-base-300 mr-2"
            />
          ) : (
            <UserIcon className="size-[60px] rounded-full border-solid border-base-300 mr-2" />
          )}
          <span>{userInfo?.user.username}</span>
        </div>
        <div className="flex flex-row space-x-4">
          <label
            htmlFor={modalId}
            className=" icon-[entypo--popup] Icon_Button"
          ></label>

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
        <h2 className="text-black text-lg font-semibold mb-0">{post.title}</h2>
      ) : (
        <textarea
          defaultValue={editedTitle}
          className="textarea textarea-primary min-h-7 h-7 mt-4"
          onChange={(e) => setEditedTitle(e.target.value)}
        />
      )}
      {!isEditing ? (
        <div className="mt-0">
          <h3 className="text-sm font-normal ">{editedDescription}</h3>
          {post.photo ? (
            <div className="post_photo">
              <Image
                className="object-cover"
                fill
                src={`${post.photo}/width=500,height=500`}
                alt={post.title}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <textarea
            className="textarea textarea-primary"
            defaultValue={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            // onBlur={handleEditPost}
          />
          {photoeditpreview ? (
            <div className="post_photo">
              <Image
                className="object-cover"
                fill
                src={`${photoeditpreview}`}
                alt={post.title}
              />
            </div>
          ) : post.photo ? (
            <div className="post_photo">
              <Image
                className="object-cover"
                fill
                src={`${post.photo}/width=500,height=500`}
                alt={post.title}
              />
            </div>
          ) : null}
          <div className=" flex flex-row items-center justify-center mb-4">
            {/* 포스트 사진 삭제 */}
            <button
              className="avatar_profile_button"
              onClick={() => deletePostPhoto(post.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 36 36"
                className=" p-0 m-0"
              >
                <path
                  fill="#000000"
                  d="M6 9v22a2.93 2.93 0 0 0 2.86 3h18.23A2.93 2.93 0 0 0 30 31V9Zm9 20h-2V14h2Zm8 0h-2V14h2Z"
                  className="clr-i-solid clr-i-solid-path-1"
                />
                <path
                  fill="#000000"
                  d="M30.73 5H23V4a2 2 0 0 0-2-2h-6.2A2 2 0 0 0 13 4v1H5a1 1 0 1 0 0 2h25.73a1 1 0 0 0 0-2"
                  className="clr-i-solid clr-i-solid-path-2"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </button>
            <form
              className=" p-0 m-0"
              onSubmit={handleSubmit(onSubmitEditedPhoto)}
            >
              <div className="flex flex-row p-0 m-0 ">
                <label
                  className="avatar_profile_button"
                  htmlFor={`photo_edit_${post.id}`}
                >
                  {/* 사진 선택 */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="#000000"
                      d="M32 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3M6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27Zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18Z"
                      className="clr-i-solid clr-i-solid-path-1"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  <input
                    onChange={onImageChangeForEdit}
                    type="file"
                    id={`photo_edit_${post.id}`}
                    name="photo"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {/* 확인, 제출 버튼 */}
                <button
                  className="avatar_profile_button"
                  disabled={!photoeditpreview}
                  type="submit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="#000000"
                      d="M13.72 27.69L3.29 17.27a1 1 0 0 1 1.41-1.41l9 9L31.29 7.29A1 1 0 0 1 32.7 8.7Z"
                      className="clr-i-outline clr-i-outline-path-1"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                </button>
              </div>
            </form>
            <button
              className="avatar_profile_button "
              disabled={!photoeditpreview}
              onClick={resetPreview}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 36 36"
              >
                <path
                  fill="#000000"
                  d="M24 4.22a1 1 0 0 0-1.41 1.42l5.56 5.49h-13A11 11 0 0 0 10.07 32a1 1 0 0 0 .93-1.82a9 9 0 0 1-5-8a9.08 9.08 0 0 1 9.13-9h13l-5.54 5.48A1 1 0 0 0 24 20l8-7.91Z"
                  className="clr-i-outline clr-i-outline-path-1"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleEditPost}
            disabled={!editedDescription.trim() || !editedTitle.trim()}
          >
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
