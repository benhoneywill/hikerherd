/*
  Warnings:

  - Added the required column `updatedAt` to the `BlogUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GearList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GearListGear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogUser" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GearList" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GearListGear" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
