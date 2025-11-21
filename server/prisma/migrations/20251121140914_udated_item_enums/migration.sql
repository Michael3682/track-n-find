/*
  Warnings:

  - Added the required column `associated_person` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('UNCLAIMED', 'CLAIMED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('FOUND', 'LOST');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "associated_person" TEXT NOT NULL,
ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'UNCLAIMED',
ADD COLUMN     "type" "ItemType" NOT NULL;
