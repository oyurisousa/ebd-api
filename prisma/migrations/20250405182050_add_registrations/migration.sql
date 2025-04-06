-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "trimester_room_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_trimester_room_id_fkey" FOREIGN KEY ("trimester_room_id") REFERENCES "TrimesterRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
