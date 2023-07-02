/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "imageUrl",
ADD COLUMN     "avatarUrl" TEXT;
