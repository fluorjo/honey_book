import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTime } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";

import { UserIcon } from "@heroicons/react/24/solid";
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
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/login");
  };

  const user = await getUser();

  return (
    <div>
      <Suspense fallback={"Welcome!"}>
        <div className="avatar">
          <div className="w-24 rounded-full ">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username || "User avatar"} // alt 값은 유저 이름이나 "User avatar"로 채우기
                className=""
              />
            ) : (
              <UserIcon className="rounded-full bg-[#DBDBDB] fill-white" />
            )}
          </div>
        </div>
        <h1>{user?.username} </h1>
        <span>Joined {formatToTime(user?.created_at.toString())}</span>
      </Suspense>
      <form action={logOut}>
        <button className="btn btn-primary mt-4">Log out</button>
      </form>
    </div>
  );
}
