import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTime } from "@/lib/utils";
import { notFound } from "next/navigation";

import { logOut } from "@/app/(auth)/login/userAction";
import ProfileAvatar from "@/app/components/profileAvatar";
import { Suspense } from "react";

async function getUser() {
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

// async function Username() {
//   try {
//     const user = await getUser();
//     return (
//       <div>
//         <h1>{user?.username} </h1>
//         <span>Joined {formatToTime(user?.created_at.toString())}</span>
//       </div>
//     );
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     return <h1>Error fetching user.</h1>;
//   }
// }
export default async function Profile() {
  // const logOut = async () => {
  //   "use server";
  //   const session = await getSession();
  //   await session.destroy();
  //   redirect("/login");
  // };

  const user = await getUser();

  return (
    <div>
        {/* <div className="avatar">
          <div className="w-24 rounded-full cursor-pointer hover:brightness-110">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username || "User avatar"} 
                className=""
              />
            ) : (
              <div>
                <UserIcon className="rounded-full bg-[#c3c3c3] fill-white" />
              </div>
            )}
          </div>
        </div> */}
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
        <button className="btn btn-primary mt-4">Log out</button>
      </form>
    </div>
  );
}
