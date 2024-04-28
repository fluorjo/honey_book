import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTime } from "@/lib/utils";
import { notFound } from "next/navigation";

import { logOut } from "@/app/(auth)/login/userAction";
import ProfileAvatar from "@/app/components/profileAvatar";
import { unstable_cache } from "next/cache";

async function getUser(id: number) {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}
const getCachedUser = unstable_cache(
  async (id) => getUser(id),
  ["my-app-user"],
  {
    tags: ["userStatus"],
    revalidate: 1,
  }
);


export default async function Profile({ userID }: any) {

  const user = await getCachedUser(userID);

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
      <span>Joined {formatToTime(user?.created_at.toString())}</span>
      <form action={logOut}>
        <button className="btn btn-primary mt-1">Log out</button>
      </form>
    </div>
  );
}