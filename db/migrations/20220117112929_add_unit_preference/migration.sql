-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('METRIC', 'IMPERIAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "weightUnit" "WeightUnit" NOT NULL DEFAULT E'METRIC';
