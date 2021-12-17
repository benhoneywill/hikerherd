/*
  Warnings:

  - The values [MEMEBER] on the enum `BlogUserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blogId` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BlogUserRole_new" AS ENUM ('ADMIN', 'MEMBER');
ALTER TABLE "BlogUser" ALTER COLUMN "role" TYPE "BlogUserRole_new" USING ("role"::text::"BlogUserRole_new");
ALTER TYPE "BlogUserRole" RENAME TO "BlogUserRole_old";
ALTER TYPE "BlogUserRole_new" RENAME TO "BlogUserRole";
DROP TYPE "BlogUserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "blogId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blog_name_key" ON "Blog"("name");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
