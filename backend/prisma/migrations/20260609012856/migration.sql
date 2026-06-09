-- CreateEnum
CREATE TYPE "ScheduleSlotStatus" AS ENUM ('AVAILABLE', 'PENDING', 'BOOKED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- DropIndex
DROP INDEX "PasswordReset_token_idx";

-- AlterTable
ALTER TABLE "Pedagogue" ADD COLUMN     "maxAttendanceTime" INTEGER DEFAULT 60;

-- CreateTable
CREATE TABLE "Schedule" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "ScheduleSlot" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "status" "ScheduleSlotStatus" NOT NULL DEFAULT 'AVAILABLE',
    "attendanceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleSlot_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_externalId_key" ON "Schedule"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_token_key" ON "Schedule"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleSlot_externalId_key" ON "ScheduleSlot"("externalId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSlot" ADD CONSTRAINT "ScheduleSlot_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSlot" ADD CONSTRAINT "ScheduleSlot_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
