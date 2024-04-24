import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/server/withHandler";
import { withApiSession } from "../../../libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log("session", req.session.user);
  const profile = await db.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    profile,
  });
}
export default withApiSession(
  withHandler({
    method: "GET",
    handler,
  })
);
