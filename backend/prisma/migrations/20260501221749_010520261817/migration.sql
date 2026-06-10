-- CreateTable
CREATE TABLE "Student" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dtBirth" TIMESTAMP(3) NOT NULL,
    "term" TEXT,
    "potential" TEXT,
    "difficulties" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Pedagogue" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedagogue_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Professor" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attendedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "demand" TEXT,
    "observation" TEXT,
    "removed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "AttendanceType" (
    "internalId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AttendanceType_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Subject" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Course" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coordinatorId" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Semester" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Report" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "pedagogueId" INTEGER NOT NULL,
    "condition" TEXT,
    "recommendation" TEXT,
    "conclusion" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "title" TEXT,
    "bodytext" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "internalId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "CID" TEXT,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "StudentDiagnosis" (
    "studentId" INTEGER NOT NULL,
    "diagnosisId" INTEGER NOT NULL,

    CONSTRAINT "StudentDiagnosis_pkey" PRIMARY KEY ("studentId","diagnosisId")
);

-- CreateTable
CREATE TABLE "ClassOffering" (
    "internalId" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "daysWeek" TEXT,
    "hour" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassOffering_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("studentId","classId")
);

-- CreateTable
CREATE TABLE "ClassProfessor" (
    "professorId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "ClassProfessor_pkey" PRIMARY KEY ("professorId","classId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_externalId_key" ON "Student"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollmentId_key" ON "Student"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pedagogue_externalId_key" ON "Pedagogue"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedagogue_registration_key" ON "Pedagogue"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "Pedagogue_email_key" ON "Pedagogue"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_externalId_key" ON "Professor"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_registration_key" ON "Professor"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_externalId_key" ON "Attendance"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_externalId_key" ON "Subject"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_externalId_key" ON "Course"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_acronym_key" ON "Course"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_externalId_key" ON "Semester"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_code_key" ON "Semester"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Report_externalId_key" ON "Report"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_externalId_key" ON "Feedback"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_name_key" ON "Diagnosis"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_acronym_key" ON "Diagnosis"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "ClassOffering_externalId_key" ON "ClassOffering"("externalId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AttendanceType"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Professor"("internalId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_pedagogueId_fkey" FOREIGN KEY ("pedagogueId") REFERENCES "Pedagogue"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDiagnosis" ADD CONSTRAINT "StudentDiagnosis_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDiagnosis" ADD CONSTRAINT "StudentDiagnosis_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Diagnosis"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassOffering"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassProfessor" ADD CONSTRAINT "ClassProfessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassProfessor" ADD CONSTRAINT "ClassProfessor_classId_fkey" FOREIGN KEY ("classId") REFERENCES "ClassOffering"("internalId") ON DELETE RESTRICT ON UPDATE CASCADE;
