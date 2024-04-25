/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId,commentId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_commentId_key" ON "Like"("userId", "postId", "commentId");
