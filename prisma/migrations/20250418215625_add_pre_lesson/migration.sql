-- CreateTable
CREATE TABLE "pre-lessons" (
    "id" TEXT NOT NULL,
    "trimesterId" TEXT NOT NULL,
    "lesson" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pre-lessons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pre-lessons" ADD CONSTRAINT "pre-lessons_trimesterId_fkey" FOREIGN KEY ("trimesterId") REFERENCES "trimesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
