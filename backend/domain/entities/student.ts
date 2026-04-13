import { StudentId } from "./studentId.js";
import { Name } from "./name.js";
import { Enrollment } from "./enrollment.js";
import { DtBirth } from "./dtBirth.js";
import { Email } from "./email.js";
import { PhoneNumber } from "./phoneNumber.js";
import { Course } from "./course.js";
import { Diagnosis } from "./diagnosis.js";
import { Potential } from "./potential.js";
import { Difficulties } from "./difficulties.js";
import { Cpf } from "./cpf.js";

export class Student {
  constructor(
    public readonly studentId: StudentId,
    public name: Name,
    public enrollmentId: Enrollment,
    public dtBirth: DtBirth,
    public cpf: Cpf,
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
    cpf: string,
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
      const cpfStud = Cpf.create(cpf);
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
        cpfStud,
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
}
