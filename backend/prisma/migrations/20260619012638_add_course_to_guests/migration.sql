/*
  Warnings:

  - Added the required column `courseId` to the `AppointmentGuest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppointmentGuest" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AppointmentGuest" ADD CONSTRAINT "AppointmentGuest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;
