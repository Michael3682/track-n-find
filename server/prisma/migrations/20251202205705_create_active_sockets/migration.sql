-- CreateTable
CREATE TABLE "ActiveSocket" (
    "id" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveSocket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveSocket_socketId_key" ON "ActiveSocket"("socketId");

-- AddForeignKey
ALTER TABLE "ActiveSocket" ADD CONSTRAINT "ActiveSocket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
