import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { Result } from "@domain/shared/result";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";
import { ReasonVO } from "@domain/valueObjects/appointment/reason";
import { TokenVO } from "@domain/valueObjects/appointment/token";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { NameVO } from "@domain/valueObjects/shared/name";
import { EnrollmentVO } from "@domain/valueObjects/student/enrollment";

import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type AppointmentGuestProps = {
  id?: string | undefined;
  pedagogueId: string;
  availabilityId: string;
  courseId: string;
  studentName: string;
  studentEmail: string;
  studentEnrollment: string;
  status: AppointmentStatusEnum;
  token?: string | undefined;
  reason?: string | undefined;
  removed?: boolean;
};

type AppointmentGuestPropsVO = {
  pedagogueId: ExternalIdVO;
  availabilityId: ExternalIdVO;
  courseId: ExternalIdVO;
  studentName: NameVO;
  studentEmail: EmailVO;
  studentEnrollment: EnrollmentVO;
  status: AppointmentStatusVO;
  token: TokenVO;
  reason?: ReasonVO | undefined;
};

export class AppointmentGuest {
  constructor(
    public readonly id: ExternalIdVO,
    public pedagogueId: ExternalIdVO,
    public availabilityId: ExternalIdVO,
    public courseId: ExternalIdVO,
    public studentName: NameVO,
    public studentEmail: EmailVO,
    public studentEnrollment: EnrollmentVO,
    public status: AppointmentStatusVO,
    public token: TokenVO,
    public reason?: ReasonVO | undefined,
    private _removed: boolean = false,
  ) {}

  static create(props: AppointmentGuestProps): Result<AppointmentGuest> {
    const externalId = ExternalIdVO.create();
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const availabilityId = ExternalIdVO.from(props.availabilityId);
    const courseId = ExternalIdVO.from(props.courseId);
    const studentName = NameVO.create(props.studentName);
    const studentEmail = EmailVO.create(props.studentEmail);
    const studentEnrollment = EnrollmentVO.create(props.studentEnrollment);
    const token = TokenVO.create();
    const status = AppointmentStatusVO.from(props.status);
    const reason = props.reason ? ReasonVO.create(props.reason) : undefined;

    const results = [
      externalId,
      pedagogueId,
      availabilityId,
      courseId,
      studentName,
      studentEmail,
      studentEnrollment,
      token,
      status,
      reason,
    ];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<AppointmentGuest>(result.error!);
      }
    }

    return Result.ok<AppointmentGuest>(
      new AppointmentGuest(
        externalId.getValue(),
        pedagogueId.getValue(),
        availabilityId.getValue(),
        courseId.getValue(),
        studentName.getValue(),
        studentEmail.getValue(),
        studentEnrollment.getValue(),
        status.getValue(),
        token.getValue(),
        reason?.getValue() ?? undefined,
        props.removed ?? false,
      ),
    );
  }

  static rehydrate(props: AppointmentGuestProps): AppointmentGuest {
    return new AppointmentGuest(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      ExternalIdVO.fromTrusted(props.availabilityId),
      ExternalIdVO.fromTrusted(props.courseId),
      NameVO.fromTrusted(props.studentName),
      EmailVO.fromTrusted(props.studentEmail),
      EnrollmentVO.fromTrusted(props.studentEnrollment),
      AppointmentStatusVO.fromTrusted(props.status),
      TokenVO.fromTrusted(props.token!),
      props.reason ? ReasonVO.fromTrusted(props.reason) : undefined,
      props.removed ?? false,
    );
  }

  update(props: Partial<AppointmentGuestPropsVO>) {
    if (props.availabilityId) this.availabilityId = props.availabilityId;
    if (props.pedagogueId) this.pedagogueId = props.pedagogueId;
    if (props.courseId) this.courseId = props.courseId;
    if (props.studentName) this.studentName = props.studentName;
    if (props.studentEmail) this.studentEmail = props.studentEmail;
    if (props.studentEnrollment) this.studentEnrollment = props.studentEnrollment;
    if (props.status) this.status = props.status;
    if (props.reason) this.reason = props.reason;
  }

  remove(): void {
    if (this._removed) {
      throw new Error(`${AppointmentGuest.name}:${this.id} is already removed`);
    }
    this._removed = true;
  }

  get removed(): boolean {
    return this._removed;
  }
}
