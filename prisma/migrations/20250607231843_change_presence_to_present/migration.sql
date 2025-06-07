/*
  Warnings:

  - You are about to drop the column `presence` on the `attendances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "presence",
ADD COLUMN     "present" BOOLEAN NOT NULL DEFAULT false;
