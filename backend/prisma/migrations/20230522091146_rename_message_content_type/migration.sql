/*
  Warnings:

  - Changed the type of `contentType` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MessageContentType" AS ENUM ('TextPlain');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "contentType",
ADD COLUMN     "contentType" "MessageContentType" NOT NULL;

-- DropEnum
DROP TYPE "MessageContent";
