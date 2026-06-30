/*
  Warnings:

  - You are about to drop the column `appointmentGuestId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `Availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[availabilityId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[availabilityId]` on the table `AppointmentGuest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_appointmentGuestId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_appointmentId_fkey";

-- DropIndex
DROP INDEX "Availability_appointmentGuestId_key";

-- DropIndex
DROP INDEX "Availability_appointmentId_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "availabilityId" INTEGER;

-- AlterTable
ALTER TABLE "AppointmentGuest" ADD COLUMN     "availabilityId" INTEGER;

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "appointmentGuestId",
DROP COLUMN "appointmentId";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_availabilityId_key" ON "Appointment"("availabilityId");

-- CreateIndex
CREATE INDEX "Appointment_pedagogueId_idx" ON "Appointment"("pedagogueId");

-- CreateIndex
CREATE INDEX "Appointment_studentId_idx" ON "Appointment"("studentId");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentGuest_availabilityId_key" ON "AppointmentGuest"("availabilityId");

-- CreateIndex
CREATE INDEX "AppointmentGuest_pedagogueId_idx" ON "AppointmentGuest"("pedagogueId");

-- CreateIndex
CREATE INDEX "AppointmentGuest_status_idx" ON "AppointmentGuest"("status");

-- CreateIndex
CREATE INDEX "Availability_pedagogueId_idx" ON "Availability"("pedagogueId");

-- CreateIndex
CREATE INDEX "Availability_startDateTime_idx" ON "Availability"("startDateTime");

-- CreateIndex
CREATE INDEX "Availability_status_idx" ON "Availability"("status");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availability"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentGuest" ADD CONSTRAINT "AppointmentGuest_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availability"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
