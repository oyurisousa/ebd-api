/*
  Warnings:

  - You are about to drop the column `member_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_member_id_fkey";

-- DropIndex
DROP INDEX "User_member_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "member_id",
DROP COLUMN "updated_at",
ADD COLUMN     "memberId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_memberId_key" ON "User"("memberId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
