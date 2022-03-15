/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_avatar_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ADD COLUMN     "avatar_id" TEXT,
ADD COLUMN     "avatar_version" INTEGER;
