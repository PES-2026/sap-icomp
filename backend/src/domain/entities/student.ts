import { DateVO } from "@domain/valueObjects/shared/date";
import { CourseVO } from "../valueObjects/course/course";
import { DiagnosisVO } from "../valueObjects/student/diagnosis";
import { DifficultiesVO } from "../valueObjects/student/difficulties";
import { EmailVO } from "../valueObjects/shared/email";
import { EnrollmentVO } from "../valueObjects/student/enrollment";
import { NameVO } from "../valueObjects/shared/name";
import { PhoneNumberVO } from "../valueObjects/student/phoneNumber";
import { PotentialVO } from "../valueObjects/student/potential";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { Result } from "@domain/shared/result";

type StudentProps = {
  externalId?: string;
  name: string;
  enrollmentId: string;
  dtBirth: string;
  email: string;
  phoneNumber: string;
  course: string;
  diagnosis: string;
  potential: string;
  difficulties: string;
};

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

  static create(props: StudentProps): Result<Student> {
    const studentId = ExternalIdVO.create();
    const nameStud = NameVO.create(props.name);
    const enrollmentStud = EnrollmentVO.create(props.enrollmentId);
    const dtBirthStud = DateVO.create(props.dtBirth);
    const emailStud = EmailVO.create(props.email);
    const phoneNumberStud = PhoneNumberVO.create(props.phoneNumber);
    const courseStud = CourseVO.create(props.course);
    const diagnosisStud = DiagnosisVO.create(props.diagnosis);
    const potentialStud = PotentialVO.create(props.potential);
    const difficultiesStud = DifficultiesVO.create(props.difficulties);

    const results = [
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
    ];

    for (let result of results) {
      if (result.isFailure) {
        return Result.fail<Student>(result.error!);
      }
    }

    return Result.ok<Student>(
      new Student(
        studentId.getValue(),
        nameStud.getValue(),
        enrollmentStud.getValue(),
        dtBirthStud.getValue(),
        emailStud.getValue(),
        phoneNumberStud.getValue(),
        courseStud.getValue(),
        diagnosisStud.getValue(),
        potentialStud.getValue(),
        difficultiesStud.getValue(),
      ),
    );
  }

  static rehydrate(props: StudentProps): Student {
    return new Student(
      ExternalIdVO.fromTrusted(props.externalId!),
      NameVO.fromTrusted(props.name),
      EnrollmentVO.fromTrusted(props.enrollmentId),
      DateVO.fromTrusted(new Date(props.dtBirth)),
      EmailVO.fromTrusted(props.email),
      PhoneNumberVO.fromTrusted(props.phoneNumber),
      CourseVO.fromTrusted(props.course),
      DiagnosisVO.fromTrusted(props.diagnosis),
      PotentialVO.fromTrusted(props.potential),
      DifficultiesVO.fromTrusted(props.difficulties),
    );
  }
}
