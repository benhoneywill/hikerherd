/*
  Warnings:

  - Added the required column `slug` to the `Pack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "slug" TEXT NOT NULL;
