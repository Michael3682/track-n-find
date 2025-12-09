-- CreateTable
CREATE TABLE "Return" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "returnerId" TEXT NOT NULL,
    "returnerName" TEXT NOT NULL,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporterId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "yearAndSection" TEXT,
    "studentId" TEXT,
    "contactNumber" TEXT,
    "proofOfClaim" TEXT NOT NULL,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_returnerId_fkey" FOREIGN KEY ("returnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
