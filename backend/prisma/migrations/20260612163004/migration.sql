/*
  Warnings:

  - The values [AVAILABLE,CANCELLED] on the enum `ScheduleSlotStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `attendanceId` on the `ScheduleSlot` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `ScheduleSlot` table. All the data in the column will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `attendanceTime` to the `ScheduleSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedagogueId` to the `ScheduleSlot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED_BY_STUDENT', 'CANCELED_BY_PEDAGOGUE', 'EXPIRED', 'COMPLETED', 'MISSED');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterEnum
BEGIN;
CREATE TYPE "ScheduleSlotStatus_new" AS ENUM ('CREATED', 'PENDING', 'BOOKED');
ALTER TABLE "public"."ScheduleSlot" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ScheduleSlot" ALTER COLUMN "status" TYPE "ScheduleSlotStatus_new" USING ("status"::text::"ScheduleSlotStatus_new");
ALTER TYPE "ScheduleSlotStatus" RENAME TO "ScheduleSlotStatus_old";
ALTER TYPE "ScheduleSlotStatus_new" RENAME TO "ScheduleSlotStatus";
DROP TYPE "public"."ScheduleSlotStatus_old";
ALTER TABLE "ScheduleSlot" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pedagogueId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSlot" DROP CONSTRAINT "ScheduleSlot_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSlot" DROP CONSTRAINT "ScheduleSlot_scheduleId_fkey";

-- AlterTable
ALTER TABLE "ScheduleSlot" DROP COLUMN "attendanceId",
DROP COLUMN "scheduleId",
ADD COLUMN     "appointmentId" INTEGER,
ADD COLUMN     "attendanceTime" INTEGER NOT NULL,
ADD COLUMN     "pedagogueId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CREATED';

-- DropTable
DROP TABLE "Schedule";

-- DropEnum
DROP TYPE "ScheduleStatus";

-- CreateTable
CREATE TABLE "Appointment" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "justification" TEXT,
    "attendanceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_externalId_key" ON "Appointment"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_token_key" ON "Appointment"("token");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSlot" ADD CONSTRAINT "ScheduleSlot_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSlot" ADD CONSTRAINT "ScheduleSlot_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
