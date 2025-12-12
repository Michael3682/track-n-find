-- CreateEnum
CREATE TYPE "LOG_TARGETS" AS ENUM ('ITEM', 'USER', 'MESSAGE', 'CONVERSATION');

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" "LOG_TARGETS" NOT NULL,
    "targetId" TEXT NOT NULL,
    "metaData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);
