"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcrypt";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};
const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist."),
  password: z.string({
    required_error: "Password is required",
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});
export const logOut = async () => {
  "use server";
  const session = await getSession();
  await session.destroy();
  redirect("/login");
};
export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.spa(data);
  if (!result.success) {
    console.log("data", data);
    console.log("result fail", result);

    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    if (ok) {
      const session = await getSession();
      console.log("user", user);
      console.log("session", session);
      session.id = user!.id;
      await session.save();
      console.log("session", session);

      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      };
    }
  }
}
export async function getUploadAvatarUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
const revalidateUser = async () => {
  "use server";
  revalidateTag("userStatus");
};
export async function editUser(
  userId: number,
  data: { userName?: string; avatar?: string | null }
) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Authentication required");
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.id !== session.id) {
      throw new Error("Unauthorized to edit this user");
    }

    // 업데이트 진행
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        username: data.userName,
        avatar: data.avatar,
      },
    });
    console.log("edituser", user);
    console.log("updatedUser", updatedUser);

    return updatedUser;
  } catch (e) {
    console.log("eerr", e);
    throw e;
  } finally {
    revalidateUser();
  }
}
export async function deleteUserAvatar(userId: number) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      throw new Error("Authentication required");
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.id !== session.id) {
      throw new Error("Unauthorized to edit this user");
    }

    // 업데이트 진행
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        avatar: null,
      },
    });
    console.log("edituser", user);
    console.log("updatedUser", updatedUser);
    return updatedUser;
  } catch (e) {
    console.log("eerr", e);
    throw e; // It's generally a good idea to rethrow the error after logging it
  } finally {
    revalidateUser();
  }
}
