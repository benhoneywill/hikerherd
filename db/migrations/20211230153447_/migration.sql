/*
  Warnings:

  - You are about to drop the column `gearItemId` on the `PackGear` table. All the data in the column will be lost.
  - You are about to drop the `GearItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryGear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishListCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishListGear` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gearId]` on the table `PackGear` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gearId` to the `PackGear` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('INVENTORY', 'WISH_LIST');

-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_clonedFromId_fkey";

-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_userId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCategory" DROP CONSTRAINT "InventoryCategory_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryGear" DROP CONSTRAINT "InventoryGear_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryGear" DROP CONSTRAINT "InventoryGear_gearItemId_fkey";

-- DropForeignKey
ALTER TABLE "PackGear" DROP CONSTRAINT "PackGear_gearItemId_fkey";

-- DropForeignKey
ALTER TABLE "WishList" DROP CONSTRAINT "WishList_userId_fkey";

-- DropForeignKey
ALTER TABLE "WishListCategory" DROP CONSTRAINT "WishListCategory_wishListId_fkey";

-- DropForeignKey
ALTER TABLE "WishListGear" DROP CONSTRAINT "WishListGear_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "WishListGear" DROP CONSTRAINT "WishListGear_gearItemId_fkey";

-- DropIndex
DROP INDEX "PackGear_gearItemId_key";

-- AlterTable
ALTER TABLE "PackGear" DROP COLUMN "gearItemId",
ADD COLUMN     "gearId" TEXT NOT NULL;

-- DropTable
DROP TABLE "GearItem";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "InventoryCategory";

-- DropTable
DROP TABLE "InventoryGear";

-- DropTable
DROP TABLE "WishList";

-- DropTable
DROP TABLE "WishListCategory";

-- DropTable
DROP TABLE "WishListGear";

-- CreateTable
CREATE TABLE "Gear" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "link" TEXT,
    "notes" TEXT,
    "consumable" BOOLEAN NOT NULL,
    "weight" INTEGER NOT NULL,
    "price" INTEGER,
    "userId" TEXT NOT NULL,
    "clonedFromId" TEXT,

    CONSTRAINT "Gear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" "CategoryType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "gearId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackGear_gearId_key" ON "PackGear"("gearId");

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gear" ADD CONSTRAINT "Gear_clonedFromId_fkey" FOREIGN KEY ("clonedFromId") REFERENCES "Gear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryItem" ADD CONSTRAINT "CategoryItem_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryItem" ADD CONSTRAINT "CategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackGear" ADD CONSTRAINT "PackGear_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
