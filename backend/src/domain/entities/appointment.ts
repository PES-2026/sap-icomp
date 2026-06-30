import { AppointmentStatusEnum } from "@domain/enum/appointmentStatus";
import { Result } from "@domain/shared/result";
import { AppointmentStatusVO } from "@domain/valueObjects/appointment/appointmentStatus";
import { ReasonVO } from "@domain/valueObjects/appointment/reason";
import { TokenVO } from "@domain/valueObjects/appointment/token";

import { ExternalIdVO } from "../valueObjects/shared/externalId";

export type AppointmentProps = {
  id?: string | undefined;
  pedagogueId: string;
  availabilityId: string;
  studentId: string;
  status: AppointmentStatusEnum;
  token?: string | undefined;
  reason?: string | undefined;
  removed?: boolean;
};

type AppointmentPropsVO = {
  pedagogueId: ExternalIdVO;
  availabilityId: ExternalIdVO;
  studentId: ExternalIdVO;
  token: TokenVO;
  status: AppointmentStatusVO;
  reason: ReasonVO;
};

export class Appointment {
  constructor(
    public readonly id: ExternalIdVO,
    public pedagogueId: ExternalIdVO,
    public availabilityId: ExternalIdVO,
    public studentId: ExternalIdVO,
    public token: TokenVO,
    public status: AppointmentStatusVO,
    public reason?: ReasonVO | undefined,
    private _removed: boolean = false,
  ) {}

  static create(props: AppointmentProps): Result<Appointment> {
    const externalId = ExternalIdVO.create();
    const pedagogueId = ExternalIdVO.from(props.pedagogueId);
    const availabilityId = ExternalIdVO.from(props.availabilityId);
    const token = TokenVO.create();
    const status = AppointmentStatusVO.from(props.status);
    const studentId = ExternalIdVO.from(props.studentId);
    const reason = props.reason ? ReasonVO.create(props.reason) : undefined;

    const results = [externalId, pedagogueId, studentId, token, status, reason, availabilityId];

    for (const result of results) {
      if (result?.isFailure) {
        return Result.fail<Appointment>(result.error!);
      }
    }

    return Result.ok<Appointment>(
      new Appointment(
        externalId.getValue(),
        pedagogueId.getValue(),
        availabilityId.getValue(),
        studentId.getValue(),
        token.getValue(),
        status.getValue(),
        reason ? reason.getValue() : undefined,
        props.removed ?? false,
      ),
    );
  }

  static rehydrate(props: AppointmentProps): Appointment {
    return new Appointment(
      ExternalIdVO.fromTrusted(props.id!),
      ExternalIdVO.fromTrusted(props.pedagogueId),
      ExternalIdVO.fromTrusted(props.availabilityId),
      ExternalIdVO.fromTrusted(props.studentId),
      TokenVO.fromTrusted(props.token!),
      AppointmentStatusVO.fromTrusted(props.status),
      props.reason ? ReasonVO.fromTrusted(props.reason) : undefined,
    );
  }

  update(props: Partial<AppointmentPropsVO>) {
    if (props.availabilityId) this.availabilityId = props.availabilityId;
    if (props.pedagogueId) this.pedagogueId = props.pedagogueId;
    if (props.studentId) this.studentId = props.studentId;
    if (props.status) this.status = props.status;
    if (props.reason) this.reason = props.reason;
  }

  remove(): void {
    if (this._removed) {
      throw new Error(`${Appointment.name}:${this.id} is already removed`);
    }
    this._removed = true;
  }

  get removed(): boolean {
    return this._removed;
  }
}
