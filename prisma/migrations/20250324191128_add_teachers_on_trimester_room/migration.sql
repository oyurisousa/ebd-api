-- AlterTable
ALTER TABLE "TrimesterRoom" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "_TrimesterRoomToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TrimesterRoomToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TrimesterRoomToUser_B_index" ON "_TrimesterRoomToUser"("B");

-- AddForeignKey
ALTER TABLE "_TrimesterRoomToUser" ADD CONSTRAINT "_TrimesterRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "TrimesterRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrimesterRoomToUser" ADD CONSTRAINT "_TrimesterRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
