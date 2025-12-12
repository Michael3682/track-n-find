-- CreateEnum
CREATE TYPE "TurnoverStatus" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "Turnover" ADD COLUMN     "proofOfTurnover" TEXT,
ADD COLUMN     "status" "TurnoverStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "turnedOverAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Turnover" ADD CONSTRAINT "Turnover_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
