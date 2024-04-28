import db from "@/lib/db";
import { formatToTime } from "@/lib/utils";
import { notFound } from "next/navigation";
import getSession from "@/lib/session";

import { logOut } from "@/app/(auth)/login/userAction";
import ProfileAvatar from "@/app/components/profileAvatar";

async function getUser() {
  const session = await getSession();

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });
  if (!user) {
    notFound();
  }
  return user;
}

export default async function Profile() {
  const user = await getUser();

  return (
    <div className="flex flex-col items-center space-y-1">
      <ProfileAvatar
        user={{
          userName: user.username,
          avatar: user.avatar,
          created_at: user.created_at,
          id: user.id,
        }}
      />
      <span>Joined {formatToTime(user.created_at.toString())}</span>
      <a className="link link-primary text-black py-4" href={"/posts"}>
        Go to Posts
      </a>
      <form action={logOut}>
        <button className="btn btn-primary mt-1">Log out</button>
      </form>
    </div>
  );
}
