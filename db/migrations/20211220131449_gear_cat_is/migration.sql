/*
  Warnings:

  - The primary key for the `GearCategoryGear` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `GearCategoryGear` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "GearCategoryGear" DROP CONSTRAINT "GearCategoryGear_categoryId_fkey";

-- AlterTable
ALTER TABLE "GearCategoryGear" DROP CONSTRAINT "GearCategoryGear_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ADD CONSTRAINT "GearCategoryGear_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "GearCategoryGear" ADD CONSTRAINT "GearCategoryGear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GearCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
