/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `internalId` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "internalId",
ADD COLUMN     "internalId" SERIAL NOT NULL,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("internalId");
