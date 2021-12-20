/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Gear` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Gear" DROP CONSTRAINT "Gear_categoryId_fkey";

-- AlterTable
ALTER TABLE "Gear" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "GearCategoryGear" (
    "gearId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "GearCategoryGear_pkey" PRIMARY KEY ("gearId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GearCategoryGear_gearId_key" ON "GearCategoryGear"("gearId");

-- AddForeignKey
ALTER TABLE "GearCategoryGear" ADD CONSTRAINT "GearCategoryGear_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearCategoryGear" ADD CONSTRAINT "GearCategoryGear_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GearCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
