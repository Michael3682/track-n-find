/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `Turnover` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Turnover_itemId_key" ON "Turnover"("itemId");
