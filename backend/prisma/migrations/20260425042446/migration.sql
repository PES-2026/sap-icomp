-- CreateTable
CREATE TABLE "Attendance" (
    "internalId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "demand" TEXT NOT NULL,
    "generalObversations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_externalId_key" ON "Attendance"("externalId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("externalId") ON DELETE RESTRICT ON UPDATE CASCADE;
