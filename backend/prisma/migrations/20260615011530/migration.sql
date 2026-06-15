/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `ScheduleSlot` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED_BY_STUDENT', 'CANCELED_BY_PEDAGOGUE', 'EXPIRED', 'COMPLETED', 'MISSED');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pedagogueId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSlot" DROP CONSTRAINT "ScheduleSlot_appointmentId_fkey";

-- AlterTable
ALTER TABLE "ScheduleSlot" DROP COLUMN "appointmentId",
ADD COLUMN     "scheduleId" INTEGER;

-- DropTable
DROP TABLE "Appointment";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- CreateTable
CREATE TABLE "Schedule" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "studentId" INTEGER,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "reason" TEXT,
    "attendanceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_externalId_key" ON "Schedule"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_token_key" ON "Schedule"("token");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSlot" ADD CONSTRAINT "ScheduleSlot_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
