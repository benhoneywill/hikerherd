-- CreateEnum
CREATE TYPE "GearType" AS ENUM ('PACK', 'SHELTER', 'SLEEP', 'WATER', 'COOKWARE', 'TOILETRIES', 'ELECTRONICS', 'CLOTHING', 'FOOTWARE', 'CONSUMABLES', 'MISCELLANEOUS', 'OTHER');

-- AlterTable
ALTER TABLE "Gear" ADD COLUMN     "type" "GearType";
