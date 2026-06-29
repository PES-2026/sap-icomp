/*
  Warnings:

  - You are about to drop the column `maxAttendanceTime` on the `Pedagogue` table. All the data in the column will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('CREATED', 'PENDING', 'BOOKED');

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pedagogueId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSlot" DROP CONSTRAINT "ScheduleSlot_pedagogueId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSlot" DROP CONSTRAINT "ScheduleSlot_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Pedagogue" DROP COLUMN "maxAttendanceTime";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "ScheduleSlot";

-- DropEnum
DROP TYPE "ScheduleSlotStatus";

-- CreateTable
CREATE TABLE "Appointment" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "studentId" INTEGER,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "reason" TEXT,
    "attendanceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "AppointmentGuest" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "attendanceInternalId" INTEGER,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentEnrollment" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "reason" TEXT,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AppointmentGuest_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Availability" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "appointmentId" INTEGER,
    "appointmentGuestId" INTEGER,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "attendanceTime" INTEGER NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_externalId_key" ON "Appointment"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_token_key" ON "Appointment"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentGuest_externalId_key" ON "AppointmentGuest"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentGuest_token_key" ON "AppointmentGuest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_externalId_key" ON "Availability"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_appointmentId_key" ON "Availability"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_appointmentGuestId_key" ON "Availability"("appointmentGuestId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentGuest" ADD CONSTRAINT "AppointmentGuest_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentGuest" ADD CONSTRAINT "AppointmentGuest_attendanceInternalId_fkey" FOREIGN KEY ("attendanceInternalId") REFERENCES "Attendance"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_appointmentGuestId_fkey" FOREIGN KEY ("appointmentGuestId") REFERENCES "AppointmentGuest"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
