/*
  Warnings:

  - A unique constraint covering the columns `[itemId,hostId,senderId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_itemId_hostId_senderId_key" ON "Conversation"("itemId", "hostId", "senderId");
