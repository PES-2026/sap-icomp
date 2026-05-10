import { DateVO } from "@domain/valueObjects/shared/date.js";
import { CourseVO } from "../valueObjects/course/course.js";
import { DiagnosisVO } from "../valueObjects/student/diagnosis.js";
import { DifficultiesVO } from "../valueObjects/student/difficulties.js";
import { EmailVO } from "../valueObjects/shared/email.js";
import { EnrollmentVO } from "../valueObjects/student/enrollment.js";
import { NameVO } from "../valueObjects/shared/name.js";
import { PhoneNumberVO } from "../valueObjects/student/phoneNumber.js";
import { PotentialVO } from "../valueObjects/student/potential.js";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId.js";

import { StudentData } from "./studentData.js";

export class Student {
  constructor(
    public readonly studentId: ExternalIdVO,
    public name: NameVO,
    public enrollmentId: EnrollmentVO,
    public dtBirth: DateVO,
    public email: EmailVO,
    public phoneNumber: PhoneNumberVO,
    public course: CourseVO,
    public diagnosis: DiagnosisVO,
    public potential: PotentialVO,
    public difficulties: DifficultiesVO,
  ) {}
  static create(
    name: string,
    enrollmentId: string,
    dtBirth: string,
    email: string,
    phoneNumber: string,
    course: string,
    diagnosis: string,
    potential: string,
    difficulties: string,
  ) {
    const studentId = ExternalIdVO.create();
    const nameStud = NameVO.create(name);
    const enrollmentStud = EnrollmentVO.create(enrollmentId);
    const dtBirthStud = DateVO.create(dtBirth);
    const emailStud = EmailVO.create(email);
    const phoneNumberStud = PhoneNumberVO.create(phoneNumber);
    const courseStud = CourseVO.create(course);
    const diagnosisStud = DiagnosisVO.create(diagnosis);
    const potentialStud = PotentialVO.create(potential);
    const difficultiesStud = DifficultiesVO.create(difficulties);

    return new Student(
      studentId,
      nameStud,
      enrollmentStud,
      dtBirthStud,
      emailStud,
      phoneNumberStud,
      courseStud,
      diagnosisStud,
      potentialStud,
      difficultiesStud,
    );
  }
  static update(student: StudentData) {
    const studentId = ExternalIdVO.fromTrusted(student.externalId);

    return new Student(
      studentId,
      NameVO.create(student.name),
      EnrollmentVO.create(student.enrollmentId),
      DateVO.create(student.dtBirth),
      EmailVO.create(student.email),
      PhoneNumberVO.create(student.phoneNumber),
      CourseVO.create(student.courseId),
      DiagnosisVO.create(student.diagnosis),
      PotentialVO.create(student.potential),
      DifficultiesVO.create(student.difficulties),
    );
  }
}
