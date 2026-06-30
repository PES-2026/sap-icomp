/*
  Warnings:

  - Added the required column `weekDay` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AvailabilityStatus" ADD VALUE 'REMOVED';

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "weekDay" "DaysOfWeek" NOT NULL;
