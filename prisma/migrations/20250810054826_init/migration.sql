-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sender" TEXT NOT NULL DEFAULT 'USER',
    "clerkId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_clerkId_idx" ON "public"."Message"("clerkId");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "public"."User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
