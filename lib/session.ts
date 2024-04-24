import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextApiRequest } from "next";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "Honey Book",
    password: process.env.COOKIE_PASSWORD!,
  });
}
