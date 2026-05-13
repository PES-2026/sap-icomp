import { Course } from "../valueObjects/course/course.js";
import { Diagnosis } from "../valueObjects/student/diagnosis.js";
import { Difficulties } from "../valueObjects/student/difficulties.js";
import { DtBirth } from "../valueObjects/student/dtBirth.js";
import { Email } from "../valueObjects/student/email.js";
import { Enrollment } from "../valueObjects/student/enrollment.js";
import { Name } from "../valueObjects/student/name.js";
import { PhoneNumber } from "../valueObjects/student/phoneNumber.js";
import { Potential } from "../valueObjects/student/potential.js";
import { StudentId } from "../valueObjects/student/studentId.js";

import { StudentData } from "./studentData.js";

export class Student {
  constructor(
    public readonly studentId: StudentId,
    public name: Name,
    public enrollmentId: Enrollment,
    public dtBirth: DtBirth,
    public email: Email,
    public phoneNumber: PhoneNumber,
    public course: Course,
    public diagnosis: Diagnosis,
    public potential: Potential,
    public difficulties: Difficulties,
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
    const studentId = StudentId.create();
    const nameStud = Name.create(name);
    const enrollmentStud = Enrollment.create(enrollmentId);
    const dtBirthStud = DtBirth.create(dtBirth);
    const emailStud = Email.create(email);
    const phoneNumberStud = PhoneNumber.create(phoneNumber);
    const courseStud = Course.create(course);
    const diagnosisStud = Diagnosis.create(diagnosis);
    const potentialStud = Potential.create(potential);
    const difficultiesStud = Difficulties.create(difficulties);

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
    const studentId = StudentId.reutilise(student.externalId);

    return new Student(
      studentId,
      Name.create(student.name),
      Enrollment.create(student.enrollmentId),
      DtBirth.create(student.dtBirth),
      Email.create(student.email),
      PhoneNumber.create(student.phoneNumber),
      Course.create(student.courseId),
      Diagnosis.create(student.diagnosis),
      Potential.create(student.potential),
      Difficulties.create(student.difficulties),
    );
  }
}
