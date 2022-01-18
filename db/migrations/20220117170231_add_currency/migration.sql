-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'GBP', 'EUR');

-- AlterTable
ALTER TABLE "Gear" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT E'USD';
