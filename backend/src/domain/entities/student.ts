import { StudentId } from "./valueObjects/studentId.js";
import { Name } from "./valueObjects/name.js";
import { Enrollment } from "./valueObjects/enrollment.js";
import { DtBirth } from "./valueObjects/dtBirth.js";
import { Email } from "./valueObjects/email.js";
import { PhoneNumber } from "./valueObjects/phoneNumber.js";
import { Course } from "./valueObjects/course.js";
import { Diagnosis } from "./valueObjects/diagnosis.js";
import { Potential } from "./valueObjects/potential.js";
import { Difficulties } from "./valueObjects/difficulties.js";

import { StudentData } from "./student-data.js";

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
    try {
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
    } catch (error) {
      throw error;
    }
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
      Course.create(student.course),
      Diagnosis.create(student.diagnosis),
      Potential.create(student.potential),
      Difficulties.create(student.difficulties),
    );
  }
}
