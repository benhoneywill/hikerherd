/*
  Warnings:

  - You are about to drop the column `type` on the `Gear` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gear" DROP COLUMN "type";

-- DropEnum
DROP TYPE "GearType";
