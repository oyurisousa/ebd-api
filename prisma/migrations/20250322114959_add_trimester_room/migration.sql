/*
  Warnings:

  - You are about to drop the column `bith_date` on the `members` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "bith_date",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "TrimesterRoom" (
    "room_id" TEXT NOT NULL,
    "trimester_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrimesterRoom_room_id_trimester_id_key" ON "TrimesterRoom"("room_id", "trimester_id");

-- AddForeignKey
ALTER TABLE "TrimesterRoom" ADD CONSTRAINT "TrimesterRoom_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrimesterRoom" ADD CONSTRAINT "TrimesterRoom_trimester_id_fkey" FOREIGN KEY ("trimester_id") REFERENCES "trimesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
