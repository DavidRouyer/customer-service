-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('Inbound', 'Outbound');

-- CreateEnum
CREATE TYPE "MessageContent" AS ENUM ('TextPlain');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('Pending', 'Sent', 'DeliveredToCloud', 'DeliveredToDevice', 'Seen');

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MessageStatus" NOT NULL,
    "content" JSONB NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "senderId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
