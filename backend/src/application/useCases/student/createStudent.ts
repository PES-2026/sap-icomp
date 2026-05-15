import { CreateStudentDTO, CreateStudentResponse } from "@application/dtos/student/createStudentDto";
import { ApplicationError } from "@application/errors/applicationError";
import { EmailAlreadyExistsError } from "@application/errors/student/emailAlreadyExistsError";
import { EnrollmentAlreadyExistsError } from "@application/errors/student/enrollmentAlreadyExistsError";
import { Student } from "@domain/entities/student";
import { DomainError } from "@domain/errors/domainError";
import { IStudentRepository } from "@domain/repositories/studentRepository";
import { Result } from "@domain/shared/result";

export class CreateStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  async execute(data: CreateStudentDTO): Promise<Result<CreateStudentResponse, ApplicationError | DomainError>> {
    const emailExists = await this.studentRepository.existsByEmail(data.email);
    const enrollmentExists = await this.studentRepository.existsByEnrollmentId(data.enrollmentId);

    if (emailExists) {
      return Result.fail<CreateStudentResponse>(new EmailAlreadyExistsError(data.email));
    }

    if (enrollmentExists) {
      return Result.fail<CreateStudentResponse>(new EnrollmentAlreadyExistsError(data.enrollmentId));
    }

    const studentEntity = Student.create({
      name: data.name,
      enrollmentId: data.enrollmentId,
      dtBirth: data.dtBirth,
      email: data.email,
      phoneNumber: data.phoneNumber,
      course: data.courseId,
      diagnoses: data.diagnoses,
      potential: data.potential ?? "",
      difficulties: data.difficulties ?? "",
    });

    if (studentEntity.isFailure) {
      return Result.fail<CreateStudentResponse>(studentEntity.error!);
    }

    await this.studentRepository.save(studentEntity.getValue());

    return Result.ok<CreateStudentResponse>({
      id: studentEntity.getValue().studentId.value,
      name: studentEntity.getValue().name.value,
      enrollmentId: studentEntity.getValue().enrollmentId.value,
      dtBirth: studentEntity.getValue().dtBirth.value,
      phoneNumber: studentEntity.getValue().phoneNumber.value,
      email: studentEntity.getValue().email.value,
      courseId: studentEntity.getValue().course.value,
      diagnoses: studentEntity.getValue().diagnoses.map((vo) => vo.value),
      potential: studentEntity.getValue().potential?.value ?? "",
      difficulties: studentEntity.getValue().difficulties?.value ?? "",
    });
  }
}
