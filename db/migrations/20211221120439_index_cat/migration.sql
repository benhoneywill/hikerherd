/*
  Warnings:

  - Added the required column `index` to the `GearCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GearCategory" ADD COLUMN     "index" INTEGER NOT NULL;
