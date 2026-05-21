import { Result } from "@domain/shared/result";
import { DateVO } from "@domain/valueObjects/shared/date";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";

import { CourseVO } from "../valueObjects/course/course";
import { EmailVO } from "../valueObjects/shared/email";
import { NameVO } from "../valueObjects/shared/name";
import { DifficultiesVO } from "../valueObjects/student/difficulties";
import { EnrollmentVO } from "../valueObjects/student/enrollment";
import { PhoneNumberVO } from "../valueObjects/student/phoneNumber";
import { PotentialVO } from "../valueObjects/student/potential";

export type StudentProps = {
  studentId?: string;
  name: string;
  enrollmentId: string;
  dtBirth: Date | string;
  email: string;
  phoneNumber: string;
  course: string;
  diagnoses: string[];
  potential: string;
  difficulties: string;
};

export type StudentVOProps = {
  name: NameVO;
  enrollmentId: EnrollmentVO;
  dtBirth: DateVO;
  email: EmailVO;
  phoneNumber: PhoneNumberVO;
  course: CourseVO;
  diagnoses: ExternalIdVO[];
  potential: PotentialVO;
  difficulties: DifficultiesVO;
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
    public diagnoses: ExternalIdVO[],
    public potential?: PotentialVO,
    public difficulties?: DifficultiesVO,
  ) {}

  static create(props: StudentProps): Result<Student> {
    const studentId = ExternalIdVO.create();
    const nameStud = NameVO.create(props.name);
    const enrollmentStud = EnrollmentVO.create(props.enrollmentId);
    const dtBirthStud = DateVO.create(props.dtBirth);
    const emailStud = EmailVO.create(props.email);
    const phoneNumberStud = PhoneNumberVO.create(props.phoneNumber);
    const courseStud = CourseVO.create(props.course);

    const diagnosesResults = props.diagnoses ? props.diagnoses.map((id) => ExternalIdVO.from(id)) : [];
    const diagnosisFailure = diagnosesResults.find((r) => r.isFailure);
    if (diagnosisFailure) return Result.fail<Student>(diagnosisFailure.error!);

    const potentialStud = props.potential ? PotentialVO.create(props.potential) : undefined;
    const difficultiesStud = props.difficulties ? DifficultiesVO.create(props.difficulties) : undefined;

    const results = [
      studentId,
      nameStud,
      enrollmentStud,
      dtBirthStud,
      emailStud,
      phoneNumberStud,
      courseStud,
      potentialStud,
      difficultiesStud,
    ];

    for (const result of results) {
      if (result?.isFailure) {
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
        diagnosesResults.map((r) => r.getValue() as ExternalIdVO),
        potentialStud ? potentialStud.getValue() : undefined,
        difficultiesStud ? difficultiesStud.getValue() : undefined,
      ),
    );
  }

  static rehydrate(props: StudentProps): Student {
    return new Student(
      ExternalIdVO.fromTrusted(props.studentId!),
      NameVO.fromTrusted(props.name),
      EnrollmentVO.fromTrusted(props.enrollmentId),
      DateVO.fromTrusted(new Date(props.dtBirth)),
      EmailVO.fromTrusted(props.email),
      PhoneNumberVO.fromTrusted(props.phoneNumber),
      CourseVO.fromTrusted(props.course),
      props.diagnoses ? props.diagnoses.map((id) => ExternalIdVO.fromTrusted(id)) : [],
      props.potential ? PotentialVO.fromTrusted(props.potential) : undefined,
      props.difficulties ? DifficultiesVO.fromTrusted(props.difficulties) : undefined,
    );
  }

  update(props: Partial<StudentVOProps>): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.enrollmentId !== undefined) this.enrollmentId = props.enrollmentId;
    if (props.dtBirth !== undefined) this.dtBirth = props.dtBirth;
    if (props.email !== undefined) this.email = props.email;
    if (props.phoneNumber !== undefined) this.phoneNumber = props.phoneNumber;
    if (props.course !== undefined) this.course = props.course;
    if (props.diagnoses !== undefined) this.diagnoses = props.diagnoses;
    if (props.potential !== undefined) this.potential = props.potential;
    if (props.difficulties !== undefined) this.difficulties = props.difficulties;
  }
}
