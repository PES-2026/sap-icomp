import { Result } from "@domain/shared/result";
import { TimeVO } from "@domain/valueObjects/appointment/time";
import { EmailVO } from "@domain/valueObjects/shared/email";
import { ExternalIdVO } from "@domain/valueObjects/shared/externalId";
import { NameVO } from "@domain/valueObjects/shared/name";
import { PasswordVO } from "@domain/valueObjects/shared/password";
import { RegistrationNumberVO } from "@domain/valueObjects/shared/registration";
import { UserStatusVO } from "@domain/valueObjects/shared/userStatus";
import { PhoneNumberVO } from "@domain/valueObjects/student/phoneNumber";

export type PedagogueProps = {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  registrationNumber: string;
  userStatus: string;
  password?: string;
};

export type PedagogueVOProps = {
  name: NameVO;
  email: EmailVO;
  phoneNumber: PhoneNumberVO;
  registrationNumber: RegistrationNumberVO;
  userStatus: UserStatusVO;
  password: PasswordVO;
};

export class Pedagogue {
  constructor(
    public readonly id: ExternalIdVO,
    public name: NameVO,
    public email: EmailVO,
    public phoneNumber: PhoneNumberVO,
    public registrationNumber: RegistrationNumberVO,
    public userStatus: UserStatusVO,
    public password?: PasswordVO,
    public maxAttendanceTime?: TimeVO,
  ) {}

  update(props: Partial<PedagogueVOProps>): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.email !== undefined) this.email = props.email;
    if (props.phoneNumber !== undefined) this.phoneNumber = props.phoneNumber;
    if (props.registrationNumber !== undefined) this.registrationNumber = props.registrationNumber;
    if (props.userStatus !== undefined) this.userStatus = props.userStatus;
  }

  changePassword(newPassword: PasswordVO): void {
    this.password = newPassword;
  }

  static create(props: PedagogueProps): Result<Pedagogue> {
    const id = ExternalIdVO.create();
    const name = NameVO.create(props.name);
    const email = EmailVO.create(props.email);
    const phoneNumber = PhoneNumberVO.create(props.phoneNumber);
    const registrationNumber = RegistrationNumberVO.create(props.registrationNumber);
    const userStatus = UserStatusVO.create(props.userStatus);
    const password = props.password ? PasswordVO.create(props.password, props.password) : undefined;

    const results = [id, name, email, phoneNumber, registrationNumber, userStatus, password];

    for (const result of results) {
      if (result?.isFailure) {
        throw Result.fail<Pedagogue>(result.error!);
      }
    }
    return Result.ok(
      new Pedagogue(
        id.getValue(),
        name.getValue(),
        email.getValue(),
        phoneNumber.getValue(),
        registrationNumber.getValue(),
        userStatus.getValue(),
        password?.getValue(),
      ),
    );
  }

  static rehydrate(props: PedagogueProps): Pedagogue {
    return new Pedagogue(
      ExternalIdVO.fromTrusted(props.id!),
      NameVO.fromTrusted(props.name),
      EmailVO.fromTrusted(props.email),
      PhoneNumberVO.fromTrusted(props.phoneNumber),
      RegistrationNumberVO.fromTrusted(props.registrationNumber),
      UserStatusVO.fromTrusted(props.userStatus),
      props.password ? PasswordVO.fromTrusted(props.password) : undefined,
    );
  }
}
