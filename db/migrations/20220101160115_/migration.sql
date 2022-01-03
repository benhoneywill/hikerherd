/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Pack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pack_slug_key" ON "Pack"("slug");
