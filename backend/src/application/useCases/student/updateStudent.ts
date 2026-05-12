import { UpdateStudentDTO } from "@application/dtos/student/updateStudentDto";
import { ApplicationError } from "@application/errors/applicationError";
import { EmailAlreadyExistsError } from "@application/errors/student/emailAlreadyExistsError";
import { EnrollmentAlreadyExistsError } from "@application/errors/student/enrollmentAlreadyExistsError";
import { StudentNotFoundError } from "@application/errors/student/studentNotFoundError";
import { Student, StudentVOProps } from "@domain/entities/student";
import { DomainError } from "@domain/errors/domainError";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";
import { CourseVO } from "@domain/valueObjects/course/course";
import { DateVO } from "@domain/valueObjects/shared/date";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { NameVO } from "@domain/valueObjects/shared/name";
import { DiagnosisVO } from "@domain/valueObjects/student/diagnosis";
import { DifficultiesVO } from "@domain/valueObjects/student/difficulties";
import { EnrollmentVO } from "@domain/valueObjects/student/enrollment";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";
import { PotentialVO } from "@domain/valueObjects/student/potential";

export class UpdateStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: UpdateStudentDTO): Promise<Result<Student, DomainError | ApplicationError>> {
    const student = await this.studentRepository.findByUUID(input.id);
    if (!student) return Result.fail<Student>(new StudentNotFoundError(input.id));

    if (input.email && input.email !== student.email.value) {
      const emailExists = await this.studentRepository.existsByEmail(input.email);
      if (emailExists) return Result.fail<Student>(new EmailAlreadyExistsError(input.email));
    }

    if (input.enrollmentId && input.enrollmentId !== student.enrollmentId.value) {
      const enrollmentExists = await this.studentRepository.existsByEnrollmentId(input.enrollmentId);
      if (enrollmentExists) return Result.fail<Student>(new EnrollmentAlreadyExistsError(input.enrollmentId));
    }

    const props: Partial<StudentVOProps> = {};

    if (input.name !== undefined) {
      const result = NameVO.create(input.name);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.name = result.getValue();
    }

    if (input.enrollmentId !== undefined) {
      const result = EnrollmentVO.create(input.enrollmentId);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.enrollmentId = result.getValue();
    }

    if (input.dtBirth !== undefined) {
      const result = DateVO.create(input.dtBirth);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.dtBirth = result.getValue();
    }

    if (input.email !== undefined) {
      const result = EmailVO.create(input.email);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.email = result.getValue();
    }

    if (input.phoneNumber !== undefined) {
      const result = PhoneNumberVO.create(input.phoneNumber);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.phoneNumber = result.getValue();
    }

    if (input.courseId !== undefined) {
      const result = CourseVO.create(input.courseId);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.course = result.getValue();
    }

    if (input.diagnosis !== undefined) {
      const result = DiagnosisVO.create(input.diagnosis);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.diagnosis = result.getValue();
    }

    if (input.potential !== undefined) {
      const result = PotentialVO.create(input.potential);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.potential = result.getValue();
    }

    if (input.difficulties !== undefined) {
      const result = DifficultiesVO.create(input.difficulties);
      if (result.isFailure) return Result.fail<Student>(result.error!);
      props.difficulties = result.getValue();
    }

    student.update(props);

    await this.studentRepository.save(student);

    return Result.ok<Student>(student);
  }
}
