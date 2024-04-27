import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
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
//   // await new Promise((resolve) => setTimeout(resolve, 30000));
//   const user = await getUser();
//   return <h1>Welcome! {user?.username}!</h1>;
// }
async function Username() {
  try {
    const user = await getUser();
    return <h1>Welcome! {user?.username}!</h1>;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return <h1>Error fetching user.</h1>;
  }
}
export default async function Profile() {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/login");
  };
  return (
    <div>
      <Suspense fallback={"Welcome!"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}
