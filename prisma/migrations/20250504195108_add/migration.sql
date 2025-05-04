-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "trimesterRoomId" TEXT NOT NULL,
    "preLessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visitors" INTEGER NOT NULL,
    "bibles" INTEGER NOT NULL,
    "magazines" INTEGER NOT NULL,
    "offers" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_preLessonId_fkey" FOREIGN KEY ("preLessonId") REFERENCES "pre-lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_trimesterRoomId_fkey" FOREIGN KEY ("trimesterRoomId") REFERENCES "TrimesterRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
