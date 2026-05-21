import { UpdateStudentDTO, UpdateStudentResponse } from "@application/dtos/student/updateStudentDto";
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
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";
import { DifficultiesVO } from "@domain/valueObjects/student/difficulties";
import { EnrollmentVO } from "@domain/valueObjects/student/enrollment";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";
import { PotentialVO } from "@domain/valueObjects/student/potential";

export class UpdateStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(input: UpdateStudentDTO): Promise<Result<UpdateStudentResponse, DomainError | ApplicationError>> {
    const student = await this.studentRepository.findByUUID(input.id);
    if (!student) return Result.fail<UpdateStudentResponse>(new StudentNotFoundError(input.id));

    const studentEntity = Student.rehydrate({
      studentId: student.id,
      enrollmentId: student.enrollmentId,
      name: student.name,
      dtBirth: student.dtBirth,
      email: student.email,
      phoneNumber: student.phoneNumber,
      course: student.course.id,
      diagnoses: student.diagnoses.map((d) => d.id),
      potential: student.potential,
      difficulties: student.difficulties,
    });

    if (input.email && input.email !== studentEntity.email.value) {
      const emailExists = await this.studentRepository.existsByEmail(input.email);
      if (emailExists) return Result.fail<UpdateStudentResponse>(new EmailAlreadyExistsError(input.email));
    }

    if (input.enrollmentId && input.enrollmentId !== studentEntity.enrollmentId.value) {
      const enrollmentExists = await this.studentRepository.existsByEnrollmentId(input.enrollmentId);
      if (enrollmentExists)
        return Result.fail<UpdateStudentResponse>(new EnrollmentAlreadyExistsError(input.enrollmentId));
    }

    const props: Partial<StudentVOProps> = {};

    if (input.name !== undefined) {
      const result = NameVO.create(input.name);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.name = result.getValue();
    }

    if (input.enrollmentId !== undefined) {
      const result = EnrollmentVO.create(input.enrollmentId);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.enrollmentId = result.getValue();
    }

    if (input.dtBirth !== undefined) {
      const result = DateVO.create(input.dtBirth);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.dtBirth = result.getValue();
    }

    if (input.email !== undefined) {
      const result = EmailVO.create(input.email);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.email = result.getValue();
    }

    if (input.phoneNumber !== undefined) {
      const result = PhoneNumberVO.create(input.phoneNumber);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.phoneNumber = result.getValue();
    }

    if (input.courseId !== undefined) {
      const result = CourseVO.create(input.courseId);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.course = result.getValue();
    }

    if (input.diagnoses !== undefined) {
      const diagnosesResults = input.diagnoses.map((id) => ExternalIdVO.from(id));
      const failure = diagnosesResults.find((r) => r.isFailure);
      if (failure) return Result.fail<UpdateStudentResponse>(failure.error!);
      props.diagnoses = diagnosesResults.map((r) => r.getValue() as ExternalIdVO);
    }

    if (input.potential !== undefined) {
      const result = PotentialVO.create(input.potential);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.potential = result.getValue();
    }

    if (input.difficulties !== undefined) {
      const result = DifficultiesVO.create(input.difficulties);
      if (result.isFailure) return Result.fail<UpdateStudentResponse>(result.error!);
      props.difficulties = result.getValue();
    }

    studentEntity.update(props);

    await this.studentRepository.update(studentEntity);

    return Result.ok<UpdateStudentResponse>({
      id: studentEntity.studentId.value,
      name: studentEntity.name.value,
      enrollmentId: studentEntity.enrollmentId.value,
      dtBirth: studentEntity.dtBirth.value,
      phoneNumber: studentEntity.phoneNumber.value,
      email: studentEntity.email.value,
      courseId: studentEntity.course.value,
      diagnoses: studentEntity.diagnoses.map((vo) => vo.value),
      potential: studentEntity.potential?.value ?? "",
      difficulties: studentEntity.difficulties?.value ?? "",
    });
  }
}
