-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pedagogueId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "pedagogueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;
