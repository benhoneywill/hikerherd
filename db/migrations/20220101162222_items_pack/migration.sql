/*
  Warnings:

  - You are about to drop the `PackGear` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackGear" DROP CONSTRAINT "PackGear_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PackGear" DROP CONSTRAINT "PackGear_gearId_fkey";

-- DropTable
DROP TABLE "PackGear";

-- CreateTable
CREATE TABLE "PackCategoryItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "notes" TEXT,
    "worn" BOOLEAN NOT NULL,
    "categoryId" TEXT NOT NULL,
    "gearId" TEXT NOT NULL,

    CONSTRAINT "PackCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackCategoryItem_gearId_key" ON "PackCategoryItem"("gearId");

-- AddForeignKey
ALTER TABLE "PackCategoryItem" ADD CONSTRAINT "PackCategoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackCategoryItem" ADD CONSTRAINT "PackCategoryItem_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Gear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
