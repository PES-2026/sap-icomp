/*
  Warnings:

  - A unique constraint covering the columns `[externalid]` on the table `AttendanceType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `AttendanceType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalid` to the `AttendanceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AttendanceType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttendanceType" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalid" TEXT NOT NULL,
ADD COLUMN     "removed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "removed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "acronym" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceType_externalid_key" ON "AttendanceType"("externalid");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceType_name_key" ON "AttendanceType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_externalId_key" ON "Diagnosis"("externalId");
