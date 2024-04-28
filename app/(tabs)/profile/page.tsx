import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTime } from "@/lib/utils";
import ProfileAvatar from "@/app/components/profileAvatar";
import { logOut } from "@/app/(auth)/login/userAction";
import { GetServerSideProps } from 'next';

interface ProfileProps {
  user: {
    username: string;
    avatar: string;
    created_at: Date;
    id: number;
  };
}

export default function Profile({ user }: ProfileProps) {
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
      <form action={logOut}>
        <button className="btn btn-primary mt-1">Log out</button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userID = parseInt(context.params?.userID as string);
  const user = await getUser(userID);
  if (!user) {
    return {
      notFound: true,
    };
  }
  return {
    props: { user },
  };
}

async function getUser(id: number) {
  const session = await getSession();
  if (session.id && session.id === id) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
  return null;
}
