-- AlterEnum
ALTER TYPE "ItemStatus" ADD VALUE 'TURNEDOVER';

-- CreateTable
CREATE TABLE "Turnover" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "Turnover_pkey" PRIMARY KEY ("id")
);
