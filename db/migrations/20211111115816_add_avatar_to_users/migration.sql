/*
  Warnings:

  - A unique constraint covering the columns `[avatar]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_key" ON "User"("avatar");
