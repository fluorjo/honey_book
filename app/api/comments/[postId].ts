import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
async function getComments(postId:number) {
  
  const comments = await db.comment.findMany({
    where: { postId: postId },
    select: {
      id: true,
      commentText: true,
      created_at: true,
    },
  });
  return comments.map((comment) => ({
    ...comment,
    commentText: comment.commentText ?? "No description available",
  }));
}
export default async function handler(req: any, res: any) {
  const { postId } = req.query; // URL에서 postId를 추출

  if (req.method === "GET") {
    try {
      const comments = await getComments(parseInt(postId));
      res.status(200).json(comments); 
      console.log(comments)
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching the comments." });
        console.log(error)
    }
  } else {

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not xxxx`, console.log('xxxxxx'));
  }
}
