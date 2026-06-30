/*
  Warnings:

  - Made the column `studentId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `availabilityId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `availabilityId` on table `AppointmentGuest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_availabilityId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentGuest" DROP CONSTRAINT "AppointmentGuest_availabilityId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "studentId" SET NOT NULL,
ALTER COLUMN "availabilityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "AppointmentGuest" ALTER COLUMN "availabilityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availability"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentGuest" ADD CONSTRAINT "AppointmentGuest_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "Availability"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;
